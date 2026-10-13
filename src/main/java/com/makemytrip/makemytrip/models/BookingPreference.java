package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;

@Entity
@Table(name = "booking_preferences")
public class BookingPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String preferenceType;

    @Column(nullable = false)
    private String preferenceValue;

    public BookingPreference() {
    	
    }

	public BookingPreference(Long id, Long userId, String preferenceType, String preferenceValue) {
		this.id = id;
		this.userId = userId;
		this.preferenceType = preferenceType;
		this.preferenceValue = preferenceValue;
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

    public String getPreferenceType() {
        return preferenceType;
    }

    public void setPreferenceType(String preferenceType) {
        this.preferenceType = preferenceType;
    }

    public String getPreferenceValue() {
        return preferenceValue;
    }

    public void setPreferenceValue(String preferenceValue) {
        this.preferenceValue = preferenceValue;
    }
}