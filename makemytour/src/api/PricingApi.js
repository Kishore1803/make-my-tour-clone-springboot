import axios from "axios";

const pricingApi = axios.create({
  baseURL: "https://make-my-tour-clone-springboot-backend.onrender.com",
});

export const getCurrentPrice = async (type, itemId, userId = null) => {
  const response = await pricingApi.get(`/api/pricing/${type}/${itemId}`, {
    params: userId != null ? { userId } : {},
  });
  return response.data;
};

export const getPriceHistory = async (type, itemId) => {
  const response = await pricingApi.get(
    `/api/pricing/${type}/${itemId}/history`,
  );
  return response.data;
};

export const freezePrice = async (type, itemId, userId) => {
  const response = await pricingApi.post(
    `/api/pricing/${type}/${itemId}/freeze`,
    { userId },
  );
  return response.data;
};

export const getPriceFreeze = async (freezeId) => {
  const response = await pricingApi.get(`/api/pricing/freezes/${freezeId}`);
  return response.data;
};

export const updatePricing = async (type, itemId, pricing) => {
  const response = await pricingApi.put(
    `/api/pricing/admin/${type}/${itemId}`,
    pricing,
  );
  return response.data;
};

export default pricingApi;
