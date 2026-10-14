import type { PriceResponse } from "@/types/pricing";

interface Props {
  price: PriceResponse;
}

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value ?? 0);

export default function PriceBreakdown({ price }: Props) {
  const items = [
    { label: "Base price", value: price.basePrice },
    { label: "Demand adjustment", value: price.demandAmount },
    { label: "Seasonal adjustment", value: price.seasonalAmount },
    { label: "Holiday adjustment (20%)", value: price.holidayAmount },
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">Current booking price</p>
          <h2 className="mt-1 text-3xl font-bold text-gray-900">
            {money(price.finalPrice)}
          </h2>
        </div>

        {price.frozen && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Price Frozen
          </span>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between gap-4 text-sm">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-medium text-gray-900">
              {money(item.value)}
            </span>
          </div>
        ))}

        <div className="flex justify-between border-t pt-4 font-bold">
          <span>Final price</span>
          <span className="text-blue-600">{money(price.finalPrice)}</span>
        </div>
      </div>

      {price.updatedAt && (
        <p className="mt-4 text-xs text-gray-500">
          Updated: {new Date(price.updatedAt).toLocaleString("en-IN")}
        </p>
      )}
    </section>
  );
}
