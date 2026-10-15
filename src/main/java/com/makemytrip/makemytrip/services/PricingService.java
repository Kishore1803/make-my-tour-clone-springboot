package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.dto.PricingDtos.*;
import com.makemytrip.makemytrip.models.*;
import com.makemytrip.makemytrip.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PricingService {
	
    private static final BigDecimal HOLIDAY_RATE = new BigDecimal("0.20");
    private static final BigDecimal MIN_RATE = new BigDecimal("-0.50");
    private static final BigDecimal MAX_RATE = BigDecimal.ONE;
    private static final int FREEZE_MINUTES = 30;

    @Autowired
    private PricingItemRepository itemRepository;
    
    @Autowired
    private PriceHistoryRepository historyRepository;
    
    @Autowired
    private PriceFreezeRepository freezeRepository;

    private String normalizeType(String type) {
        if (type == null) throw new IllegalArgumentException("Type must be FLIGHT or HOTEL");
        String normalized = type.trim().toUpperCase();
        if (!normalized.equals("FLIGHT") && !normalized.equals("HOTEL"))
            throw new IllegalArgumentException("Type must be FLIGHT or HOTEL");
        return normalized;
    }

    private PricingItem getItem(String type, Long itemId) {
        if (itemId == null || itemId <= 0) throw new IllegalArgumentException("Invalid itemId");
        return itemRepository.findByItemTypeAndItemId(type, itemId)
                .orElseThrow(() -> new IllegalArgumentException("Pricing item not found. Create pricing data first."));
    }

    private BigDecimal amount(BigDecimal base, BigDecimal rate) {
        return base.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateFinalPrice(PricingItem item) {
        BigDecimal base = item.getBasePrice();
        BigDecimal demand = amount(base, item.getDemandAdjustment());
        BigDecimal seasonal = amount(base, item.getSeasonalAdjustment());
        BigDecimal holiday = item.isHoliday() ? amount(base, HOLIDAY_RATE) : BigDecimal.ZERO.setScale(2);
        return base.add(demand).add(seasonal).add(holiday)
                .max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
    }

    private PriceFreeze findActiveFreeze(Long userId, String type, Long itemId) {
        if (userId == null) return null;
        return freezeRepository
                .findFirstByUserIdAndItemTypeAndItemIdAndStatusOrderByExpiresAtDesc(userId, type, itemId, "ACTIVE")
                .filter(f -> f.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElse(null);
    }

    @Transactional
    public PriceResponse getCurrentPrice(String requestedType, Long itemId, Long userId) {
        String type = normalizeType(requestedType);
        PricingItem item = getItem(type, itemId);
        PriceFreeze freeze = findActiveFreeze(userId, type, itemId);
        BigDecimal base = item.getBasePrice();
        BigDecimal demand = amount(base, item.getDemandAdjustment());
        BigDecimal seasonal = amount(base, item.getSeasonalAdjustment());
        BigDecimal holiday = item.isHoliday() ? amount(base, HOLIDAY_RATE) : BigDecimal.ZERO.setScale(2);
        BigDecimal calculated = calculateFinalPrice(item);
        saveHistoryIfChanged(item, calculated);
        return new PriceResponse(type, itemId, base, demand, seasonal, holiday,
                freeze == null ? calculated : freeze.getLockedPrice(),
                freeze != null, item.getUpdatedAt());
    }

    private void saveHistoryIfChanged(PricingItem item, BigDecimal finalPrice) {

        List<PriceHistory> records =
                historyRepository.findTop30ByItemTypeAndItemIdOrderByRecordedAtDesc(
                        item.getItemType(), item.getItemId());

        PriceHistory latest = records.isEmpty() ? null : records.get(0);

        // Avoid duplicate history entries when the price has not changed.
        if (latest != null
                && latest.getFinalPrice() != null
                && latest.getBasePrice() != null
                && latest.getFinalPrice().compareTo(finalPrice) == 0
                && latest.getBasePrice().compareTo(item.getBasePrice()) == 0) {
            return;
        }

        BigDecimal change = BigDecimal.ZERO;

        if (latest != null
                && latest.getFinalPrice() != null
                && latest.getFinalPrice().compareTo(BigDecimal.ZERO) != 0) {

            change = finalPrice.subtract(latest.getFinalPrice())
                    .multiply(new BigDecimal("100"))
                    .divide(latest.getFinalPrice(), 2, RoundingMode.HALF_UP);
        }

        PriceHistory history = new PriceHistory();

        BigDecimal basePrice = item.getBasePrice();

        // Core pricing fields
        history.setItemType(item.getItemType());
        history.setItemId(item.getItemId());
        history.setBasePrice(basePrice);
        history.setDynamicPrice(finalPrice);
        history.setFinalPrice(finalPrice);
        history.setChangePercentage(change);

        // Pricing breakdown: store the adjustment rates, not their amounts.
        history.setDemandAdjustment(item.getDemandAdjustment());
        history.setSeasonalAdjustment(item.getSeasonalAdjustment());
        history.setHoliday(item.isHoliday());

        // Legacy database columns
        if ("FLIGHT".equalsIgnoreCase(item.getItemType())) {
            history.setFlightId(item.getItemId());
            history.setHotelId(null);
        } else if ("HOTEL".equalsIgnoreCase(item.getItemType())) {
            history.setHotelId(item.getItemId());
            history.setFlightId(null);
        }

        history.setReason(item.isHoliday()
                ? "Holiday pricing"
                : "Normal pricing");

        LocalDateTime now = LocalDateTime.now();
        history.setRecordedAt(now);
        historyRepository.save(history);
    }

    @Transactional(readOnly = true)
    public List<HistoryResponse> getHistory(String requestedType, Long itemId) {
        String type = normalizeType(requestedType);
        getItem(type, itemId);
        return historyRepository.findTop30ByItemTypeAndItemIdOrderByRecordedAtDesc(type, itemId)
                .stream()
                .map(h -> new HistoryResponse(h.getBasePrice(), h.getFinalPrice(),
                        h.getChangePercentage(), h.getRecordedAt()))
                .sorted((a, b) -> a.recordedAt().compareTo(b.recordedAt()))
                .toList();
    }

    @Transactional
    public FreezeResponse freezePrice(String requestedType, Long itemId, Long userId) {
        if (userId == null || userId <= 0) throw new IllegalArgumentException("Valid userId is required");
        String type = normalizeType(requestedType);
        PricingItem item = getItem(type, itemId);
        PriceFreeze existing = findActiveFreeze(userId, type, itemId);
        if (existing != null) return toFreezeResponse(existing);

        LocalDateTime now = LocalDateTime.now();
        PriceFreeze freeze = new PriceFreeze();
        freeze.setUserId(userId);
        freeze.setItemType(type);
        freeze.setItemId(itemId);
        freeze.setLockedPrice(calculateFinalPrice(item));
        freeze.setExpiresAt(now.plusMinutes(FREEZE_MINUTES));
        freeze.setStatus("ACTIVE");
        return toFreezeResponse(freezeRepository.save(freeze));
    }

    @Transactional
    public FreezeResponse getFreeze(Long freezeId) {
        if (freezeId == null || freezeId <= 0) throw new IllegalArgumentException("Invalid freezeId");
        PriceFreeze freeze = freezeRepository.findById(freezeId)
                .orElseThrow(() -> new IllegalArgumentException("Price freeze not found"));
        if ("ACTIVE".equals(freeze.getStatus()) && !freeze.getExpiresAt().isAfter(LocalDateTime.now())) {
            freeze.setStatus("EXPIRED");
            freeze = freezeRepository.save(freeze);
        }
        return toFreezeResponse(freeze);
    }

    private FreezeResponse toFreezeResponse(PriceFreeze freeze) {
        return new FreezeResponse(freeze.getId(), freeze.getLockedPrice(),
                freeze.getExpiresAt(), freeze.getStatus());
    }

    @Transactional
    public PriceResponse updatePricing(String requestedType, Long itemId, AdminUpdateRequest request) {
        String type = normalizeType(requestedType);
        if (itemId == null || itemId <= 0) throw new IllegalArgumentException("Invalid itemId");
        if (request == null || request.basePrice() == null
                || request.demandAdjustment() == null || request.seasonalAdjustment() == null)
            throw new IllegalArgumentException("All pricing fields are required");
        if (request.basePrice().compareTo(BigDecimal.ZERO) < 0)
            throw new IllegalArgumentException("basePrice cannot be negative");
        validateRate(request.demandAdjustment(), "demandAdjustment");
        validateRate(request.seasonalAdjustment(), "seasonalAdjustment");

        PricingItem item = itemRepository.findByItemTypeAndItemId(type, itemId)
                .orElseGet(PricingItem::new);
        item.setItemType(type);
        item.setItemId(itemId);
        item.setBasePrice(request.basePrice().setScale(2, RoundingMode.HALF_UP));
        item.setDemandAdjustment(request.demandAdjustment());
        item.setSeasonalAdjustment(request.seasonalAdjustment());
        item.setHoliday(request.holiday());
        item = itemRepository.save(item);
        saveHistoryIfChanged(item, calculateFinalPrice(item));
        return getCurrentPrice(type, itemId, null);
    }

    private void validateRate(BigDecimal rate, String fieldName) {
        if (rate.compareTo(MIN_RATE) < 0 || rate.compareTo(MAX_RATE) > 0)
            throw new IllegalArgumentException(fieldName + " must be between -0.50 and 1.00");
    }
}
