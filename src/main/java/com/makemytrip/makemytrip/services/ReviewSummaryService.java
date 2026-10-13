package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.repositories.ReviewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReviewSummaryService {

	@Autowired
    private ReviewRepository reviewRepository;

    // GET REVIEW SUMMARY
    public Map<String, Object> getSummary(Long itemId, String itemType) {

        if (itemId == null) {
            throw new RuntimeException("Item ID is required");
        }

        if (itemType == null || itemType.trim().isEmpty()) {
            throw new RuntimeException("Item type is required");
        }

        String type = itemType.toUpperCase();

        if (!type.equals("HOTEL") && !type.equals("FLIGHT")) {
            throw new RuntimeException("Item type must be HOTEL or FLIGHT");
        }

        List<Review> reviews = reviewRepository.findByItemIdAndItemTypeAndStatus(itemId, type,"ACTIVE");

        int totalReviews = reviews.size();

        int oneStar = 0;
        int twoStar = 0;
        int threeStar = 0;
        int fourStar = 0;
        int fiveStar = 0;
        int totalRating = 0;

        for (Review review : reviews) {
            Integer rating = review.getRating();
            if (rating == null) {
                continue;
            }
            
            totalRating += rating;
            switch (rating) {

                case 1:
                    oneStar++;
                    break;

                case 2:
                    twoStar++;
                    break;

                case 3:
                    threeStar++;
                    break;

                case 4:
                    fourStar++;
                    break;

                case 5:
                    fiveStar++;
                    break;

                default:
                    break;
            }
        }

        double averageRating = 0.0;

        if (totalReviews > 0) {
            averageRating = (double) totalRating / totalReviews;
        }

        // Round to 1 decimal place
        averageRating = Math.round(averageRating * 10.0) / 10.0;
        Map<String, Object> summary = new HashMap<>();

        summary.put("itemId", itemId);
        summary.put("itemType", type);
        summary.put("totalReviews", totalReviews);
        summary.put("averageRating", averageRating);
        summary.put("oneStar", oneStar);
        summary.put("twoStar", twoStar);
        summary.put("threeStar", threeStar);
        summary.put("fourStar", fourStar);
        summary.put("fiveStar", fiveStar);

        return summary;
    }
}