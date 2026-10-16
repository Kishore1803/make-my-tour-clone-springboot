
package com.makemytrip.makemytrip.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.makemytrip.makemytrip.dto.PricingDtos.AdminUpdateRequest;
import com.makemytrip.makemytrip.dto.PricingDtos.FreezeResponse;
import com.makemytrip.makemytrip.dto.PricingDtos.HistoryResponse;
import com.makemytrip.makemytrip.dto.PricingDtos.PriceResponse;
import com.makemytrip.makemytrip.models.PriceFreeze;
import com.makemytrip.makemytrip.models.PricingItem;
import com.makemytrip.makemytrip.repositories.PriceFreezeRepository;
import com.makemytrip.makemytrip.repositories.PricingItemRepository;

@Service
public class PricingService {

    private static final int FREEZE_MINUTES = 30;
    private static final BigDecimal MIN_RATE = new BigDecimal("-0.50");
    private static final BigDecimal MAX_RATE = new BigDecimal("1.00");
    private static final BigDecimal HOLIDAY_RATE = new BigDecimal("0.20");
    private static final BigDecimal ZERO = BigDecimal.ZERO;

    @Autowired
    private PriceFreezeRepository priceFreezeRepository;

    @Autowired
    private PricingItemRepository pricingItemRepository;

    public String normalizeType(String itemType) {
        if (itemType == null || itemType.isBlank()) {
            throw new IllegalArgumentException("Item type is required.");
        }

        String type = itemType.trim().toUpperCase(Locale.ROOT);

        if (!type.equals("FLIGHT") && !type.equals("HOTEL")) {
            throw new IllegalArgumentException(
                "Item type must be FLIGHT or HOTEL."
            );
        }

        return type;
    }

