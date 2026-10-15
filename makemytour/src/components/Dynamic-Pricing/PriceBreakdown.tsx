import type { PriceResponse } from "../../types/pricing";
const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export default function PriceBreakdown({ price }: { price: PriceResponse }) {
  const rows = [
    ["Base price", price.basePrice],
    ["Demand adjustment", price.demandAmount],
    ["Seasonal adjustment", price.seasonalAmount],
    ["Holiday surcharge", price.holidayAmount],
  ] as const;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Current booking price</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {money(price.finalPrice)}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${price.frozen ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}
        >
          {price.frozen ? "Price protected" : "Live price"}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {rows.map(([label, amount]) => (
          <div key={label} className="flex justify-between gap-4 text-sm">
            <span className="text-slate-600">{label}</span>
            <span
              className={`font-medium ${amount > 0 ? "text-rose-600" : amount < 0 ? "text-emerald-700" : "text-slate-800"}`}
            >
              {amount > 0 ? "+" : ""}
              {money(amount)}
            </span>
          </div>
        ))}
      </div>
      
      <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">
        Prices are calculated from the base price and adjustments. Holiday
        surcharge is 20% when enabled by the backend.
      </p>
      {price.updatedAt && (
        <p className="mt-2 text-xs text-slate-400">
          Updated: {new Date(price.updatedAt).toLocaleString()}
        </p>
      )}
    </section>
  );
}
