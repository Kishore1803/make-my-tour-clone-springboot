import axios from "axios";

const API = axios.create({
  baseURL:
    "https://make-my-tour-clone-springboot-backend.onrender.com/api/flight-status",
});

export const getAllFlights = () => API.get("");

export const getFlightStatus = (flightNumber) =>
  API.get(`/${encodeURIComponent(flightNumber)}`);

export const searchFlights = (from, to) =>
  API.get("/search", { params: { from, to } });

export const getFlightsByStatus = (status) =>
  API.get(`/status/${encodeURIComponent(status)}`);

export const createFlight = (flightData) => API.post("", flightData);

const PUSH_API =
  "https://make-my-tour-clone-springboot-backend.onrender.com/api/push";

export const savePushSubscription = (subscription) =>
  axios.post(`${PUSH_API}/subscribe`, {
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
  });

export const removePushSubscription = (endpoint) =>
  axios.delete(`${PUSH_API}/unsubscribe`, {
    params: { endpoint },
  });

export default API;
