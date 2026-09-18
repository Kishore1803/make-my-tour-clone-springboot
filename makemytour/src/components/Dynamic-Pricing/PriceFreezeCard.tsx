"use client";

interface PriceFreezeCardProps {
  type: "flight" | "hotel";
  frozenPrice: number;
  createdAt: string;
  expiresAt: string;
  status: string;
  onFreeze?: () => void;
  loading?: boolean;
}

const PriceFreezeCard = ({
  type,
  frozenPrice,
  createdAt,
  expiresAt,
  status,
  onFreeze,
  loading = false,
}: PriceFreezeCardProps) => {
  const isActive = status.toUpperCase() === "ACTIVE";
  const formatDate = (dateValue: string) => {
    if (!dateValue) {
      return "-";
    }

    return new Date(dateValue).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-5 h-10 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mt-5 space-y-3">
          <div className="h-5 animate-pulse rounded bg-gray-100" />
          <div className="h-5 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {type === "flight" ? "Flight Price Freeze" : "Hotel Price Freeze"}
          </p>

          <h3 className="mt-1 text-xl font-bold text-gray-900">
            {isActive ? "Price Protected" : "Price Freeze Expired"}
          </h3>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isActive ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          <span>{type === "flight" ? "✈️" : "🏨"}</span>
        </div>
      </div>

      {/* Status */}
      <div className="mt-5">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Frozen Price */}
      <div className="mt-5 rounded-xl bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Frozen Price</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">
          ₹{frozenPrice.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Details */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Frozen On</span>
          <span className="text-sm font-medium text-gray-700">
            {formatDate(createdAt)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Expires On</span>
          <span className="text-sm font-medium text-gray-700">
            {formatDate(expiresAt)}
          </span>
        </div>
      </div>

      {/* Active Message */}
      {isActive && (
        <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-3">
          <p className="text-sm font-medium text-green-700">
            Your price is protected until the expiry time.
          </p>
        </div>
      )}

      {/* Expired Message */}
      {!isActive && (
        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm text-gray-600">
            This price freeze is no longer active.
          </p>
        </div>
      )}

      {/* Freeze Again */}
      {onFreeze && !isActive && (
        <button
          type="button"
          onClick={onFreeze}
          className="mt-5 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Freeze Current Price
        </button>
      )}
    </div>
  );
};

export default PriceFreezeCard;
