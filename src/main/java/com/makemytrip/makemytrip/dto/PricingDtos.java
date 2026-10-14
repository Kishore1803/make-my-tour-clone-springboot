package com.makemytrip.makemytrip.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public final class PricingDtos {

    private PricingDtos() {}

    public record AdminUpdateRequest(
        BigDecimal basePrice,
        BigDecimal demandAdjustment,
        BigDecimal seasonalAdjustment,
        boolean holiday
    ) {}

    public record PriceResponse(
        String itemType,
        Long itemId,
        BigDecimal basePrice,
        BigDecimal demandAmount,
        BigDecimal seasonalAmount,
        BigDecimal holidayAmount,
        BigDecimal finalPrice,
        boolean frozen,
        LocalDateTime updatedAt
    ) {}

    public record HistoryResponse(
        BigDecimal basePrice,
        BigDecimal finalPrice,
        LocalDateTime recordedAt
    ) {}

    public record FreezeRequest(Long userId) {}

    public record FreezeResponse(
        Long freezeId,
        BigDecimal lockedPrice,
        LocalDateTime expiresAt,
        String status
    ) {}
}