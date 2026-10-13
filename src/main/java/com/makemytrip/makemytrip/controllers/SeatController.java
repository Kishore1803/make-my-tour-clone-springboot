package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Seat;
import com.makemytrip.makemytrip.services.SeatService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seat")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @GetMapping("/flight/{flightId}")
    public List<Seat> getSeatsByFlight(@PathVariable Long flightId) {
        return seatService.getSeatsByFlight(flightId);
    }

    @GetMapping("/flight/{flightId}/available")
    public List<Seat> getAvailableSeats(@PathVariable Long flightId) {
        return seatService.getAvailableSeats(flightId);
    }

    @GetMapping("/{flightId}/{seatNumber}")
    public Seat getSeat(@PathVariable Long flightId, @PathVariable String seatNumber) {
        return seatService.getSeat(flightId, seatNumber);
    }
}