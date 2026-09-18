package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.services.FlightStatusService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flight-status")
public class FlightStatusController {

    private final FlightStatusService service;

    public FlightStatusController(FlightStatusService service) {
        this.service = service;
    }

    @GetMapping("/{flightId}")
    public FlightStatus getStatus(@PathVariable Long flightId) {
        return service.getFlightStatus(flightId);
    }

    @PostMapping("/{flightId}/simulate")
    public FlightStatus simulateStatus(@PathVariable Long flightId) {
        return service.simulateFlightStatus(flightId);
    }
}