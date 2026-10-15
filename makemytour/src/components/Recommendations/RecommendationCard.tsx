import { useState } from "react";
import { ThumbsUp, ThumbsDown, Info, MapPin } from "lucide-react";
import type { Recommendation } from "@/api/recommendationApi";

import { useRouter } from "next/navigation";

type Props = {
  item: Recommendation;
  onFeedback: (itemId: number, helpful: boolean) => Promise<void>;
  onSelect: (item: Recommendation) => void;
};

export default function RecommendationCard({
  item,
  onFeedback,
  onSelect,
}: Props) {
  const [showReason, setShowReason] = useState(false);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submitFeedback = async (helpful: boolean) => {
    try {
      setSubmitting(true);
      await onFeedback(item.id, helpful);
      setFeedback(helpful);
    } finally {
      setSubmitting(false);
    }
  };

  const router = useRouter();

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-sky-50 text-sky-700">
          <MapPin size={36} />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
              {item.type}
            </p>
            <h3 className="mt-1 text-lg font-bold text-gray-900">
              {item.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{item.destination}</p>
          </div>

          <button
            type="button"
            title="Why this recommendation?"
            aria-label="Why this recommendation?"
            onClick={() => setShowReason((current) => !current)}
            className="rounded-full border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
          >
            <Info size={18} />
          </button>
        </div>

        {showReason && (
          <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
            <strong>Why this recommendation?</strong>
            <p className="mt-1">{item.reason}</p>
          </div>
        )}

        {item.description && (
          <p className="mt-3 line-clamp-2 text-sm text-gray-600">
            {item.description}
          </p>
        )}

        {item.price != null && (
          <p className="mt-3 font-semibold text-gray-900">
            From ₹{Number(item.price).toLocaleString("en-IN")}
          </p>
        )}

        <button
          type="button"
          onClick={() => router.push("/explore")}
          className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700"
        >
          Explore
        </button>

        <div className="mt-4 border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500">
            Was this recommendation useful?
          </p>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => void submitFeedback(true)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                feedback === true
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              <ThumbsUp size={15} />
              Helpful
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => void submitFeedback(false)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                feedback === false
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              <ThumbsDown size={15} />
              Not relevant
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
