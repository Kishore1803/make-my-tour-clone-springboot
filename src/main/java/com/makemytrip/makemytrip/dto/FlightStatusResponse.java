package com.makemytrip.makemytrip.dto;

import java.time.LocalDateTime;

public class FlightStatusResponse {

    private Long id;

    private String flightNumber;
    private String airline;

    private String fromCity;
    private String toCity;

    private String departureDate;

    private String scheduledDeparture;
    private String revisedDeparture;

    private String scheduledArrival;
    private String estimatedArrival;

    private String status;

    private Integer delayMinutes;
    private String delayReason;

    private String terminal;
    private String gate;

    private Integer progress;

    private LocalDateTime lastUpdated;

    public FlightStatusResponse() {
    }

    public FlightStatusResponse(Long id, String flightNumber, String airline, String fromCity, String toCity,
            String departureDate, String scheduledDeparture, String revisedDeparture, String scheduledArrival,
            String estimatedArrival, String status, Integer delayMinutes, String delayReason, String terminal,
            String gate, Integer progress, LocalDateTime lastUpdated) {
        this.id = id;
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
        this.delayMinutes = delayMinutes;
        this.delayReason = delayReason;
        this.terminal = terminal;
        this.gate = gate;
        this.progress = progress;
        this.lastUpdated = lastUpdated;
    }

    public Long getId() {
        return id;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public String getAirline() {
        return airline;
    }

    public String getFromCity() {
        return fromCity;
    }

    public String getToCity() {
        return toCity;
    }

    public String getDepartureDate() {
        return departureDate;
    }

    public String getScheduledDeparture() {
        return scheduledDeparture;
    }

    public String getRevisedDeparture() {
        return revisedDeparture;
    }

    public String getScheduledArrival() {
        return scheduledArrival;
    }

    public String getEstimatedArrival() {
        return estimatedArrival;
    }

    public String getStatus() {
        return status;
    }

    public Integer getDelayMinutes() {
        return delayMinutes;
    }

    public String getDelayReason() {
        return delayReason;
    }

    public String getTerminal() {
        return terminal;
    }

    public String getGate() {
        return gate;
    }

    public Integer getProgress() {
        return progress;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }
}