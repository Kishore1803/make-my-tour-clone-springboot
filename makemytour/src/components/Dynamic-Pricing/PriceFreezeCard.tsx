import { useEffect, useState } from "react";
import type { PriceFreezeResponse } from "../../types/pricing";

function remaining(expiresAt: string) {
  const s = Math.max(
    0,
    Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
  );
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export default function PriceFreezeCard({
  userId,
  onFreeze,
}: {
  userId: number | string;
  onFreeze: () => Promise<PriceFreezeResponse>;
}) {
  const [freeze, setFreeze] = useState<PriceFreezeResponse | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const active = !!freeze &&
    freeze.status === "ACTIVE" &&
    new Date(freeze.expiresAt).getTime() > now;
  async function submit() {
    setBusy(true);
    setError("");
    try {
      setFreeze(await onFreeze());
    } catch (e: any) {
      setError(
        e?.response?.data?.message || e?.message || "Unable to freeze price",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold">🔒 Freeze this price</h3>
      <p className="mt-1 text-sm text-slate-500">
        Lock the current quote for 30 minutes while you decide.
      </p>

      {active ? (
        <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          Price locked · Time remaining: <b>{remaining(freeze!.expiresAt)}</b>
          <p className="mt-1">
            Locked price: ₹{Number(freeze!.lockedPrice).toLocaleString("en-IN")}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={submit}
          disabled={busy || !userId}
          className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {busy ? "Locking price…" : "Freeze price for 30 minutes"}
        </button>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-rose-600">
          {error}
        </p>
      )}
      {!userId && (
        <p className="mt-2 text-xs text-slate-500">
          Sign in to freeze a price.
        </p>
      )}
    </section>
  );
}
