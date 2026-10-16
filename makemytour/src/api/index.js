import axios from "axios";

const BACKEND_URL =
  "https://make-my-tour-clone-springboot-backend.onrender.com";

const API = axios.create({ baseURL: BACKEND_URL, timeout: 60000 });

// COMMON ERROR HANDLER
const handleApiError = (operation, error) => {
  console.error(
    `${operation} failed:`,
    error.response?.status,
    error.response?.data || error.message,
  );
  throw error;
};

// USER LOGIN
export const login = async (email, password) => {
  try {
    const response = await API.post("/user/login", null, {
      params: { email, password },
    });
    return response.data;
  } catch (error) {
    handleApiError("Login", error);
  }
};

// USER SIGNUP
export const signup = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
) => {
  try {
    const response = await API.post("/user/signup", {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    return response.data;
  } catch (error) {
    handleApiError("Signup", error);
  }
};

// GET USER BY EMAIL
export const getuserbyemail = async (email) => {
  try {
    const response = await API.get("/user/email", {
      params: { email },
    });
    return response.data;
  } catch (error) {
    handleApiError("Get user by email", error);
  }
};

// EDIT USER PROFILE
export const editprofile = async (
  id,
  firstName,
  lastName,
  email,
  phoneNumber,
) => {
  try {
    const response = await API.post(
      "/user/edit",
      {
        firstName,
        lastName,
        email,
        phoneNumber,
      },
      {
        params: { id },
      },
    );
    return response.data;
  } catch (error) {
    handleApiError("Edit profile", error);
  }
};

// FLIGHT APIs
export const getflight = async () => {
  try {
    const response = await API.get("/flight");
    return response.data;
  } catch (error) {
    handleApiError("Get flights", error);
  }
};

export const addflight = async (
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats,
) => {
  try {
    const response = await API.post("/admin/flight", {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    });
    return response.data;
  } catch (error) {
    handleApiError("Add flight", error);
  }
};

export const editflight = async (
  id,
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats,
) => {
  try {
    const response = await API.put(`/admin/flight/${id}`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    });
    return response.data;
  } catch (error) {
    handleApiError("Edit flight", error);
  }
};

// HOTEL APIs
export const gethotel = async () => {
  try {
    const response = await API.get("/hotel");
    return response.data;
  } catch (error) {
    handleApiError("Get hotels", error);
  }
};

export const addhotel = async (
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities,
) => {
  try {
    const response = await API.post("/admin/hotel", {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    });
    return response.data;
  } catch (error) {
    handleApiError("Add hotel", error);
  }
};

export const edithotel = async (
  id,
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities,
) => {
  try {
    const response = await API.put(`/admin/hotel/${id}`, {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    });
    return response.data;
  } catch (error) {
    handleApiError("Edit hotel", error);
  }
};

// FLIGHT BOOKING
export const handleflightbooking = async (
  userId,
  flightId,
  seats,
  price,
  selectedSeat,
) => {
  try {
    const response = await API.post("/booking/flight", null, {
      params: {
        userId: Number(userId),
        flightId: Number(flightId),
        seats: Number(seats),
        price: Number(price),
        selectedSeat,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError("Flight booking", error);
  }
};

// HOTEL BOOKING
export const handlehotelbooking = async (userId, hotelId, rooms, price) => {
  try {
    const response = await API.post("/booking/hotel", null, {
      params: {
        userId: Number(userId),
        hotelId: Number(hotelId),
        rooms: Number(rooms),
        price: Number(price),
      },
    });
    return response.data;
  } catch (error) {
    handleApiError("Hotel booking", error);
  }
};

export default API;
