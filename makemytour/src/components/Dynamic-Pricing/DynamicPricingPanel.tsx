import { useCallback, useEffect, useState } from "react";
import {
  freezePrice,
  getCurrentPrice,
  getPriceHistory,
} from "@/api/pricingApi";
import type {
  ItemType,
  PriceHistoryPoint,
  PriceResponse,
  PriceFreezeResponse,
} from "../../types/pricing";

import PriceBreakdown from "./PriceBreakdown";
import PriceHistoryChart from "./PriceHistoryChart";
import PriceFreezeCard from "./PriceFreezeCard";

type Props = {
  type: ItemType;
  itemId: number | string;
  userId: number | string;
  pollIntervalMs?: number;
};

export default function DynamicPricingPanel({
  type,
  itemId,
  userId,
  pollIntervalMs = 10000,
}: Props) {
  const [price, setPrice] = useState<PriceResponse | null>(null),
    [history, setHistory] = useState<PriceHistoryPoint[]>([]),
    [loading, setLoading] = useState(true),
    [refreshing, setRefreshing] = useState(false),
    [error, setError] = useState("");

  const refresh = useCallback(
    async (initial = false) => {
      if (initial) setLoading(true);
      else setRefreshing(true);
      setError("");
      try {
        const [p, h] = await Promise.all([
          getCurrentPrice(type, itemId, userId),
          getPriceHistory(type, itemId),
        ]);
        setPrice(p);
        setHistory(h);
      } catch (e: any) {
        setError(
          e?.response?.data?.message ||
            e?.response?.data?.error ||
            e?.message ||
            "Could not load pricing. Check backend and pricing record.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [type, itemId, userId],
  );

  useEffect(() => {
    let alive = true;
    const run = (initial: boolean) => {
      if (alive) void refresh(initial);
    };
    run(true);
    const timer = window.setInterval(
      () => run(false),
      Math.max(5000, pollIntervalMs),
    );
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [refresh, pollIntervalMs]);

  const handleFreeze = async (): Promise<PriceFreezeResponse> => {
    const result = await freezePrice(type, itemId, userId);
    await refresh(false);
    return result;
  };

  if (loading)
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
        Loading live pricing…
      </div>
    );

  if (!price)
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
        <h3 className="font-semibold text-rose-900">Pricing unavailable</h3>
        <p className="mt-2 break-words text-sm text-rose-800">
          {error || "No pricing response received."}
        </p>
        <button
          onClick={() => void refresh(true)}
          className="mt-3 rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Dynamic pricing</h2>
          <p className="mt-1 text-sm text-slate-500">
            {type === "FLIGHT" ? "Flight" : "Hotel"} #{itemId} · automatic
            refresh
          </p>
        </div>
        <span className="text-xs text-slate-500">
          {refreshing ? "Updating…" : "● Live"}
        </span>
      </div>

      {error && (
        <p
          role="status"
          className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
        >
          {error} Showing last successful price.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PriceBreakdown price={price} />
        <PriceFreezeCard userId={userId} onFreeze={handleFreeze} />
      </div>
      <PriceHistoryChart history={history} />
    </section>
  );
}
