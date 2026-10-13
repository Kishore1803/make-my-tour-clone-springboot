package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.dto.ReviewRequest;
import com.makemytrip.makemytrip.dto.ReviewResponse;
import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.repositories.ReviewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

	@Autowired
    private ReviewRepository reviewRepository;

    // CREATE REVIEW
    public ReviewResponse createReview(ReviewRequest request) {
    	
        validateReview(request);
        Review review = new Review(request.getUserId(), request.getItemId(),
                request.getItemType().toUpperCase(), request.getRating(), request.getComment());
        
        Review savedReview = reviewRepository.save(review);
        return convertToResponse(savedReview);
    }

    // GET REVIEWS
    public List<ReviewResponse> getReviews(Long itemId, String itemType, String sort) {
    	
        String type = itemType.toUpperCase();
        List<Review> reviews;
        
        if ("highest".equalsIgnoreCase(sort)) {
            reviews = reviewRepository.findByItemIdAndItemTypeAndStatusOrderByRatingDesc(itemId, type, "ACTIVE");

        } else if ("helpful".equalsIgnoreCase(sort)) {
            reviews = reviewRepository.findByItemIdAndItemTypeAndStatusOrderByHelpfulCountDesc(itemId, type, "ACTIVE");

        } else {
            reviews = reviewRepository.findByItemIdAndItemTypeAndStatusOrderByCreatedAtDesc(itemId, type, "ACTIVE" );
        }

        return reviews.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // UPDATE REVIEW
    public ReviewResponse updateReview(Long reviewId, ReviewRequest request) {
    	
        validateReview(request);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUpdatedAt(LocalDateTime.now());

        Review updatedReview = reviewRepository.save(review);
        return convertToResponse(updatedReview);
    }

    // DELETE REVIEW
    public void deleteReview(Long reviewId) {
    	
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Soft delete
        review.setStatus("REMOVED");
        review.setUpdatedAt(LocalDateTime.now());
        reviewRepository.save(review);
    }

    // MARK REVIEW AS HELPFUL
    public ReviewResponse markHelpful(Long reviewId) {
    	
        Review review = reviewRepository.findById(reviewId).orElseThrow(() ->
                        new RuntimeException("Review not found"));

        Integer helpfulCount = review.getHelpfulCount();

        if (helpfulCount == null) {
            helpfulCount = 0;
        }

        review.setHelpfulCount(helpfulCount + 1);

        Review updatedReview = reviewRepository.save(review);
        return convertToResponse(updatedReview);
    }

    // VALIDATION
    private void validateReview(ReviewRequest request) {

        if (request.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }

        if (request.getItemId() == null) {
            throw new RuntimeException("Item ID is required");
        }

        if (request.getItemType() == null || request.getItemType().trim().isEmpty()) {
            throw new RuntimeException("Item type is required");
        }

        String itemType = request.getItemType().toUpperCase();

        if (!itemType.equals("HOTEL") && !itemType.equals("FLIGHT")) {
            throw new RuntimeException("Item type must be HOTEL or FLIGHT");
        }

        // Rating must be 1 to 5
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        if (request.getComment() == null ||
                request.getComment().trim().isEmpty()) {
            throw new RuntimeException("Review comment is required");
        }

        if (request.getComment().length() > 1000) {
            throw new RuntimeException("Review cannot exceed 1000 characters");
        }
    }

    // CONVERT ENTITY → RESPONSE
    private ReviewResponse convertToResponse(Review review) {

        return new ReviewResponse(review.getId(), review.getUserId(),
                review.getItemId(), review.getItemType(), review.getRating(),
                review.getComment(), review.getStatus(), review.getHelpfulCount(),
                review.getCreatedAt(), review.getUpdatedAt());
    }
}