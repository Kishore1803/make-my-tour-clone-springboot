"use client";

import { useState, type FormEvent } from "react";
import { cancelBooking } from "@/api/cancellationRefundApi";
import type {
  BookingDetails as BookingDetailsData,
  Cancellation,
} from "@/types/CancellationRefund";

interface CancellationFormProps {
  userId: number;
  booking: BookingDetailsData;
  onSuccess: (cancellation: Cancellation) => void;
  onClose?: () => void;
}

const cancellationReasons = [
  "Change of plans",
  "Booked by mistake",
  "Found a better option",
  "Schedule changed",
  "Personal reasons",
  "Other",
];

export default function CancellationForm({
  userId,
  booking,
  onSuccess,
  onClose,
}: CancellationFormProps) {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isCancelled = booking.cancellationStatus?.toUpperCase() === "CANCELLED";
  const isOtherReason = reason === "Other";
  const finalReason = isOtherReason ? customReason.trim() : reason;

  const refundAmount =
    booking.totalPrice >= 0
      ? Math.round(booking.totalPrice * 0.5 * 100) / 100
      : 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!userId || !booking.bookingId) {
      setError("User ID or booking ID is missing.");
      return;
    }

    if (isCancelled) {
      setError("This booking is already cancelled.");
      return;
    }

    if (!reason || !finalReason) {
      setError("Please select or enter a cancellation reason.");
      return;
    }

    if (!confirmed) {
      setError("Please confirm the cancellation.");
      return;
    }

    setLoading(true);

    try {
      const cancellation = await cancelBooking({
        userId,
        bookingId: booking.bookingId,
        bookingType: booking.type,
        reason: finalReason,
      });

      onSuccess(cancellation);
    } catch (err: unknown) {
      let message = "Unable to cancel the booking. Please try again.";
      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (
          err as {
            response?: {
              data?: unknown;
              status?: number;
            };
          }
        ).response;

        if (typeof response?.data === "string") {
          message = response.data;
        } else if (response?.status === 404) {
          message = "Booking or user was not found.";
        } else if (response?.status === 409) {
          message = "This booking may already be cancelled.";
        } else if (!response) {
          message = "Cannot connect to the backend server.";
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div>
        <h2 className="text-xl font-bold text-gray-900">Cancel Booking</h2>
        <p className="mt-1 text-sm text-gray-600">
          Booking ID: #{booking.bookingId}
        </p>
      </div>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-gray-600">Original booking amount</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(booking.totalPrice)}
          </span>
        </div>

        <p className="mt-2 text-xs leading-5 text-gray-500">
          Your refund eligibility and amount will be calculated by the backend
          according to the cancellation policy.
        </p>
      </div>

      <div>
        <label
          htmlFor="cancellation-reason"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Reason for cancellation
        </label>

        <select
          id="cancellation-reason"
          value={reason}
          onChange={(event) => {
            setReason(event.target.value);
            setError("");
          }}
          disabled={loading || isCancelled}
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-gray-100"
        >
          <option value="">Select a reason</option>
          {cancellationReasons.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {isOtherReason && (
        <div>
          <label
            htmlFor="custom-reason"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Enter your reason
          </label>

          <textarea
            id="custom-reason"
            value={customReason}
            onChange={(event) => setCustomReason(event.target.value)}
            disabled={loading}
            required
            maxLength={250}
            rows={3}
            placeholder="Tell us why you are cancelling..."
            className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
        </div>
      )}

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
          disabled={loading || isCancelled}
          className="mt-1 h-4 w-4 accent-red-600"
        />

        <span className="text-sm leading-6 text-gray-700">
          I confirm that I want to cancel this booking and understand that the
          applicable refund will follow the cancellation policy.
        </span>
      </label>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Keep Booking
          </button>
        )}

        <button
          type="submit"
          disabled={loading || isCancelled}
          className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Cancelling..."
            : isCancelled
              ? "Already Cancelled"
              : "Confirm Cancellation"}
        </button>
      </div>
    </form>
  );
}
