import axios from "axios";

const API = axios.create({
  baseURL: "https://make-my-tour-clone-springboot-backend.onrender.com/api",
});

// Seat Selection APIs
export const getSeatsByFlight = (flightId) => {
  return API.get(`/seat/flight/${flightId}`);
};

export const getAvailableSeats = (flightId) => {
  return API.get(`/seat/flight/${flightId}/available`);
};

export const getSeat = (flightId, seatNumber) => {
  return API.get(`/seat/${flightId}/${seatNumber}`);
};

// Room Selection APIs
export const getRoomsByHotel = (hotelId) => {
  return API.get(`/room/hotel/${hotelId}`);
};

export const getAvailableRooms = (hotelId) => {
  return API.get(`/room/hotel/${hotelId}/available`);
};

export const getRoom = (hotelId, roomType) => {
  return API.get(`/room/${hotelId}/${encodeURIComponent(roomType)}`);
};

// Booking Preference APIs
export const getUserPreferences = (userId) => {
  return API.get(`/preference/user/${userId}`);
};

export const getPreference = (userId, preferenceType) => {
  return API.get(`/preference/${userId}/${preferenceType}`);
};

export const savePreference = (userId, preferenceType, preferenceValue) => {
  return API.post("/preference/save", null, {
    params: {
      userId,
      preferenceType,
      preferenceValue,
    },
  });
};

export const deletePreference = (preferenceId) => {
  return API.delete(`/preference/${preferenceId}`);
};
