package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.ReviewFlag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewFlagRepository extends JpaRepository<ReviewFlag, Long> {

    // Get all pending reports for moderator review
    List<ReviewFlag> findByStatusOrderByCreatedAtAsc(String status);

    // Get reports for a particular review
    List<ReviewFlag> findByReviewIdOrderByCreatedAtDesc(Long reviewId);

    // Get reports submitted by a particular user
    List<ReviewFlag> findByUserIdOrderByCreatedAtDesc(Long userId);
}