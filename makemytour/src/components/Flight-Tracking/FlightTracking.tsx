"use client";

import { useEffect, useState } from "react";
import NotificationBell from "./NotificationBell";
import FlightStatusCard, { Flight } from "./FlightStatusCard";
import TrackedFlightCard from "./TrackedFlightCard";
import {
  trackFlight,
  stopTrackingFlight,
  getTrackedFlights,
} from "@/api/Flight-Tracking-api";

interface FlightTrackingProps {
  userId: number;
}

const FlightTracking = ({ userId }: FlightTrackingProps) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [trackedFlights, setTrackedFlights] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const availableFlights: Flight[] = [
    {
      id: 1,
      flightNumber: "6E-201",
      from: "MAA",
      to: "DEL",
      departureTime: "10:30 AM",
      arrivalTime: "01:15 PM",
    },
    {
      id: 2,
      flightNumber: "AI-302",
      from: "MAA",
      to: "BOM",
      departureTime: "02:00 PM",
      arrivalTime: "04:00 PM",
    },
    {
      id: 3,
      flightNumber: "6E-450",
      from: "BLR",
      to: "HYD",
      departureTime: "06:30 PM",
      arrivalTime: "07:45 PM",
    },
    {
      id: 4,
      flightNumber: "AI-505",
      from: "DEL",
      to: "MAA",
      departureTime: "08:00 AM",
      arrivalTime: "10:45 AM",
    },
  ];

  const loadFlights = () => {
    const defaultFlights = availableFlights.map((flight) => ({
      ...flight,
      status: "On_Time",
      reason: "Flight is operating on schedule",
    }));
    setFlights(defaultFlights);
  };

  const loadTrackedFlights = async () => {
    try {
      const data = await getTrackedFlights(userId);
      setTrackedFlights(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading tracked flights:", error);
      setTrackedFlights([]);
    }
  };

  useEffect(() => {
    if (!userId) return;
    const loadData = async () => {
      setLoading(true);
      loadFlights();
      await loadTrackedFlights();
      setLoading(false);
    };

    loadData();

    // Refresh tracked flights every 60 seconds
    const interval = setInterval(() => {
      loadFlights();
      loadTrackedFlights();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [userId]);

  const handleTrack = async (flight: Flight) => {
    try {
      await trackFlight(userId, flight.id, flight.flightNumber);
      await loadTrackedFlights();
      setNotifications((previous) => [
        {
          id: Date.now(),
          title: "Flight Tracking Enabled",
          message: `${flight.flightNumber} is now being tracked.`,
          time: "Just now",
          type: "info",
        },
        ...previous,
      ]);
      alert(`${flight.flightNumber} is now being tracked!`);
    } catch (error) {
      console.error("Error tracking flight:", error);
      alert("Unable to track this flight.");
    }
  };

  const handleStopTracking = async (flightId: number) => {
    try {
      await stopTrackingFlight(userId, flightId);
      await loadTrackedFlights();
      setNotifications((previous) => [
        {
          id: Date.now(),
          title: "Tracking Stopped",
          message: "Flight tracking has been stopped.",
          time: "Just now",
          type: "info",
        },
        ...previous,
      ]);
    } catch (error) {
      console.error("Error stopping tracking:", error);
    }
  };

  const isFlightTracked = (flightId: number) => {
    return trackedFlights.some(
      (flight) => Number(flight.flightId) === Number(flightId),
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Flight Tracking</h2>
          <p className="mt-1 text-sm text-gray-500">
            Track your flights and receive live status updates.
          </p>
        </div>

        <NotificationBell notifications={notifications} />
      </div>

      {/* My Tracked Flights */}
      <div>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            My Tracked Flights
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Monitor your tracked flights and their latest status.
          </p>
        </div>

        {trackedFlights.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="font-semibold text-gray-700">No Tracked Flights</p>
            <p className="mt-1 text-sm text-gray-500">
              Track a flight below to receive status updates.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {trackedFlights.map((flight) => (
              <TrackedFlightCard
                key={flight.id || `${flight.userId}-${flight.flightId}`}
                flight={flight}
                onStopTracking={() =>
                  handleStopTracking(Number(flight.flightId))
                }
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">Available Flights</h3>
          <p className="mt-1 text-sm text-gray-500">
            Choose a flight to start tracking.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {flights.map((flight) => (
            <FlightStatusCard
              key={flight.id}
              flight={flight}
              onTrack={() => handleTrack(flight)}
              isTracked={isFlightTracked(flight.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlightTracking;
