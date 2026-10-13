package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Get active reviews for a hotel or flight
    List<Review> findByItemIdAndItemTypeAndStatus(Long itemId, String itemType, String status);

    // Sort by newest
    List<Review> findByItemIdAndItemTypeAndStatusOrderByCreatedAtDesc(Long itemId, String itemType, String status);

    // Sort by highest rating
    List<Review> findByItemIdAndItemTypeAndStatusOrderByRatingDesc(Long itemId, String itemType, String status);

    // Sort by most helpful
    List<Review> findByItemIdAndItemTypeAndStatusOrderByHelpfulCountDesc(Long itemId,String itemType, String status);
}