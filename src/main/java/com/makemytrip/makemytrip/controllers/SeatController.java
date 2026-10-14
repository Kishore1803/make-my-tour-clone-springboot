package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Seat;
import com.makemytrip.makemytrip.services.SeatService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seat")
public class SeatController {

    @Autowired
    private SeatService seatService;

    // Add a new seat
    @PostMapping
    public ResponseEntity<Seat> createSeat(@RequestBody Seat seat) {
        Seat savedSeat = seatService.createSeat(seat);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSeat);
    }

    // Get all seats for a flight
    @GetMapping("/flight/{flightId}")
    public List<Seat> getSeatsByFlight(@PathVariable Long flightId) {
        return seatService.getSeatsByFlight(flightId);
    }

    // Get available seats
    @GetMapping("/flight/{flightId}/available")
    public List<Seat> getAvailableSeats(@PathVariable Long flightId) {
        return seatService.getAvailableSeats(flightId);
    }

    // Get a specific seat
    @GetMapping("/{flightId}/{seatNumber}")
    public Seat getSeat(@PathVariable Long flightId, @PathVariable String seatNumber) {
        return seatService.getSeat(flightId, seatNumber);
    }
}
