import { useEffect, useState } from "react";
import { freezePrice, getPriceFreeze } from "@/api/PricingApi";
import type { ItemType, PriceFreezeResponse } from "@/types/pricing";

interface Props {
  type: ItemType;
  itemId: number;
  userId: number;
  onFrozen: () => void;
}

export default function PriceFreezeCard({
  type,
  itemId,
  userId,
  onFrozen,
}: Props) {
  const [freeze, setFreeze] = useState<PriceFreezeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!freeze?.freezeId || freeze.status !== "ACTIVE") return;

    let cancelled = false;

    const check = async () => {
      try {
        const latest = await getPriceFreeze(freeze.freezeId);
        if (!cancelled) setFreeze(latest);
      } catch {
        // Keep the last known status if the request fails.
      }
    };

    const timer = window.setInterval(() => void check(), 15000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [freeze?.freezeId, freeze?.status]);

  useEffect(() => {
    if (!freeze?.expiresAt || freeze.status !== "ACTIVE") {
      setRemaining("");
      return;
    }

    const update = () => {
      const milliseconds = new Date(freeze.expiresAt).getTime() - Date.now();

      if (milliseconds <= 0) {
        setRemaining("Expiry reached — checking status...");
        return;
      }

      const seconds = Math.floor(milliseconds / 1000);
      setRemaining(
        `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s remaining`,
      );
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [freeze?.expiresAt, freeze?.status]);

  const handleFreeze = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await freezePrice(type, itemId, userId);
      setFreeze(result);
      onFrozen();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to freeze the price. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const active =
    freeze?.status === "ACTIVE" &&
    new Date(freeze.expiresAt).getTime() > Date.now();

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">
          🔒
        </span>
        <div>
          <h3 className="font-semibold text-gray-900">Freeze your price</h3>
          <p className="mt-1 text-sm text-gray-500">
            Lock your quoted price for 30 minutes.
          </p>
        </div>
      </div>

      {active && freeze ? (
        <div className="mt-4 rounded-xl bg-green-50 p-4 text-green-800">
          <p className="font-semibold">Price freeze active</p>
          <p className="mt-2 text-xl font-bold">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 2,
            }).format(freeze.lockedPrice)}
          </p>
          <p className="mt-2 text-sm">{remaining}</p>
          <p className="mt-1 text-xs">
            Expires: {new Date(freeze.expiresAt).toLocaleString("en-IN")}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => void handleFreeze()}
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Freezing price..."
            : freeze?.status === "EXPIRED"
              ? "Freeze price again"
              : "Freeze current price"}
        </button>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <p className="mt-4 text-xs leading-5 text-gray-500">
        Freezing a price does not book the flight or hotel. Checkout must
        validate the freeze before accepting the locked amount.
      </p>
    </section>
  );
}
