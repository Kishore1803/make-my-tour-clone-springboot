import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

type Booking = {
  bookingId: string | number;
  type?: string;
  date?: string;
  totalPrice?: number;
  cancellationStatus?: string;
  cancelledAt?: string;
  refundAmount?: number;
  refundStatus?: string;
  cancellationReason?: string;
};

type RootState = {
  user: {
    user: {
      bookings?: Booking[];
    } | null;
  };
};

function formatAmount(value?: number) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function formatDate(value?: string) {
  if (!value) return "Not available";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getRefundStyle(status: string) {
  switch (status.toUpperCase()) {
    case "COMPLETED":
    case "REFUNDED":
      return "bg-green-50 text-green-700";

    case "PROCESSING":
      return "bg-blue-50 text-blue-700";

    case "PENDING":
      return "bg-amber-50 text-amber-700";

    case "FAILED":
      return "bg-red-50 text-red-700";

    case "NOT_APPLICABLE":
      return "bg-gray-100 text-gray-600";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function TrackRefundsPage() {
  const user = useSelector((state: RootState) => state.user.user);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const refunds = useMemo(() => {
    const bookings = user?.bookings ?? [];

    return bookings.filter((booking) => {
      const cancellationStatus = (
        booking.cancellationStatus ?? ""
      ).toUpperCase();

      const refundStatus = (
        booking.refundStatus ?? "NOT_APPLICABLE"
      ).toUpperCase();

      const isCancelled =
        cancellationStatus === "CANCELLED" || refundStatus !== "NOT_APPLICABLE";

      const matchesSearch = `${booking.bookingId} ${booking.type ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      const matchesFilter = filter === "ALL" || refundStatus === filter;

      return isCancelled && matchesSearch && matchesFilter;
    });
  }, [user?.bookings, search, filter]);

  const totalRefund = refunds.reduce(
    (sum, booking) => sum + Number(booking.refundAmount ?? 0),
    0,
  );

  const completedRefund = refunds
    .filter((booking) =>
      ["COMPLETED", "REFUNDED"].includes(
        (booking.refundStatus ?? "").toUpperCase(),
      ),
    )
    .reduce((sum, booking) => sum + Number(booking.refundAmount ?? 0), 0);

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Track My Refunds</h1>
          <p className="mt-3 text-gray-600">
            Please log in to view your refund records.
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
            MAKEMYTOUR · PAYMENTS
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Track My Refunds
          </h1>
          <p className="mt-2 text-gray-600">
            View your cancellation records and the refund status saved for each
            booking.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Recorded Refunds
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatAmount(totalRefund)}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Sum of refund amounts recorded for the bookings shown below.
            </p>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <p className="text-sm font-medium text-green-800">
              Refunds Marked Completed
            </p>
            <p className="mt-2 text-3xl font-bold text-green-700">
              {formatAmount(completedRefund)}
            </p>
            <p className="mt-2 text-xs text-green-700">
              Based on the status stored in your booking records.
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by booking ID or type..."
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="REFUNDED">Refunded</option>
            <option value="FAILED">Failed</option>
            <option value="NOT_APPLICABLE">Not applicable</option>
          </select>
        </div>

        {refunds.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No matching refund records
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Cancelled bookings with refund information will appear here when
              those details are available in your account.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {refunds.map((booking, index) => {
              const status = (
                booking.refundStatus ?? "NOT_APPLICABLE"
              ).toUpperCase();

              return (
                <article
                  key={`${booking.type ?? "BOOKING"}-${booking.bookingId}-${index}`}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {booking.type ?? "Booking"}
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-gray-900">
                        Booking #{booking.bookingId}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Booking date: {formatDate(booking.date)}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Cancelled date: {formatDate(booking.cancelledAt)}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm text-gray-500">
                        Recorded refund amount
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-900">
                        {formatAmount(booking.refundAmount)}
                      </p>

                      <span
                        className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRefundStyle(status)}`}
                      >
                        {status.replaceAll("_", " ")}
                      </span>
                    </div>
                  </div>

                  {booking.cancellationReason && (
                    <div className="mt-5 border-t border-gray-100 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Cancellation reason
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        {booking.cancellationReason}
                      </p>
                    </div>
                  )}

                  <p className="mt-4 rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-600">
                    This page displays the refund amount and status available in
                    your booking record. A completed status here does not
                    independently verify that money has reached your bank
                    account.
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
