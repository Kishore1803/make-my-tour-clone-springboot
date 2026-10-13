package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_history")
public class PriceHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemType;
    private Long itemId;

    @Column(precision = 12, scale = 2)
    private BigDecimal basePrice;

    @Column(precision = 12, scale = 2)
    private BigDecimal finalPrice;

    @Column(precision = 6, scale = 4)
    private BigDecimal demandAdjustment;

    @Column(precision = 6, scale = 4)
    private BigDecimal seasonalAdjustment;

    private boolean holiday;
    private LocalDateTime recordedAt;

    public PriceHistory() {}

    @PrePersist
    public void setRecordedAtIfMissing() {
        if (recordedAt == null) {
            recordedAt = LocalDateTime.now();
        }
    }

    public Long getId() { 
    	return id; 
    }
    
    public void setId(Long id) { 
    	this.id = id; 
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

    public BigDecimal getDemandAdjustment() {
    	return demandAdjustment; 
    }
    
    public void setDemandAdjustment(BigDecimal value) {
        demandAdjustment = value;
    }

    public BigDecimal getSeasonalAdjustment() {
    	return seasonalAdjustment;
    }
    
    public void setSeasonalAdjustment(BigDecimal value) {
        seasonalAdjustment = value;
    }

    public boolean isHoliday() { 
    	return holiday; 
    }
    
    public void setHoliday(boolean holiday) { 
    	this.holiday = holiday; 
    }

    public LocalDateTime getRecordedAt() { 
    	return recordedAt;
    }
    
    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}
