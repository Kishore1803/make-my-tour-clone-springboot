package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Seat;
import com.makemytrip.makemytrip.repositories.SeatRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    public List<Seat> getSeatsByFlight(Long flightId) {
        return seatRepository.findByFlightIdOrderBySeatNumberAsc(flightId);
    }
    
    public Seat createSeat(Seat seat) {
        return seatRepository.save(seat);
    }

    public List<Seat> getAvailableSeats(Long flightId) {
        return seatRepository.findByFlightIdAndAvailableTrue(flightId);
    }

    public Seat getSeat(Long flightId, String seatNumber) {

        return seatRepository
                .findByFlightIdAndSeatNumber(flightId, seatNumber)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
    }

    public Seat saveSeat(Seat seat) {
        return seatRepository.save(seat);
    }

    public void updateSeatAvailability(Long seatId, boolean available) {

        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
        seat.setAvailable(available);
        seatRepository.save(seat);
    }
}