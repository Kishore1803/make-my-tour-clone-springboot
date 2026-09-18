package com.makemytrip.makemytrip.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.makemytrip.makemytrip.models.PriceHistory;

public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {
    List<PriceHistory> findByFlightIdOrderByCreatedAtAsc(Long flightId);
    List<PriceHistory> findByHotelIdOrderByCreatedAtAsc(Long hotelId);
}