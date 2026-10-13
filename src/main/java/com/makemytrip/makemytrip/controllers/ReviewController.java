package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.dto.ReviewRequest;
import com.makemytrip.makemytrip.dto.ReviewResponse;
import com.makemytrip.makemytrip.services.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

	@Autowired
    private ReviewService reviewService;

    // CREATE REVIEW
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET REVIEWS
    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable Long itemId, @RequestParam String itemType, @RequestParam(defaultValue = "newest") String sort) {
        List<ReviewResponse> reviews = reviewService.getReviews(itemId, itemType, sort);
        return ResponseEntity.ok(reviews);
    }
    
    // UPDATE REVIEW
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(@PathVariable Long reviewId, @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.updateReview(reviewId, request);
        return ResponseEntity.ok(response);
    }
    
    // DELETE REVIEW
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review removed successfully");
    }

    // MARK REVIEW AS HELPFUL
    @PostMapping("/{reviewId}/helpful")
    public ResponseEntity<ReviewResponse> markHelpful(@PathVariable Long reviewId) {
        ReviewResponse response = reviewService.markHelpful(reviewId);
        return ResponseEntity.ok(response);
    }
}