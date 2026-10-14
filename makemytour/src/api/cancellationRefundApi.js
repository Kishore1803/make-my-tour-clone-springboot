import axios from "axios";

const API_BASE_URL = "https://make-my-tour-clone-springboot-backend.onrender.com";

const api = axios.create({ baseURL: API_BASE_URL });

// Cancel a booking
export const cancelBooking = async ({
  userId,
  bookingId,
  bookingType,
  reason,
}) => {
  try {
    if (
      userId == null ||
      bookingId == null ||
      !bookingType ||
      !reason?.trim()
    ) {
      throw new Error(
        "userId, bookingId, bookingType and reason are required.",
      );
    }

    const response = await api.post("/cancellation/cancel", null, {
      params: {
        userId,
        bookingId,
        bookingType: bookingType.trim().toUpperCase(),
        reason: reason.trim(),
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
  try {
    if (userId == null) {
      throw new Error("userId is required.");
    }

    const response = await api.get(`/cancellation/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Get cancellations failed:",
      error.response?.status,
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Create a refund record
export const createRefund = async ({ userId, bookingId, bookingType }) => {
  try {
    if (userId == null || bookingId == null || !bookingType) {
      throw new Error("userId, bookingId and bookingType are required.");
    }

    const response = await api.post("/refund/create", null, {
      params: {
        userId,
        bookingId,
        bookingType: bookingType.trim().toUpperCase(),
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Create refund failed:",
      error.response?.status,
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Get refund by booking ID
export const getRefundByBookingId = async (bookingId) => {
  try {
    if (bookingId == null) {
      throw new Error("bookingId is required.");
    }

    const response = await api.get(`/refund/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Get refund by booking ID failed:",
      error.response?.status,
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Get all refunds for a user
export const getUserRefunds = async (userId) => {
  try {
    if (userId == null) {
      throw new Error("userId is required.");
    }

    const response = await api.get(`/refund/user/${userId}`);

    return response.data;
  } catch (error) {
    console.error(
      "Get user refunds failed:",
      error.response?.status,
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Update refund status
export const updateRefundStatus = async (refundId, status) => {
  try {
    if (refundId == null || !status) {
      throw new Error("refundId and status are required.");
    }

    const response = await api.put(`/refund/${refundId}/status`, null, {
      params: {
        status: status.trim().toUpperCase(),
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Update refund status failed:",
      error.response?.status,
      error.response?.data || error.message,
    );
    throw error;
  }
};

export default api;
