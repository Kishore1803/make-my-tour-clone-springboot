package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByFlightIdOrderBySeatNumberAsc(Long flightId);
    Optional<Seat> findByFlightIdAndSeatNumber(Long flightId, String seatNumber);
    List<Seat> findByFlightIdAndAvailableTrue(Long flightId);
}