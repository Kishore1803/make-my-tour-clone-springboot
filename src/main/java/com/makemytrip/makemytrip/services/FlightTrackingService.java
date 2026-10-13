package com.makemytrip.makemytrip.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.makemytrip.makemytrip.models.FlightTracking;
import com.makemytrip.makemytrip.repositories.FlightTrackingRepository;

@Service
public class FlightTrackingService {

	@Autowired
    private FlightTrackingRepository flighttrackingrepository;

    public FlightTracking trackFlight(Long userId, Long flightId, String flightNumber) {

        FlightTracking tracking = flighttrackingrepository.findByUserIdAndFlightId(userId, flightId)
        		.orElse(new FlightTracking());

        tracking.setUserId(userId);
        tracking.setFlightId(flightId);
        tracking.setFlightNumber(flightNumber);
        tracking.setStatus("ON_TIME");
        tracking.setReason("Flight is operating on schedule");
        tracking.setLastUpdated(LocalDateTime.now());

        return flighttrackingrepository.save(tracking);
    }

    public void stopTrackingFlight(Long userId,Long flightId) {
    	flighttrackingrepository.deleteByUserIdAndFlightId(userId, flightId);
    }

    public List<FlightTracking> getTrackedFlights(Long userId) {
        return flighttrackingrepository.findByUserId(userId);
    }

    public FlightTracking getTracking(Long userId,Long flightId) {
        return flighttrackingrepository.findByUserIdAndFlightId(userId, flightId).orElse(null);
    }

    public FlightTracking updateTrackingStatus(Long userId, Long flightId, String status, String reason, LocalDateTime estimatedArrivalTime) {

        FlightTracking tracking = flighttrackingrepository.findByUserIdAndFlightId(userId, flightId).orElse(new FlightTracking());

        tracking.setUserId(userId);
        tracking.setFlightId(flightId);
        tracking.setStatus(status);
        tracking.setReason(reason);
        tracking.setEstimatedArrivalTime(estimatedArrivalTime);
        tracking.setLastUpdated(LocalDateTime.now());

        return flighttrackingrepository.save(tracking);
    }
}