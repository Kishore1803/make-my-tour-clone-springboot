package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.dto.FlightStatusResponse;
import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.repositories.FlightStatusRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class FlightStatusService {

	@Autowired
    private FlightStatusRepository repository;
	
	@Autowired
    private WebPushService webPushService;

    private static final DateTimeFormatter TIME_FORMAT =
            DateTimeFormatter.ofPattern("HH:mm");

    @Transactional
    public List<FlightStatusResponse> getAllFlights() {
        List<FlightStatus> flights = repository.findAll();

        flights.forEach(this::refreshFlight);

        return flights.stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional
    public FlightStatusResponse getFlightStatus(String flightNumber) {
        FlightStatus flight = repository
                .findByFlightNumber(flightNumber.trim().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Flight not found: " + flightNumber));

        refreshFlight(flight);
        return convertToResponse(flight);
    }

    @Transactional
    public List<FlightStatusResponse> searchFlights(String fromCity, String toCity) {
        return repository.findByFromCityAndToCity(fromCity, toCity)
                .stream()
                .map(flight -> {
                    refreshFlight(flight);
                    return convertToResponse(flight);
                })
                .toList();
    }

    @Transactional
    public List<FlightStatusResponse> getFlightsByStatus(String status) {
        return repository.findByStatus(status.trim().toUpperCase(Locale.ROOT)
)
                .stream()
                .map(flight -> {
                    refreshFlight(flight);
                    return convertToResponse(flight);
                })
                .toList();
    }

    @Transactional
    public FlightStatusResponse createFlight(FlightStatus flight) {
        flight.setFlightNumber(flight.getFlightNumber().trim().toUpperCase());
        flight.setStatus(flight.getStatus() == null
                        ? "ON_TIME"
                        : flight.getStatus().toUpperCase());

        LocalDateTime now = LocalDateTime.now();
        flight.setLastUpdated(now);

        if (flight.getStatusUpdatedAt() == null) {
            flight.setStatusUpdatedAt(now);
        }

        if (flight.getDelayMinutes() == null) {
            flight.setDelayMinutes(0);
        }

        if (flight.getProgress() == null) {
            flight.setProgress(0);
        }

        return convertToResponse(repository.save(flight));
    }

    private void refreshFlight(FlightStatus flight) {
        LocalDateTime now = LocalDateTime.now();

        if (flight.getStatusUpdatedAt() == null) {
            flight.setStatusUpdatedAt(now);
            flight.setLastUpdated(now);
            repository.save(flight);
            return;
        }

        String oldStatus = flight.getStatus();
        Integer oldDelay = flight.getDelayMinutes();
        String oldArrival = flight.getEstimatedArrival();

        long elapsedMinutes = Duration.between(flight.getStatusUpdatedAt(), now).toMinutes();

        String status = oldStatus == null
                ? "ON_TIME"
                : oldStatus.toUpperCase(Locale.ROOT);

        // Demo: each active flight stage lasts two minutes.
        if (elapsedMinutes >= 2) {
            switch (status) {
                case "ON_TIME" -> {
                    flight.setStatus("BOARDING");
                    flight.setProgress(5);
                }
                case "BOARDING" -> {
                    flight.setStatus("DEPARTED");
                    flight.setProgress(10);
                }
                case "DEPARTED" -> {
                    flight.setStatus("IN_AIR");
                    flight.setProgress(50);
                }
                case "IN_AIR" -> {
                    flight.setStatus("ARRIVED");
                    flight.setProgress(100);
                }
                case "DELAYED" -> {
                    int delay = flight.getDelayMinutes() == null
                            ? 0 : flight.getDelayMinutes();

                    flight.setDelayMinutes(delay + 15);
                    updateRevisedTimes(flight, 15);
                }
                default -> {
                    // ARRIVED and CANCELLED are terminal states.
                }
            }

            if (!"ARRIVED".equals(status) && !"CANCELLED".equals(status)) {
                flight.setStatusUpdatedAt(now);
            }
        }

        flight.setLastUpdated(now);

        boolean statusChanged = !safeEquals(oldStatus, flight.getStatus());
        boolean delayChanged = !safeEquals(oldDelay, flight.getDelayMinutes());
        boolean arrivalChanged = !safeEquals(oldArrival, flight.getEstimatedArrival());

        repository.save(flight);

        if (statusChanged || delayChanged || arrivalChanged) {
            String message = buildNotificationMessage(flight, statusChanged, delayChanged, arrivalChanged);

            // Push delivery should not break the flight-status API.
            try {
                webPushService.sendToAll(flight.getFlightNumber(),message);
            } catch (Exception exception) {
                System.err.println("Push notification failed: " + exception.getMessage());
            }
        }
    }

    private void updateRevisedTimes(FlightStatus flight, int addedMinutes) {
        try {
        	
            if (flight.getRevisedDeparture() != null && !flight.getRevisedDeparture().isBlank()) {
                LocalTime revised = LocalTime.parse(flight.getRevisedDeparture(), TIME_FORMAT);
                flight.setRevisedDeparture(revised.plusMinutes(addedMinutes).format(TIME_FORMAT));
            }

            if (flight.getEstimatedArrival() != null && !flight.getEstimatedArrival().isBlank()) {
                LocalTime arrival = LocalTime.parse(flight.getEstimatedArrival(), TIME_FORMAT);
                flight.setEstimatedArrival(arrival.plusMinutes(addedMinutes).format(TIME_FORMAT));
            }
            
        } catch (Exception exception) {
            System.err.println("Could not adjust mock flight times: " + exception.getMessage());
        }
    }

    private String buildNotificationMessage(FlightStatus flight, boolean statusChanged, boolean delayChanged, boolean arrivalChanged) {
        if ("CANCELLED".equalsIgnoreCase(flight.getStatus())) {
            return flight.getFlightNumber() + " has been cancelled.";
        }

        if ("DELAYED".equalsIgnoreCase(flight.getStatus()) || delayChanged) {
            return flight.getFlightNumber()
                    + " delay updated to "
                    + flight.getDelayMinutes()
                    + " minutes. "
                    + (flight.getDelayReason() == null
                    ? "" : flight.getDelayReason());
        }

        if (arrivalChanged) {
            return flight.getFlightNumber()
                    + " estimated arrival is now "
                    + flight.getEstimatedArrival() + ".";
        }

        return flight.getFlightNumber()
                + " status updated to "
                + flight.getStatus() + ".";
    }

    private boolean safeEquals(Object a, Object b) {
        return a == null ? b == null : a.equals(b);
    }

    private FlightStatusResponse convertToResponse(FlightStatus flight) {
        return new FlightStatusResponse(
                flight.getId(),
                flight.getFlightNumber(),
                flight.getAirline(),
                flight.getFromCity(),
                flight.getToCity(),
                flight.getDepartureDate(),
                flight.getScheduledDeparture(),
                flight.getRevisedDeparture(),
                flight.getScheduledArrival(),
                flight.getEstimatedArrival(),
                flight.getStatus(),
                flight.getDelayMinutes(),
                flight.getDelayReason(),
                flight.getTerminal(),
                flight.getGate(),
                flight.getProgress(),
                flight.getLastUpdated()
        );
    }
}