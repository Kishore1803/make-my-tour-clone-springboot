"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  createReviewReply,
  getReviewReplies,
  deleteReviewReply,
} from "@/api/Reviewapi";

interface Reply {
  id: number;
  reviewId: number;
  userId: number;
  comment: string;
  createdAt: string;
  status: string;
}

interface ReviewReplyProps {
  reviewId: number;
  currentUserId?: number;
}

const ReviewReply = ({ reviewId, currentUserId }: ReviewReplyProps) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadReplies = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getReviewReplies(reviewId);
      setReplies(response.data);
    } catch (error) {
      console.error("Error loading replies:", error);
      setError("Unable to load replies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!reviewId) return;

    loadReplies();
  }, [reviewId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!currentUserId) {
      setError("Please login to reply.");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a reply.");
      return;
    }

    if (comment.trim().length < 2) {
      setError("Reply must contain at least 2 characters.");
      return;
    }

    if (comment.length > 1000) {
      setError("Reply cannot exceed 1000 characters.");
      return;
    }

    try {
      setReplyLoading(true);
      await createReviewReply(reviewId, currentUserId, comment.trim());
      setComment("");
      setSuccess("Reply added successfully.");
      await loadReplies();
    } catch (error: any) {
      console.error("Error creating reply:", error);
      setError(error?.response?.data?.message || "Unable to add reply.");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDelete = async (replyId: number) => {
    if (!currentUserId) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove this reply?",
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteReviewReply(replyId, currentUserId);
      setSuccess("Reply removed successfully.");
      await loadReplies();
    } catch (error: any) {
      console.error("Error deleting reply:", error);
      setError(error?.response?.data?.message || "Unable to remove reply.");
    }
  };

  return (
    <div className="mt-5 border-t pt-5">
      <h4 className="font-semibold text-gray-900">Replies</h4>

      {loading && (
        <p className="text-sm text-gray-500 mt-3">Loading replies...</p>
      )}

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-3 p-3 rounded-lg bg-green-50 text-green-600 text-sm">
          {success}
        </div>
      )}

      {!loading && replies.length === 0 && (
        <p className="text-sm text-gray-400 mt-3">No replies yet.</p>
      )}

      <div className="mt-4 space-y-3">
        {replies.map((reply) => (
          <div
            key={reply.id}
            className="
              ml-4
              border-l-2
              border-gray-200
              pl-4
            "
          >
            {/* USER + DATE */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <p className="text-sm font-medium text-gray-800">
                User #{reply.userId}
              </p>
              <span className="text-xs text-gray-400">
                {new Date(reply.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* COMMENT */}
            <p className="text-sm text-gray-600 mt-1">{reply.comment}</p>

            {/* DELETE */}
            {currentUserId === reply.userId && (
              <button
                type="button"
                onClick={() => handleDelete(reply.id)}
                className="
                  text-xs
                  text-red-500
                  mt-2
                  hover:underline
                "
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-5">
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Write a reply..."
          maxLength={1000}
          rows={3}
          className="
            w-full
            border
            rounded-lg
            px-4
            py-3
            resize-none
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
          <span className="text-xs text-gray-400">{comment.length}/1000</span>

          <button
            type="submit"
            disabled={replyLoading}
            className="
              px-5
              py-2
              bg-blue-600
              text-white
              rounded-lg
              text-sm
              font-medium
              hover:bg-blue-700
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {replyLoading ? "Posting..." : "Post Reply"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewReply;
