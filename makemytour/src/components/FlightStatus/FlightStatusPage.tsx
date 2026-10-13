
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAllFlights,
  getFlightStatus,
} from "@/api/FlightStatusApi";

import EnableFlightNotifications from "./EnableFlightNotification";
import FlightSearch from "./FlightSearch";
import FlightStatusCard from "./FlightStatusCard";
import FlightTimeline from "./FlightTimeline";
import FlightNotification from "./FlightNotification";
import TrackedFlights, { type TrackedFlight } from "./TrackedFlights";
import useFlightStatusFeatures from "./useFlightStatusFeatures";

interface Flight extends TrackedFlight {
  id: number;
  flightNumber: string;
  airline: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  scheduledDeparture: string;
  revisedDeparture: string;
  scheduledArrival: string;
  estimatedArrival: string;
  status: string;
  delayMinutes: number;
  delayReason: string | null;
  terminal: string;
  gate: string;
  progress: number;
  lastUpdated: string;
}

export default function FlightStatusPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    trackedFlights,
    notifications,
    trackFlight,
    removeTrackedFlight,
    markNotificationRead,
    clearNotifications,
    processFlightUpdates,
  } = useFlightStatusFeatures();

  // Load flights and compare them with the previous snapshot.
  const loadFlights = useCallback(async () => {
    try {
      setError("");

      const response = await getAllFlights();
      const data: Flight[] = response.data;

      processFlightUpdates(data);
      setFlights(data);

      setSearchResults((previous) =>
        previous.map(
          (oldFlight) =>
            data.find((flight) => flight.id === oldFlight.id) ??
            oldFlight
        )
      );

      setSelectedFlight((previous) =>
        previous
          ? data.find((flight) => flight.id === previous.id) ??
            previous
          : null
      );
    } catch (err) {
      console.error("Failed to load flight status:", err);
      setError(
        "Unable to load flights. Check that Spring Boot is running on port 8081."
      );
    } finally {
      setLoading(false);
    }
  }, [processFlightUpdates]);

  // Initial load and periodic refresh.
  useEffect(() => {
    void loadFlights();

    const intervalId = window.setInterval(() => {
      void loadFlights();
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [loadFlights]);

  // Search results from FlightSearch.
  const handleSearchResults = useCallback((results: Flight[]) => {
    setSearchResults(results);

    if (results.length === 1) {
      setSelectedFlight(results[0]);
    } else {
      setSelectedFlight(null);
    }
  }, []);

  // Add a flight to persistent tracking.
  const handleTrackFlight = useCallback(
    (flight: Flight) => {
      trackFlight(flight);
    },
    [trackFlight]
  );

  // Remove a flight from tracking.
  const handleRemoveTrackedFlight = useCallback(
    (flightId: string | number) => {
      removeTrackedFlight(flightId);
    },
    [removeTrackedFlight]
  );

  // Fetch the latest data when opening a tracked flight.
  const openTrackedFlight = useCallback(async (flight: Flight) => {
    try {
      const response = await getFlightStatus(flight.flightNumber);
      setSelectedFlight(response.data as Flight);
    } catch (err) {
      console.error("Failed to refresh selected flight:", err);
      setSelectedFlight(flight);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl space-y-10">

        {/* Page header */}
        <header className="rounded-3xl bg-gradient-to-r from-blue-950 via-blue-800 to-sky-700 p-6 text-white sm:p-10">
          <div className="mb-5">
            <EnableFlightNotifications />
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
            MakeMyTour
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Live Flight Status
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
            Track flights, check departure changes, and monitor estimated
            arrival times in one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/15 px-4 py-2">
              {flights.length} available flights
            </span>

            <span className="rounded-full bg-white/15 px-4 py-2">
              {trackedFlights.length} tracked flights
            </span>

            <span className="rounded-full bg-white/15 px-4 py-2">
              Refreshes every 30 seconds
            </span>

            <span className="rounded-full bg-white/15 px-4 py-2">
              {notifications.filter((item) => !item.read).length} unread alerts
            </span>
          </div>
        </header>

        {/* Flight search */}
        <section>
          <FlightSearch
            onResults={(results) =>
              handleSearchResults(results as Flight[])
            }
            onLoading={setSearchLoading}
          />
        </section>

        {/* Loading */}
        {(loading || searchLoading) && (
          <p className="text-sm text-gray-600 dark:text-gray-300" role="status">
            {loading ? "Loading flights..." : "Searching flights..."}
          </p>
        )}

        {/* API errors */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}

            <button
              type="button"
              onClick={() => void loadFlights()}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Search results */}
        {searchResults.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Search Results
            </h2>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {searchResults.map((flight) => (
                <FlightStatusCard
                  key={flight.id}
                  flight={flight}
                  onTrack={handleTrackFlight}
                  isTracked={trackedFlights.some(
                    (tracked) => tracked.id === flight.id
                  )}
                />
              ))}
            </div>
          </section>
        )}

        {/* Selected flight timeline */}
        {selectedFlight && (
          <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Flight Journey: {selectedFlight.flightNumber}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {selectedFlight.fromCity} → {selectedFlight.toCity}
              </p>
            </div>

            <FlightTimeline
              status={selectedFlight.status}
              scheduledDeparture={selectedFlight.scheduledDeparture}
              revisedDeparture={selectedFlight.revisedDeparture}
              scheduledArrival={selectedFlight.scheduledArrival}
              estimatedArrival={selectedFlight.estimatedArrival}
              progress={selectedFlight.progress}
            />
          </section>
        )}

        {/* Available flights */}
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Available Flights
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track a flight to save it in your tracked list.
            </p>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading flight data...</p>
          ) : flights.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="font-semibold text-gray-800 dark:text-white">
                No flights available
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Add mock flight data through Postman and refresh this page.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {flights.map((flight) => (
                <div key={flight.id} className="space-y-3">
                  <FlightStatusCard
                    flight={flight}
                    onTrack={handleTrackFlight}
                    isTracked={trackedFlights.some(
                      (tracked) => tracked.id === flight.id
                    )}
                  />

                  <button
                    type="button"
                    onClick={() => void openTrackedFlight(flight)}
                    className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400"
                  >
                    View flight timeline
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Tracked flights */}
        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Tracked Flights
          </h2>

          <TrackedFlights
            flights={trackedFlights}
            onTrack={handleTrackFlight}
            onRemove={handleRemoveTrackedFlight}
            onTrackFlight={openTrackedFlight}
          />
        </section>

        {/* Notifications */}
        <FlightNotification
          notifications={notifications}
          onMarkRead={markNotificationRead}
          onClear={clearNotifications}
        />

        <p className="text-center text-xs text-gray-500">
          Flight information is simulated using mock data and is not an
          official airline tracking service.
        </p>
      </div>
    </main>
  );
}
