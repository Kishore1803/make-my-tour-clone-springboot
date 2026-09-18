package com.makemytrip.makemytrip.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.makemytrip.makemytrip.models.PriceFreeze;
import com.makemytrip.makemytrip.models.PriceHistory;
import com.makemytrip.makemytrip.services.DynamicPricingService;
import com.makemytrip.makemytrip.services.PriceFreezeService;
import com.makemytrip.makemytrip.services.PriceHistoryService;

@RestController
@RequestMapping("/api/pricing")
public class PricingController {

    @Autowired
    private DynamicPricingService dynamicPricingService;

    @Autowired
    private PriceHistoryService priceHistoryService;

    @Autowired
    private PriceFreezeService priceFreezeService;

    // Dynamic Flight Price
    @GetMapping("/flight/{flightId}")
    public ResponseEntity<Double> getFlightPrice(@PathVariable Long flightId, @RequestParam Double basePrice, @RequestParam int availableSeats) {
        Double price = dynamicPricingService.calculateFlightPrice(flightId, basePrice, availableSeats);
        return ResponseEntity.ok(price);
    }

    // Flight Price History
    @GetMapping("/history/flight/{flightId}")
    public ResponseEntity<List<PriceHistory>> getFlightPriceHistory(@PathVariable Long flightId) {
        return ResponseEntity.ok(priceHistoryService.getFlightPriceHistory(flightId));
    }
    
    // Freeze Flight Price
    @PostMapping("/freeze/flight")
    public ResponseEntity<PriceFreeze> freezeFlightPrice(@RequestParam Long userId, @RequestParam Long flightId, @RequestParam Double price, @RequestParam int minutes) {
        PriceFreeze freeze = priceFreezeService.freezeFlightPrice(userId, flightId, price, minutes);
        return ResponseEntity.ok(freeze);
    }
    
    // Get Flight Freeze
    @GetMapping("/freeze/flight/{userId}/{flightId}")
    public ResponseEntity<PriceFreeze> getFlightFreeze(@PathVariable Long userId, @PathVariable Long flightId) {
        PriceFreeze freeze = priceFreezeService.getFlightFreeze(userId, flightId);
        if (freeze == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(freeze);
    }

    // Dynamic Hotel Price
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<Double> getHotelPrice(@PathVariable Long hotelId, @RequestParam Double basePrice, @RequestParam int availableRooms) {
        Double price = dynamicPricingService.calculateHotelPrice(hotelId, basePrice, availableRooms);
        return ResponseEntity.ok(price);
    }

    // Hotel Price History
    @GetMapping("/history/hotel/{hotelId}")
    public ResponseEntity<List<PriceHistory>> getHotelPriceHistory(@PathVariable Long hotelId) {
        return ResponseEntity.ok(priceHistoryService.getHotelPriceHistory(hotelId));
    }

    // Freeze Hotel Price
    @PostMapping("/freeze/hotel")
    public ResponseEntity<PriceFreeze> freezeHotelPrice(@RequestParam Long userId, @RequestParam Long hotelId, @RequestParam Double price, @RequestParam int minutes) {
        PriceFreeze freeze = priceFreezeService.freezeHotelPrice(userId, hotelId, price, minutes);
        return ResponseEntity.ok(freeze);
    }

    // Get Hotel Freeze
    @GetMapping("/freeze/hotel/{userId}/{hotelId}")
    public ResponseEntity<PriceFreeze> getHotelFreeze(@PathVariable Long userId, @PathVariable Long hotelId) {
        PriceFreeze freeze = priceFreezeService.getHotelFreeze(userId,hotelId);
        if (freeze == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(freeze);
    }

    // Get User Freezes
    @GetMapping("/freeze/user/{userId}")
    public ResponseEntity<List<PriceFreeze>> getUserFreezes(@PathVariable Long userId) {
        return ResponseEntity.ok(priceFreezeService.getUserFreezes(userId));
    }
}