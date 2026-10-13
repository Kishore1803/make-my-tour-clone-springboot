package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.BookingPreference;
import com.makemytrip.makemytrip.repositories.BookingPreferenceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingPreferenceService {

    @Autowired
    private BookingPreferenceRepository preferenceRepository;

    // Get all preferences of a user
    public List<BookingPreference> getUserPreferences(Long userId) {
        return preferenceRepository.findByUserId(userId);
    }

    // Get specific preference
    public BookingPreference getPreference(Long userId, String preferenceType) {
        return preferenceRepository.findByUserIdAndPreferenceType(userId, preferenceType)
        		.orElse(null);
    }

    // Save or update preference
    public BookingPreference savePreference(Long userId, String preferenceType, String preferenceValue) {

        BookingPreference preference = preferenceRepository.findByUserIdAndPreferenceType(userId, preferenceType)
        		.orElse(new BookingPreference());

        preference.setUserId(userId);
        preference.setPreferenceType(preferenceType);
        preference.setPreferenceValue(preferenceValue);
        return preferenceRepository.save(preference);
    }

    // Delete preference
    public void deletePreference(Long preferenceId) {

        if (!preferenceRepository.existsById(preferenceId)) {
            throw new RuntimeException("Preference not found");
        }
        
        preferenceRepository.deleteById(preferenceId);
    }
}