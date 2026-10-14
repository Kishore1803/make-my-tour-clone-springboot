package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.dto.PricingDtos.*;
import com.makemytrip.makemytrip.models.*;
import com.makemytrip.makemytrip.repositories.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PricingService {

    private static final BigDecimal HOLIDAY_RATE =
        new BigDecimal("0.20");

    private static final BigDecimal MIN_RATE =
        new BigDecimal("-0.50");

    private static final BigDecimal MAX_RATE =
        BigDecimal.ONE;

    private static final int FREEZE_MINUTES = 30;

    private final PricingItemRepository itemRepository;
    private final PriceHistoryRepository historyRepository;
    private final PriceFreezeRepository freezeRepository;

    public PricingService(
            PricingItemRepository itemRepository,
            PriceHistoryRepository historyRepository,
            PriceFreezeRepository freezeRepository) {

        this.itemRepository = itemRepository;
        this.historyRepository = historyRepository;
        this.freezeRepository = freezeRepository;
    }

    // Validate and normalize FLIGHT / HOTEL.
    private String normalizeType(String type) {
        if (type == null) {
            throw new IllegalArgumentException(
                "Type must be FLIGHT or HOTEL");
        }

        String normalized = type.trim().toUpperCase();

        if (!normalized.equals("FLIGHT")
                && !normalized.equals("HOTEL")) {
            throw new IllegalArgumentException(
                "Type must be FLIGHT or HOTEL");
        }

        return normalized;
    }

    // Get the saved pricing data.
    private PricingItem getItem(String type, Long itemId) {
        if (itemId == null || itemId <= 0) {
            throw new IllegalArgumentException(
                "Invalid itemId");
        }

        return itemRepository
            .findByItemTypeAndItemId(type, itemId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Pricing item not found. Create pricing data first."));
    }

    private BigDecimal amount(
            BigDecimal base,
            BigDecimal rate) {

        return base.multiply(rate)
            .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateFinalPrice(PricingItem item) {
        BigDecimal base = item.getBasePrice();

        BigDecimal demand = amount(
            base, item.getDemandAdjustment());

        BigDecimal seasonal = amount(
            base, item.getSeasonalAdjustment());

        BigDecimal holiday = item.isHoliday()
            ? amount(base, HOLIDAY_RATE)
            : BigDecimal.ZERO.setScale(2);

        return base
            .add(demand)
            .add(seasonal)
            .add(holiday)
            .max(BigDecimal.ZERO)
            .setScale(2, RoundingMode.HALF_UP);
    }

    private PriceFreeze findActiveFreeze(
            Long userId,
            String type,
            Long itemId) {

        if (userId == null) {
            return null;
        }

        return freezeRepository
            .findFirstByUserIdAndItemTypeAndItemIdAndStatusOrderByExpiresAtDesc(
                userId, type, itemId, "ACTIVE")
            .filter(freeze ->
                freeze.getExpiresAt()
                    .isAfter(LocalDateTime.now()))
            .orElse(null);
    }

    // Current calculated price.
    @Transactional
    public PriceResponse getCurrentPrice(
            String requestedType,
            Long itemId,
            Long userId) {

        String type = normalizeType(requestedType);
        PricingItem item = getItem(type, itemId);

        PriceFreeze freeze =
            findActiveFreeze(userId, type, itemId);

        BigDecimal base = item.getBasePrice();

        BigDecimal demand = amount(
            base, item.getDemandAdjustment());

        BigDecimal seasonal = amount(
            base, item.getSeasonalAdjustment());

        BigDecimal holiday = item.isHoliday()
            ? amount(base, HOLIDAY_RATE)
            : BigDecimal.ZERO.setScale(2);

        BigDecimal calculatedPrice =
            calculateFinalPrice(item);

        // Show the locked price when a valid freeze exists.
        BigDecimal finalPrice = freeze != null
            ? freeze.getLockedPrice()
            : calculatedPrice;

        // History records the calculated market price.
        saveHistoryIfChanged(item, calculatedPrice);

        return new PriceResponse(
            type,
            itemId,
            base,
            demand,
            seasonal,
            holiday,
            finalPrice,
            freeze != null,
            item.getUpdatedAt()
        );
    }

    // Save a snapshot only when the price or base price changes.
    private void saveHistoryIfChanged(
            PricingItem item,
            BigDecimal finalPrice) {

        List<PriceHistory> records =
            historyRepository
                .findTop30ByItemTypeAndItemIdOrderByRecordedAtDesc(
                    item.getItemType(),
                    item.getItemId()
                );

        PriceHistory latest =
            records.isEmpty() ? null : records.get(0);

        boolean unchanged =
            latest != null
            && latest.getFinalPrice().compareTo(finalPrice) == 0
            && latest.getBasePrice()
                .compareTo(item.getBasePrice()) == 0;

        if (unchanged) {
            return;
        }

        BigDecimal changePercentage = BigDecimal.ZERO;

        if (latest != null
                && latest.getFinalPrice()
                    .compareTo(BigDecimal.ZERO) != 0) {

            changePercentage = finalPrice
                .subtract(latest.getFinalPrice())
                .multiply(new BigDecimal("100"))
                .divide(
                    latest.getFinalPrice(),
                    2,
                    RoundingMode.HALF_UP
                );
        }

        PriceHistory history = new PriceHistory();

        history.setItemType(item.getItemType());
        history.setItemId(item.getItemId());
        history.setBasePrice(item.getBasePrice());
        history.setFinalPrice(finalPrice);
        history.setChangePercentage(changePercentage);

        historyRepository.save(history);
    }

    // Return the latest 30 records, oldest first for the graph.
    @Transactional(readOnly = true)
    public List<HistoryResponse> getHistory(
            String requestedType,
            Long itemId) {

        String type = normalizeType(requestedType);
        getItem(type, itemId);

        List<PriceHistory> records =
            historyRepository
                .findTop30ByItemTypeAndItemIdOrderByRecordedAtDesc(
                    type, itemId
                );

        return records.stream()
            .map(history -> new HistoryResponse(
                history.getBasePrice(),
                history.getFinalPrice(),
                history.getRecordedAt()
            ))
            .sorted((a, b) ->
                a.recordedAt().compareTo(b.recordedAt()))
            .toList();
    }

    // Freeze the current price for 30 minutes.
    @Transactional
    public FreezeResponse freezePrice(
            String requestedType,
            Long itemId,
            Long userId) {

        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException(
                "Valid userId is required");
        }

        String type = normalizeType(requestedType);
        PricingItem item = getItem(type, itemId);

        PriceFreeze existing =
            findActiveFreeze(userId, type, itemId);

        if (existing != null) {
            return toFreezeResponse(existing);
        }

        BigDecimal currentPrice =
            calculateFinalPrice(item);

        LocalDateTime now = LocalDateTime.now();

        PriceFreeze freeze = new PriceFreeze();
        freeze.setUserId(userId);
        freeze.setItemType(type);
        freeze.setItemId(itemId);
        freeze.setLockedPrice(currentPrice);
        freeze.setExpiresAt(
            now.plusMinutes(FREEZE_MINUTES));
        freeze.setStatus("ACTIVE");

        return toFreezeResponse(
            freezeRepository.save(freeze));
    }

    // Read freeze and mark it expired when necessary.
    @Transactional
    public FreezeResponse getFreeze(Long freezeId) {
        if (freezeId == null || freezeId <= 0) {
            throw new IllegalArgumentException(
                "Invalid freezeId");
        }

        PriceFreeze freeze = freezeRepository
            .findById(freezeId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Price freeze not found"));

        if ("ACTIVE".equals(freeze.getStatus())
                && !freeze.getExpiresAt()
                    .isAfter(LocalDateTime.now())) {

            freeze.setStatus("EXPIRED");
            freeze = freezeRepository.save(freeze);
        }

        return toFreezeResponse(freeze);
    }

    private FreezeResponse toFreezeResponse(
            PriceFreeze freeze) {

        return new FreezeResponse(
            freeze.getId(),
            freeze.getLockedPrice(),
            freeze.getExpiresAt(),
            freeze.getStatus()
        );
    }

    // Create or update pricing inputs.
    @Transactional
    public PriceResponse updatePricing(
            String requestedType,
            Long itemId,
            AdminUpdateRequest request) {

        String type = normalizeType(requestedType);

        if (itemId == null || itemId <= 0) {
            throw new IllegalArgumentException(
                "Invalid itemId");
        }

        if (request == null
                || request.basePrice() == null
                || request.demandAdjustment() == null
                || request.seasonalAdjustment() == null) {

            throw new IllegalArgumentException(
                "All pricing fields are required");
        }

        BigDecimal basePrice = request.basePrice();

        if (basePrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                "basePrice cannot be negative");
        }

        validateRate(
            request.demandAdjustment(), "demandAdjustment");

        validateRate(
            request.seasonalAdjustment(), "seasonalAdjustment");

        PricingItem item = itemRepository
            .findByItemTypeAndItemId(type, itemId)
            .orElseGet(PricingItem::new);

        item.setItemType(type);
        item.setItemId(itemId);
        item.setBasePrice(
            basePrice.setScale(2, RoundingMode.HALF_UP));
        item.setDemandAdjustment(
            request.demandAdjustment());
        item.setSeasonalAdjustment(
            request.seasonalAdjustment());
        item.setHoliday(request.holiday());

        item = itemRepository.save(item);

        saveHistoryIfChanged(
            item, calculateFinalPrice(item));

        return getCurrentPrice(type, itemId, null);
    }

    private void validateRate(
            BigDecimal rate,
            String fieldName) {

        if (rate.compareTo(MIN_RATE) < 0
                || rate.compareTo(MAX_RATE) > 0) {

            throw new IllegalArgumentException(
                fieldName
                + " must be between -0.50 and 1.00");
        }
    }
}