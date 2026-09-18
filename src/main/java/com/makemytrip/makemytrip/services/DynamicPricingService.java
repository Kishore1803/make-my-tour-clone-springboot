package com.makemytrip.makemytrip.services;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.makemytrip.makemytrip.models.PriceHistory;
import com.makemytrip.makemytrip.repositories.PriceHistoryRepository;

@Service
public class DynamicPricingService {

	@Autowired
    private PriceHistoryRepository priceHistoryRepository;

    public Double calculateFlightPrice(Long flightId, Double basePrice, int availableSeats) {
        double dynamicPrice = basePrice;
        double changePercentage = 0;
        String reason = "Normal pricing";

        if (availableSeats <= 5) {
            dynamicPrice = basePrice * 1.20;
            changePercentage = 20;
            reason = "High demand - limited seats";
            
        } else if (availableSeats <= 10) {
            dynamicPrice = basePrice * 1.10;
            changePercentage = 10;
            reason = "Moderate demand";
        }

        if (isPeakSeason()) {
            dynamicPrice = dynamicPrice * 1.10;
            changePercentage += 10;
            reason = reason + " and peak season";
        }

        savePriceHistory(flightId, null, basePrice, dynamicPrice, changePercentage, reason);
        return dynamicPrice;
    }

    public Double calculateHotelPrice(Long hotelId, Double basePrice, int availableRooms) {
        double dynamicPrice = basePrice;
        double changePercentage = 0;
        String reason = "Normal pricing";

        if (availableRooms <= 5) {
            dynamicPrice = basePrice * 1.20;
            changePercentage = 20;
            reason = "High demand - limited rooms";
            
        } else if (availableRooms <= 10) {
            dynamicPrice = basePrice * 1.10;
            changePercentage = 10;
            reason = "Moderate demand";
        }

        if (isPeakSeason()) {
            dynamicPrice = dynamicPrice * 1.10;
            changePercentage += 10;
            reason = reason + " and peak season";
        }

        savePriceHistory(null, hotelId, basePrice, dynamicPrice, changePercentage, reason);
        return dynamicPrice;
    }

    private boolean isPeakSeason() {

        LocalDate today = LocalDate.now();
        LocalDate decemberStart = LocalDate.of(today.getYear(), 12, 15);
        LocalDate aprilStart = LocalDate.of(today.getYear(), 4, 1);
        LocalDate aprilEnd = LocalDate.of(today.getYear(), 4, 15);
        LocalDate mayStart = LocalDate.of(today.getYear(), 5, 1);
        LocalDate mayEnd = LocalDate.of(today.getYear(), 5, 15);

        return !today.isBefore(decemberStart) || (!today.isBefore(aprilStart)
                && !today.isAfter(aprilEnd)) || (!today.isBefore(mayStart) && !today.isAfter(mayEnd));
    }

    private void savePriceHistory(Long flightId, Long hotelId, Double basePrice, Double dynamicPrice, Double changePercentage, String reason) {

        PriceHistory history = new PriceHistory();

        history.setFlightId(flightId);
        history.setHotelId(hotelId);
        history.setBasePrice(basePrice);
        history.setDynamicPrice(dynamicPrice);
        history.setChangePercentage(changePercentage);
        history.setReason(reason);
        history.setCreatedAt(LocalDateTime.now());

        priceHistoryRepository.save(history);
    }
}