import axios from "axios";

const API = axios.create({
  baseURL: "https://make-my-tour-clone-springboot-backend.onrender.com/api",
});

// Get tracking status for one flight
export const getFlightTracking = async (userId, flightId) => {
  try {
    const response = await API.get(`/flight-tracking/${userId}/${flightId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error getting flight tracking:", error);
    return null;
  }
};

// Track a flight
export const trackFlight = async (userId, flightId, flightNumber) => {
  const response = await API.post("/flight-tracking/track", {
    userId,
    flightId,
    flightNumber,
  });
  return response.data;
};

// Stop tracking a flight
export const stopTrackingFlight = async (userId, flightId) => {
  const response = await API.delete(`/flight-tracking/${userId}/${flightId}`);
  return response.data;
};

// Get all tracked flights
export const getTrackedFlights = async (userId) => {
  const response = await API.get(`/flight-tracking/user/${userId}`);
  return response.data;
};

// Update tracking status
export const updateTrackingStatus = async (
  userId,
  flightId,
  status,
  reason,
  estimatedArrivalTime,
) => {
  const response = await API.put("/flight-tracking/status", {
    userId,
    flightId,
    status,
    reason,
    estimatedArrivalTime,
  });
  return response.data;
};
