import { useEffect, useState } from "react";
import { freezePrice, getPriceFreeze } from "@/api/PricingApi";
import type { ItemType, PriceFreezeResponse } from "@/types/pricing";

interface Props {
  type: ItemType;
  itemId: number;
  userId: number;
  onFrozen: () => void;
}

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

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
    if (!freeze || freeze.status !== "ACTIVE") return;
    let cancelled = false;

    const checkStatus = async () => {
      try {
        const data = await getPriceFreeze(freeze.freezeId);
        if (!cancelled) setFreeze(data);
      } catch {
        // Keep last known status during a temporary network error.
      }
    };

    const timer = window.setInterval(() => void checkStatus(), 15000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [freeze?.freezeId, freeze?.status]);

  useEffect(() => {
    if (!freeze || freeze.status !== "ACTIVE") {
      setRemaining("");
      return;
    }

    const updateCountdown = () => {
      const ms = new Date(freeze.expiresAt).getTime() - Date.now();

      if (ms <= 0) {
        setRemaining("Checking expiry...");
        return;
      }

      const seconds = Math.floor(ms / 1000);

      setRemaining(
        `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(
          2,
          "0",
        )}s remaining`,
      );
    };

    updateCountdown();

    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, [freeze?.expiresAt, freeze?.status]);

  const handleFreeze = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await freezePrice(type, itemId, userId);
      setFreeze(data);
      onFrozen();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Unable to freeze price. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isActive =
    freeze?.status === "ACTIVE" &&
    new Date(freeze.expiresAt).getTime() > Date.now();

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900">🔒 Freeze your price</h3>
      <p className="mt-1 text-sm text-gray-500">
        Lock the current quote for 30 minutes.
      </p>

      {isActive && freeze ? (
        <div className="mt-4 rounded-xl bg-green-50 p-4">
          <p className="font-semibold text-green-800">Price freeze active</p>
          <p className="mt-2 text-2xl font-bold text-green-900">
            {money(freeze.lockedPrice)}
          </p>
          <p className="mt-2 text-sm text-green-800">{remaining}</p>
          <p className="mt-1 text-xs text-green-800">
            Expires: {new Date(freeze.expiresAt).toLocaleString("en-IN")}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => void handleFreeze()}
          disabled={loading || userId <= 0}
          className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Freezing price..." : "Freeze current price"}
        </button>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <p className="mt-4 text-xs text-gray-500">
        A freeze does not book the ticket or room. Checkout must validate the
        freeze on the backend.
      </p>
    </section>
  );
}
