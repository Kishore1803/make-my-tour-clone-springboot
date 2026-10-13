package com.makemytrip.makemytrip.services;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.makemytrip.makemytrip.models.Cancellation;
import com.makemytrip.makemytrip.models.Refund;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.repositories.CancellationRepository;
import com.makemytrip.makemytrip.repositories.RefundRepository;
import com.makemytrip.makemytrip.repositories.UserRepository;

@Service
public class CancellationService {

	@Autowired
    private UserRepository userRepository;
	
	@Autowired
    private CancellationRepository cancellationRepository;
	
	@Autowired
    private RefundRepository refundRepository;

    @Transactional
    public Cancellation cancelBooking(Long userId, Long bookingId, String bookingType, String reason) {

        if (userId == null || bookingId == null) {
            throw new IllegalArgumentException("User ID and booking ID are required");
        }

        if (bookingType == null || bookingType.isBlank()) {
            throw new IllegalArgumentException("Booking type is required");
        }

        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("Cancellation reason is required");
        }

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (cancellationRepository
                .existsByUserIdAndBookingId(userId, bookingId)) {
            throw new IllegalStateException("Booking already cancelled");
        }

        Users.Booking selectedBooking = user.getBookings()
                .stream()
                .filter(booking ->
                        booking.getBookingId() != null
                        && booking.getBookingId().equals(bookingId)
                        && booking.getType() != null
                        && booking.getType().equalsIgnoreCase(bookingType))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (selectedBooking.getBookedAt() == null || selectedBooking.getBookedAt().isBlank()) {
            throw new IllegalStateException("Booking timestamp is missing");
        }

        LocalDateTime bookedAt;

        try {
            bookedAt = LocalDateTime.parse(selectedBooking.getBookedAt());
        } catch (DateTimeParseException exception) {
            throw new IllegalStateException( "Invalid booking timestamp. Expected ISO format, "
                    + "for example 2026-10-12T10:30:00");
        }

        LocalDateTime cancelledAt = LocalDateTime.now();

        if (bookedAt.isAfter(cancelledAt)) {
            throw new IllegalStateException("Booking timestamp cannot be in the future");
        }

        long elapsedSeconds = Duration.between(bookedAt, cancelledAt).getSeconds();

        // 50% refund if cancelled within 24 hours of booking.
        double refundPercentage = elapsedSeconds <= Duration.ofHours(24).getSeconds()
                        ? 50.0
                        : 0.0;

        double bookingAmount = selectedBooking.getTotalPrice();

        if (!Double.isFinite(bookingAmount) || bookingAmount < 0) {
            throw new IllegalStateException("Invalid booking amount");
        }

        double refundAmount = Math.round(bookingAmount * refundPercentage) / 100.0;

        Cancellation cancellation = new Cancellation();
        cancellation.setUserId(userId);
        cancellation.setBookingId(bookingId);
        cancellation.setBookingType(bookingType);
        cancellation.setReason(reason.trim());
        cancellation.setBookingAmount(bookingAmount);
        cancellation.setRefundPercentage(refundPercentage);
        cancellation.setRefundAmount(refundAmount);
        cancellation.setCancelledAt(cancelledAt);
        cancellation.setStatus(refundAmount > 0 ? "REFUND_PENDING" : "CANCELLED");

        // Preserve the booking instead of removing it.
        selectedBooking.setCancellationStatus("CANCELLED");
        selectedBooking.setCancellationReason(reason.trim());
        selectedBooking.setCancelledAt(cancelledAt.toString());
        selectedBooking.setRefundAmount(refundAmount);
        selectedBooking.setRefundStatus(refundAmount > 0 ? "PENDING" : "NOT_APPLICABLE");

        userRepository.save(user);

        Cancellation savedCancellation = cancellationRepository.save(cancellation);

        // Create a separate refund record when a refund is due.
        if (refundAmount > 0) {
            Refund refund = new Refund();
            refund.setUserId(userId);
            refund.setBookingId(bookingId);
            refund.setBookingType(bookingType);
            refund.setBookingAmount(bookingAmount);
            refund.setRefundAmount(refundAmount);
            refund.setRefundPercentage(refundPercentage);
            refund.setRefundStatus("PENDING");
            refund.setExpectedTimeline("Subject to payment provider processing; "
                    + "check your payment provider for the actual timeline");
            refund.setRequestedAt(cancelledAt);
            refundRepository.save(refund);
        }

        return savedCancellation;
    }

    public List<Cancellation> getUserCancellations(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }
        return cancellationRepository.findByUserId(userId);
    }
}