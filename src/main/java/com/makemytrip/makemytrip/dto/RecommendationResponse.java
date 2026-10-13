package com.makemytrip.makemytrip.dto;

import java.math.BigDecimal;

public record RecommendationResponse(
    Long id,
    String type,
    String title,
    String destination,
    String category,
    String description,
    String imageUrl,
    BigDecimal price,
    double score,
    String reason
) {}
