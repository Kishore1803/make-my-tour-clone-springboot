package com.makemytrip.makemytrip.services;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.repositories.FlightStatusRepository;

@Service
public class FlightStatusService {

    private final FlightStatusRepository repository;

    public FlightStatusService(FlightStatusRepository repository) {
        this.repository = repository;
    }

    public FlightStatus getFlightStatus(Long flightId) {
        return repository.findByFlightId(flightId).orElse(null);
    }

    public FlightStatus updateFlightStatus(Long flightId, String status, int delayMinutes, String delayReason) {
    	
        FlightStatus flightStatus = repository.findByFlightId(flightId).orElse(new FlightStatus());
        flightStatus.setFlightId(flightId);
        flightStatus.setStatus(status);
        flightStatus.setDelayMinutes(delayMinutes);
        flightStatus.setDelayReason(delayReason);
        flightStatus.setUpdatedAt(LocalDateTime.now());

        return repository.save(flightStatus);
    }

    public FlightStatus simulateFlightStatus(Long flightId) {
    	
        FlightStatus flightStatus = repository.findByFlightId(flightId).orElse(new FlightStatus());
        flightStatus.setFlightId(flightId);

        double random = Math.random();

        if (random < 0.25) {

            flightStatus.setStatus("BOARDING");
            flightStatus.setDelayMinutes(0);
            flightStatus.setDelayReason("Boarding in progress");

        } else if (random < 0.50) {

            flightStatus.setStatus("ON_TIME");
            flightStatus.setDelayMinutes(0);
            flightStatus.setDelayReason("Flight is operating on schedule");

        } else if (random < 0.75) {

            flightStatus.setStatus("DELAYED");
            flightStatus.setDelayMinutes(60);
            flightStatus.setDelayReason("Operational delay");

        } else {

            flightStatus.setStatus("DELAYED");
            flightStatus.setDelayMinutes(120);
            flightStatus.setDelayReason("Weather conditions");
        }

        flightStatus.setUpdatedAt(LocalDateTime.now());
        return repository.save(flightStatus);
    }
}