import type { PriceHistoryPoint } from "@/types/pricing";

interface Props {
  history: PriceHistoryPoint[];
}

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function PriceHistoryChart({ history }: Props) {
  const points = [...history]
    .filter((item) => Number.isFinite(Number(item.finalPrice)))
    .sort(
      (a, b) =>
        new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
    )
    .slice(-30);

  if (points.length === 0) {
    return (
      <section className="rounded-2xl border bg-white p-5">
        <h3 className="text-lg font-bold">Price history</h3>
        <p className="mt-2 text-sm text-gray-500">
          No price history available yet.
        </p>
      </section>
    );
  }

  const width = 600;
  const height = 240;
  const padding = 35;
  const values = points.map((p) => Number(p.finalPrice));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const coordinates = points.map((point, index) => ({
    x:
      points.length === 1
        ? width / 2
        : padding + (index / (points.length - 1)) * (width - padding * 2),
    y:
      height -
      padding -
      ((Number(point.finalPrice) - min) / range) * (height - padding * 2),
  }));
  const path = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900">Price history</h3>

      <p className="mt-1 text-sm text-gray-500">
        Last {points.length} recorded prices
      </p>

      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[400px]"
          role="img"
          aria-label="Booking price history chart"
        >
          {[0, 1, 2, 3].map((n) => {
            const y = padding + (n / 3) * (height - padding * 2);

            return (
              <line
                key={n}
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="4 4"
              />
            );
          })}

          <path
            d={path}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {coordinates.map((point, index) => (
            <circle
              key={`${points[index].recordedAt}-${index}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#2563eb"
            >
              <title>
                {new Date(points[index].recordedAt).toLocaleString("en-IN")} —{" "}
                {money(Number(points[index].finalPrice))}
              </title>
            </circle>
          ))}
        </svg>
      </div>

      <div className="mt-3 flex justify-between text-sm text-gray-600">
        <span>
          Lowest: <b>{money(min)}</b>
        </span>
        <span>
          Highest: <b>{money(max)}</b>
        </span>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Historical values are recorded prices, not future predictions.
      </p>
    </section>
  );
}
