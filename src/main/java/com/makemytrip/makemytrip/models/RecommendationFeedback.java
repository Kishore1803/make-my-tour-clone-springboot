package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendation_feedback", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "itemId"}))
public class RecommendationFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long itemId;
    private boolean helpful;
    private String reason;
    private LocalDateTime createdAt = LocalDateTime.now();

    public RecommendationFeedback() {}

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getItemId() { return itemId; }
    public boolean isHelpful() { return helpful; }
    public String getReason() { return reason; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public void setHelpful(boolean helpful) { this.helpful = helpful; }
    public void setReason(String reason) { this.reason = reason; }
}
