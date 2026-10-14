import axios from "axios";

const API = axios.create({ baseURL: "https://make-my-tour-clone-springboot-backend.onrender.com" });

// Seat Selection APIs
export const getSeatsByFlight = (flightId) =>
  API.get(`/seat/flight/${flightId}`);

export const getAvailableSeats = (flightId) =>
  API.get(`/seat/flight/${flightId}/available`);

export const getSeat = (flightId, seatNumber) =>
  API.get(`/seat/${flightId}/${encodeURIComponent(seatNumber)}`);

// Room Selection APIs
export const getRoomsByHotel = (hotelId) => API.get(`/room/hotel/${hotelId}`);

export const getAvailableRooms = (hotelId) =>
  API.get(`/room/hotel/${hotelId}/available`);

export const getRoom = (hotelId, roomType) =>
  API.get(`/room/${hotelId}/${encodeURIComponent(roomType)}`);

// Booking Preference APIs
export const getUserPreferences = (userId) =>
  API.get(`/preference/user/${userId}`);

export const getPreference = (userId, preferenceType) =>
  API.get(`/preference/${userId}/${encodeURIComponent(preferenceType)}`);

export const savePreference = (userId, preferenceType, preferenceValue) =>
  API.post("/preference/save", null, {
    params: {
      userId,
      preferenceType,
      preferenceValue,
    },
  });

export const deletePreference = (preferenceId) =>
  API.delete(`/preference/${preferenceId}`);

export default API;
