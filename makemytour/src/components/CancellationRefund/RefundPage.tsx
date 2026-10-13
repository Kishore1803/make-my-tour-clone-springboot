"use client";

import { useCallback, useEffect, useState } from "react";
import { getUserRefunds } from "@/api/cancellationRefundApi";
import type { Refund } from "@/types/CancellationRefund";

import PageHeader from "@/components/CancellationRefund/PageHearder";
import RefundSummary from "@/components/CancellationRefund/RefundSummary";

// Replace with the actual logged-in user's ID.
const USER_ID = 1;

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRefunds = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getUserRefunds(USER_ID);
      setRefunds(data);
    } catch {
      setError(
        "Unable to load refunds. Please check your backend connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRefunds();
  }, [fetchRefunds]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="My Refunds"
          description="Track your refund amounts, processing status, and expected timelines."
        />

        {/* Summary */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Total Refund Records</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {refunds.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Total Refund Amount</p>
            <p className="mt-2 text-2xl font-bold text-green-700">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
              }).format(
                refunds.reduce(
                  (total, refund) => total + refund.refundAmount,
                  0,
                ),
              )}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Pending Refunds</p>
            <p className="mt-2 text-2xl font-bold text-amber-600">
              {
                refunds.filter((refund) =>
                  ["PENDING", "PROCESSING"].includes(
                    refund.refundStatus.toUpperCase(),
                  ),
                ).length
              }
            </p>
          </div>
        </section>

        {/* Refund history */}
        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900">Refund History</h2>

            <button
              type="button"
              onClick={() => void fetchRefunds()}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600">
              Loading refunds...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={() => void fetchRefunds()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : refunds.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
              <p className="text-lg font-semibold text-gray-900">
                No refunds found
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Your refund records will appear here when available.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {refunds.map((refund) => (
                <RefundSummary key={refund.id} refund={refund} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
