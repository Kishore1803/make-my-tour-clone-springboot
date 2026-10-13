package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.ReviewReply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewReplyRepository extends JpaRepository<ReviewReply, Long> {

    // Get all active replies for a review
    List<ReviewReply> findByReviewIdAndStatusOrderByCreatedAtAsc(Long reviewId, String status);
}