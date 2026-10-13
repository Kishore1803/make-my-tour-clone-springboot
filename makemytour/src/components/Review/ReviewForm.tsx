"use client";

import { FormEvent, useState } from "react";
import { createReview } from "@/api/Reviewapi";
import StarRating from "./StarRating";

interface ReviewFormProps {
  userId: number;
  itemId: number;
  itemType: "HOTEL" | "FLIGHT";
  onReviewCreated?: () => void;
}

const ReviewForm = ({
  userId,
  itemId,
  itemType,
  onReviewCreated,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Rating validation
    if (rating < 1 || rating > 5) {
      setError("Please select a rating from 1 to 5 stars.");
      return;
    }

    // Comment validation
    if (!comment.trim()) {
      setError("Please write your review.");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Review must contain at least 10 characters.");
      return;
    }

    if (comment.length > 1000) {
      setError("Review cannot exceed 1000 characters.");
      return;
    }

    try {
      setLoading(true);
      await createReview({
        userId,
        itemId,
        itemType,
        rating,
        comment: comment.trim(),
      });

      // Clear form
      setRating(0);
      setComment("");
      setSuccess("Your review has been submitted successfully!");

      // Refresh review list
      if (onReviewCreated) {
        onReviewCreated();
      }
    } catch (error: any) {
      console.error("Error creating review:", error);
      setError(
        error?.response?.data?.message || "Unable to submit your review.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 bg-white">
      <h3 className="text-xl font-semibold text-gray-900">Write a Review</h3>
      <p className="text-sm text-gray-500 mt-1">
        Share your experience with other travelers.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <StarRating rating={rating} onRatingChange={setRating} size="lg" />
          {rating > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              You selected {rating} out of 5 stars.
            </p>
          )}
        </div>

        {/* COMMENT */}
        <div>
          <label
            htmlFor="review-comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Review
          </label>

          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={
              itemType === "HOTEL"
                ? "Tell us about your Hotel Experience..."
                : "Tell us about your Flight Experience..."
            }
            maxLength={1000}
            rows={5}
            className="
              w-full border rounded-lg px-4 py-3 resize-none 
              outline-none focus:ring-2 focus:ring-blue-500
            "
          />

          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-400">{comment.length}/1000</span>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
            {success}
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 text-white font-medium
             hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition
          "
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
