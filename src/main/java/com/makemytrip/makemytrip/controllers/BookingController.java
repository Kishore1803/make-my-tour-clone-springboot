package com.makemytrip.makemytrip.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.services.BookingService;

@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/flight")
    public ResponseEntity<Users.Booking> bookFlight(@RequestParam Long userId, @RequestParam Long flightId,
            @RequestParam int seats, @RequestParam double price, @RequestParam String selectedSeat) {
        Users.Booking booking = bookingService.bookFlight(userId, flightId, seats, price, selectedSeat);
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/hotel")
    public ResponseEntity<Users.Booking> bookHotel(@RequestParam Long userId, @RequestParam Long hotelId,
            @RequestParam int rooms, @RequestParam double price) {
        Users.Booking booking = bookingService.bookhotel(userId, hotelId, rooms, price);
        return ResponseEntity.ok(booking);
    }
}
