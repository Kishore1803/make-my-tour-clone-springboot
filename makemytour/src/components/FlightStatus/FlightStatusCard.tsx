"use client";

import FlightStatusBadge from "./FlightStatusBadge";

interface FlightStatusCardProps {
  flight: {
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
  };
  onTrack?: (flight: FlightStatusCardProps["flight"]) => void;
  isTracked?: boolean;
}

export default function FlightStatusCard({
  flight,
  onTrack,
  isTracked = false,
}: FlightStatusCardProps) {
  const isDelayed = flight.status?.toUpperCase() === "DELAYED";
  const departureChanged =
    flight.revisedDeparture !== flight.scheduledDeparture;
  const arrivalChanged = flight.estimatedArrival !== flight.scheduledArrival;

  const formatUpdatedTime = (value: string) => {
    if (!value) return "Unavailable";
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <article className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-gray-900">
            {flight.flightNumber}
          </p>
          <p className="mt-1 text-sm text-gray-500">{flight.airline}</p>
        </div>
        <FlightStatusBadge status={flight.status} />
      </div>

      {/* Route */}
      <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div>
          <p className="text-2xl font-bold text-gray-900">{flight.fromCity}</p>
          <p className="mt-2 text-sm text-gray-500">Departure</p>
          <p className="mt-1 font-semibold text-gray-800">
            {flight.scheduledDeparture}
          </p>

          {departureChanged && (
            <p className="mt-1 text-sm font-semibold text-orange-600">
              Revised: {flight.revisedDeparture}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center px-1">
          <span className="text-xl" aria-hidden="true">
            ✈
          </span>

          <div className="my-2 h-0.5 w-12 bg-gray-300 sm:w-20" />
          <span className="text-xs text-gray-500">Flight route</span>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{flight.toCity}</p>
          <p className="mt-2 text-sm text-gray-500">Scheduled arrival</p>
          <p className="mt-1 font-semibold text-gray-800">
            {flight.scheduledArrival}
          </p>

          {arrivalChanged && (
            <p className="mt-1 text-sm font-semibold text-orange-600">
              Estimated: {flight.estimatedArrival}
            </p>
          )}
        </div>
      </div>

      {/* Delay information */}
      {isDelayed && (
        <div className="mb-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="font-semibold text-orange-800">
            Flight delayed
            {flight.delayMinutes > 0
              ? ` by ${Math.floor(flight.delayMinutes / 60)}h${
                  flight.delayMinutes % 60
                    ? ` ${flight.delayMinutes % 60}m`
                    : ""
                }`
              : ""}
          </p>

          {flight.delayReason && (
            <p className="mt-1 text-sm text-orange-700">
              Reason: {flight.delayReason}
            </p>
          )}

          <p className="mt-2 text-sm text-gray-700">
            Revised departure: {flight.revisedDeparture}
          </p>

          <p className="text-sm text-gray-700">
            Estimated arrival: {flight.estimatedArrival}
          </p>
        </div>
      )}

      {/* Flight progress */}
      <div className="mb-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-gray-700">Flight progress</span>
          <span className="text-gray-500">{flight.progress ?? 0}%</span>
        </div>

        <div
          className="h-2 w-full overflow-hidden rounded-full bg-gray-100"
          role="progressbar"
          aria-label="Flight progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(100, Math.max(0, flight.progress ?? 0))}
        >
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.max(0, flight.progress ?? 0))}%`,
            }}
          />
        </div>
      </div>

      {/* Terminal and gate */}
      <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
        <div>
          <p className="text-xs text-gray-500">Terminal</p>
          <p className="mt-1 font-semibold text-gray-800">
            {flight.terminal || "Not assigned"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Gate</p>
          <p className="mt-1 font-semibold text-gray-800">
            {flight.gate || "Not assigned"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          Updated: {formatUpdatedTime(flight.lastUpdated)}
        </p>

        {onTrack && (
          <button
            type="button"
            onClick={() => onTrack(flight)}
            disabled={isTracked}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              isTracked
                ? "cursor-not-allowed bg-green-100 text-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isTracked ? "Tracking" : "Track Flight"}
          </button>
        )}
      </div>
    </article>
  );
}
