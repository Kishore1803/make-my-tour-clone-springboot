package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.ReviewPhoto;
import com.makemytrip.makemytrip.services.ReviewPhotoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/review-photos")
public class ReviewPhotoController {

    @Autowired
    private ReviewPhotoService photoService;

    // Upload Photo
    @PostMapping("/upload")
    public ResponseEntity<ReviewPhoto> uploadPhoto(@RequestParam Long reviewId, @RequestParam Long userId,
            @RequestParam("file") MultipartFile file) {
        ReviewPhoto photo = photoService.uploadPhoto(reviewId, userId, file);
        return ResponseEntity.ok(photo);
    }

    // Get Review Photos
    @GetMapping("/review/{reviewId}")
    public ResponseEntity<List<ReviewPhoto>> getPhotos(@PathVariable Long reviewId) {
        return ResponseEntity.ok(photoService.getPhotos(reviewId));
    }

    // Delete Photo
    @DeleteMapping("/{photoId}")
    public ResponseEntity<String> deletePhoto(@PathVariable Long photoId, @RequestParam Long userId) {
        photoService.deletePhoto(photoId, userId);
        return ResponseEntity.ok("Photo deleted successfully");
    }
}