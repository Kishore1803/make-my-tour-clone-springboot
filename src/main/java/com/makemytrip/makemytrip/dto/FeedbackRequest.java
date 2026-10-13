package com.makemytrip.makemytrip.dto;

import jakarta.validation.constraints.NotNull;

public record FeedbackRequest(
    @NotNull Long userId,
    @NotNull Long itemId,
    @NotNull Boolean helpful,
    String reason
) {}
