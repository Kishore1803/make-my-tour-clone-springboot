
package com.makemytrip.makemytrip.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.makemytrip.makemytrip.models.Refund;
import com.makemytrip.makemytrip.services.RefundService;

@RestController
@RequestMapping("/refund")
public class RefundController {

    @Autowired
    private RefundService refundService;

    // Get refund by booking ID
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Refund> getRefundByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(refundService.getRefundByBookingId(bookingId));
    }

    // Get all refunds belonging to a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Refund>> getUserRefunds(@PathVariable Long userId) {
        return ResponseEntity.ok(refundService.getUserRefunds(userId));
    }

    // Update refund status
    @PutMapping("/{refundId}/status")
    public ResponseEntity<Refund> updateRefundStatus(@PathVariable Long refundId, @RequestParam String status) {
        return ResponseEntity.ok(refundService.updateRefundStatus(refundId, status));
    }

    // Create refund only when explicitly required
    @PostMapping("/create")
    public ResponseEntity<Refund> createRefund(@RequestParam Long userId, @RequestParam Long bookingId,
            @RequestParam String bookingType) {
        return ResponseEntity.ok(refundService.createRefund(userId, bookingId, bookingType));
    }
}
