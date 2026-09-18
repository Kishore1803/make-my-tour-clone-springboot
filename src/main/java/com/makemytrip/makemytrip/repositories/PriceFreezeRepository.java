package com.makemytrip.makemytrip.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.makemytrip.makemytrip.models.PriceFreeze;

public interface PriceFreezeRepository extends JpaRepository<PriceFreeze, Long> {
    Optional<PriceFreeze> findByUserIdAndFlightIdAndStatus(Long userId, Long flightId, String status);
    Optional<PriceFreeze> findByUserIdAndHotelIdAndStatus(Long userId, Long hotelId, String status);
    List<PriceFreeze> findByUserId(Long userId);
}