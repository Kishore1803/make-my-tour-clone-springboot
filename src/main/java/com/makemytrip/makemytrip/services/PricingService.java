package com.makemytrip.makemytrip.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    private PriceFreezeRepository priceFreezeRepository;

    @Autowired
    private PricingItemRepository pricingItemRepository;

    // NORMALIZE ITEM TYPE
    public String normalizeType(String itemType) {

        if (itemType == null || itemType.isBlank()) {
            throw new IllegalArgumentException("Item type is required.");
        }

        String type = itemType.trim().toUpperCase(Locale.ROOT);

        if (!type.equals("FLIGHT") && !type.equals("HOTEL")) {
            throw new IllegalArgumentException("Item type must be FLIGHT or HOTEL.");
        }

        return type;
    }

    // GET PRICING ITEM
    private PricingItem getPricingItem(String itemType, Long itemId) {

        String type = normalizeType(itemType);

        if (itemId == null) {
            throw new IllegalArgumentException("Item ID is required.");
        }

        return pricingItemRepository
                .findByItemTypeAndItemId(type, itemId)
                .orElseThrow(() -> new IllegalArgumentException("Pricing item not found for " + type + " ID " + itemId));
    }

    // CALCULATE DYNAMIC PRICE
    public BigDecimal calculatePrice(PricingItem item) {

        if (item == null || item.getBasePrice() == null || item.getBasePrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Base price must be greater than zero.");
        }

        BigDecimal demand = item.getDemandAdjustment() != null
                ? item.getDemandAdjustment()
                : BigDecimal.ZERO;

        BigDecimal seasonal = item.getSeasonalAdjustment() != null
                ? item.getSeasonalAdjustment()
                : BigDecimal.ZERO;

        demand = demand.max(MIN_RATE).min(MAX_RATE);
        seasonal = seasonal.max(MIN_RATE).min(MAX_RATE);

        BigDecimal holiday = item.isHoliday()
                ? HOLIDAY_RATE
                : BigDecimal.ZERO;

        BigDecimal multiplier = BigDecimal.ONE
                .add(demand)
                .add(seasonal)
                .add(holiday);

        if (multiplier.compareTo(BigDecimal.ZERO) < 0) {
            multiplier = BigDecimal.ZERO;
        }

        return item.getBasePrice()
                .multiply(multiplier)
                .setScale(2, RoundingMode.HALF_UP);
    }

    // FIND ACTIVE, UNEXPIRED FREEZE
    @Transactional
    public PriceFreeze findActiveFreeze(Long userId, String itemType, Long itemId) {

        if (userId == null || itemId == null) {
            throw new IllegalArgumentException("User ID and item ID are required.");
        }

        String type = normalizeType(itemType);
        LocalDateTime now = LocalDateTime.now();

        return priceFreezeRepository
                .findFirstByUserIdAndItemTypeAndItemIdAndStatusOrderByExpiresAtDesc(userId, type, itemId, "ACTIVE")
                .filter(freeze ->
                        freeze.getExpiresAt() != null && freeze.getExpiresAt().isAfter(now))
                .orElse(null);
    }

    // GET CURRENT PRICE
    @Transactional
    public BigDecimal getCurrentPrice(Long userId, String itemType, Long itemId) {

        PriceFreeze freeze = findActiveFreeze(userId, itemType, itemId);

        if (freeze != null) {
            return freeze.getLockedPrice();
        }

        PricingItem item = getPricingItem(itemType, itemId);

        return calculatePrice(item);
    }

    // CREATE OR REUSE PRICE FREEZE
    @Transactional
    public PriceFreeze freezePrice(Long userId,String itemType, Long itemId) {

        if (userId == null) {
            throw new IllegalArgumentException("User ID is required.");
        }

        if (itemId == null) {
            throw new IllegalArgumentException("Item ID is required.");
        }

        String type = normalizeType(itemType);
        LocalDateTime now = LocalDateTime.now();

        // Reuse a freeze only when it has not expired
        PriceFreeze existing = priceFreezeRepository
                .findFirstByUserIdAndItemTypeAndItemIdAndStatusOrderByExpiresAtDesc(userId, type, itemId, "ACTIVE")
                .orElse(null);

        if (existing != null && existing.getExpiresAt() != null
                && existing.getExpiresAt().isAfter(now)) {
            return existing;
        }

        // Mark the old freeze expired
        if (existing != null) {
            existing.setStatus("EXPIRED");
            priceFreezeRepository.save(existing);
        }

        // Calculate the latest price
        PricingItem item = getPricingItem(type, itemId);
        BigDecimal lockedPrice = calculatePrice(item);

        // Create a new freeze
        PriceFreeze freeze = new PriceFreeze();
        freeze.setUserId(userId);
        freeze.setItemType(type);
        freeze.setItemId(itemId);
        freeze.setLockedPrice(lockedPrice);
        freeze.setCreatedAt(now);
        freeze.setExpiresAt(now.plusMinutes(FREEZE_MINUTES));
        freeze.setStatus("ACTIVE");

        return priceFreezeRepository.save(freeze);
    }

    // GET FREEZE BY ID
    @Transactional
    public PriceFreeze getFreeze(Long freezeId) {

        if (freezeId == null) {
            throw new IllegalArgumentException("Freeze ID is required.");
        }

        PriceFreeze freeze = priceFreezeRepository
                .findById(freezeId)
                .orElseThrow(() -> new IllegalArgumentException("Price freeze not found: " + freezeId));

        if (freeze.getExpiresAt() == null || !freeze.getExpiresAt().isAfter(LocalDateTime.now())) {

            freeze.setStatus("EXPIRED");
            priceFreezeRepository.save(freeze);
        }

        return freeze;
    }

    // VALIDATE PRICE BEFORE BOOKING
    @Transactional
    public PriceFreeze validateActiveFreeze(Long userId, String itemType, Long itemId, double requestedPrice) {

        if (!Double.isFinite(requestedPrice) || requestedPrice <= 0) {
            throw new IllegalArgumentException("Invalid booking price.");
        }

        PriceFreeze freeze = findActiveFreeze(userId, itemType, itemId);

        if (freeze == null) {
            throw new IllegalStateException("Price freeze expired or not found. " + "Please refresh the price.");
        }

        if (freeze.getLockedPrice() == null) {
            throw new IllegalStateException("Frozen price is missing.");
        }

        double lockedPrice = freeze.getLockedPrice().doubleValue();

        if (Math.abs(requestedPrice - lockedPrice) > 0.01) {
            throw new IllegalArgumentException("Price mismatch. Locked price is "  + lockedPrice);
        }
        return freeze;
    }

    // UPDATE PRICING ITEM
    @Transactional
    public PricingItem updatePricing(PricingItem item) {

        if (item == null) {
            throw new IllegalArgumentException("Pricing item is required.");
        }

        normalizeType(item.getItemType());

        if (item.getItemId() == null || item.getBasePrice() == null
                || item.getBasePrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valid item ID and base price are required.");
        }

        if (item.getDemandAdjustment() == null) {
            item.setDemandAdjustment(BigDecimal.ZERO);
        }

        if (item.getSeasonalAdjustment() == null) {
            item.setSeasonalAdjustment(BigDecimal.ZERO);
        }
        return pricingItemRepository.save(item);
    }
}
