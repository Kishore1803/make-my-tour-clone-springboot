package com.makemytrip.makemytrip.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.services.BookingService;

@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/flight")
    public Users.Booking bookFlight(@RequestParam Long userId, @RequestParam Long flightId, @RequestParam int seats, @RequestParam double price, @RequestParam String selectedSeat) {
        return bookingService.bookFlight(userId, flightId, seats,price, selectedSeat);
    }

    @PostMapping("/hotel")
    public Users.Booking bookhotel(@RequestParam Long userId, @RequestParam Long hotelId, @RequestParam int rooms, @RequestParam double price) {
            return bookingService.bookhotel(userId, hotelId, rooms, price);
    }
}