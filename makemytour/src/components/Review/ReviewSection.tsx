"use client";

import { useEffect, useState } from "react";
import { getReviews, getReviewSummary } from "@/api/Reviewapi";

import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

interface ReviewSectionProps {
  itemId: number;
  itemType: "HOTEL" | "FLIGHT";
  currentUserId?: number;
}

interface Review {
  id: number;
  userId: number;
  rating: number;
  comment: string;
  helpfulCount: number;
  createdAt: string;
}

interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
}

const ReviewSection = ({
  itemId,
  itemType,
  currentUserId,
}: ReviewSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getReviews(itemId, itemType, sort);
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const response = await getReviewSummary(itemId, itemType);
      setSummary(response.data);
    } catch (error) {
      console.error("Failed to load review summary:", error);
    }
  };

  useEffect(() => {
    loadReviews();
    loadSummary();
  }, [itemId, itemType, sort]);

  const refreshReviews = () => {
    loadReviews();
    loadSummary();
  };

  return (
    <section className="mt-10 w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
        <p className="mt-1 text-sm text-gray-500">
          See what other travelers have to say
        </p>
      </div>

      {summary && (
        <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center border-b pb-5 md:border-b-0 md:border-r md:pb-0">
              <div className="text-4xl font-bold text-gray-900">
                {summary.averageRating.toFixed(1)}
              </div>

              <div className="mt-1 text-yellow-400 text-xl">
                {"★".repeat(Math.round(summary.averageRating))}
                {"☆".repeat(5 - Math.round(summary.averageRating))}
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {summary.totalReviews} review
                {summary.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count =
                  rating === 5
                    ? summary.fiveStar
                    : rating === 4
                      ? summary.fourStar
                      : rating === 3
                        ? summary.threeStar
                        : rating === 2
                          ? summary.twoStar
                          : summary.oneStar;

                const percentage =
                  summary.totalReviews > 0
                    ? (count / summary.totalReviews) * 100
                    : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="w-12 text-sm text-gray-600">
                      {rating} ★
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs text-gray-500">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {currentUserId ? (
        <div className="mb-8">
          <ReviewForm
            userId={currentUserId}
            itemId={itemId}
            itemType={itemType}
            onReviewCreated={refreshReviews}
          />
        </div>
      ) : (
        <div className="mb-8 rounded-xl border bg-gray-50 p-5 text-center">
          <p className="text-sm text-gray-600">
            Please login to write a review.
          </p>
        </div>
      )}

      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Traveler Reviews
        </h3>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rated</option>
        </select>
      </div>

      {loading && (
        <div className="py-10 text-center text-gray-500">
          Loading reviews...
        </div>
      )}
      {!loading && error && (
        <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}
      {!loading && !error && reviews.length === 0 && (
        <div className="rounded-xl border bg-gray-50 p-8 text-center">
          <p className="text-gray-600">No reviews yet.</p>
          <p className="mt-1 text-sm text-gray-400">
            Be the first traveler to share your experience.
          </p>
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-5">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={currentUserId}
              onHelpful={refreshReviews}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
