package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.ReviewFlag;
import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.repositories.ReviewFlagRepository;
import com.makemytrip.makemytrip.repositories.ReviewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewFlagService {

	@Autowired
    private ReviewFlagRepository flagRepository;
	
	@Autowired
    private ReviewRepository reviewRepository;

    // CREATE REPORT
    public ReviewFlag createFlag(Long reviewId, Long userId, String reason) {

        validateFlag(reviewId, userId, reason);

        // Check whether the review exists
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Only active reviews can be reported
        if (!"ACTIVE".equalsIgnoreCase(review.getStatus())) {
            throw new RuntimeException("This review cannot be reported");
        }

        ReviewFlag flag = new ReviewFlag(reviewId, userId, reason.trim());
        return flagRepository.save(flag);
    }

    // GET PENDING REPORTS
    public List<ReviewFlag> getPendingFlags() {
        return flagRepository.findByStatusOrderByCreatedAtAsc("PENDING");
    }
    
    // GET REPORTS FOR REVIEW
    public List<ReviewFlag> getFlagsByReview(Long reviewId) {

        if (reviewId == null) {
            throw new RuntimeException("Review ID is required");
        }
        return flagRepository.findByReviewIdOrderByCreatedAtDesc(reviewId);
    }

    // DISMISS REPORT
    public ReviewFlag dismissFlag(Long flagId) {

        ReviewFlag flag = getFlag(flagId);
        flag.setStatus("DISMISSED");
        return flagRepository.save(flag);
    }

    // REMOVE REVIEW
    public ReviewFlag removeReview(Long flagId) {

        ReviewFlag flag = getFlag(flagId);

        Review review = reviewRepository.findById(flag.getReviewId())
        		.orElseThrow(() -> new RuntimeException("Review not found"));

        // Remove the reported review
        review.setStatus("REMOVED");
        reviewRepository.save(review);

        // Mark report as reviewed
        flag.setStatus("REVIEWED");
        return flagRepository.save(flag);
    }
    
    // GET FLAG BY ID
    private ReviewFlag getFlag(Long flagId) {

        if (flagId == null) {
            throw new RuntimeException("Flag ID is required");
        }

        return flagRepository.findById(flagId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    // VALIDATION
    private void validateFlag(Long reviewId, Long userId, String reason) {

        if (reviewId == null) {
            throw new RuntimeException("Review ID is required");
        }

        if (userId == null) {
            throw new RuntimeException("User ID is required");
        }

        if (reason == null || reason.trim().isEmpty()) {
            throw new RuntimeException("Report reason is required");
        }

        if (reason.length() > 500) {
            throw new RuntimeException("Report reason cannot exceed 500 characters");
        }
    }
}