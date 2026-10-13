package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.ReviewReply;
import com.makemytrip.makemytrip.services.ReviewReplyService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review-replies")
public class ReviewReplyController {

	@Autowired
    private ReviewReplyService replyService;

    // CREATE REPLY
    @PostMapping
    public ResponseEntity<ReviewReply> createReply(@RequestParam Long reviewId, @RequestParam Long userId, @RequestParam String comment) {
        ReviewReply reply = replyService.createReply(reviewId, userId, comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(reply);
    }

    // GET REPLIES
    @GetMapping("/review/{reviewId}")
    public ResponseEntity<List<ReviewReply>> getReplies(@PathVariable Long reviewId) {
        List<ReviewReply> replies = replyService.getReplies(reviewId);
        return ResponseEntity.ok(replies);
    }

    // UPDATE REPLY
    @PutMapping("/{replyId}")
    public ResponseEntity<ReviewReply> updateReply(@PathVariable Long replyId, @RequestParam Long userId, @RequestParam String comment) {
        ReviewReply updatedReply = replyService.updateReply(replyId, userId, comment);
        return ResponseEntity.ok(updatedReply);
    }

    // DELETE REPLY
    @DeleteMapping("/{replyId}")
    public ResponseEntity<String> deleteReply(@PathVariable Long replyId, @RequestParam Long userId) {
        replyService.deleteReply(replyId, userId);
        return ResponseEntity.ok("Reply removed successfully");
    }
}