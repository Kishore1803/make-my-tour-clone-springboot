package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.FlightStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FlightStatusRepository extends JpaRepository<FlightStatus, Long> {
    Optional<FlightStatus> findByFlightId(Long flightId);
}