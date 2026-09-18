package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flight_status")
public class FlightStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long flightId;

    @Column(nullable = false)
    private String status;

    private int delayMinutes;

    private String delayReason;

    private LocalDateTime estimatedDeparture;

    private LocalDateTime estimatedArrival;

    private LocalDateTime updatedAt;

    public FlightStatus() {
    }

    public FlightStatus(Long flightId, String status, int delayMinutes, String delayReason, LocalDateTime estimatedDeparture, LocalDateTime estimatedArrival, LocalDateTime updatedAt) {
        this.flightId = flightId;
        this.status = status;
        this.delayMinutes = delayMinutes;
        this.delayReason = delayReason;
        this.estimatedDeparture = estimatedDeparture;
        this.estimatedArrival = estimatedArrival;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getDelayMinutes() {
        return delayMinutes;
    }

    public void setDelayMinutes(int delayMinutes) {
        this.delayMinutes = delayMinutes;
    }

    public String getDelayReason() {
        return delayReason;
    }

    public void setDelayReason(String delayReason) {
        this.delayReason = delayReason;
    }

    public LocalDateTime getEstimatedDeparture() {
        return estimatedDeparture;
    }

    public void setEstimatedDeparture(LocalDateTime estimatedDeparture) {
        this.estimatedDeparture = estimatedDeparture;
    }

    public LocalDateTime getEstimatedArrival() {
        return estimatedArrival;
    }

    public void setEstimatedArrival(LocalDateTime estimatedArrival) {
        this.estimatedArrival = estimatedArrival;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}