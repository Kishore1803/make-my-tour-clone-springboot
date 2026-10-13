import axios from "axios";

const API_BASE_URL = "https://make-my-tour-clone-springboot-backend.onrender.com"
const api = axios.create({ baseURL: API_BASE_URL });

// Cancel a booking
export const cancelBooking = async ({
  userId,
  bookingId,
  bookingType,
  reason,
}) => {
  try {
    if (!userId || bookingId == null || !bookingType || !reason) {
      throw new Error(
        "userId, bookingId, bookingType and reason are required.",
      );
    }

    const response = await api.post("/cancellation/cancel", null, {
      params: {
        userId,
        bookingId,
        bookingType,
        reason,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Cancel booking API failed:",
      error.response?.status,
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Get cancellation history for a user
export const getUserCancellations = async (userId) => {
  const response = await api.get(`/cancellation/user/${userId}`);
  return response.data;
};

// Create a refund record
export const createRefund = async ({ userId, bookingId, bookingType }) => {
  const response = await api.post("/refund/create", null, {
    params: {
      userId,
      bookingId,
      bookingType,
    },
  });
  return response.data;
};

// Get refund by booking ID
export const getRefundByBookingId = async (bookingId) => {
  const response = await api.get(`/refund/booking/${bookingId}`);
  return response.data;
};

// Get all refunds for a user
export const getUserRefunds = async (userId) => {
  const response = await api.get(`/refund/user/${userId}`);
  return response.data;
};

// Update refund status
export const updateRefundStatus = async (refundId, status) => {
  const response = await api.put(`/refund/${refundId}/status`, null, {
    params: { status },
  });
  return response.data;
};

export default api;
