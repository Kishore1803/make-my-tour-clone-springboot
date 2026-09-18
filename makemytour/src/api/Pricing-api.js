import axios from "axios";

const API = axios.create({
  baseURL: "https://make-my-tour-clone-springboot-backend.onrender.com/api",
});

// Dynamic Flight Price
export const getFlightDynamicPrice = (flightId, basePrice, availableSeats) => {
  return API.get(`/pricing/flight/${flightId}`, {
    params: {
      basePrice,
      availableSeats,
    },
  });
};

// Flight Price History
export const getFlightPriceHistory = (flightId) => {
  return API.get(`/pricing/history/flight/${flightId}`);
};

// Freeze Flight Price
export const freezeFlightPrice = (userId, flightId, price, minutes) => {
  return API.post("/pricing/freeze/flight", null, {
    params: {
      userId,
      flightId,
      price,
      minutes,
    },
  });
};

// Freeze Hotel Price
export const freezeHotelPrice = (userId, hotelId, price, minutes) => {
  return API.post("/pricing/freeze/hotel", null, {
    params: {
      userId,
      hotelId,
      price,
      minutes,
    },
  });
};

// Get Flight Freeze
export const getFlightFreeze = (userId, flightId) => {
  return API.get(`/pricing/freeze/flight/${userId}/${flightId}`);
};

// Dynamic Hotel Price
export const getHotelDynamicPrice = (hotelId, basePrice, availableRooms) => {
  return API.get(`/pricing/hotel/${hotelId}`, {
    params: {
      basePrice,
      availableRooms,
    },
  });
};

// Hotel Price History
export const getHotelPriceHistory = (hotelId) => {
  return API.get(`/pricing/history/hotel/${hotelId}`);
};

// Get Hotel Freeze
export const getHotelFreeze = (userId, hotelId) => {
  return API.get(`/pricing/freeze/hotel/${userId}/${hotelId}`);
};

// Get User Freezes
export const getUserFreezes = (userId) => {
  return API.get(`/pricing/freeze/user/${userId}`);
};
