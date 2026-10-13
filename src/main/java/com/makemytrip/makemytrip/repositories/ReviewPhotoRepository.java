package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.ReviewPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewPhotoRepository extends JpaRepository<ReviewPhoto, Long> {

    // Get all active photos for a review
    List<ReviewPhoto> findByReviewIdAndStatusOrderByCreatedAtAsc(Long reviewId, String status);
}