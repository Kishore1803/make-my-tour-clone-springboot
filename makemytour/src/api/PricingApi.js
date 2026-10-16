import axios from "axios";

const API_BASE_URL =
  "https://make-my-tour-clone-springboot-backend.onrender.com";
  
const pricingApi = axios.create({ baseURL: `${API_BASE_URL}/api/pricing` });

// Get current dynamic price
export const getCurrentPrice = async (type, itemId, userId) => {
  try {
    const response = await pricingApi.get(`/${type}/${itemId}`, {
      params: userId ? { userId } : {},
    });
    return response.data;
  } catch (error) {
    console.error(
      "Get current price failed:",
      error.response?.status,
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Get price history
export const getPriceHistory = async (type, itemId) => {
  try {
    const response = await pricingApi.get(`/${type}/${itemId}/history`);
    const data = response.data;
    return Array.isArray(data) ? data : (data?.history ?? []);
  } catch (error) {
    console.error(
      "Get price history failed:",
      error.response?.status,
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Freeze price for 30 minutes
export const freezePrice = async (type, itemId, userId) => {
  try {
    const response = await pricingApi.post(`/${type}/${itemId}/freeze`, {
      userId: Number(userId),
    });
    return response.data;
  } catch (error) {
    console.error(
      "Freeze price failed:",
      error.response?.status,
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Get price freeze status by freeze ID
export const getPriceFreeze = async (freezeId) => {
  try {
    const response = await pricingApi.get(`/freezes/${freezeId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Get price freeze failed:",
      error.response?.status,
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Admin: update pricing configuration
export const updatePricing = async (type, itemId, pricingData) => {
  try {
    const response = await pricingApi.put(
      `/admin/${type}/${itemId}`,
      pricingData,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Update pricing failed:",
      error.response?.status,
      error.response?.data || error.message,
    );
    throw error;
  }
};

export default pricingApi;
