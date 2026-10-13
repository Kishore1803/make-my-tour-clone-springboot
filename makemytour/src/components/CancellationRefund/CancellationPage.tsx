"use client";

import { useCallback, useEffect, useState } from "react";
import { getUserCancellations } from "@/api/cancellationRefundApi";
import type {
  Cancellation,
  BookingDetails as Booking,
} from "@/types/CancellationRefund";

import PageHeader from "@/components/CancellationRefund/PageHearder";
import BookingDetails from "@/components/CancellationRefund/BookingDetails";
import CancellationForm from "@/components/CancellationRefund/CancellationForm";
import CancellationHistory from "@/components/CancellationRefund/CancellationHistory";

// Replace this with the logged-in user's actual ID.
const USER_ID = 1;

export default function CancellationPage() {
  const [cancellations, setCancellations] = useState<Cancellation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  // Replace with bookings loaded from your existing booking API/context.
  const [bookings] = useState<Booking[]>([]);

  const fetchCancellations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getUserCancellations(USER_ID);
      setCancellations(data);
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof err.message === "string"
          ? err.message
          : "Please check your backend connection and try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCancellations();
  }, [fetchCancellations]);

  const handleCancellationSuccess = (cancellation: Cancellation) => {
    setCancellations((previous) => [
      cancellation,
      ...previous.filter((item) => item.id !== cancellation.id),
    ]);

    setSelectedBooking(null);
    // Refresh history so the page reflects the backend's saved records.
    void fetchCancellations();
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Manage Cancellations"
          description="Cancel your bookings and track your cancellation history."
        />

        {/* Booking list */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Your Bookings
          </h2>

          {bookings.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
              No bookings are loaded. Connect your existing booking API or
              booking context here to display cancellable bookings.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {bookings.map((booking) => (
                <BookingDetails
                  key={`${booking.type}-${booking.bookingId}`}
                  booking={booking}
                  onCancel={setSelectedBooking}
                />
              ))}
            </div>
          )}
        </section>

        {/* Cancellation form */}
        {selectedBooking && (
          <section className="mb-10">
            <CancellationForm
              userId={USER_ID}
              booking={selectedBooking}
              onSuccess={handleCancellationSuccess}
              onClose={() => setSelectedBooking(null)}
            />
          </section>
        )}

        {/* Cancellation history */}
        <CancellationHistory
          cancellations={cancellations}
          loading={loading}
          error={error}
          onRetry={fetchCancellations}
        />
      </div>
    </main>
  );
}
