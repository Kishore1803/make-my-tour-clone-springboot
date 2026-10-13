"use client";

import StatusBadge from "./StatusBadge";
import type { Cancellation } from "@/types/CancellationRefund";

interface CancellationHistoryProps {
  cancellations: Cancellation[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (date: string) => {
  if (!date) return "—";
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;
  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function CancellationHistory({
  cancellations,
  loading = false,
  error = null,
  onRetry,
}: CancellationHistoryProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        <p className="mt-3 text-sm text-gray-600">
          Loading cancellation history...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">
          Unable to load cancellation history
        </p>
        <p className="mt-2 text-sm text-red-600">{error}</p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (cancellations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <div className="text-4xl" aria-hidden="true">
          📋
        </div>

        <h3 className="mt-3 text-lg font-semibold text-gray-900">
          No cancellations yet
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Your cancelled bookings will appear here.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4" aria-label="Cancellation history">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          Cancellation History
        </h2>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
          {cancellations.length}{" "}
          {cancellations.length === 1 ? "record" : "records"}
        </span>
      </div>

      {cancellations.map((cancellation) => (
        <article
          key={cancellation.id}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Booking ID
              </p>

              <h3 className="mt-1 text-lg font-bold text-gray-900">
                #{cancellation.bookingId}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {cancellation.bookingType}
              </p>
            </div>

            <StatusBadge status={cancellation.status} />
          </div>

          <div className="my-5 grid grid-cols-1 gap-4 border-y border-gray-100 py-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">Booking Amount</p>
              <p className="mt-1 font-semibold text-gray-900">
                {formatCurrency(cancellation.bookingAmount)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Refund Amount</p>
              <p className="mt-1 font-semibold text-green-700">
                {formatCurrency(cancellation.refundAmount)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Refund Percentage</p>
              <p className="mt-1 font-semibold text-gray-900">
                {cancellation.refundPercentage}%
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">
              Cancellation Reason
            </p>

            <p className="mt-1 text-sm text-gray-600">
              {cancellation.reason || "No reason provided"}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Cancelled On</p>
            <p className="mt-1 text-sm font-medium text-gray-800">
              {formatDate(cancellation.cancelledAt)}
            </p>
          </div>

          {cancellation.refundAmount > 0 && (
            <div className="mt-5 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                Refund record amount:{" "}
                <strong>{formatCurrency(cancellation.refundAmount)}</strong>
              </p>

              <p className="mt-1 text-xs text-blue-700">
                This amount does not confirm that the money has been transferred
                to your account.
              </p>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
