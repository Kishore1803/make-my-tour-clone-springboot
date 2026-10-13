package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.FlightStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FlightStatusRepository extends JpaRepository<FlightStatus, Long> {

    // Find a flight using flight number
    Optional<FlightStatus> findByFlightNumber(String flightNumber);

    // Get all flights by current status
    List<FlightStatus> findByStatus(String status);

    // Find flights between two cities
    List<FlightStatus> findByFromCityAndToCity(String fromCity, String toCity);

    // Find flights for a particular date
    List<FlightStatus> findByDepartureDate(String departureDate);
}