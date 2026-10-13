package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.ReviewReply;
import com.makemytrip.makemytrip.repositories.ReviewReplyRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import java.util.List;

@Service
public class ReviewReplyService {

	@Autowired
    private ReviewReplyRepository replyRepository;

    // CREATE REPLY
    public ReviewReply createReply(Long reviewId, Long userId, String comment) {

        validateReply(reviewId, userId, comment);
        ReviewReply reply = new ReviewReply(reviewId, userId, comment.trim());
        return replyRepository.save(reply);
    }

    // GET REPLIES
    public List<ReviewReply> getReplies(Long reviewId) {
    	
        if (reviewId == null) {
            throw new RuntimeException("Review ID is required");
        }

        return replyRepository.findByReviewIdAndStatusOrderByCreatedAtAsc(reviewId, "ACTIVE");
    }
    
    // UPDATE REPLY
    public ReviewReply updateReply(Long replyId, Long userId, String comment) {

        if (replyId == null) {
            throw new RuntimeException("Reply ID is required");
        }

        if (userId == null) {
            throw new RuntimeException("User ID is required");
        }

        if (comment == null ||comment.trim().isEmpty()) {
            throw new RuntimeException("Reply comment is required");
        }

        if (comment.length() > 1000) {
            throw new RuntimeException("Reply cannot exceed 1000 characters");
        }

        ReviewReply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));

        // Only the reply owner can update it
        if (!reply.getUserId().equals(userId)) {
            throw new RuntimeException("You can only update your own reply");
        }

        reply.setComment(comment.trim());
        return replyRepository.save(reply);
    }

    // DELETE REPLY

    public void deleteReply(Long replyId, Long userId) {

        if (replyId == null) {
            throw new RuntimeException("Reply ID is required");
        }

        if (userId == null) {
            throw new RuntimeException("User ID is required");
        }

        ReviewReply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));

        // Only the reply owner can remove it
        if (!reply.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own reply");
        }

        reply.setStatus("REMOVED");
        replyRepository.save(reply);
    }

    // VALIDATION
    private void validateReply(Long reviewId, Long userId, String comment) {

        if (reviewId == null) {
            throw new RuntimeException("Review ID is required");
        }

        if (userId == null) {
            throw new RuntimeException("User ID is required");
        }

        if (comment == null || comment.trim().isEmpty()) {
            throw new RuntimeException("Reply comment is required");
        }

        if (comment.length() > 1000) {
            throw new RuntimeException("Reply cannot exceed 1000 characters");
        }
    }
}