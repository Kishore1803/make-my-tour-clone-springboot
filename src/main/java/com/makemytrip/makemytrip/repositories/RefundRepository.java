package com.makemytrip.makemytrip.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.makemytrip.makemytrip.models.Refund;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    List<Refund> findByUserId(Long userId);
    List<Refund> findByBookingId(Long bookingId);
}