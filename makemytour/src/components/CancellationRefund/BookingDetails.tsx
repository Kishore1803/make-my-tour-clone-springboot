"use client";

import StatusBadge from "./StatusBadge";

export interface BookingDetailsData {
  bookingId: number;
  type: string;
  date: string;
  quantity: number;
  totalPrice: number;
  bookedAt: string;
  selectedSeat?: string;
  cancellationStatus?: string;
  refundAmount?: number;
  refundStatus?: string;
}

interface BookingDetailsProps {
  booking: BookingDetailsData;
  onCancel?: (booking: BookingDetailsData) => void;
  showCancelButton?: boolean;
}

export default function BookingDetails({
  booking,
  onCancel,
  showCancelButton = true,
}: BookingDetailsProps) {
  const isCancelled = booking.cancellationStatus?.toUpperCase() === "CANCELLED";

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const formatDate = (value: string) => {
    if (!value) return "Not available";
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      {/* Booking header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">Booking ID</p>
          <h2 className="mt-1 text-lg font-bold text-gray-900">
            #{booking.bookingId}
          </h2>
          <p className="mt-1 text-sm text-gray-600">{booking.type}</p>
        </div>
        <StatusBadge status={booking.cancellationStatus || "BOOKED"} />
      </div>

      <div className="my-5 border-t border-gray-100" />

      {/* Booking information */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoItem label="Travel Date" value={formatDate(booking.date)} />
        <InfoItem label="Booked At" value={formatDate(booking.bookedAt)} />
        <InfoItem label="Quantity" value={String(booking.quantity)} />
        <InfoItem
          label="Selected Seat"
          value={booking.selectedSeat || "Not applicable"}
        />
      </div>

      {/* Price information */}
      <div className="mt-5 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-gray-600">Total Booking Amount</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(booking.totalPrice)}
          </span>
        </div>

        {booking.refundAmount !== undefined && (
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm text-gray-600">Refund Amount</span>
            <span className="font-semibold text-green-700">
              {formatCurrency(booking.refundAmount)}
            </span>
          </div>
        )}

        {booking.refundStatus && (
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm text-gray-600">Refund Status</span>
            <StatusBadge status={booking.refundStatus} />
          </div>
        )}
      </div>

      {/* Cancel button */}
      {showCancelButton && !isCancelled && onCancel && (
        <button
          type="button"
          onClick={() => onCancel(booking)}
          className="mt-5 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
        >
          Cancel Booking
        </button>
      )}
    </article>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}
