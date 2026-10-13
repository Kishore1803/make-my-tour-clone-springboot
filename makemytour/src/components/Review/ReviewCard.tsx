"use client";

import { useState } from "react";
import { markReviewHelpful, reportReview } from "@/api/Reviewapi";

import StarRating from "./StarRating";
import ReviewReply from "./ReviewReply";
import ReviewPhotos from "./ReviewPhotos";

interface ReviewCardProps {
  review: {
    id: number;
    userId: number;
    rating: number;
    comment: string;
    helpfulCount: number;
    createdAt: string;
  };

  currentUserId?: number;
  onHelpful?: () => void;
}

const ReviewCard = ({ review, currentUserId, onHelpful }: ReviewCardProps) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [helpfulLoading, setHelpfulLoading] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleHelpful = async () => {
    if (helpfulLoading) return;

    try {
      setHelpfulLoading(true);
      setMessage("");
      const response = await markReviewHelpful(review.id);
      setHelpfulCount(response.data.helpfulCount);

      if (onHelpful) {
        onHelpful();
      }
    } catch (error) {
      console.error("Error marking review helpful:", error);
      setMessage("Unable to mark review as helpful.");
    } finally {
      setHelpfulLoading(false);
    }
  };

  const handleReport = async () => {
    if (!currentUserId) {
      setMessage("Please login to report a review.");
      return;
    }

    if (!reportReason.trim()) {
      setMessage("Please select a report reason.");
      return;
    }

    try {
      setReportLoading(true);
      setMessage("");
      await reportReview(review.id, currentUserId, reportReason);
      setShowReport(false);
      setReportReason("");
      setMessage("Review reported successfully.");
    } catch (error) {
      console.error("Error reporting review:", error);
      setMessage("Unable to report this review.");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <article className="border rounded-xl p-5 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900">User #{review.userId}</p>
          <div className="mt-1">
            <StarRating rating={review.rating} readonly size="sm" />
          </div>
        </div>
        <span className="text-sm text-gray-400">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="mt-4 text-gray-700 leading-6">{review.comment}</p>

      <div className="flex flex-wrap gap-2 mt-5">
        <button
          type="button"
          onClick={handleHelpful}
          disabled={helpfulLoading}
          className="px-3 py-2 text-sm border rounded-lg
           hover:bg-gray-50 disabled:opacity-50"
        >
          👍 Helpful ({helpfulCount})
        </button>

        {/* REPLIES */}
        <button
          type="button"
          onClick={() => setShowReply(!showReply)}
          className="px-3 py-2 text-sm border 
          rounded-lg hover:bg-gray-50"
        >
          💬 {showReply ? "Hide Replies" : "Replies"}
        </button>

        {/* PHOTOS */}
        <button
          type="button"
          onClick={() => setShowPhotos(!showPhotos)}
          className="px-3 py-2 text-smborder
            rounded-lg hover:bg-gray-50"
        >
          📸 {showPhotos ? "Hide Photos" : "Photos"}
        </button>

        {/* REPORT */}
        <button
          type="button"
          onClick={() => setShowReport(!showReport)}
          className="px-3 py-2 text-sm text-red-500 border
           border-red-200 rounded-lg hover:bg-red-50"
        >
          🚩 Report
        </button>
      </div>

      {showReply && (
        <ReviewReply reviewId={review.id} currentUserId={currentUserId} />
      )}

      {showPhotos && (
        <ReviewPhotos reviewId={review.id} currentUserId={currentUserId} />
      )}

      {showReport && (
        <div className="mt-5 p-4 bg-gray-50 rounded-lg">
          <label
            htmlFor={`report-${review.id}`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Why are you reporting this review?
          </label>

          <select
            id={`report-${review.id}`}
            value={reportReason}
            onChange={(event) => setReportReason(event.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="">Select a reason</option>
            <option value="Inappropriate content">Inappropriate content</option>
            <option value="Spam">Spam</option>
            <option value="Harassment">Harassment</option>
            <option value="False information">False information</option>
            <option value="Offensive language">Offensive language</option>
          </select>

          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={handleReport}
              disabled={reportLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm disabled:opacity-50"
            >
              {reportLoading ? "Reporting..." : "Submit Report"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowReport(false);
                setReportReason("");
              }}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
    </article>
  );
};

export default ReviewCard;
