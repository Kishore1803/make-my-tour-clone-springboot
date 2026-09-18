package com.makemytrip.makemytrip.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.makemytrip.makemytrip.models.Flight;

public interface FlightRepository extends JpaRepository<Flight,String>{
	Optional<Flight> findById(Long flightId);
}