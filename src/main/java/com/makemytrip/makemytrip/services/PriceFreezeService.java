package com.makemytrip.makemytrip.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.makemytrip.makemytrip.models.PriceFreeze;
import com.makemytrip.makemytrip.repositories.PriceFreezeRepository;

@Service
public class PriceFreezeService {

    @Autowired
    private PriceFreezeRepository priceFreezeRepository;

    public PriceFreeze freezeFlightPrice(Long userId, Long flightId, Double price, int minutes) {

        PriceFreeze freeze = new PriceFreeze();

        freeze.setUserId(userId);
        freeze.setFlightId(flightId);
        freeze.setHotelId(null);
        freeze.setFrozenPrice(price);
        freeze.setCreatedAt(LocalDateTime.now());
        freeze.setExpiresAt(LocalDateTime.now().plusMinutes(minutes));
        freeze.setStatus("ACTIVE");

        return priceFreezeRepository.save(freeze);
    }

    public PriceFreeze freezeHotelPrice(Long userId, Long hotelId, Double price, int minutes) {

        PriceFreeze freeze = new PriceFreeze();

        freeze.setUserId(userId);
        freeze.setFlightId(null);
        freeze.setHotelId(hotelId);
        freeze.setFrozenPrice(price);
        freeze.setCreatedAt(LocalDateTime.now());
        freeze.setExpiresAt(LocalDateTime.now().plusMinutes(minutes));
        freeze.setStatus("ACTIVE");
        
        return priceFreezeRepository.save(freeze);
    }

    public PriceFreeze getFlightFreeze(Long userId, Long flightId) {
        return priceFreezeRepository.findByUserIdAndFlightIdAndStatus(userId, flightId, "ACTIVE").orElse(null);
    }

    public PriceFreeze getHotelFreeze(Long userId, Long hotelId) {
        return priceFreezeRepository.findByUserIdAndHotelIdAndStatus(userId, hotelId, "ACTIVE") .orElse(null);
    }

    public List<PriceFreeze> getUserFreezes(Long userId) {
        return priceFreezeRepository.findByUserId(userId);
    }

    public void expireFreeze(PriceFreeze freeze) {
        freeze.setStatus("EXPIRED");
        priceFreezeRepository.save(freeze);
    }
}