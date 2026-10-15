import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  ArrowLeft,
  Plane,
  Hotel,
  Search,
  XCircle,
  Clock,
  CheckCircle2,
  CircleDollarSign,
  RefreshCw,
  Ticket,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const API_BASE_URL =
  "https://make-my-tour-clone-springboot-backend.onrender.com";

interface Booking {
  type?: string;
  bookingId?: number | string;
  date?: string;
  quantity?: number;
  totalPrice?: number;
  bookedAt?: string;
  selectedSeat?: string;
  cancellationStatus?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  refundAmount?: number;
  refundStatus?: string;
}

const money = (value: unknown) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

const statusClass = (status: string) => {
  const value = status.toUpperCase();

  if (["CANCELLED", "REFUNDED", "COMPLETED", "SUCCESS"].includes(value)) {
    return "bg-emerald-100 text-emerald-800";
  }

  if (["PROCESSING", "PENDING", "INITIATED"].includes(value)) {
    return "bg-amber-100 text-amber-800";
  }

  if (["FAILED", "REJECTED"].includes(value)) {
    return "bg-rose-100 text-rose-800";
  }

  return "bg-blue-100 text-blue-800";
};

const prettyStatus = (value?: string) => {
  if (!value) return "Not available";

  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default function ManageCancellationPage() {
  const router = useRouter();

  const user = useSelector((state: any) => state.user.user);

  const bookings: Booking[] = Array.isArray(user?.bookings)
    ? user.bookings
    : [];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [reason, setReason] = useState("Change of travel plans");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const status = (booking.cancellationStatus || "BOOKED").toUpperCase();

      const matchesFilter =
        filter === "ALL" ||
        (filter === "ACTIVE" && !["CANCELLED", "COMPLETED"].includes(status)) ||
        (filter === "CANCELLED" && status === "CANCELLED") ||
        (filter === "REFUND" &&
          ["PENDING", "PROCESSING", "INITIATED"].includes(
            (booking.refundStatus || "").toUpperCase(),
          )) ||
        (filter === "REFUNDED" &&
          ["REFUNDED", "COMPLETED", "SUCCESS"].includes(
            (booking.refundStatus || "").toUpperCase(),
          ));

      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        String(booking.bookingId ?? "")
          .toLowerCase()
          .includes(query) ||
        String(booking.type ?? "")
          .toLowerCase()
          .includes(query) ||
        String(booking.selectedSeat ?? "")
          .toLowerCase()
          .includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [bookings, filter, search]);

  const cancelBooking = async () => {
    if (!user?.id || !selected) {
      setError("Please log in and select a booking.");
      return;
    }

    if (!reason.trim()) {
      setError("Please select a cancellation reason.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      /*
       * IMPORTANT:
       * Change this URL and request parameters to match your
       * actual Spring Boot cancellation controller.
       *
       * This example assumes:
       * POST /booking/cancel
       * params: userId, bookingId, type, reason
       */
      await axios.post(`${API_BASE_URL}/booking/cancel`, null, {
        params: {
          userId: user.id,
          bookingId: selected.bookingId,
          type: selected.type,
          reason: details.trim() ? `${reason}: ${details.trim()}` : reason,
        },
      });

      setMessage(
        "Cancellation request submitted. Refresh your bookings to view the latest status.",
      );
      setSelected(null);
    } catch (e: any) {
      console.error("Cancellation failed:", {
        status: e?.response?.status,
        data: e?.response?.data,
        message: e?.message,
      });

      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Cancellation failed. Verify the backend cancellation endpoint.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (!user?.id) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <section className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <Ticket className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-4 text-2xl font-bold">Login Required</h1>
          <p className="mt-2 text-slate-600">
            Log in to manage cancellations and track your refunds.
          </p>
          <Button className="mt-5" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <section className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3">
            <CircleDollarSign className="h-9 w-9" />
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Manage Cancellation
              </h1>
              <p className="mt-1 text-sm text-blue-100">
                Cancel eligible bookings and track refund progress.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SummaryCard label="Total bookings" value={bookings.length} />
            <SummaryCard
              label="Cancelled"
              value={
                bookings.filter(
                  (b) =>
                    (b.cancellationStatus || "").toUpperCase() === "CANCELLED",
                ).length
              }
            />
            <SummaryCard
              label="Refund amount"
              value={money(
                bookings.reduce(
                  (sum, b) => sum + Number(b.refundAmount ?? 0),
                  0,
                ),
              )}
            />
          </div>
        </section>

        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {message}
          </div>
        )}

        {error && !selected && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            {error}
          </div>
        )}

        <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Search booking ID, type or seat"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Button variant="outline" onClick={() => router.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ["ALL", "All bookings"],
              ["ACTIVE", "Active"],
              ["CANCELLED", "Cancelled"],
              ["REFUND", "Refund pending"],
              ["REFUNDED", "Refunded"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  filter === value
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <Ticket className="mx-auto h-12 w-12 text-slate-300" />
              <h2 className="mt-4 text-xl font-semibold">No bookings found</h2>
              <p className="mt-2 text-sm text-slate-500">
                Your bookings will appear here once available in your account.
              </p>
            </div>
          ) : (
            filteredBookings.map((booking, index) => {
              const type = (booking.type || "FLIGHT").toUpperCase();
              const cancelled =
                (booking.cancellationStatus || "").toUpperCase() ===
                "CANCELLED";

              const status = booking.cancellationStatus || "BOOKED";
              const refundStatus = booking.refundStatus || "NOT_APPLICABLE";

              return (
                <article
                  key={`${type}-${booking.bookingId ?? index}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        {type === "HOTEL" ? (
                          <Hotel className="h-6 w-6" />
                        ) : (
                          <Plane className="h-6 w-6" />
                        )}
                      </div>

                      <div>
                        <h2 className="text-lg font-bold">
                          {type === "HOTEL"
                            ? "Hotel Booking"
                            : "Flight Booking"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Booking ID: {booking.bookingId ?? "N/A"}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                          <CalendarDays className="h-4 w-4" />
                          Travel date: {booking.date || "Not available"}
                        </p>
                        {booking.selectedSeat && (
                          <p className="mt-1 text-sm text-slate-500">
                            Seat: {booking.selectedSeat}
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                        status,
                      )}`}
                    >
                      {prettyStatus(status)}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-4">
                    <InfoItem label="Quantity" value={booking.quantity ?? 1} />
                    <InfoItem
                      label="Booking amount"
                      value={money(booking.totalPrice)}
                    />
                    <InfoItem
                      label="Refund amount"
                      value={money(booking.refundAmount)}
                    />
                    <div>
                      <p className="text-xs text-slate-500">Refund status</p>
                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusClass(
                          refundStatus,
                        )}`}
                      >
                        {prettyStatus(refundStatus)}
                      </span>
                    </div>
                  </div>

                  {cancelled && (
                    <div className="mt-4 rounded-xl border border-slate-200 p-4">
                      <p className="flex items-center gap-2 font-semibold">
                        {["REFUNDED", "COMPLETED", "SUCCESS"].includes(
                          refundStatus.toUpperCase(),
                        ) ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-600" />
                        )}
                        Refund tracking
                      </p>

                      <p className="mt-2 text-sm text-slate-600">
                        {booking.cancelledAt
                          ? `Cancelled at: ${booking.cancelledAt}`
                          : "Cancellation recorded"}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Reason: {booking.cancellationReason || "Not provided"}
                      </p>

                      <p className="mt-2 text-sm text-slate-600">
                        {["REFUNDED", "COMPLETED", "SUCCESS"].includes(
                          refundStatus.toUpperCase(),
                        )
                          ? "Refund marked as completed by the backend."
                          : "The latest refund status will appear here when the backend updates this booking."}
                      </p>
                    </div>
                  )}

                  {!cancelled && (
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-slate-500">
                        Cancellation eligibility and refund amount depend on
                        your backend policy.
                      </p>

                      <Button
                        variant="outline"
                        className="border-rose-200 text-rose-700 hover:bg-rose-50"
                        onClick={() => {
                          setSelected(booking);
                          setReason("Change of travel plans");
                          setDetails("");
                          setError("");
                        }}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Request cancellation
                      </Button>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="cancel-title"
              className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 id="cancel-title" className="text-xl font-bold">
                    Confirm cancellation
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Booking ID: {selected.bookingId ?? "N/A"}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => {
                    setSelected(null);
                    setError("");
                  }}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <Label htmlFor="cancelReason">Cancellation reason</Label>
                  <select
                    id="cancelReason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm"
                  >
                    <option>Change of travel plans</option>
                    <option>Booked by mistake</option>
                    <option>Schedule changed</option>
                    <option>Found another option</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="cancelDetails">
                    Additional details (optional)
                  </Label>
                  <Textarea
                    id="cancelDetails"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Tell us more about your cancellation"
                    className="mt-2"
                  />
                </div>

                <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                  Cancellation may be irreversible. The backend should verify
                  eligibility and calculate any applicable refund.
                </div>

                {error && (
                  <p role="alert" className="text-sm text-rose-700">
                    {error}
                  </p>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={() => setSelected(null)}
                  >
                    Keep booking
                  </Button>

                  <Button
                    type="button"
                    disabled={busy}
                    className="bg-rose-600 text-white hover:bg-rose-700"
                    onClick={() => void cancelBooking()}
                  >
                    {busy ? "Submitting..." : "Confirm cancellation"}
                  </Button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-white/10 p-4">
      <p className="text-sm text-blue-100">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold">{value}</p>
    </div>
  );
}
