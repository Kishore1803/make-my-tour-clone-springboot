import type { PriceHistoryPoint } from "../../types/pricing";

const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function PriceHistoryChart({
  history,
}: {
  history: PriceHistoryPoint[];
}) {
  
  const points = [...history]
    .filter((p) => Number.isFinite(Number(p.finalPrice)))
    .sort(
      (a, b) =>
        new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
    )
    .slice(-30);

  if (points.length < 2)
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold">Price history</h3>
        <p className="mt-2 text-sm text-slate-500">
          History graph appears after at least two price snapshots are saved by
          the backend.
        </p>
      </section>
    );

  const values = points.map((p) => Number(p.finalPrice)),
    min = Math.min(...values),
    max = Math.max(...values),
    range = Math.max(max - min, 1),
    w = 640,
    h = 190,
    pad = 18;
  const coords = values.map((v, i) => ({
    x: pad + (i * (w - 2 * pad)) / (values.length - 1),
    y: h - pad - ((v - min) / range) * (h - 2 * pad),
  }));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <h3 className="font-semibold">Price history</h3>
        <span className="text-xs text-slate-500">
          {points.length} snapshots
        </span>
      </div>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Booking price history chart"
        className="mt-4 h-auto w-full"
      >
        {[0, 0.5, 1].map((f) => (
          <line
            key={f}
            x1={pad}
            x2={w - pad}
            y1={pad + f * (h - 2 * pad)}
            y2={pad + f * (h - 2 * pad)}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />
        ))}

        <polyline
          points={coords.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {coords.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#2563eb">
            <title>
              {money(values[i])} —{" "}
              {new Date(points[i].recordedAt).toLocaleString()}
            </title>
          </circle>
        ))}
      </svg>

      <div className="flex justify-between text-xs text-slate-500">
        <span>Low: {money(min)}</span>
        <span>High: {money(max)}</span>
      </div>
      <div className="mt-4 max-h-36 space-y-2 overflow-y-auto">
        {[...points]
          .reverse()
          .slice(0, 5)
          .map((p, i) => (
            <div
              key={`${p.recordedAt}-${i}`}
              className="flex justify-between gap-3 text-xs"
            >
              <span className="text-slate-500">
                {new Date(p.recordedAt).toLocaleString()}
              </span>
              <b>{money(Number(p.finalPrice))}</b>
            </div>
          ))}
      </div>
    </section>
  );
}
