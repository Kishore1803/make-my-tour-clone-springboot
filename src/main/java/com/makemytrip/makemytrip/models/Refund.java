
package com.makemytrip.makemytrip.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "refunds")
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long bookingId;
    private String bookingType;

    @Column(nullable = false)
    private double bookingAmount;

    @Column(nullable = false)
    private double refundAmount;

    private String refundStatus;
    private double refundPercentage;
    private String expectedTimeline;
    private LocalDateTime requestedAt;
    private LocalDateTime completedAt;

    // Default constructor
    public Refund() {
    }

    // Parameterized constructor
    public Refund(Long id, Long userId, Long bookingId, String bookingType,
            double bookingAmount, double refundAmount,String refundStatus, double refundPercentage, 
            String expectedTimeline, LocalDateTime requestedAt, LocalDateTime completedAt) {
        this.id = id;
        this.userId = userId;
        this.bookingId = bookingId;
        this.bookingType = bookingType;
        this.bookingAmount = bookingAmount;
        this.refundAmount = refundAmount;
        this.refundStatus = refundStatus;
        this.refundPercentage = refundPercentage;
        this.expectedTimeline = expectedTimeline;
        this.requestedAt = requestedAt;
        this.completedAt = completedAt;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getBookingType() {
        return bookingType;
    }

    public void setBookingType(String bookingType) {
        this.bookingType = bookingType;
    }

    public double getBookingAmount() {
        return bookingAmount;
    }

    public void setBookingAmount(double bookingAmount) {
        this.bookingAmount = bookingAmount;
    }

    public double getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(double refundAmount) {
        this.refundAmount = refundAmount;
    }

    public String getRefundStatus() {
        return refundStatus;
    }

    public void setRefundStatus(String refundStatus) {
        this.refundStatus = refundStatus;
    }

    public double getRefundPercentage() {
        return refundPercentage;
    }

    public void setRefundPercentage(double refundPercentage) {
        this.refundPercentage = refundPercentage;
    }

    public String getExpectedTimeline() {
        return expectedTimeline;
    }

    public void setExpectedTimeline(String expectedTimeline) {
        this.expectedTimeline = expectedTimeline;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}