package com.makemytrip.makemytrip.models;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    private String password;
    private String role;
    private String phoneNumber;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_bookings", joinColumns = @JoinColumn(name = "user_id"))
    private List<Booking> bookings = new ArrayList<>();

    public Users() {
    }

    public Users(Long id, String firstName, String lastName, String email, String password, String role, String phoneNumber, List<Booking> bookings) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.bookings = bookings != null ? bookings : new ArrayList<>();
    }

    // User getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings != null ? bookings : new ArrayList<>();
    }

    // Embedded booking details
    @Embeddable
    public static class Booking {

        private String type;
        private Long bookingId;
        private String date;
        private int quantity;
        private double totalPrice;
        private String bookedAt;
        private String selectedSeat;

        // Cancellation details
        private String cancellationStatus = "BOOKED";
        private String cancellationReason;
        private String cancelledAt;

        // Refund details
        private double refundAmount;
        private String refundStatus = "NOT_APPLICABLE";

        public Booking() {
        }

        public Booking(String type, Long bookingId, String date, int quantity, double totalPrice, String bookedAt, String selectedSeat) {
            this.type = type;
            this.bookingId = bookingId;
            this.date = date;
            this.quantity = quantity;
            this.totalPrice = totalPrice;
            this.bookedAt = bookedAt;
            this.selectedSeat = selectedSeat;
            this.cancellationStatus = "BOOKED";
            this.refundAmount = 0.0;
            this.refundStatus = "NOT_APPLICABLE";
        }

        // Booking getters and setters
        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Long getBookingId() {
            return bookingId;
        }

        public void setBookingId(Long bookingId) {
            this.bookingId = bookingId;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public double getTotalPrice() {
            return totalPrice;
        }

        public void setTotalPrice(double totalPrice) {
            this.totalPrice = totalPrice;
        }

        public String getBookedAt() {
            return bookedAt;
        }

        public void setBookedAt(String bookedAt) {
            this.bookedAt = bookedAt;
        }

        public String getSelectedSeat() {
            return selectedSeat;
        }

        public void setSelectedSeat(String selectedSeat) {
            this.selectedSeat = selectedSeat;
        }

        // Cancellation getters and setters
        public String getCancellationStatus() {
            return cancellationStatus;
        }

        public void setCancellationStatus(String cancellationStatus) {
            this.cancellationStatus = cancellationStatus;
        }

        public String getCancellationReason() {
            return cancellationReason;
        }

        public void setCancellationReason(String cancellationReason) {
            this.cancellationReason = cancellationReason;
        }

        public String getCancelledAt() {
            return cancelledAt;
        }

        public void setCancelledAt(String cancelledAt) {
            this.cancelledAt = cancelledAt;
        }

        // Refund getters and setters
        public double getRefundAmount() {
            return refundAmount;
        }

        public void setRefundAmount(double refundAmount) {
            this.refundAmount = refundAmount;
        }

        public String getRefundStatus() {
            return refundStatus;
        }

        public void setRefundStatus(String refundStatus) {
            this.refundStatus = refundStatus;
        }
    }
}