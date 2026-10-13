package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_freezes")
public class PriceFreeze {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String itemType;
    private Long itemId;

    @Column(precision = 12, scale = 2)
    private BigDecimal lockedPrice;

    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private String status;

    public PriceFreeze() {}

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
