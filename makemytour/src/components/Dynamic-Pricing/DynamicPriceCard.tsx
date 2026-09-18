"use client";

interface DynamicPriceCardProps {
  type: "flight" | "hotel";
  basePrice: number;
  currentPrice: number;
  changePercentage?: number;
  reason?: string;
  loading?: boolean;
  onFreeze?: () => void;
  freezeLoading?: boolean;
  isFrozen?: boolean;
}

const DynamicPriceCard = ({
  type,
  basePrice,
  currentPrice,
  changePercentage = 0,
  reason = "Normal pricing",
  loading = false,
  onFreeze,
  freezeLoading = false,
  isFrozen = false,
}: DynamicPriceCardProps) => {
  const priceDifference = currentPrice - basePrice;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {type === "flight" ? "Flight Dynamic Price" : "Hotel Dynamic Price"}
          </p>

          <h3 className="mt-1 text-lg font-bold text-gray-900">
            Current Price
          </h3>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <span className="text-lg">{type === "flight" ? "✈️" : "🏨"}</span>
        </div>
      </div>

      {/* Current Price */}
      <div className="mt-6">
        {loading ? (
          <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-gray-900">
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>
            {changePercentage !== 0 && (
              <span
                className={`mb-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  changePercentage > 0
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {changePercentage > 0 ? "+" : ""}
                {changePercentage}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* Base Price */}
      {!loading && (
        <div className="mt-4 flex items-center justify-between border-b border-gray-100 pb-4">
          <span className="text-sm text-gray-500">Base Price</span>
          <span className="text-sm font-semibold text-gray-700">
            ₹{basePrice.toLocaleString("en-IN")}
          </span>
        </div>
      )}

      {/* Price Difference */}
      {!loading && priceDifference !== 0 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">Price Change</span>
          <span className={`text-sm font-semibold ${
            priceDifference > 0 ? "text-orange-600" : "text-green-600"
            }`}
          >
            {priceDifference > 0 ? "+" : ""}₹
            {priceDifference.toLocaleString("en-IN")}
          </span>
        </div>
      )}

      {/* Reason */}
      {!loading && (
        <div className="mt-4 rounded-xl bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-500">Pricing Reason</p>
          <p className="mt-1 text-sm font-medium text-gray-700">{reason}</p>
        </div>
      )}

      {/* Freeze Button */}
      {onFreeze && !loading && (
        <button
          type="button"
          onClick={onFreeze}
          disabled={freezeLoading || isFrozen}
          className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isFrozen
              ? "cursor-not-allowed bg-green-100 text-green-700"
              : "bg-gray-900 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          }`}
        >
          {freezeLoading
            ? "Freezing Price..."
            : isFrozen
              ? "✓ Price Frozen"
              : "Freeze Price"}
        </button>
      )}

      {/* Freeze Information */}
      {isFrozen && (
        <p className="mt-3 text-center text-xs text-green-600">
          Your current price is protected for the selected period.
        </p>
      )}
    </div>
  );
};

export default DynamicPriceCard;
