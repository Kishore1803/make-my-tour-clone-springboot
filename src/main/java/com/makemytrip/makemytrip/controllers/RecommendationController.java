package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.dto.*;
import com.makemytrip.makemytrip.models.*;
import com.makemytrip.makemytrip.services.RecommendationService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

	@Autowired
    private RecommendationService service;

    @GetMapping("/{userId}")
    public ResponseEntity<List<RecommendationResponse>> getRecommendations(@PathVariable Long userId, @RequestParam(required = false) String type) {
        return ResponseEntity.ok(service.recommend(userId, type));
    }

    @PostMapping("/feedback")
    public ResponseEntity<Map<String, String>> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        service.saveFeedback(request);
        return ResponseEntity.ok(Map.of("message", "Feedback saved successfully"));
    }

    @PostMapping("/{userId}/{itemId}/interaction")
    public ResponseEntity<TravelInteraction> recordInteraction(@PathVariable Long userId, @PathVariable Long itemId, @RequestParam String action) {
        return ResponseEntity.ok(service.recordInteraction(userId, itemId, action));
    }
}