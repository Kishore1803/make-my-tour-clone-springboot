package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_history")
public class PriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long flightId;

    private Long hotelId;

    private Double basePrice;

    private Double dynamicPrice;

    private Double changePercentage;

    private String reason;

    private LocalDateTime createdAt;

    public PriceHistory() {
    }

    public PriceHistory(Long flightId,Long hotelId, Double basePrice, Double dynamicPrice, Double changePercentage, String reason, LocalDateTime createdAt) {
        this.flightId = flightId;
        this.hotelId = hotelId;
        this.basePrice = basePrice;
        this.dynamicPrice = dynamicPrice;
        this.changePercentage = changePercentage;
        this.reason = reason;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public Double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(Double basePrice) {
        this.basePrice = basePrice;
    }

    public Double getDynamicPrice() {
        return dynamicPrice;
    }

    public void setDynamicPrice(Double dynamicPrice) {
        this.dynamicPrice = dynamicPrice;
    }

    public Double getChangePercentage() {
        return changePercentage;
    }

    public void setChangePercentage(Double changePercentage) {
        this.changePercentage = changePercentage;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}