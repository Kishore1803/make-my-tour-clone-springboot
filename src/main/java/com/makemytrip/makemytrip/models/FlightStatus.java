package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flight_status")
public class FlightStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "flight_number", nullable = false)
    private String flightNumber;

    @Column(nullable = false)
    private String airline;

    @Column(name = "from_city", nullable = false)
    private String fromCity;

    @Column(name = "to_city", nullable = false)
    private String toCity;

    @Column(name = "departure_date", nullable = false)
    private String departureDate;

    @Column(name = "scheduled_departure", nullable = false)
    private String scheduledDeparture;

    @Column(name = "revised_departure", nullable = false)
    private String revisedDeparture;

    @Column(name = "scheduled_arrival", nullable = false)
    private String scheduledArrival;

    @Column(name = "estimated_arrival", nullable = false)
    private String estimatedArrival;

    @Column(nullable = false)
    private String status;

    @Column(name = "delay_minutes", nullable = false)
    private Integer delayMinutes = 0;

    @Column(name = "delay_reason", length = 500)
    private String delayReason;

    private String terminal;

    private String gate;

    @Column(nullable = false)
    private Integer progress = 0;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    @Column(name = "status_updated_at", nullable = false)
    private LocalDateTime statusUpdatedAt;

    public FlightStatus() {
    }

    public FlightStatus(
            String flightNumber,
            String airline,
            String fromCity,
            String toCity,
            String departureDate,
            String scheduledDeparture,
            String revisedDeparture,
            String scheduledArrival,
            String estimatedArrival,
            String status,
            Integer delayMinutes,
            String delayReason,
            String terminal,
            String gate,
            Integer progress) {

        this.flightNumber = flightNumber;
        this.airline = airline;
        this.fromCity = fromCity;
        this.toCity = toCity;
        this.departureDate = departureDate;
        this.scheduledDeparture = scheduledDeparture;
        this.revisedDeparture = revisedDeparture;
        this.scheduledArrival = scheduledArrival;
        this.estimatedArrival = estimatedArrival;
        this.status = status;
        this.delayMinutes = delayMinutes != null ? delayMinutes : 0;
        this.delayReason = delayReason;
        this.terminal = terminal;
        this.gate = gate;
        this.progress = progress != null ? progress : 0;
        this.lastUpdated = LocalDateTime.now();
        this.statusUpdatedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        if (lastUpdated == null) {
            lastUpdated = now;
        }

        if (statusUpdatedAt == null) {
            statusUpdatedAt = now;
        }

        if (delayMinutes == null) {
            delayMinutes = 0;
        }

        if (progress == null) {
            progress = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getAirline() {
        return airline;
    }

    public void setAirline(String airline) {
        this.airline = airline;
    }

    public String getFromCity() {
        return fromCity;
    }

    public void setFromCity(String fromCity) {
        this.fromCity = fromCity;
    }

    public String getToCity() {
        return toCity;
    }

    public void setToCity(String toCity) {
        this.toCity = toCity;
    }

    public String getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(String departureDate) {
        this.departureDate = departureDate;
    }

    public String getScheduledDeparture() {
        return scheduledDeparture;
    }

    public void setScheduledDeparture(String scheduledDeparture) {
        this.scheduledDeparture = scheduledDeparture;
    }

    public String getRevisedDeparture() {
        return revisedDeparture;
    }

    public void setRevisedDeparture(String revisedDeparture) {
        this.revisedDeparture = revisedDeparture;
    }

    public String getScheduledArrival() {
        return scheduledArrival;
    }

    public void setScheduledArrival(String scheduledArrival) {
        this.scheduledArrival = scheduledArrival;
    }

    public String getEstimatedArrival() {
        return estimatedArrival;
    }

    public void setEstimatedArrival(String estimatedArrival) {
        this.estimatedArrival = estimatedArrival;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.statusUpdatedAt = LocalDateTime.now();
    }

    public Integer getDelayMinutes() {
        return delayMinutes;
    }

    public void setDelayMinutes(Integer delayMinutes) {
        this.delayMinutes = delayMinutes;
    }

    public String getDelayReason() {
        return delayReason;
    }

    public void setDelayReason(String delayReason) {
        this.delayReason = delayReason;
    }

    public String getTerminal() {
        return terminal;
    }

    public void setTerminal(String terminal) {
        this.terminal = terminal;
    }

    public String getGate() {
        return gate;
    }

    public void setGate(String gate) {
        this.gate = gate;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public LocalDateTime getStatusUpdatedAt() {
        return statusUpdatedAt;
    }

    public void setStatusUpdatedAt(LocalDateTime statusUpdatedAt) {
        this.statusUpdatedAt = statusUpdatedAt;
    }
}