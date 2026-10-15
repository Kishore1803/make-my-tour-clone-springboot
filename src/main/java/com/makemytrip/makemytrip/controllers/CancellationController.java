
package com.makemytrip.makemytrip.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.makemytrip.makemytrip.models.Cancellation;
import com.makemytrip.makemytrip.services.CancellationService;

@RestController
@RequestMapping("/cancellation")
public class CancellationController {

    @Autowired
    private CancellationService cancellationService;

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelBooking(@RequestParam Long userId, @RequestParam Long bookingId,
            @RequestParam String bookingType, @RequestParam String reason) {
        System.out.println("=== CANCELLATION REQUEST ===");
        System.out.println("User ID: " + userId);
        System.out.println("Booking ID: " + bookingId);
        System.out.println("Booking Type: " + bookingType);
        System.out.println("Reason: " + reason);

        try {
            Cancellation cancellation = cancellationService.cancelBooking(userId, bookingId, bookingType, reason);
            return ResponseEntity.ok(cancellation);

        } catch (IllegalArgumentException e) {
            System.err.println("Cancellation validation failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));

        } catch (IllegalStateException e) {
            System.err.println("Cancellation state error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Cancellation>> getUserCancellations(@PathVariable Long userId) {
        return ResponseEntity.ok(cancellationService.getUserCancellations(userId));
    }
}
