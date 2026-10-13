package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long hotelId;

    @Column(nullable = false)
    private String roomType;

    @Column(nullable = false)
    private double pricePerNight;

    @Column(nullable = false)
    private int availableRooms;

    @Column(length = 1000)
    private String description;

    private String imageUrl;

    private String previewUrl;

    public Room() {
    	
    }
    
	public Room(Long id, Long hotelId, String roomType, double pricePerNight, int availableRooms, String description,
			String imageUrl, String previewUrl) {
		this.id = id;
		this.hotelId = hotelId;
		this.roomType = roomType;
		this.pricePerNight = pricePerNight;
		this.availableRooms = availableRooms;
		this.description = description;
		this.imageUrl = imageUrl;
		this.previewUrl = previewUrl;
	}

	// Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public int getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(int availableRooms) {
        this.availableRooms = availableRooms;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPreviewUrl() {
        return previewUrl;
    }

    public void setPreviewUrl(String previewUrl) {
        this.previewUrl = previewUrl;
    }
}