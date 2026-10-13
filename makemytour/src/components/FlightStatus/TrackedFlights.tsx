"use client";

import { useState } from "react";
import FlightStatusBadge from "./FlightStatusBadge";

export interface TrackedFlight {
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

interface TrackedFlightsProps {
  flights: TrackedFlight[];
  onTrack?: (flight: TrackedFlight) => void;
  onRemove?: (flightId: string | number) => void;
  onTrackFlight?: (flight: TrackedFlight) => void;
}

export default function TrackedFlights({
  flights,
  onTrack,
  onRemove,
  onTrackFlight,
}: TrackedFlightsProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleFlights = showAll ? flights : flights.slice(0, 3);
  const formatTime = (time?: string) => {
    if (!time) return "Not available";
    return time;
  };

  const formatDate = (date?: string) => {
    if (!date) return "Date unavailable";
    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatUpdatedAt = (date?: string) => {
    if (!date) return "Not available";
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tracked Flights
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor your saved flights and their latest status.
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-200">
          {flights.length} tracked
        </span>
      </div>

      {flights.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl dark:bg-blue-950">
            ✈️
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            No tracked flights yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
            Add a flight from Available Flights or Search Results to monitor its
            departure, arrival, gate, and delay updates.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {visibleFlights.map((flight) => (
              <article
                key={flight.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Flight header */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 p-5 dark:border-gray-800">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {flight.airline || "Airline"}
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                      {flight.flightNumber}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(flight.departureDate)}
                    </p>
                  </div>

                  <FlightStatusBadge status={flight.status} />
                </div>

                {/* Route */}
                <div className="p-5">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {flight.fromCity}
                      </p>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Departure
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {formatTime(flight.revisedDeparture || flight.scheduledDeparture)}
                      </p>

                      {flight.revisedDeparture &&
                        flight.revisedDeparture !==
                          flight.scheduledDeparture && (
                          <p className="mt-1 text-xs text-amber-600">
                            Scheduled: {flight.scheduledDeparture}
                          </p>
                        )}
                    </div>

                    <div className="flex flex-col items-center px-1">
                      <span className="text-xl" aria-hidden="true">
                        ✈️
                      </span>

                      <div className="my-2 h-px w-12 bg-blue-300 dark:bg-blue-700" />

                      <span className="text-xs text-gray-400">
                        {flight.progress ?? 0}%
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {flight.toCity}
                      </p>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Arrival
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {formatTime(flight.estimatedArrival || flight.scheduledArrival)}
                      </p>

                      {flight.estimatedArrival &&
                        flight.estimatedArrival !== flight.scheduledArrival && (
                          <p className="mt-1 text-xs text-amber-600">
                            Scheduled: {flight.scheduledArrival}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, flight.progress ?? 0),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Delay details */}
                  {flight.status === "DELAYED" && (
                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                        Flight delayed
                        {flight.delayMinutes > 0
                          ? ` by ${flight.delayMinutes} minutes`
                          : ""}
                      </p>

                      {flight.delayReason && (
                        <p className="mt-1 text-sm text-amber-700 dark:text-amber-200">
                          Reason: {flight.delayReason}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Terminal and gate */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Terminal
                      </p>

                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {flight.terminal || "TBA"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Gate
                      </p>

                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {flight.gate || "TBA"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-gray-400">
                    Last updated: {formatUpdatedAt(flight.lastUpdated)}
                  </p>

                  {/* Actions */}
                  <div className="mt-5 flex flex-wrap gap-3">
                    {onTrackFlight && (
                      <button
                        type="button"
                        onClick={() => onTrackFlight(flight)}
                        className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Timeline
                      </button>
                    )}

                    {onRemove && (
                      <button
                        type="button"
                        onClick={() => onRemove(flight.id)}
                        className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                      >
                        Remove
                      </button>
                    )}

                    {onTrack && (
                      <button
                        type="button"
                        onClick={() => onTrack(flight)}
                        className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200"
                      >
                        Track again
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {flights.length > 3 && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowAll((current) => !current)}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                {showAll
                  ? "Show fewer flights"
                  : `View all ${flights.length} tracked flights`}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
