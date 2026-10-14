import { useCallback, useEffect, useState } from "react";
import { getCurrentPrice, getPriceHistory } from "@/api/PricingApi";

import type {
  ItemType,
  PriceResponse,
  PriceHistoryPoint,
} from "@/types/pricing";

import PriceBreakdown from "./PriceBreakdown";
import PriceHistoryChart from "./PriceHistoryChart";
import PriceFreezeCard from "./PriceFreezeCard";

interface Props {
  type: ItemType;
  itemId: number;
  userId: number;
}

export default function DynamicPricingPanel({ type, itemId, userId }: Props) {
  const [price, setPrice] = useState<PriceResponse | null>(null);
  const [history, setHistory] = useState<PriceHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [current, records] = await Promise.all([
        getCurrentPrice(type, itemId, userId),
        getPriceHistory(type, itemId),
      ]);

      setPrice(current);
      setHistory(Array.isArray(records) ? records : []);
      setError("");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to load pricing. Check the backend and item ID.",
      );
    } finally {
      setLoading(false);
    }
  }, [type, itemId, userId]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const [current, records] = await Promise.all([
          getCurrentPrice(type, itemId, userId),
          getPriceHistory(type, itemId),
        ]);

        if (!cancelled) {
          setPrice(current);
          setHistory(Array.isArray(records) ? records : []);
          setError("");
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              "Unable to load pricing information.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    const timer = window.setInterval(() => {
      if (!cancelled) void refresh();
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [type, itemId, userId, refresh]);

  if (loading && !price) {
    return (
      <div className="animate-pulse rounded-2xl bg-white p-6">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="mt-5 h-36 rounded bg-gray-100" />
      </div>
    );
  }

  if (!price) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p role="alert" className="text-sm text-red-700">
          {error || "Pricing information is unavailable."}
        </p>

        <button
          onClick={() => void refresh()}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            MakeMyTour
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Dynamic pricing
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Transparent prices, history, and temporary price protection.
          </p>
        </div>

        <button
          onClick={() => void refresh()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
        >
          Refresh price
        </button>
      </div>

      {error && (
        <p
          role="status"
          className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
        >
          Refresh failed. Displaying the last loaded price.
        </p>
      )}

      <PriceBreakdown price={price} />
      <PriceHistoryChart history={history} />
      <PriceFreezeCard
        type={type}
        itemId={itemId}
        userId={userId}
        onFrozen={() => void refresh()}
      />

      <p className="text-xs text-gray-500">
        Prices refresh every 30 seconds while this component is open. Actual
        price changes depend on updates from the backend.
      </p>
    </section>
  );
}
