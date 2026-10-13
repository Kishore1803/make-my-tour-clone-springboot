
package com.makemytrip.makemytrip.services;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.makemytrip.makemytrip.models.Refund;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.repositories.RefundRepository;
import com.makemytrip.makemytrip.repositories.UserRepository;

@Service
public class RefundService {

	@Autowired
    private RefundRepository refundRepository;
	
	@Autowired
    private UserRepository userRepository;

    @Transactional
    public Refund createRefund(Long userId, Long bookingId, String bookingType) {

        if (userId == null || bookingId == null || bookingType == null || bookingType.isBlank()) {
            throw new IllegalArgumentException("User ID, booking ID and booking type are required");
        }

        // Prevent duplicate refund records
        List<Refund> existingRefunds = refundRepository.findByBookingId(bookingId);

        for (Refund existing : existingRefunds) {
            if (userId.equals(existing.getUserId())
                    && bookingType.equalsIgnoreCase(
                            existing.getBookingType())) {
                throw new IllegalStateException("Refund already exists for this booking");
            }
        }

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Users.Booking selectedBooking = user.getBookings()
                .stream()
                .filter(booking ->
                        booking.getBookingId() != null
                        && booking.getBookingId().equals(bookingId)
                        && booking.getType() != null
                        && booking.getType().equalsIgnoreCase(bookingType))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (selectedBooking.getCancellationStatus() != null
                && selectedBooking.getCancellationStatus()
                        .equalsIgnoreCase("CANCELLED")) {
            throw new IllegalStateException("Booking is already cancelled; use its existing refund");
        }

        double bookingAmount = selectedBooking.getTotalPrice();

        if (!Double.isFinite(bookingAmount) || bookingAmount < 0) {
            throw new IllegalStateException("Invalid booking amount");
        }

        LocalDateTime now = LocalDateTime.now();
        double refundPercentage = calculateRefundPercentage(selectedBooking.getBookedAt(), now);
        double refundAmount = Math.round(bookingAmount * refundPercentage) / 100.0;
        Refund refund = new Refund();
        refund.setUserId(userId);
        refund.setBookingId(bookingId);
        refund.setBookingType(bookingType);
        refund.setBookingAmount(bookingAmount);
        refund.setRefundPercentage(refundPercentage);
        refund.setRefundAmount(refundAmount);
        refund.setRefundStatus(refundAmount > 0 ? "PENDING" : "NOT_APPLICABLE");
        refund.setExpectedTimeline(refundAmount > 0
                        ? "5-7 business days, subject to payment provider"
                        : "No refund applicable");
        refund.setRequestedAt(now);
        return refundRepository.save(refund);
    }

    private double calculateRefundPercentage(
            String bookedAt, LocalDateTime now) {

        if (bookedAt == null || bookedAt.isBlank()) {
            throw new IllegalStateException("Booking timestamp is missing");
        }
        final LocalDateTime bookingTime;

        try {
            bookingTime = LocalDateTime.parse(bookedAt);
        } catch (DateTimeParseException exception) {
            throw new IllegalStateException("Invalid booking timestamp. Expected format: "
                    + "2026-10-12T10:30:00");
        }

        if (bookingTime.isAfter(now)) {
            throw new IllegalStateException("Booking timestamp cannot be in the future");
        }

        long elapsedSeconds = Duration.between(bookingTime, now).getSeconds();
        return elapsedSeconds <= Duration.ofHours(24).getSeconds()
                ? 50.0
                : 0.0;
    }

    public Refund getRefundByBookingId(Long bookingId) {
        List<Refund> refunds = refundRepository.findByBookingId(bookingId);

        if (refunds.isEmpty()) {
            throw new IllegalArgumentException("Refund not found");
        }

        return refunds.get(0);
    }

    public List<Refund> getUserRefunds(Long userId) {
        if (userId == null || !userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }

        return refundRepository.findByUserId(userId);
    }

    @Transactional
    public Refund updateRefundStatus(Long refundId, String status) {
        if (status == null || !List.of(
                "PENDING", "PROCESSING", "COMPLETED",
                "FAILED", "NOT_APPLICABLE").contains(status.toUpperCase())) {
            throw new IllegalArgumentException("Invalid refund status");
        }

        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new IllegalArgumentException("Refund not found"));

        String normalizedStatus = status.toUpperCase();
        refund.setRefundStatus(normalizedStatus);

        if ("COMPLETED".equals(normalizedStatus)) {
            refund.setCompletedAt(LocalDateTime.now());
        } else {
            refund.setCompletedAt(null);
        }
        return refundRepository.save(refund);
    }
}