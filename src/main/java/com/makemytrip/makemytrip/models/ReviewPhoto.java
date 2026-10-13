package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_photos")
public class ReviewPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Review to which this photo belongs
    @Column(nullable = false)
    private Long reviewId;

    // User who uploaded the photo
    @Column(nullable = false)
    private Long userId;

    // Image URL or stored image path
    @Column(length = 1000, nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String status;

    // CONSTRUCTOR
    public ReviewPhoto() {
    }

    public ReviewPhoto(Long reviewId, Long userId, String imageUrl) {
        this.reviewId = reviewId;
        this.userId = userId;
        this.imageUrl = imageUrl;
        this.createdAt = LocalDateTime.now();
        this.status = "ACTIVE";
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}