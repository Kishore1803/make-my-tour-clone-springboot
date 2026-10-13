import axios from "axios";

const API_BASE_URL = "https://make-my-tour-clone-springboot-backend.onrender.com";
const api = axios.create({ baseURL: API_BASE_URL });

/**
 * @typedef {Object} Recommendation
 * @property {number} id
 * @property {string} type
 * @property {string} title
 * @property {string} destination
 * @property {string} [category]
 * @property {string} [description]
 * @property {string} [imageUrl]
 * @property {number|string|null} [price]
 * @property {number} [score]
 * @property {string} [reason]
 */

/**
 * @param {number|string} userId
 * @param {string} [type]
 * @returns {Promise<Recommendation[]>}
 */

export const getRecommendations = async (userId, type) => {
  const response = await api.get(`/api/recommendations/${userId}`, {
    params: type ? { type } : {},
  });
  return response.data;
};

export const sendRecommendationFeedback = async (
  userId,
  itemId,
  helpful,
  reason = "",
) => {
  const response = await api.post("/api/recommendations/feedback", {
    userId: Number(userId),
    itemId,
    helpful,
    reason,
  });
  return response.data;
};

export const recordRecommendationInteraction = async (
  userId,
  itemId,
  action = "CLICK",
) => {
  const response = await api.post(
    `/api/recommendations/${userId}/${itemId}/interaction`,
    null,
    {
      params: { action },
    },
  );
  return response.data;
};

export default api;
