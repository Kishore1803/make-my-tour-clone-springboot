import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getRecommendations,
  sendRecommendationFeedback,
  recordRecommendationInteraction,
} from "@/api/recommendationApi";
import type { Recommendation } from "@/api/recommendationApi";
import RecommendationCard from "./RecommendationCard";

type Props = {
  userId: number | string;
};

export default function RecommendationSection({ userId }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<Recommendation[]>([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getRecommendations(userId, type || undefined);
        if (active) setItems(data);
      } catch (err) {
        console.error("Recommendation loading failed:", err);
        if (active) setError("Unable to load recommendations.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [userId, type]);

  const handleFeedback = async (itemId: number, helpful: boolean) => {
    await sendRecommendationFeedback(userId, itemId, helpful);
  };

  const handleSelect = async (item: Recommendation) => {
    try {
      await recordRecommendationInteraction(userId, item.id, "CLICK");
    } catch (error) {
      console.error("Unable to record interaction:", error);
    }

    const route =
      item.type.toUpperCase() === "HOTEL"
        ? "/hotels"
        : item.type.toUpperCase() === "FLIGHT"
          ? "/flights"
          : "/destinations";

    void router.push({
      pathname: route,
      query: {
        destination: item.destination,
        recommendationId: item.id,
      },
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          Made for you
        </p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          Recommended for You
        </h2>
        <p className="mt-2 text-gray-600">
          Discover trips selected based on your travel interests.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { label: "All", value: "" },
          { label: "Destinations", value: "DESTINATION" },
          { label: "Hotels", value: "HOTEL" },
          { label: "Flights", value: "FLIGHT" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setType(option.value)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              type === option.value
                ? "border-red-600 bg-red-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-10 text-center text-gray-500">
          Finding recommendations for you...
        </p>
      ) : error ? (
        <p className="py-10 text-center text-red-600">{error}</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h3 className="font-semibold text-gray-800">
            No recommendations yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Explore destinations and your personalized suggestions will appear
            here as travel data becomes available.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <RecommendationCard
              key={item.id}
              item={item}
              onFeedback={handleFeedback}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </section>
  );
}
