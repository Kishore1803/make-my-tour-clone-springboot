package com.makemytrip.makemytrip.models;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "price_freeze")
public class PriceFreeze {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long userId;

	private Long flightId;

	private Long hotelId;

	private Double frozenPrice;

	private LocalDateTime createdAt;

	private LocalDateTime expiresAt;

	private String status;

	public PriceFreeze(Long id, Long userId, Long flightId, Long hotelId, Double frozenPrice, LocalDateTime createdAt,
			LocalDateTime expiresAt, String status) {
		this.id = id;
		this.userId = userId;
		this.flightId = flightId;
		this.hotelId = hotelId;
		this.frozenPrice = frozenPrice;
		this.createdAt = createdAt;
		this.expiresAt = expiresAt;
		this.status = status;
	}
	
	public PriceFreeze() {
		
	}

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

	public Double getFrozenPrice() {
		return frozenPrice;
	}

	public void setFrozenPrice(Double frozenPrice) {
		this.frozenPrice = frozenPrice;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime localDateTime) {
		this.createdAt = localDateTime;
	}

	public LocalDateTime getExpiresAt() {
		return expiresAt;
	}

	public void setExpiresAt(LocalDateTime localDateTime) {
		this.expiresAt = localDateTime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
}