package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.FlightTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface FlightTrackingRepository extends JpaRepository<FlightTracking, Long> {

    List<FlightTracking> findByUserId(Long userId);
    Optional<FlightTracking> findByUserIdAndFlightId(Long userId,Long flightId);

    @Transactional
    @Modifying
    @Query("DELETE FROM FlightTracking f WHERE f.userId = :userId AND f.flightId = :flightId")
    void deleteByUserIdAndFlightId(@Param("userId") Long userId,@Param("flightId") Long flightId);
}