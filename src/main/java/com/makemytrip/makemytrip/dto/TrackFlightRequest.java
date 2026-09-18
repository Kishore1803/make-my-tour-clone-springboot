package com.makemytrip.makemytrip.dto;

public class TrackFlightRequest {

    private Long userId;
    private Long flightId;
    private String flightNumber;

    public TrackFlightRequest() {
    }

    public TrackFlightRequest(Long userId, Long flightId, String flightNumber) {
        this.userId = userId;
        this.flightId = flightId;
        this.flightNumber = flightNumber;
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

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }
}