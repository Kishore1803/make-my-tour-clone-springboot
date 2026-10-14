package com.makemytrip.makemytrip.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.Seat;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.SeatRepository;

@Service
public class BookingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Transactional
    public Booking bookFlight(Long userId, Long flightId, int seats, double price, String selectedSeat) {

        if (userId == null || flightId == null) {
            throw new IllegalArgumentException("User ID and flight ID are required.");
        }

        if (seats <= 0) {
            throw new IllegalArgumentException("Number of seats must be greater than zero.");
        }

        if (!Double.isFinite(price) || price < 0) {
            throw new IllegalArgumentException("Invalid booking price.");
        }

        if (selectedSeat == null || selectedSeat.isBlank()) {
            throw new IllegalArgumentException("Please select a seat.");
        }

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new IllegalArgumentException("Flight not found: " + flightId));

        Seat seat = seatRepository
                .findByFlightIdAndSeatNumber(flightId, selectedSeat)
                .orElseThrow(() -> new IllegalArgumentException("Selected seat not found."));

        if (!seat.isAvailable()) {
            throw new IllegalStateException("Selected seat is already booked.");
        }

        if (flight.getAvailableSeats() < seats) {
            throw new IllegalStateException("Not enough seats available.");
        }

        // Update flight availability.
        flight.setAvailableSeats(flight.getAvailableSeats() - seats);

        // Create booking.
        Booking booking = new Booking();
        booking.setType("FLIGHT");
        booking.setBookingId(flightId);
        booking.setDate(LocalDate.now().toString());
        booking.setBookedAt(LocalDateTime.now().toString());
        booking.setQuantity(seats);
        booking.setTotalPrice(price);
        booking.setSelectedSeat(selectedSeat);
        booking.setCancellationStatus("BOOKED");
        booking.setRefundAmount(0.0);
        booking.setRefundStatus("NOT_APPLICABLE");
        user.getBookings().add(booking);
        seat.setAvailable(false);

        flightRepository.save(flight);
        seatRepository.save(seat);
        userRepository.save(user);

        System.out.println("Flight booking saved.");
        System.out.println("User ID: " + userId);
        System.out.println("Flight ID: " + flightId);
        System.out.println("Booking type: " + booking.getType());
        return booking;
    }

    @Transactional
    public Booking bookhotel(Long userId, Long hotelId, int rooms, double price) {

        if (userId == null || hotelId == null) {
            throw new IllegalArgumentException("User ID and hotel ID are required.");
        }

        if (rooms <= 0) {
            throw new IllegalArgumentException("Number of rooms must be greater than zero.");
        }

        if (!Double.isFinite(price) || price < 0) {
            throw new IllegalArgumentException("Invalid booking price.");
        }

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new IllegalArgumentException("Hotel not found: " + hotelId));

        if (hotel.getAvailableRooms() < rooms) {
            throw new IllegalStateException("Not enough rooms available.");
        }

        // Update hotel availability.
        hotel.setAvailableRooms(hotel.getAvailableRooms() - rooms);

        // Create booking.
        Booking booking = new Booking();
        booking.setType("HOTEL");

        booking.setBookingId(hotelId);
        booking.setDate(LocalDate.now().toString());
        booking.setBookedAt(LocalDateTime.now().toString());
        booking.setQuantity(rooms);
        booking.setTotalPrice(price);
        booking.setCancellationStatus("BOOKED");
        booking.setRefundAmount(0.0);
        booking.setRefundStatus("NOT_APPLICABLE");
        user.getBookings().add(booking);

        hotelRepository.save(hotel);
        userRepository.save(user);

        System.out.println("Hotel booking saved.");
        System.out.println("User ID: " + userId);
        System.out.println("Hotel ID: " + hotelId);
        System.out.println("Booking type: " + booking.getType());

        return booking;
    }
}
