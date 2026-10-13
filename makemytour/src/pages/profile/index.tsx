import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  Phone,
  Mail,
  Edit2,
  MapPin,
  Calendar,
  CreditCard,
  X,
  Check,
  LogOut,
  Plane,
  Building2,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { clearUser, setUser } from "@/store";
import { editprofile } from "@/api";
import { getUserRefunds, cancelBooking } from "@/api/cancellationRefundApi";

type Booking = {
  bookingId?: string | number;
  id?: string | number;
  type?: string;
  bookingType?: string;
  date?: string;
  bookedAt?: string;
  quantity?: number;
  totalPrice?: number | string;
  selectedSeat?: string;
  cancellationStatus?: string;
  refundStatus?: string;
  cancelledAt?: string;
  [key: string]: any;
};

type Refund = {
  id?: string | number;
  bookingId?: string | number;
  bookingType?: string;
  refundAmount?: number | string;
  refundPercentage?: number | string;
  refundStatus?: string;
  status?: string;
  expectedTimeline?: string;
  requestedAt?: string;
  completedAt?: string;
};

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

const getStatusClass = (status?: string) => {
  const value = (status || "CONFIRMED").toUpperCase();

  if (
    ["COMPLETED", "SUCCESS", "REFUND_COMPLETED", "PROCESSED", "PAID"].includes(
      value,
    )
  ) {
    return "bg-green-100 text-green-700";
  }

  if (["CANCELLED", "REJECTED", "FAILED", "REFUND_FAILED"].includes(value)) {
    return "bg-red-100 text-red-700";
  }

  if (
    ["PENDING", "REFUND_PENDING", "PROCESSING", "IN_PROGRESS"].includes(value)
  ) {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-blue-100 text-blue-700";
};

const formatStatus = (status?: string) => {
  if (!status) return "Confirmed";

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (value?: string) => {
  if (!value) return "Date not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAmount = (amount?: number | string) => {
  const value = Number(amount || 0);

  return `₹${(Number.isFinite(value) ? value : 0).toLocaleString("en-IN")}`;
};

const Index = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundError, setRefundError] = useState("");
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [cancellingId, setCancellingId] = useState<string | number | null>(
    null,
  );

  const [userData, setUserData] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const bookings: Booking[] = useMemo(() => {
    if (!Array.isArray(user?.bookings)) return [];

    return user.bookings.filter(
      (booking: Booking | null | undefined) =>
        booking && typeof booking === "object",
    );
  }, [user?.bookings]);

  useEffect(() => {
    if (!user) return;

    setUserData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
    });
  }, [user]);

  useEffect(() => {
    let active = true;

    const fetchRefunds = async () => {
      if (!user?.id) {
        setRefunds([]);
        return;
      }

      try {
        setRefundLoading(true);
        setRefundError("");

        const response = await getUserRefunds(user.id);
        const data = response?.data ?? response;

        if (active) {
          setRefunds(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching refunds:", error);

        if (active) {
          setRefunds([]);
          setRefundError(
            "Unable to load refund details. Please try again later.",
          );
        }
      } finally {
        if (active) setRefundLoading(false);
      }
    };

    void fetchRefunds();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const logout = () => {
    dispatch(clearUser());
    router.push("/");
  };

  const handleEditFormChange = (field: keyof ProfileForm, value: string) => {
    setUserData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!user?.id) {
      alert("Please log in again before updating your profile.");
      return;
    }

    if (
      !userData.firstName.trim() ||
      !userData.lastName.trim() ||
      !userData.email.trim()
    ) {
      alert("Please enter your first name, last name, and email.");
      return;
    }

    try {
      setSaving(true);

      const response = await editprofile(
        user.id,
        userData.firstName.trim(),
        userData.lastName.trim(),
        userData.email.trim(),
        userData.phoneNumber.trim(),
      );

      const updatedProfile = response?.data ?? response;

      const updatedUser = {
        ...user,
        ...updatedProfile,
        ...userData,
        bookings: Array.isArray(updatedProfile?.bookings)
          ? updatedProfile.bookings
          : bookings,
      };

      dispatch(setUser(updatedUser));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setUserData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    });

    setIsEditing(false);
  };

  const handleCancelBooking = async (booking: Booking) => {
    const bookingId = booking.bookingId ?? booking.id;

    if (bookingId == null) {
      alert("Booking ID not found.");
      return;
    }

    const currentStatus = (
      booking.cancellationStatus ||
      (booking.cancelledAt ? "CANCELLED" : "CONFIRMED")
    ).toUpperCase();

    if (currentStatus === "CANCELLED") {
      alert("This booking is already cancelled.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel this ${
        booking.type || booking.bookingType || "booking"
      }? Booking ID: ${bookingId}`,
    );

    if (!confirmed) return;

    try {
      setCancellingId(bookingId);
      // This must call your real backend cancellation endpoint.
      const rawType = booking.type || booking.bookingType || "Booking";
      const bookingType = rawType.toLowerCase().includes("flight")
        ? "FLIGHT"
        : rawType.toLowerCase().includes("hotel")
          ? "HOTEL"
          : rawType.toUpperCase();

      await cancelBooking({
        userId: user.id,
        bookingId: bookingId,
        bookingType: bookingType,
        reason: "Cancelled by user",
      });
      const updatedBookings = bookings.map((item) => {
        const itemId = item.bookingId ?? item.id;

        return String(itemId) === String(bookingId)
          ? {
              ...item,
              cancellationStatus: "CANCELLED",
              cancelledAt: new Date().toISOString(),
            }
          : item;
      });

      dispatch(
        setUser({
          ...user,
          bookings: updatedBookings,
        }),
      );

      if (user?.id) {
        const response = await getUserRefunds(user.id);
        const data = response?.data ?? response;
        setRefunds(Array.isArray(data) ? data : []);
      }
      alert("Cancellation request submitted successfully.");
    } catch (error) {
      console.error("Booking cancellation failed:", error);
      alert("Unable to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const viewCancellationPolicy = (booking: Booking) => {
    const bookingId = booking.bookingId ?? booking.id;
    const rawType = booking.type || booking.bookingType || "Booking";
    const type = rawType.toLowerCase().includes("flight")
      ? "flight"
      : rawType.toLowerCase().includes("hotel")
        ? "hotel"
        : rawType.toLowerCase();

    void router.push({
      pathname: "/cancellation-policy",
      query: {
        bookingId: bookingId == null ? "" : String(bookingId),
        bookingType: type,
      },
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Login Required</h2>
          <p className="text-gray-500 mt-2">
            Please log in to view your profile and bookings.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-5 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 px-4 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-red-600 flex items-center gap-1 hover:text-red-700"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form
                  className="space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void handleSave();
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(event) =>
                        handleEditFormChange("firstName", event.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(event) =>
                        handleEditFormChange("lastName", event.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(event) =>
                        handleEditFormChange("email", event.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userData.phoneNumber}
                      onChange={(event) =>
                        handleEditFormChange("phoneNumber", event.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      {saving ? "Saving..." : "Save"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500 shrink-0" />
                    <p className="font-medium text-gray-800 break-words">
                      {user.firstName || ""} {user.lastName || ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500 shrink-0" />
                    <p className="text-gray-700 break-all">
                      {user.email || "Email not available"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500 shrink-0" />
                    <p className="text-gray-700">
                      {user.phoneNumber || "Phone not available"}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-full mt-4 flex items-center justify-center gap-2 text-red-600 hover:text-red-700"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bookings */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    My Bookings
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Your flight and hotel bookings
                  </p>
                </div>

                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-600">
                  {bookings.length}{" "}
                  {bookings.length === 1 ? "Booking" : "Bookings"}
                </div>
              </div>

              <div className="space-y-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-10">
                    <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      No Bookings Yet
                    </h3>
                    <p className="text-gray-500 mt-1">
                      Your flight and hotel bookings will appear here.
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push("/")}
                      className="mt-5 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                    >
                      Explore Trips
                    </button>
                  </div>
                ) : (
                  bookings.map((booking, index) => {
                    const rawType =
                      booking.type || booking.bookingType || "Booking";
                    const normalizedType = rawType.toLowerCase();

                    const isFlight =
                      normalizedType.includes("flight") ||
                      normalizedType.includes("plane");

                    const isHotel =
                      normalizedType.includes("hotel") ||
                      normalizedType.includes("room") ||
                      normalizedType.includes("stay");

                    const displayType = isFlight
                      ? "Flight"
                      : isHotel
                        ? "Hotel"
                        : rawType;

                    const bookingId = booking.bookingId ?? booking.id;

                    const bookingStatus =
                      booking.cancellationStatus ||
                      (booking.cancelledAt ? "CANCELLED" : "CONFIRMED");

                    const isCancelled =
                      bookingStatus.toUpperCase() === "CANCELLED";

                    const linkedRefund = refunds.find(
                      (refund) =>
                        String(refund.bookingId) === String(bookingId),
                    );

                    const refundStatus =
                      booking.refundStatus ||
                      linkedRefund?.refundStatus ||
                      linkedRefund?.status;

                    return (
                      <article
                        key={`${bookingId ?? "booking"}-${index}`}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            {isFlight ? (
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <Plane className="w-6 h-6 text-blue-600" />
                              </div>
                            ) : (
                              <div className="bg-green-100 p-2 rounded-lg">
                                <Building2 className="w-6 h-6 text-green-600" />
                              </div>
                            )}

                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {displayType}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Booking ID: {bookingId ?? "Not available"}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatAmount(booking.totalPrice)}
                            </p>
                            <span
                              className={`inline-flex mt-2 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                bookingStatus,
                              )}`}
                            >
                              {formatStatus(bookingStatus)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 shrink-0" />
                            {formatDate(booking.date || booking.bookedAt)}
                          </div>

                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 shrink-0" />
                            {displayType}
                          </div>

                          <div className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4 shrink-0" />
                            <span className="text-green-600 font-medium">
                              Paid
                            </span>
                          </div>
                        </div>

                        {booking.quantity != null && (
                          <p className="mt-3 text-sm text-gray-600">
                            Quantity: {booking.quantity}
                          </p>
                        )}

                        {booking.selectedSeat && (
                          <p className="mt-2 text-sm text-gray-600">
                            Seat: {booking.selectedSeat}
                          </p>
                        )}

                        {/* Actions for each booking */}
                        <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                          {!isCancelled && (
                            <button
                              type="button"
                              onClick={() => void handleCancelBooking(booking)}
                              disabled={cancellingId === bookingId}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {cancellingId === bookingId ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4" />
                                  Cancel Booking
                                </>
                              )}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => viewCancellationPolicy(booking)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <FileText className="w-4 h-4" />
                            View Cancellation Policy
                          </button>
                        </div>

                        {isCancelled && (
                          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            <p className="font-semibold">Booking Cancelled</p>
                            {booking.cancelledAt && (
                              <p className="mt-1">
                                Cancelled on: {formatDate(booking.cancelledAt)}
                              </p>
                            )}
                          </div>
                        )}

                        {refundStatus && (
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4">
                            <span className="text-sm text-gray-600">
                              Refund status
                            </span>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                refundStatus,
                              )}`}
                            >
                              {formatStatus(refundStatus)}
                            </span>
                          </div>
                        )}

                        {linkedRefund && (
                          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                            <span className="text-gray-600">Refund amount</span>
                            <span className="font-semibold text-gray-900">
                              {formatAmount(linkedRefund.refundAmount)}
                            </span>
                          </div>
                        )}
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Refund Status */}
        <div className="mt-10">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Refund Status
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Track refunds associated with your cancelled bookings.
              </p>
            </div>
            <CreditCard className="w-7 h-7 text-gray-400" />
          </div>

          {refundLoading ? (
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <Loader2 className="w-7 h-7 mx-auto text-red-600 animate-spin" />
              <p className="text-gray-500 mt-3">Loading refund details...</p>
            </div>
          ) : refundError ? (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-start gap-3 text-red-600">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm">{refundError}</p>
              </div>
            </div>
          ) : refunds.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <CreditCard className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <h3 className="font-semibold text-gray-700">No Refunds</h3>
              <p className="text-gray-500 text-sm mt-1">
                Your refund information will appear here after a refund record
                is created.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {refunds.map((refund, index) => {
                const status =
                  refund.refundStatus || refund.status || "PENDING";

                return (
                  <article
                    key={refund.id ?? `${refund.bookingId}-${index}`}
                    className="bg-white rounded-xl shadow p-6 border border-gray-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Refund Details
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Booking ID: {refund.bookingId ?? "Not available"}
                        </p>
                        {refund.bookingType && (
                          <p className="text-sm text-gray-500 mt-1">
                            Type: {refund.bookingType}
                          </p>
                        )}
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          status,
                        )}`}
                      >
                        {formatStatus(status)}
                      </span>
                    </div>

                    <div className="mt-5">
                      <p className="text-sm text-gray-500">Refund Amount</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatAmount(refund.refundAmount)}
                      </p>
                    </div>

                    {refund.refundPercentage != null && (
                      <div className="mt-4 flex justify-between gap-3 text-sm">
                        <span className="text-gray-500">Refund percentage</span>
                        <span className="font-medium text-gray-800">
                          {refund.refundPercentage}%
                        </span>
                      </div>
                    )}

                    {refund.requestedAt && (
                      <div className="mt-3 flex justify-between gap-3 text-sm">
                        <span className="text-gray-500">Requested on</span>
                        <span className="text-right text-gray-800">
                          {formatDate(refund.requestedAt)}
                        </span>
                      </div>
                    )}

                    {refund.completedAt && (
                      <div className="mt-3 flex justify-between gap-3 text-sm">
                        <span className="text-gray-500">Completed on</span>
                        <span className="text-right text-gray-800">
                          {formatDate(refund.completedAt)}
                        </span>
                      </div>
                    )}

                    <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                      Expected timeline:{" "}
                      {refund.expectedTimeline || "5–7 business days"}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* General policy link */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => router.push("/cancellation-policy")}
            className="text-sm font-medium text-red-600 hover:text-red-700 underline underline-offset-4"
          >
            View General Cancellation & Refund Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
