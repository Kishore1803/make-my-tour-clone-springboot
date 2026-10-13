
package com.makemytrip.makemytrip.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.makemytrip.makemytrip.models.Cancellation;

@Repository
public interface CancellationRepository extends JpaRepository<Cancellation, Long> {
    List<Cancellation> findByUserId(Long userId);
    boolean existsByUserIdAndBookingId(Long userId, Long bookingId);
}