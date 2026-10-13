"use client";

import type { Refund } from "@/types/CancellationRefund";
import StatusBadge from "./StatusBadge";

interface RefundSummaryProps {
  refund: Refund;
  onViewDetails?: () => void;
}

export default function RefundSummary({
  refund,
  onViewDetails,
}: RefundSummaryProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const formatDate = (value?: string | null) => {
    if (!value) return "Not available";
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const isRefundApplicable = refund.refundAmount > 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-5 text-white sm:p-6">
        <p className="text-sm text-blue-100">Booking #{refund.bookingId}</p>
        <h2 className="mt-2 text-xl font-bold">Refund Summary</h2>
        <p className="mt-1 text-sm text-blue-100">{refund.bookingType}</p>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {/* Refund amount */}
        <div className="rounded-xl bg-gray-50 p-5 text-center">
          <p className="text-sm font-medium text-gray-600">Refund Amount</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatCurrency(refund.refundAmount)}
          </p>

          <div className="mt-3 flex justify-center">
            <StatusBadge status={refund.refundStatus} />
          </div>
        </div>

        {/* Amount breakdown */}
        <div className="space-y-4">
          <SummaryRow
            label="Original Booking Amount"
            value={formatCurrency(refund.bookingAmount)}
          />

          <SummaryRow
            label="Refund Percentage"
            value={`${refund.refundPercentage}%`}
          />

          <SummaryRow
            label="Refund Requested"
            value={formatDate(refund.requestedAt)}
          />

          <SummaryRow
            label="Expected Timeline"
            value={
              isRefundApplicable
                ? refund.expectedTimeline || "Awaiting confirmation"
                : "No refund applicable"
            }
          />

          {refund.completedAt && (
            <SummaryRow
              label="Completed At"
              value={formatDate(refund.completedAt)}
            />
          )}
        </div>

        {/* Information message */}
        <div
          className={`rounded-xl p-4 ${
            isRefundApplicable
              ? "bg-blue-50 text-blue-800"
              : "bg-gray-50 text-gray-700"
          }`}
        >
          <p className="text-sm leading-6">
            {isRefundApplicable
              ? "Your refund request has been recorded. The displayed status reflects the backend record; actual payment processing depends on your payment provider."
              : "No refund amount is applicable to this booking under the current refund calculation."}
          </p>
        </div>

        {/* Optional action */}
        {onViewDetails && (
          <button
            type="button"
            onClick={onViewDetails}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            View Refund Details
          </button>
        )}
      </div>
    </section>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="break-words text-sm font-semibold text-gray-900 sm:text-right">
        {value}
      </span>
    </div>
  );
}
