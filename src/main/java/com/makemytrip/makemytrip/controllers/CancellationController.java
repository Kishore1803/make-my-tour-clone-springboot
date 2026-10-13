
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
@CrossOrigin(origins = "*")
public class CancellationController {

	@Autowired
    private CancellationService cancellationService;

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelBooking(@RequestParam Long userId, @RequestParam Long bookingId, @RequestParam String bookingType, @RequestParam String reason) {

        try {
            Cancellation cancellation = cancellationService.cancelBooking(userId, bookingId, bookingType, reason);
            return ResponseEntity.ok(cancellation);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                   .body(e.getMessage());

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Cancellation>> getUserCancellations(@PathVariable Long userId) {
        return ResponseEntity.ok(cancellationService.getUserCancellations(userId));
    }
}
