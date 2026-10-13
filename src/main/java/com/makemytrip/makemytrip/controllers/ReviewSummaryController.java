package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.services.ReviewSummaryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewSummaryController {

	@Autowired
    private ReviewSummaryService reviewSummaryService;

    // GET REVIEW SUMMARY
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@RequestParam Long itemId, @RequestParam String itemType) {
        Map<String, Object> summary = reviewSummaryService.getSummary(itemId, itemType);
        return ResponseEntity.ok(summary);
    }
}