    private PricingItem getPricingItem(String type, Long itemId) {
        String normalizedType = normalizeType(type);

        if (itemId == null) {
            throw new IllegalArgumentException("Item ID is required.");
        }

        return pricingItemRepository
            .findByItemTypeAndItemId(normalizedType, itemId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Pricing item not found for " + normalizedType
                    + " ID " + itemId
            ));
    }

    private BigDecimal safeRate(BigDecimal rate) {
        if (rate == null) {
            return ZERO;
        }
        return rate.max(MIN_RATE).min(MAX_RATE);
    }

    private BigDecimal holidayAmount(PricingItem item) {
        if (!item.isHoliday()) {
            return ZERO;
        }

        return item.getBasePrice()
            .multiply(HOLIDAY_RATE)
            .setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculatePrice(PricingItem item) {
        if (item == null || item.getBasePrice() == null
                || item.getBasePrice().compareTo(ZERO) <= 0) {
            throw new IllegalArgumentException(
                "Base price must be greater than zero."
            );
        }

        BigDecimal demand = safeRate(item.getDemandAdjustment());
        BigDecimal seasonal = safeRate(item.getSeasonalAdjustment());

        BigDecimal multiplier = BigDecimal.ONE
            .add(demand)
            .add(seasonal)
            .add(item.isHoliday() ? HOLIDAY_RATE : ZERO);

        if (multiplier.compareTo(ZERO) < 0) {
            multiplier = ZERO;
        }

        return item.getBasePrice()
            .multiply(multiplier)
            .setScale(2, RoundingMode.HALF_UP);
    }

    private PriceResponse toPriceResponse(
            PricingItem item, BigDecimal finalPrice, boolean frozen) {

        BigDecimal base = item.getBasePrice();
        BigDecimal demandAmount = base
            .multiply(safeRate(item.getDemandAdjustment()))
            .setScale(2, RoundingMode.HALF_UP);

        BigDecimal seasonalAmount = base
            .multiply(safeRate(item.getSeasonalAdjustment()))
            .setScale(2, RoundingMode.HALF_UP);

        return new PriceResponse(
            item.getItemType(),
            item.getItemId(),
            base,
            demandAmount,
            seasonalAmount,
            holidayAmount(item),
            finalPrice,
            frozen,
            item.getUpdatedAt()
        );
    }

    @Transactional
    public PriceResponse getCurrentPrice(
            String type, Long itemId, Long userId) {

        PricingItem item = getPricingItem(type, itemId);

        if (userId != null) {
            PriceFreeze freeze = findActiveFreeze(userId, type, itemId);

            if (freeze != null) {
                return toPriceResponse(
                    item, freeze.getLockedPrice(), true
                );
            }
        }

        return toPriceResponse(item, calculatePrice(item), false);
    }

    @Transactional
    public List<HistoryResponse> getHistory(String type, Long itemId) {
        // Temporary: history persistence has not been implemented yet.
        getPricingItem(type, itemId);
        return List.of();
    }

    @Transactional
    public FreezeResponse freezePrice(
            String type, Long itemId, Long userId) {

        if (userId == null) {
            throw new IllegalArgumentException("User ID is required.");
        }

        PricingItem item = getPricingItem(type, itemId);
        PriceFreeze existing = findActiveFreeze(userId, type, itemId);

        if (existing != null) {
            return toFreezeResponse(existing);
        }

        LocalDateTime now = LocalDateTime.now();

        PriceFreeze freeze = new PriceFreeze();
        freeze.setUserId(userId);
        freeze.setItemType(normalizeType(type));
        freeze.setItemId(itemId);
        freeze.setLockedPrice(calculatePrice(item));
        freeze.setCreatedAt(now);
        freeze.setExpiresAt(now.plusMinutes(FREEZE_MINUTES));
        freeze.setStatus("ACTIVE");

        return toFreezeResponse(priceFreezeRepository.save(freeze));
    }

    @Transactional
    public FreezeResponse getFreeze(Long freezeId) {
        if (freezeId == null) {
            throw new IllegalArgumentException("Freeze ID is required.");
        }

        PriceFreeze freeze = priceFreezeRepository.findById(freezeId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Price freeze not found: " + freezeId
            ));

        if (freeze.getExpiresAt() == null
                || !freeze.getExpiresAt().isAfter(LocalDateTime.now())) {
            freeze.setStatus("EXPIRED");
            freeze = priceFreezeRepository.save(freeze);
        }

        return toFreezeResponse(freeze);
    }

    @Transactional
    public PriceResponse updatePricing(
            String type, Long itemId, AdminUpdateRequest request) {

        if (request == null || request.basePrice() == null
                || request.basePrice().compareTo(ZERO) <= 0) {
            throw new IllegalArgumentException(
                "A valid base price is required."
            );
        }

        String normalizedType = normalizeType(type);

        if (itemId == null) {
            throw new IllegalArgumentException("Item ID is required.");
        }

        PricingItem item = pricingItemRepository
            .findByItemTypeAndItemId(normalizedType, itemId)
            .orElseGet(PricingItem::new);

        item.setItemType(normalizedType);
        item.setItemId(itemId);
        item.setBasePrice(request.basePrice());
        item.setDemandAdjustment(
            safeRate(request.demandAdjustment())
        );
        item.setSeasonalAdjustment(
            safeRate(request.seasonalAdjustment())
        );
        item.setHoliday(request.holiday());

        PricingItem saved = pricingItemRepository.save(item);

        return toPriceResponse(saved, calculatePrice(saved), false);
    }

    @Transactional
    public PriceFreeze findActiveFreeze(
            Long userId, String itemType, Long itemId) {

        if (userId == null || itemId == null) {
            throw new IllegalArgumentException(
                "User ID and item ID are required."
            );
        }

        String type = normalizeType(itemType);
        LocalDateTime now = LocalDateTime.now();

        return priceFreezeRepository
            .findFirstByUserIdAndItemTypeAndItemIdAndStatusOrderByExpiresAtDesc(
                userId, type, itemId, "ACTIVE"
            )
            .filter(freeze -> freeze.getExpiresAt() != null
                && freeze.getExpiresAt().isAfter(now))
            .orElse(null);
    }

    @Transactional
    public PriceFreeze validateActiveFreeze(
            Long userId, String itemType, Long itemId,
            double requestedPrice) {

        if (!Double.isFinite(requestedPrice) || requestedPrice <= 0) {
            throw new IllegalArgumentException("Invalid booking price.");
        }

        PriceFreeze freeze = findActiveFreeze(
            userId, itemType, itemId
        );

        if (freeze == null) {
            throw new IllegalStateException(
                "Price freeze expired or not found. Please refresh the price."
            );
        }

        if (freeze.getLockedPrice() == null) {
            throw new IllegalStateException("Frozen price is missing.");
        }

        if (Math.abs(
                requestedPrice - freeze.getLockedPrice().doubleValue()
            ) > 0.01) {
            throw new IllegalArgumentException(
                "Price mismatch. Locked price is "
                    + freeze.getLockedPrice()
            );
        }

        return freeze;
    }

    private FreezeResponse toFreezeResponse(PriceFreeze freeze) {
        return new FreezeResponse(
            freeze.getId(),
            freeze.getLockedPrice(),
            freeze.getExpiresAt(),
            freeze.getStatus()
        );
    }
}
