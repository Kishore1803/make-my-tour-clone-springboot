package com.makemytrip.makemytrip.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.makemytrip.makemytrip.models.Flight;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
}