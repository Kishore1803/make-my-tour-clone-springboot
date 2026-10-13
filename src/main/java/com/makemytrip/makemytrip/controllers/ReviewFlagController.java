package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.ReviewFlag;
import com.makemytrip.makemytrip.services.ReviewFlagService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review-flags")
public class ReviewFlagController {

	@Autowired
    private ReviewFlagService flagService;

    // REPORT REVIEW
    @PostMapping
    public ResponseEntity<ReviewFlag> createFlag(@RequestParam Long reviewId, @RequestParam Long userId, @RequestParam String reason) {
        ReviewFlag flag = flagService.createFlag(reviewId, userId, reason);
        return ResponseEntity.status(HttpStatus.CREATED).body(flag);
    }

    // GET PENDING REPORTS
    @GetMapping("/pending")
    public ResponseEntity<List<ReviewFlag>> getPendingFlags() {
        List<ReviewFlag> flags = flagService.getPendingFlags();
        return ResponseEntity.ok(flags);
    }

    // GET REPORTS FOR A REVIEW
    @GetMapping("/review/{reviewId}")
    public ResponseEntity<List<ReviewFlag>> getFlagsByReview(@PathVariable Long reviewId) {
        List<ReviewFlag> flags = flagService.getFlagsByReview(reviewId);
        return ResponseEntity.ok(flags);
    }

    // DISMISS REPORT
    @PutMapping("/{flagId}/dismiss")
    public ResponseEntity<ReviewFlag> dismissFlag(@PathVariable Long flagId) {
        ReviewFlag flag = flagService.dismissFlag(flagId);
        return ResponseEntity.ok(flag);
    }

    // REMOVE REPORTED REVIEW
    @PutMapping("/{flagId}/remove")
    public ResponseEntity<ReviewFlag> removeReview(@PathVariable Long flagId) {
        ReviewFlag flag = flagService.removeReview(flagId);
        return ResponseEntity.ok(flag);
    }
}