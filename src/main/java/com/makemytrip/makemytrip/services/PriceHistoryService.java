package com.makemytrip.makemytrip.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.makemytrip.makemytrip.models.PriceHistory;
import com.makemytrip.makemytrip.repositories.PriceHistoryRepository;

@Service
public class PriceHistoryService {

    @Autowired
    private PriceHistoryRepository priceHistoryRepository;

    public List<PriceHistory> getFlightPriceHistory(Long flightId) {
        return priceHistoryRepository.findByFlightIdOrderByCreatedAtAsc(flightId);
    }

    public List<PriceHistory> getHotelPriceHistory(Long hotelId) {
        return priceHistoryRepository.findByHotelIdOrderByCreatedAtAsc(hotelId);
    }
}