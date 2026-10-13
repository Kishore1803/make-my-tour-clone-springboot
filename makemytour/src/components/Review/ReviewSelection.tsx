"use client";

import { useEffect, useState } from "react";
import { getReviews, getReviewSummary } from "@/api/Reviewapi";
import ReviewCard from "./ReviewCard";

interface Review {
  id: number;
  userId: number;
  itemId: number;
  itemType: string;
  rating: number;
  comment: string;
  helpfulCount: number;
  createdAt: string;
}

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
}

interface ReviewSectionProps {
  itemId: number;
  itemType: "HOTEL" | "FLIGHT";
  currentUserId?: number;
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

  // LOAD REVIEWS
  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getReviews(itemId, itemType, sort);
      setReviews(response.data);
    } catch (error) {
      console.error("Error loading reviews:", error);
      setError("Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  // LOAD SUMMARY
  const loadSummary = async () => {
    try {
      const response = await getReviewSummary(itemId, itemType);
      setSummary(response.data);
    } catch (error) {
      console.error("Error loading review summary:", error);
    }
  };

  const refreshReviews = async () => {
    await loadReviews();
    await loadSummary();
  };

  // LOAD DATA
  useEffect(() => {
    if (!itemId) return;

    loadReviews();
    loadSummary();
  }, [itemId, itemType, sort]);

  // STAR DISPLAY
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // LOADING
  if (loading) {
    return (
      <section className="mt-10">
        <div className="animate-pulse space-y-3">
          <div className="h-7 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 border-t pt-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Reviews & Ratings
          </h2>
          <p className="text-gray-500 mt-1">See what other travelers think.</p>
        </div>

        {/* SORT */}
        <div className="flex items-center gap-2">
          <label htmlFor="review-sort" className="text-sm text-gray-600">
            Sort by
          </label>

          <select
            id="review-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-xl p-6 text-center">
            <div className="text-4xl font-bold">
              {summary.averageRating.toFixed(1)}
            </div>

            <div className="flex justify-center mt-2">
              {renderStars(Math.round(summary.averageRating))}
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {summary.totalReviews} Reviews
            </p>
          </div>

          {/* RATING BREAKDOWN */}
          <div className="md:col-span-2 border rounded-xl p-6">
            {[
              {
                rating: 5,
                count: summary.fiveStar,
              },
              {
                rating: 4,
                count: summary.fourStar,
              },
              {
                rating: 3,
                count: summary.threeStar,
              },
              {
                rating: 2,
                count: summary.twoStar,
              },
              {
                rating: 1,
                count: summary.oneStar,
              },
            ].map((item) => {
              const percentage =
                summary.totalReviews > 0
                  ? (item.count / summary.totalReviews) * 100
                  : 0;

              return (
                <div key={item.rating} className="flex items-center gap-3 mb-3">
                  <span className="w-8 text-sm">{item.rating}★</span>

                  <div
                    className="
                    flex-1
                    h-2
                    bg-gray-200
                    rounded-full
                    overflow-hidden
                  "
                  >
                    <div
                      className=" h-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-8 text-sm text-gray-500">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-8">
        {reviews.length === 0 ? (
          <div className="border rounded-xl p-8 text-center">
            <p className="text-gray-500">No reviews yet.</p>
            <p className="text-sm text-gray-400 mt-1 ">
              Be the first to review this{" "}
              {itemType === "HOTEL" ? "hotel." : "flight."}
            </p>
          </div>
        ) : (
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
      </div>
    </section>
  );
};

export default ReviewSection;
