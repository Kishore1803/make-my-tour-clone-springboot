package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pricing_items",
       uniqueConstraints = @UniqueConstraint(columnNames = {"item_type", "item_id"}))
public class PricingItem {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_type", nullable = false, length = 16)
    private String itemType;

    @Column(name = "item_id", nullable = false)
    private Long itemId;

    @Column(name = "base_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "demand_adjustment", nullable = false, precision = 6, scale = 4)
    private BigDecimal demandAdjustment = BigDecimal.ZERO;

    @Column(name = "seasonal_adjustment", nullable = false, precision = 6, scale = 4)
    private BigDecimal seasonalAdjustment = BigDecimal.ZERO;

    @Column(nullable = false)
    private boolean holiday;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
    public BigDecimal getDemandAdjustment() { return demandAdjustment; }
    public void setDemandAdjustment(BigDecimal demandAdjustment) { this.demandAdjustment = demandAdjustment; }
    public BigDecimal getSeasonalAdjustment() { return seasonalAdjustment; }
    public void setSeasonalAdjustment(BigDecimal seasonalAdjustment) { this.seasonalAdjustment = seasonalAdjustment; }
    public boolean isHoliday() { return holiday; }
    public void setHoliday(boolean holiday) { this.holiday = holiday; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
