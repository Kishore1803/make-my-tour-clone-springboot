package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.BookingPreference;
import com.makemytrip.makemytrip.services.BookingPreferenceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/preference")
public class BookingPeferenceService {

    @Autowired
    private BookingPreferenceService preferenceService;

    // Get all preferences of a user
    @GetMapping("/user/{userId}")
    public List<BookingPreference> getUserPreferences(@PathVariable Long userId) {
        return preferenceService.getUserPreferences(userId);
    }

    // Get specific preference
    @GetMapping("/{userId}/{preferenceType}")
    public BookingPreference getPreference(@PathVariable Long userId, @PathVariable String preferenceType) {
        return preferenceService.getPreference(userId, preferenceType);
    }

    // Save or update preference
    @PostMapping("/save")
    public BookingPreference savePreference(@RequestParam Long userId, @RequestParam String preferenceType,
            @RequestParam String preferenceValue) {
        return preferenceService.savePreference(userId, preferenceType, preferenceValue);
    }

    // Delete preference
    @DeleteMapping("/{preferenceId}")
    public String deletePreference(@PathVariable Long preferenceId) {
        preferenceService.deletePreference(preferenceId);
        return "Preference deleted successfully";
    }
}