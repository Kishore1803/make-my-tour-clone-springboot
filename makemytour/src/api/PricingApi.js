import axios from "axios";

const API_BASE_URL = "https://make-my-tour-clone-springboot-backend.onrender.com";

const pricingApi = axios.create({
  baseURL: `${API_BASE_URL}/api/pricing`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Get current dynamic price
export const getCurrentPrice = async (type, itemId, userId) => {
  const response = await pricingApi.get(`/${type}/${itemId}`, {
    params: userId ? { userId } : {},
  });
  return response.data;
};

// Get price history for graph
export const getPriceHistory = async (type, itemId) => {
  const response = await pricingApi.get(`/${type}/${itemId}/history`);
  const data = response.data;
  return Array.isArray(data) ? data : (data?.history ?? []);
};

// Freeze the current price for 30 minutes
export const freezePrice = async (type, itemId, userId) => {
  const response = await pricingApi.post(`/${type}/${itemId}/freeze`, {
    userId: String(userId),
  });
  return response.data;
};

// Get price freeze status
export const getPriceFreeze = async (freezeId) => {
  const response = await pricingApi.get(`/freezes/${freezeId}`);
  return response.data;
};

// Admin: create or update pricing configuration
export const updatePricing = async (type, itemId, pricingData) => {
  const response = await pricingApi.put(
    `/admin/${type}/${itemId}`,
    pricingData,
  );
  return response.data;
};

export default pricingApi;
