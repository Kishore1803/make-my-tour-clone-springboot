package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flight_tracking", uniqueConstraints = {@UniqueConstraint(columnNames = {"userId", "flightId"})})
public class FlightTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long flightId;

    private String flightNumber;

    private String status;

    private String reason;

    private LocalDateTime departureTime;

    private LocalDateTime arrivalTime;

    private LocalDateTime estimatedArrivalTime;

    private LocalDateTime lastUpdated;

    public FlightTracking() {
    }

    public FlightTracking(Long userId, Long flightId, String flightNumber, String status, String reason, LocalDateTime departureTime, LocalDateTime arrivalTime, LocalDateTime estimatedArrivalTime, LocalDateTime lastUpdated) {
        this.userId = userId;
        this.flightId = flightId;
        this.flightNumber = flightNumber;
        this.status = status;
        this.reason = reason;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.estimatedArrivalTime = estimatedArrivalTime;
        this.lastUpdated = lastUpdated;
    }

    public Long getId() {
        return id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public LocalDateTime getEstimatedArrivalTime() {
        return estimatedArrivalTime;
    }

    public void setEstimatedArrivalTime(
            LocalDateTime estimatedArrivalTime) {

        this.estimatedArrivalTime = estimatedArrivalTime;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}