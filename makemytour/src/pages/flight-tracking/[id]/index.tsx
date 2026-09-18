"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  getFlightTracking,
  trackFlight,
  stopTrackingFlight,
} from "@/api/Flight-Tracking-api";

interface FlightTrackingData {
  id?: number;
  userId?: number;
  flightId: number;
  flightNumber: string;
  status: string;
  reason?: string;
  departureTime?: string;
  arrivalTime?: string;
  estimatedArrivalTime?: string;
  lastUpdated?: string;
}

const FlightTrackingPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [flight, setFlight] = useState<FlightTrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);

  // Get logged-in user
  const getUserId = () => {
    if (typeof window === "undefined") {
      return null;
    }
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return null;
    }

    try {
      const user = JSON.parse(storedUser);
      return Number(user.id);
    } catch (error) {
      console.error("Unable to read user:", error);
      return null;
    }
  };

  const loadFlight = async () => {
    if (!id) return;
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getFlightTracking(userId, Number(id));
      setFlight(data);
      if (data) {
        setTracking(true);
      }
    } catch (error) {
      console.error("Error loading flight tracking:", error);
      setFlight(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    loadFlight();
  }, [router.isReady, id]);

  useEffect(() => {
    if (!id) return;

    const interval = setInterval(() => {
      loadFlight();
    }, 60000);

    return () => clearInterval(interval);
  }, [id]);

  const handleTrack = async () => {
    if (!id || !flight) return;
    const userId = getUserId();
    if (!userId) {
      alert("Please login to track this flight.");
      return;
    }

    try {
      await trackFlight(userId, Number(id), flight.flightNumber);
      setTracking(true);
      await loadFlight();
      alert("Flight tracking enabled!");
    } catch (error) {
      console.error("Error tracking flight:", error);
      alert("Unable to track flight.");
    }
  };

  const handleStopTracking = async () => {
    if (!id) return;
    const userId = getUserId();
    if (!userId) return;
    try {
      await stopTrackingFlight(userId, Number(id));
      setTracking(false);
      alert("Flight tracking stopped.");
    } catch (error) {
      console.error("Error stopping tracking:", error);
    }
  };

  const getStatusStyle = () => {
    switch (flight?.status?.toUpperCase()) {
      case "ON_TIME":
        return "bg-green-100 text-green-700";

      case "BOARDING":
        return "bg-yellow-100 text-yellow-700";

      case "DELAYED":
        return "bg-red-100 text-red-700";

      case "CANCELLED":
        return "bg-gray-200 text-gray-700";

      case "DEPARTED":
        return "bg-blue-100 text-blue-700";

      case "ARRIVED":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = () => {
    switch (flight?.status?.toUpperCase()) {
      case "ON_TIME":
        return "On Time";

      case "BOARDING":
        return "Boarding";

      case "DELAYED":
        return "Delayed";

      case "CANCELLED":
        return "Cancelled";

      case "DEPARTED":
        return "Departed";

      case "ARRIVED":
        return "Arrived";

      default:
        return flight?.status || "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
          <p className="mt-4 text-sm text-gray-500">Loading flight status...</p>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl">✈️</div>

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Flight not found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            We couldn't find tracking information for this flight.
          </p>

          <button
            onClick={() => router.back()}
            className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-gray-500">Live Flight Tracking</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              {flight.flightNumber}
            </h1>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle()}`}
          >
            ● {getStatusText()}
          </span>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {/* Route */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-3">
              {/* Departure */}
              <div>
                <p className="text-sm text-gray-500">Departure</p>
                <h2 className="mt-1 text-3xl font-bold text-gray-900">
                  {flight.departureTime || "--:--"}
                </h2>
              </div>

              {/* Flight Line */}
              <div className="flex items-center">
                <div className="h-px flex-1 bg-gray-300" />
                <div className="mx-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-xl text-white">
                  ✈
                </div>
                <div className="h-px flex-1 bg-gray-300" />
              </div>

              {/* Arrival */}
              <div className="sm:text-right">
                <p className="text-sm text-gray-500">Estimated Arrival</p>

                <h2 className="mt-1 text-3xl font-bold text-gray-900">
                  {flight.estimatedArrivalTime || flight.arrivalTime || "--:--"}
                </h2>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="border-t bg-gray-50 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900">
              Current Flight Status
            </h3>

            {/* Status */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-4">
                <p className="text-xs text-gray-500">Status</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {getStatusText()}
                </p>
              </div>

              <div className="rounded-xl bg-white p-4">
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {flight.lastUpdated || "Just now"}
                </p>
              </div>
            </div>

            {/* Reason */}
            {flight.reason && (
              <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-xs font-semibold uppercase text-yellow-700">
                  Latest Update
                </p>
                <p className="mt-1 text-sm text-yellow-800">{flight.reason}</p>
              </div>
            )}

            {/* Estimated Arrival */}
            {flight.estimatedArrivalTime && (
              <div className="mt-4 rounded-xl border bg-white p-4">
                <p className="text-xs text-gray-500">Revised Arrival Time</p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {flight.estimatedArrivalTime}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t p-6 sm:flex-row">
            {tracking ? (
              <button
                onClick={handleStopTracking}
                className="flex-1 rounded-lg border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Stop Tracking
              </button>
            ) : (
              <button
                onClick={handleTrack}
                className="flex-1 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Track This Flight
              </button>
            )}

            <button
              onClick={loadFlight}
              className="rounded-lg border px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              ↻ Refresh Status
            </button>
          </div>
        </div>

        {/* Live Update Info */}
        <div className="mt-6 rounded-xl border bg-white p-5">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
              🟢
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Live Updates Enabled
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Flight status is automatically refreshed every 60 seconds.
                Important changes can be displayed through notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightTrackingPage;
