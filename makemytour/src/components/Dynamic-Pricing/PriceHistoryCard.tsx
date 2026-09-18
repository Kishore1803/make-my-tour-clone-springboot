"use client";

interface PriceHistory {
  id: number;
  basePrice: number;
  dynamicPrice: number;
  changePercentage: number;
  reason: string;
  createdAt: string;
}

interface PriceHistoryCardProps {
  type: "flight" | "hotel";
  history: PriceHistory[];
  loading?: boolean;
}

const PriceHistoryCard = ({
  type,
  history,
  loading = false,
}: PriceHistoryCardProps) => {
  if (loading) {
    
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-16 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {type === "flight" ? "Flight Price History" : "Hotel Price History"}
          </p>

          <h3 className="mt-1 text-xl font-bold text-gray-900">
            Price Changes
          </h3>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <span>{type === "flight" ? "✈️" : "🏨"}</span>
        </div>
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="font-semibold text-gray-700">No Price History</p>
          <p className="mt-1 text-sm text-gray-500">
            Price changes will appear here when available.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {history.map((item) => {
            const priceDifference = item.dynamicPrice - item.basePrice;
            const isIncrease = priceDifference > 0;
            const date = new Date(item.createdAt);

            return (
              <div
                key={item.id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                {/* Price Row */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Current Price</p>
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      ₹{item.dynamicPrice.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="text-right">
                    {item.changePercentage !== 0 && (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isIncrease
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {isIncrease ? "+" : ""}
                        {item.changePercentage}%
                      </span>
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                      {date.toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Base Price */}
                <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
                  <span className="text-xs text-gray-500">Base Price</span>
                  <span className="text-sm font-medium text-gray-700">
                    ₹{item.basePrice.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Reason */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500">Reason</p>
                  <p className="mt-1 text-sm text-gray-700">{item.reason}</p>
                </div>

                {/* Difference */}
                {priceDifference !== 0 && (
                  <div className="mt-3">
                    <p
                      className={`text-xs font-medium ${
                        isIncrease ? "text-orange-600" : "text-green-600"
                      }`}
                    >
                      {isIncrease
                        ? `Price increased by ₹${Math.abs(
                            priceDifference,
                          ).toLocaleString("en-IN")}`
                        : `Price decreased by ₹${Math.abs(
                            priceDifference,
                          ).toLocaleString("en-IN")}`}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PriceHistoryCard;
