
package com.makemytrip.makemytrip.services;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;

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

        // 1. Validate input
        if (userId == null || bookingId == null) {
            throw new IllegalArgumentException("User ID and booking ID are required.");
        }

        if (bookingType == null || bookingType.isBlank()) {
            throw new IllegalArgumentException("Booking type is required.");
        }

        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("Cancellation reason is required.");
        }

        String normalizedType = normalizeBookingType(bookingType);
        String cancellationReason = reason.trim();

        System.out.println("========== CANCELLATION REQUEST ==========");
        System.out.println("User ID: " + userId);
        System.out.println("Booking ID: " + bookingId);
        System.out.println("Requested type: " + normalizedType);

        // 2. Find user
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found for ID: " + userId));

        // 3. Check existing cancellation
        if (cancellationRepository.existsByUserIdAndBookingId(userId, bookingId)) {
            throw new IllegalStateException("This booking has already been cancelled.");
        }

        // 4. Check bookings collection
        if (user.getBookings() == null || user.getBookings().isEmpty()) {
            throw new IllegalArgumentException("No bookings found for user ID: " + userId);
        }

        // 5. Print stored booking details for debugging
        user.getBookings().forEach(booking -> {
            System.out.println("Stored booking ID: " + booking.getBookingId()
                    + ", stored type: " + booking.getType());
        });

        // 6. Find the requested booking
        Users.Booking selectedBooking = user.getBookings()
                .stream()
                .filter(booking ->
                        booking.getBookingId() != null
                        && booking.getBookingId().equals(bookingId)
                        && booking.getType() != null
                        && normalizeBookingType(booking.getType())
                                .equals(normalizedType))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Booking not found. User ID: " + userId
                        + ", Booking ID: " + bookingId
                        + ", Booking type: " + normalizedType));

        // 7. Check booking cancellation status
        if ("CANCELLED".equalsIgnoreCase(selectedBooking.getCancellationStatus())) {
            throw new IllegalStateException("This booking is already cancelled.");
        }

        // 8. Validate booking timestamp
        String bookedAtValue = selectedBooking.getBookedAt();

        if (bookedAtValue == null || bookedAtValue.isBlank()) {
            throw new IllegalStateException("Booking timestamp is missing.");
        }

        LocalDateTime bookedAt;

        try {
            bookedAt = LocalDateTime.parse(bookedAtValue.trim());
        } catch (DateTimeParseException exception) {
            throw new IllegalStateException("Invalid booking timestamp: " + bookedAtValue
                    + ". Expected format: yyyy-MM-dd'T'HH:mm:ss");
        }

        LocalDateTime cancelledAt = LocalDateTime.now();

        if (bookedAt.isAfter(cancelledAt)) {
            throw new IllegalStateException("Booking timestamp cannot be in the future.");
        }

        // 9. Calculate refund
        long elapsedSeconds = Duration.between(bookedAt, cancelledAt).getSeconds();

        // Existing business rule: 50% refund within 24 hours.
        double refundPercentage = elapsedSeconds <= Duration.ofHours(24).getSeconds()? 50.0 : 0.0;

        double bookingAmount = selectedBooking.getTotalPrice();

        if (!Double.isFinite(bookingAmount) || bookingAmount < 0) {
            throw new IllegalStateException("Invalid booking amount.");
        }

        double refundAmount = Math.round(
                bookingAmount * refundPercentage) / 100.0;

        // 10. Create cancellation record
        Cancellation cancellation = new Cancellation();
        cancellation.setUserId(userId);
        cancellation.setBookingId(bookingId);
        cancellation.setBookingType(normalizedType);
        cancellation.setReason(cancellationReason);
        cancellation.setBookingAmount(bookingAmount);
        cancellation.setRefundPercentage(refundPercentage);
        cancellation.setRefundAmount(refundAmount);
        cancellation.setCancelledAt(cancelledAt);
        cancellation.setStatus(refundAmount > 0 ? "REFUND_PENDING": "CANCELLED");

        // 11. Update booking without deleting it
        selectedBooking.setCancellationStatus("CANCELLED");
        selectedBooking.setCancellationReason(cancellationReason);
        selectedBooking.setCancelledAt(cancelledAt.toString());
        selectedBooking.setRefundAmount(refundAmount);
        selectedBooking.setRefundStatus(refundAmount > 0 ? "PENDING" : "NOT_APPLICABLE");

        // 12. Save updated user and cancellation
        userRepository.save(user);
        Cancellation savedCancellation = cancellationRepository.save(cancellation);

        // 13. Create refund record when refund is due
        if (refundAmount > 0) {

            Refund refund = new Refund();

            refund.setUserId(userId);
            refund.setBookingId(bookingId);
            refund.setBookingType(normalizedType);
            refund.setBookingAmount(bookingAmount);
            refund.setRefundAmount(refundAmount);
            refund.setRefundPercentage(refundPercentage);
            refund.setRefundStatus("PENDING");

            refund.setExpectedTimeline("Subject to payment provider processing; "
                    + "check your payment provider for the actual timeline.");

            refund.setRequestedAt(cancelledAt);
            refundRepository.save(refund);
        }

        System.out.println("Cancellation completed successfully.");
        System.out.println("Refund percentage: " + refundPercentage);
        System.out.println("Refund amount: " + refundAmount);

        return savedCancellation;
    }

    private String normalizeBookingType(String bookingType) {

        if (bookingType == null || bookingType.isBlank()) {
            return "";
        }

        String normalized = bookingType
                .trim()
                .toUpperCase(Locale.ROOT);

        if (normalized.contains("FLIGHT")) {
            return "FLIGHT";
        }

        if (normalized.contains("HOTEL")) {
            return "HOTEL";
        }
        return normalized;
    }

    @Transactional(readOnly = true)
    public List<Cancellation> getUserCancellations(Long userId) {

        if (userId == null) {
            throw new IllegalArgumentException("User ID is required.");
        }

        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found for ID: " + userId);
        }
        return cancellationRepository.findByUserId(userId);
    }
}