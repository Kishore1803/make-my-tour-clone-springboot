package com.makemytrip.makemytrip.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.makemytrip.makemytrip.dto.TrackFlightRequest;
import com.makemytrip.makemytrip.models.FlightTracking;
import com.makemytrip.makemytrip.services.FlightTrackingService;

@RestController
@RequestMapping("/api/flight-tracking")
public class FlightTrackingController {

	@Autowired
    private FlightTrackingService service;

    @GetMapping("/{userId}/{flightId}")
    public ResponseEntity<FlightTracking> getTracking(@PathVariable Long userId,@PathVariable Long flightId) {
        FlightTracking tracking = service.getTracking(userId, flightId);

        if (tracking == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(tracking);
    }

    @PostMapping("/track")
    public ResponseEntity<FlightTracking> trackFlight(@RequestBody TrackFlightRequest request) {
        FlightTracking tracking = service.trackFlight(request.getUserId(), request.getFlightId(), request.getFlightNumber());
        return ResponseEntity.ok(tracking);
    }

    @DeleteMapping("/{userId}/{flightId}")
    public ResponseEntity<Void> stopTrackingFlight(@PathVariable Long userId, @PathVariable Long flightId) {
        service.stopTrackingFlight(userId, flightId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FlightTracking>> getTrackedFlights(@PathVariable Long userId) {
        List<FlightTracking> flights = service.getTrackedFlights(userId);
        return ResponseEntity.ok(flights);
    }
}