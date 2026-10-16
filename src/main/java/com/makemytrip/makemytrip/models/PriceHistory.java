package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_history",
    indexes = @Index(name = "idx_price_history_item",
        columnList = "item_type,item_id,recorded_at"
    )
)
public class PriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_type", length = 255)
    private String itemType;

    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "dynamic_price")
    private BigDecimal dynamicPrice;

    @Column(name = "base_price", precision = 12, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "final_price", precision = 12, scale = 2)
    private BigDecimal finalPrice;

    @Column(name = "change_percentage", precision = 7, scale = 2)
    private BigDecimal changePercentage = BigDecimal.ZERO;

    @Column(name = "demand_adjustment", precision = 6, scale = 4)
    private BigDecimal demandAdjustment;

    @Column(name = "seasonal_adjustment", precision = 6, scale = 4)
    private BigDecimal seasonalAdjustment;

    @Column(name = "holiday")
    private Boolean holiday = false;

    @Column(name = "flight_id")
    private Long flightId;

    @Column(name = "hotel_id")
    private Long hotelId;

    @Column(name = "reason")
    private String reason;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        if (recordedAt == null) recordedAt = now;
        if (createdAt == null) createdAt = now;
        if (changePercentage == null) { 
        	changePercentage = BigDecimal.ZERO;
        }
        
        if (holiday == null) {
            holiday = false;
        }
    }
    
    public PriceHistory() {
    	
    }
    
	public PriceHistory(Long id, String itemType, Long itemId, BigDecimal dynamicPrice, BigDecimal basePrice,
			BigDecimal finalPrice, BigDecimal changePercentage, BigDecimal demandAdjustment,
			BigDecimal seasonalAdjustment, Boolean holiday, Long flightId, Long hotelId, String reason,
			LocalDateTime recordedAt, LocalDateTime createdAt) {
		super();
		this.id = id;
		this.itemType = itemType;
		this.itemId = itemId;
		this.dynamicPrice = dynamicPrice;
		this.basePrice = basePrice;
		this.finalPrice = finalPrice;
		this.changePercentage = changePercentage;
		this.demandAdjustment = demandAdjustment;
		this.seasonalAdjustment = seasonalAdjustment;
		this.holiday = holiday;
		this.flightId = flightId;
		this.hotelId = hotelId;
		this.reason = reason;
		this.recordedAt = recordedAt;
		this.createdAt = createdAt;
	}

	public Long getId() { 
    	return id;
    }

    public String getItemType() { 
    	return itemType; 
    }
    
    public void setItemType(String itemType) { 
    	this.itemType = itemType;
    }

    public Long getItemId() { 
    	return itemId;
    }
    
    public void setItemId(Long itemId) { 
    	this.itemId = itemId;
    }

    public BigDecimal getDynamicPrice() { 
    	return dynamicPrice;
    }
    
    public void setDynamicPrice(BigDecimal dynamicPrice) {
        this.dynamicPrice = dynamicPrice;
    }

    public BigDecimal getBasePrice() { 
    	return basePrice;
    }
    
    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public BigDecimal getFinalPrice() { 
    	return finalPrice; 
    }
    
    public void setFinalPrice(BigDecimal finalPrice) {
        this.finalPrice = finalPrice;
    }

    public BigDecimal getChangePercentage() {
        return changePercentage;
    }
    
    public void setChangePercentage(BigDecimal changePercentage) {
        this.changePercentage = changePercentage;
    }

    public BigDecimal getDemandAdjustment() {
        return demandAdjustment;
    }
    
    public void setDemandAdjustment(BigDecimal demandAdjustment) {
        this.demandAdjustment = demandAdjustment;
    }

    public BigDecimal getSeasonalAdjustment() {
        return seasonalAdjustment;
    }
    
    public void setSeasonalAdjustment(BigDecimal seasonalAdjustment) {
        this.seasonalAdjustment = seasonalAdjustment;
    }

    public Boolean getHoliday() { 
    	return holiday;
    }
    
    public void setHoliday(Boolean holiday) {
        this.holiday = holiday;
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

    public String getReason() { 
    	return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getRecordedAt() { 
    	return recordedAt;
    }
    
    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }

    public LocalDateTime getCreatedAt() { 
    	return createdAt;
    }
}