package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.BookingPreference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingPreferenceRepository extends JpaRepository<BookingPreference, Long> {

    List<BookingPreference> findByUserId(Long userId);
    Optional<BookingPreference> findByUserIdAndPreferenceType(Long userId, String preferenceType);
}