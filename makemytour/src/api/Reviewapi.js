import axios from "axios";

const API = axios.create({
  baseURL: "https://make-my-tour-clone-springboot-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Create review
export const createReview = (reviewData) => API.post("/reviews", reviewData);

// Get reviews
export const getReviews = (itemId, itemType, sort = "newest") =>
  API.get(`/reviews/item/${itemId}`, {
    params: {
      itemType,
      sort,
    },
  });

// Update review
export const updateReview = (reviewId, reviewData) =>
  API.put(`/reviews/${reviewId}`, reviewData);

// Delete review
export const deleteReview = (reviewId) => API.delete(`/reviews/${reviewId}`);

// Mark review as helpful
export const markReviewHelpful = (reviewId) =>
  API.post(`/reviews/${reviewId}/helpful`);

// Get rating summary
export const getReviewSummary = (itemId, itemType) =>
  API.get("/reviews/summary", {
    params: {
      itemId,
      itemType,
    },
  });

// Create reply
export const createReviewReply = (reviewId, userId, comment) =>
  API.post("/review-replies", null, {
    params: {
      reviewId,
      userId,
      comment,
    },
  });

// Get replies
export const getReviewReplies = (reviewId) =>
  API.get(`/review-replies/review/${reviewId}`);

// Update reply
export const updateReviewReply = (replyId, userId, comment) =>
  API.put(`/review-replies/${replyId}`, null, {
    params: {
      userId,
      comment,
    },
  });

// Delete reply
export const deleteReviewReply = (replyId, userId) =>
  API.delete(`/review-replies/${replyId}`, {
    params: {
      userId,
    },
  });

// Upload review photo
export const uploadReviewPhoto = (reviewId, userId, file) => {
  const formData = new FormData();
  formData.append("reviewId", reviewId);
  formData.append("userId", userId);
  formData.append("file", file);

  return API.post("/review-photos/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get review photos
export const getReviewPhotos = (reviewId) =>
  API.get(`/review-photos/review/${reviewId}`);

// Delete review photo
export const deleteReviewPhoto = (photoId, userId) =>
  API.delete(`/review-photos/${photoId}`, {
    params: {
      userId,
    },
  });

// Report a review
export const reportReview = (reviewId, userId, reason) =>
  API.post("/review-flags", null, {
    params: {
      reviewId,
      userId,
      reason,
    },
  });

// Get pending reports
export const getPendingReviewFlags = () => API.get("/review-flags/pending");

// Get reports for a review
export const getReviewFlags = (reviewId) =>
  API.get(`/review-flags/review/${reviewId}`);

// Dismiss report
export const dismissReviewFlag = (flagId) =>
  API.put(`/review-flags/${flagId}/dismiss`);

// Remove reported review
export const removeReportedReview = (flagId) =>
  API.put(`/review-flags/${flagId}/remove`);

export default API;
