
package com.makemytrip.makemytrip.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_freezes")
public class PriceFreeze {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "item_type", nullable = false, length = 16)
    private String itemType;

    @Column(name = "item_id", nullable = false)
    private Long itemId;

    @Column(name = "locked_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal lockedPrice;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false, length = 16)
    private String status = "ACTIVE";

    // Automatically set creation time before inserting a record
    @PrePersist
    public void setCreatedAt() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
    
    public PriceFreeze() {
    	
    }
    
	public PriceFreeze(Long id, Long userId, String itemType, Long itemId, BigDecimal lockedPrice,
			LocalDateTime createdAt, LocalDateTime expiresAt, String status) {
		this.id = id;
		this.userId = userId;
		this.itemType = itemType;
		this.itemId = itemId;
		this.lockedPrice = lockedPrice;
		this.createdAt = createdAt;
		this.expiresAt = expiresAt;
		this.status = status;
	}

	// Getters and setters
    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public BigDecimal getLockedPrice() {
        return lockedPrice;
    }

    public void setLockedPrice(BigDecimal lockedPrice) {
        this.lockedPrice = lockedPrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
