import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API_BASE_URL = "https://make-my-tour-clone-springboot-backend.onrender.com";

type Booking = {
  bookingId: string | number;
  type?: string;
  date?: string;
  quantity?: number;
  totalPrice?: number;
  selectedSeat?: string;
  cancellationStatus?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  refundAmount?: number;
  refundStatus?: string;
};

type RootState = {
  user: {
    user: {
      id?: number | string;
      bookings?: Booking[];
    } | null;
  };
};

export default function ManageCancellationPage() {
  const user = useSelector((state: RootState) => state.user.user);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [reason, setReason] = useState("Change of plans");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setBookings(user?.bookings ?? []);
  }, [user?.bookings]);

  const handleCancel = async () => {
    if (!user?.id || !selected) {
      setError("Please log in and select a booking.");
      return;
    }

    if (
      ["CANCELLED", "COMPLETED"].includes(
        (selected.cancellationStatus ?? "").toUpperCase(),
      )
    ) {
      setError("This booking cannot be cancelled.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // This endpoint must exist in your Spring Boot backend.
      await axios.post(`${API_BASE_URL}/booking/cancel`, null, {
        params: {
          userId: user.id,
          bookingId: selected.bookingId,
          type: selected.type ?? "FLIGHT",
          reason: details.trim() ? `${reason}: ${details.trim()}` : reason,
        },
      });

      setBookings((previous) =>
        previous.map((booking) =>
          booking.bookingId === selected.bookingId &&
          booking.type === selected.type
            ? {
                ...booking,
                cancellationStatus: "CANCELLED",
                cancellationReason: details.trim()
                  ? `${reason}: ${details.trim()}`
                  : reason,
              }
            : booking,
        ),
      );

      setMessage(
        "Cancellation request submitted. Check your booking status for updates.",
      );
      setSelected(null);
      setDetails("");
    } catch (err) {
      console.error("Cancellation error:", err);
      setError(
        "Cancellation failed. Please check the backend cancellation API and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Cancellations
          </h1>
          <p className="mt-3 text-gray-600">
            Please log in to view and manage your bookings.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            MAKEMYTOUR · MY BOOKINGS
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Manage Cancellations
          </h1>
          <p className="mt-2 text-gray-600">
            Review your bookings and submit a cancellation request.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No bookings found
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your bookings will appear here when available in your account.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => {
              const status = (
                booking.cancellationStatus ?? "BOOKED"
              ).toUpperCase();
              const cancelled = status === "CANCELLED";
              const unavailable = cancelled || status === "COMPLETED";

              return (
                <article
                  key={`${booking.type ?? "BOOKING"}-${booking.bookingId}-${index}`}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase text-blue-700">
                        {booking.type ?? "Booking"}
                      </span>

                      <h2 className="mt-3 text-lg font-bold text-gray-900">
                        Booking #{booking.bookingId}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {booking.date
                          ? `Travel date: ${booking.date}`
                          : "Travel date not available"}
                      </p>

                      {booking.selectedSeat && (
                        <p className="mt-1 text-sm text-gray-600">
                          Seat: {booking.selectedSeat}
                        </p>
                      )}

                      <p className="mt-2 font-semibold text-gray-900">
                        ₹
                        {Number(booking.totalPrice ?? 0).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          cancelled
                            ? "bg-red-50 text-red-700"
                            : status === "COMPLETED"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-green-50 text-green-700"
                        }`}
                      >
                        {status}
                      </span>

                      <div className="mt-4">
                        <button
                          disabled={unavailable}
                          onClick={() => {
                            setSelected(booking);
                            setError("");
                            setMessage("");
                          }}
                          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                          {cancelled
                            ? "Already Cancelled"
                            : status === "COMPLETED"
                              ? "Booking Completed"
                              : "Cancel Booking"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {cancelled && booking.cancellationReason && (
                    <p className="mt-4 border-t border-gray-100 pt-3 text-sm text-gray-600">
                      Reason: {booking.cancellationReason}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900">
                Confirm Cancellation
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Booking #{selected.bookingId}. Review your choice before
                submitting the cancellation request.
              </p>

              <label className="mt-5 block text-sm font-medium text-gray-700">
                Cancellation reason
              </label>

              <select
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm outline-none focus:border-blue-500"
              >
                <option>Change of plans</option>
                <option>Booked by mistake</option>
                <option>Travel date changed</option>
                <option>Found another option</option>
                <option>Other</option>
              </select>

              <label className="mt-4 block text-sm font-medium text-gray-700">
                Additional details (optional)
              </label>

              <textarea
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                rows={3}
                placeholder="Enter additional details..."
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-500"
              />

              <p className="mt-3 text-xs leading-5 text-amber-700">
                Refund eligibility and amount depend on the applicable booking
                rules. Check the refund status after cancellation.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  disabled={loading}
                  onClick={() => setSelected(null)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Keep Booking
                </button>

                <button
                  disabled={loading}
                  onClick={handleCancel}
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
