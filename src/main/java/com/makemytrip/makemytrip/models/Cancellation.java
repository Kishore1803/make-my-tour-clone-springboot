package com.makemytrip.makemytrip.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cancellations")
public class Cancellation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long bookingId;

    private Long userId;

    private String bookingType;

    private String reason;

    private double bookingAmount;

    private double refundPercentage;

    private double refundAmount;

    private LocalDateTime cancelledAt;

    private String status;

    // Default Constructor
    public Cancellation() {
    }

    // Parameterized Constructor
	public Cancellation(Long id, Long bookingId, Long userId, String bookingType, String reason, double bookingAmount,
			double refundPercentage, double refundAmount, LocalDateTime cancelledAt, String status) {
		super();
		this.id = id;
		this.bookingId = bookingId;
		this.userId = userId;
		this.bookingType = bookingType;
		this.reason = reason;
		this.bookingAmount = bookingAmount;
		this.refundPercentage = refundPercentage;
		this.refundAmount = refundAmount;
		this.cancelledAt = cancelledAt;
		this.status = status;
	}

    // Getters and Setters
    public Long getId() {
        return id;
    }

	public void setId(Long id) {
        this.id = id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getBookingType() {
        return bookingType;
    }

    public void setBookingType(String bookingType) {
        this.bookingType = bookingType;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public double getBookingAmount() {
        return bookingAmount;
    }

    public void setBookingAmount(double bookingAmount) {
        this.bookingAmount = bookingAmount;
    }

    public double getRefundPercentage() {
        return refundPercentage;
    }

    public void setRefundPercentage(double refundPercentage) {
        this.refundPercentage = refundPercentage;
    }

    public double getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(double refundAmount) {
        this.refundAmount = refundAmount;
    }

    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(LocalDateTime cancelledAt) {
        this.cancelledAt = cancelledAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}