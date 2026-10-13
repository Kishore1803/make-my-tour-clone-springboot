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
import java.util.Locale;

@Service
public class PricingService {

	@Autowired
    private PricingItemRepository itemRepository;
	
	@Autowired
    private PriceHistoryRepository historyRepository;
	
	@Autowired
    private PriceFreezeRepository freezeRepository;

    private static final BigDecimal ZERO = new BigDecimal("0.00");
    private static final BigDecimal HOLIDAY_RATE = new BigDecimal("0.20");

    private String normalizeType(String type) {
        if (type == null) {
            throw new IllegalArgumentException("Type is required");
        }

        String value = type.toUpperCase(Locale.ROOT);

        if (!value.equals("FLIGHT") && !value.equals("HOTEL")) {
            throw new IllegalArgumentException("Type must be FLIGHT or HOTEL");
        }

        return value;
    }

    private PricingItem getItem(String type, Long itemId) {
        return itemRepository
            .findByItemTypeAndItemId(normalizeType(type), itemId)
            .orElseThrow(() -> new IllegalArgumentException("Pricing item not found"));
    }

    private BigDecimal amount(BigDecimal base, BigDecimal rate) {
        if (rate == null) rate = BigDecimal.ZERO;

        return base.multiply(rate)
            .setScale(2, RoundingMode.HALF_UP);
    }

    private PriceResponse calculate(PricingItem item) {
        BigDecimal base = item.getBasePrice();
        BigDecimal demand = amount(base, item.getDemandAdjustment());
        BigDecimal seasonal = amount(base, item.getSeasonalAdjustment());
        BigDecimal holiday = item.isHoliday()
            ? amount(base, HOLIDAY_RATE) : ZERO;

        BigDecimal total = base.add(demand)
            .add(seasonal)
            .add(holiday)
            .setScale(2, RoundingMode.HALF_UP);

        return new PriceResponse( item.getItemType(), item.getItemId(), base, demand,
            seasonal, holiday, total, false, item.getUpdatedAt());
    }

    private PriceFreeze findActiveFreeze(Long userId, String type, Long itemId) {

        if (userId == null) return null;

        return freezeRepository
            .findFirstByUserIdAndItemTypeAndItemIdAndStatusOrderByExpiresAtDesc(
                userId, normalizeType(type), itemId, "ACTIVE")
            .filter(f -> f.getExpiresAt() != null
                && f.getExpiresAt().isAfter(LocalDateTime.now()))
            .orElse(null);
    }

    @Transactional
    public PriceResponse getCurrentPrice(String type, Long itemId, Long userId) {

        PricingItem item = getItem(type, itemId);
        PriceResponse current = calculate(item);

        List<PriceHistory> previous = historyRepository
                .findTop30ByItemTypeAndItemIdOrderByRecordedAtDesc(
                    item.getItemType(), itemId);

        boolean changed = previous.isEmpty() || previous.get(0).getFinalPrice()
                .compareTo(current.finalPrice()) != 0;

        if (changed) {
            PriceHistory snapshot = new PriceHistory();
            snapshot.setItemType(item.getItemType());
            snapshot.setItemId(itemId);
            snapshot.setBasePrice(current.basePrice());
            snapshot.setFinalPrice(current.finalPrice());
            snapshot.setDemandAdjustment(item.getDemandAdjustment());
            snapshot.setSeasonalAdjustment(item.getSeasonalAdjustment());
            snapshot.setHoliday(item.isHoliday());

            historyRepository.save(snapshot);
        }

        PriceFreeze freeze = findActiveFreeze(userId, type, itemId);

        if (freeze == null) return current;

        return new PriceResponse(current.itemType(), current.itemId(), current.basePrice(), current.demandAmount(),
            current.seasonalAmount(), current.holidayAmount(), freeze.getLockedPrice(), true, current.updatedAt());
    }

    @Transactional(readOnly = true)
    public List<HistoryResponse> getHistory(String type, Long itemId) {
        PricingItem item = getItem(type, itemId);

        return historyRepository
            .findTop30ByItemTypeAndItemIdOrderByRecordedAtDesc(
                item.getItemType(), itemId)
            .stream()
            .map(h -> new HistoryResponse(
                h.getBasePrice(), h.getFinalPrice(), h.getRecordedAt()))
            .toList();
    }

    @Transactional
    public FreezeResponse freezePrice(String type, Long itemId, Long userId) {

        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        String normalizedType = normalizeType(type);

        PriceFreeze existing = findActiveFreeze(userId, normalizedType, itemId);

        if (existing != null) return toFreezeResponse(existing);

        PriceResponse current = getCurrentPrice(normalizedType, itemId, null);

        LocalDateTime now = LocalDateTime.now();

        PriceFreeze freeze = new PriceFreeze();
        freeze.setUserId(userId);
        freeze.setItemType(normalizedType);
        freeze.setItemId(itemId);
        freeze.setLockedPrice(current.finalPrice());
        freeze.setCreatedAt(now);
        freeze.setExpiresAt(now.plusMinutes(30));
        freeze.setStatus("ACTIVE");

        return toFreezeResponse(freezeRepository.save(freeze));
    }

    @Transactional(readOnly = true)
    public FreezeResponse getFreeze(Long freezeId) {
        PriceFreeze freeze = freezeRepository.findById(freezeId)
            .orElseThrow(() -> new IllegalArgumentException("Freeze not found"));

        return toFreezeResponse(freeze);
    }

    private FreezeResponse toFreezeResponse(PriceFreeze freeze) {
        String status = freeze.getStatus();

        if ("ACTIVE".equals(status) && !freeze.getExpiresAt().isAfter(LocalDateTime.now())) {
            status = "EXPIRED";
        }

        return new FreezeResponse(freeze.getId(), freeze.getLockedPrice(), freeze.getExpiresAt(), status);
    }

    @Transactional
    public PriceResponse updatePricing(String type, Long itemId, AdminUpdateRequest request) {

        if (request == null || request.basePrice() == null || request.basePrice().signum() < 0) {
            throw new IllegalArgumentException("Base price must be zero or greater");
        }

        validateRate(request.demandAdjustment());
        validateRate(request.seasonalAdjustment());

        String normalized = normalizeType(type);

        PricingItem item = itemRepository
            .findByItemTypeAndItemId(normalized, itemId)
            .orElseGet(() -> {
                PricingItem newItem = new PricingItem();
                newItem.setItemType(normalized);
                newItem.setItemId(itemId);
                return newItem;
            });

        item.setBasePrice(request.basePrice());
        item.setDemandAdjustment(request.demandAdjustment() == null 
        		? BigDecimal.ZERO : request.demandAdjustment());
        item.setSeasonalAdjustment(request.seasonalAdjustment() == null
                ? BigDecimal.ZERO : request.seasonalAdjustment());
        item.setHoliday(request.holiday());
        return calculate(itemRepository.save(item));
    }

    private void validateRate(BigDecimal rate) {
        if (rate != null && (rate.compareTo(new BigDecimal("-0.50")) < 0 || rate.compareTo(BigDecimal.ONE) > 0)) {
            throw new IllegalArgumentException("Adjustment must be between -50% and 100%");
        }
    }
}
