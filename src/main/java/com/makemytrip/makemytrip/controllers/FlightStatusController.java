package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.dto.FlightStatusResponse;
import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.services.FlightStatusService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flight-status")
public class FlightStatusController {

    @Autowired
    private FlightStatusService flightStatusService;

    @PostMapping
    public ResponseEntity<FlightStatusResponse> createFlight(@RequestBody FlightStatus flightStatus) {
        FlightStatusResponse response = flightStatusService.createFlight(flightStatus);
        return ResponseEntity.ok(response);
    }

    // GET ALL FLIGHTS
    @GetMapping
    public ResponseEntity<List<FlightStatusResponse>> getAllFlights() {
        return ResponseEntity.ok(flightStatusService.getAllFlights());
    }

    // GET FLIGHT BY FLIGHT NUMBER
    @GetMapping("/{flightNumber}")
    public ResponseEntity<FlightStatusResponse> getFlightStatus(@PathVariable String flightNumber) {
        return ResponseEntity.ok(flightStatusService.getFlightStatus(flightNumber));
    }

    // SEARCH FLIGHTS
    @GetMapping("/search")
    public ResponseEntity<List<FlightStatusResponse>> searchFlights(@RequestParam String from,
            @RequestParam String to) {
        return ResponseEntity.ok(flightStatusService.searchFlights(from, to));
    }

    // GET FLIGHTS BY STATUS
    @GetMapping("/status/{status}")
    public ResponseEntity<List<FlightStatusResponse>> getFlightsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(flightStatusService.getFlightsByStatus(status));
    }
}