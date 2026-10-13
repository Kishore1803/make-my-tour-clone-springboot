package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "review_flags")
public class ReviewFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Review being reported
    @Column(nullable = false)
    private Long reviewId;

    // User who reported the review
    @Column(nullable = false)
    private Long userId;

    // Reason for reporting
    @Column(length = 500, nullable = false)
    private String reason;

    // PENDING / REVIEWED / DISMISSED
    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // CONSTRUCTOR
    public ReviewFlag() {
    }

    public ReviewFlag(Long reviewId, Long userId, String reason) {
        this.reviewId = reviewId;
        this.userId = userId;
        this.reason = reason;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    // GETTERS & SETTERS
    public Long getId() {
        return id;
    }

    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}