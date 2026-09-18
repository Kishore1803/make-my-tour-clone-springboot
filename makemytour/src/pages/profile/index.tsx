import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  Edit2,
  MapPin,
  Calendar,
  CreditCard,
  X,
  Check,
  LogOut,
  Plane,
  Building2,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { clearUser, setUser } from "@/store";
import { editprofile } from "@/api";
import FlightTracking from "@/components/Flight-Tracking/FlightTracking";

const Index = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const bookings = user?.bookings || [];

  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bookings: user?.bookings || [],
  });

  const [editForm, setEditForm] = useState({
    ...userData,
  });

  const logout = () => {
    dispatch(clearUser());
    router.push("/");
  };

  const handleSave = async () => {
    try {
      const data = await editprofile(
        user?.id,
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phoneNumber,
      );

      const updatedUser = {
        ...data,
        bookings: data?.bookings || bookings,
      };

      dispatch(setUser(updatedUser));

      setUserData({
        firstName: updatedUser?.firstName || "",
        lastName: updatedUser?.lastName || "",
        email: updatedUser?.email || "",
        phoneNumber: updatedUser?.phoneNumber || "",
        bookings: updatedUser?.bookings || [],
      });

      setEditForm({
        firstName: updatedUser?.firstName || "",
        lastName: updatedUser?.lastName || "",
        email: updatedUser?.email || "",
        phoneNumber: updatedUser?.phoneNumber || "",
        bookings: updatedUser?.bookings || [],
      });

      setIsEditing(false);
      alert("Profile updated successfully!");

    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");

      setUserData({
        firstName: editForm?.firstName || "",
        lastName: editForm?.lastName || "",
        email: editForm?.email || "",
        phoneNumber: editForm?.phoneNumber || "",
        bookings: editForm?.bookings || [],
      });
      setIsEditing(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "Date not available";
    }
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleEditFormChange = (field: string, value: string) => {
    setUserData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Login Required</h2>
          <p className="text-gray-500 mt-2">
            Please log in to view your profile.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-5 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 px-4 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Profile</h2>

                {!isEditing && (
                  <button
                    onClick={() => {
                      setEditForm({
                        firstName: user?.firstName || "",
                        lastName: user?.lastName || "",
                        email: user?.email || "",
                        phoneNumber: user?.phoneNumber || "",
                        bookings: user?.bookings || [],
                      });

                      setIsEditing(true);
                    }}
                    className="text-red-600 flex items-center space-x-1 hover:text-red-700"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) => handleEditFormChange("firstName", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) => handleEditFormChange("lastName", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleEditFormChange("email", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userData.phoneNumber}
                      onChange={(e) => handleEditFormChange("phoneNumber", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setUserData({
                          firstName: user?.firstName || "",
                          lastName: user?.lastName || "",
                          email: user?.email || "",
                          phoneNumber: user?.phoneNumber || "",
                          bookings: user?.bookings || [],
                        });
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (

                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <p>{user?.email}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <p>{user?.phoneNumber}</p>
                  </div>

                  <button
                    className="w-full mt-4 flex items-center justify-center space-x-2 text-red-600 hover:text-red-700"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">My Bookings</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Your flight and hotel bookings
                  </p>
                </div>

                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-600">
                  {bookings.length}{" "}
                  {bookings.length === 1 ? "Booking" : "Bookings"}
                </div>
              </div>

              <div className="space-y-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-10">
                    <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      No Bookings Yet
                    </h3>
                    <p className="text-gray-500 mt-1">
                      Your flight and hotel bookings will appear here.
                    </p>
                  </div>
                ) : (
                  bookings.map((booking: any, index: number) => (
                    <div key={booking?.bookingId || `${booking?.type}-${index}`}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow">

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {booking?.type === "Flight" ? (
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Plane className="w-6 h-6 text-blue-600" />
                            </div>
                          ) : (
                            <div className="bg-green-100 p-2 rounded-lg">
                              <Building2 className="w-6 h-6 text-green-600" />
                            </div>
                          )}

                          <div>
                            <h3 className="font-semibold">
                              {booking?.type || "Booking"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Booking ID:{" "}
                              {booking?.bookingId || "Not available"}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">
                            ₹{" "}
                            {Number(booking?.totalPrice || 0).toLocaleString(
                              "en-IN",
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking?.type || "Booking"}
                          </p>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {booking?.date
                              ? formatDate(booking.date)
                              : "Date not available"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{booking?.type || "Booking"}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <CreditCard className="w-4 h-4" />
                          <span className="text-green-600 font-medium">
                            Paid
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <FlightTracking userId={Number(user.id)} />
        </div>
      </div>
    </div>
  );
};

export default Index;
