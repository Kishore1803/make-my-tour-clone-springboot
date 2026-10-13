package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.ReviewPhoto;
import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.repositories.ReviewPhotoRepository;
import com.makemytrip.makemytrip.repositories.ReviewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ReviewPhotoService {

	@Autowired
    private ReviewPhotoRepository photoRepository;
	
    @Autowired
    private ReviewRepository reviewRepository;

    private final String uploadDirectory = "uploads/reviews/";

    // Upload Photo
    public ReviewPhoto uploadPhoto(Long reviewId, Long userId, MultipartFile file) {

        // Check review
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Check file
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Please select an image");
        }

        // Check file type
        String contentType = file.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        // Maximum 5 MB
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("Image size must be less than 5 MB");
        }

        try {
            // Create directory
            Path uploadPath = Paths.get(uploadDirectory);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalName = file.getOriginalFilename();
            String extension = "";

            if (originalName != null && originalName.contains(".")) {
            	extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID() + extension;
            Path filePath = uploadPath.resolve(fileName);

            // Save file
            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING);

            // URL stored in DB
            String imageUrl = "/uploads/reviews/" + fileName;

            ReviewPhoto photo = new ReviewPhoto(reviewId, userId, imageUrl);
            return photoRepository.save(photo);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image");
        }
    }

    // Get Photos
    public List<ReviewPhoto> getPhotos(Long reviewId) {
        return photoRepository.findByReviewIdAndStatusOrderByCreatedAtAsc(reviewId,"ACTIVE");
    }

    // Delete Photo
    public void deletePhoto(Long photoId,Long userId) {
    	
        ReviewPhoto photo = photoRepository.findById(photoId)
                        .orElseThrow(() -> new RuntimeException("Photo not found"));

        if (!photo.getUserId().equals(userId)) {
            throw new RuntimeException("You can delete only your own photo");
        }

        photo.setStatus("REMOVED");
        photoRepository.save(photo);
    }
}