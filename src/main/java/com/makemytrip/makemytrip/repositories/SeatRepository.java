package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByFlightId(Long flightId);
    List<Seat> findByFlightIdAndAvailableTrue(Long flightId);
    Optional<Seat> findByFlightIdAndSeatNumber(Long flightId, String seatNumber);
    List<Seat> findByFlightIdOrderBySeatNumberAsc(Long flightId);
}