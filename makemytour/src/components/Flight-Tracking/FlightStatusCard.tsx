import { useRouter } from "next/router";
import { Plane, Clock, AlertTriangle, CheckCircle, Bell } from "lucide-react";

export interface Flight {
  id: number;
  flightNumber: string;
  from: string;
  to: string;
  departureTime?: string;
  arrivalTime?: string;
  status?: string;
  reason?: string;
  delayMinutes?: number;
  estimatedDepartureTime?: string;
  estimatedArrivalTime?: string;
  lastUpdated?: string;
}

interface FlightStatusCardProps {
  flight: Flight;
  onTrack: () => void;
  isTracked?: boolean;
}

const FlightStatusCard = ({
  flight,
  onTrack,
  isTracked = false,
}: FlightStatusCardProps) => {
  const router = useRouter();
  const status = flight.status?.toUpperCase() || "ON_TIME";
  const statusConfig = {
    ON_TIME: {
      text: "On Time",
      bg: "bg-green-100",
      textColor: "text-green-700",
      border: "border-green-200",
      icon: CheckCircle,
    },
    BOARDING: {
      text: "Boarding",
      bg: "bg-yellow-100",
      textColor: "text-yellow-700",
      border: "border-yellow-200",
      icon: Plane,
    },
    DELAYED: {
      text: "Delayed",
      bg: "bg-red-100",
      textColor: "text-red-700",
      border: "border-red-200",
      icon: AlertTriangle,
    },
    CANCELLED: {
      text: "Cancelled",
      bg: "bg-gray-100",
      textColor: "text-gray-700",
      border: "border-gray-200",
      icon: AlertTriangle,
    },
    DEPARTED: {
      text: "Departed",
      bg: "bg-blue-100",
      textColor: "text-blue-700",
      border: "border-blue-200",
      icon: Plane,
    },
    ARRIVED: {
      text: "Arrived",
      bg: "bg-purple-100",
      textColor: "text-purple-700",
      border: "border-purple-200",
      icon: CheckCircle,
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.ON_TIME;
  const StatusIcon = config.icon;
  const handleViewDetails = () => {
    router.push(`/flight-tracking/${flight.id}`);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Flight
          </p>
          <h3 className="mt-1 text-xl font-bold text-gray-900">
            {flight.flightNumber}
          </h3>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${config.bg} ${config.textColor}`}
        >
          <StatusIcon className="h-4 w-4" />
          {config.text}
        </div>
      </div>

      {/* Flight Route */}
      <div className="px-5 py-6">
        <div className="flex items-center justify-between">
          {/* Departure */}
          <div className="w-20">
            <p className="text-2xl font-bold text-gray-900">{flight.from}</p>
            <p className="mt-1 text-xs text-gray-400">Departure</p>
            <div className="mt-2 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">
                {flight.estimatedDepartureTime || flight.departureTime || "--:--"}
              </span>
            </div>
          </div>

          {/* Flight Path */}
          <div className="flex flex-1 items-center px-3">
            <div className="h-px flex-1 bg-gray-300" />
            <div className="mx-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          {/* Arrival */}
          <div className="w-24 text-right">
            <p className="text-2xl font-bold text-gray-900">{flight.to}</p>
            <p className="mt-1 text-xs text-gray-400">Arrival</p>
            <div className="mt-2 flex items-center justify-end gap-1">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">
                {flight.estimatedArrivalTime || flight.arrivalTime || "--:--"}
              </span>
            </div>
          </div>
        </div>

        {/* Delayed */}
        {status === "DELAYED" && (
          <div
            className={`mt-5 rounded-xl border p-4 ${config.bg} ${config.border}`}
          >
            <div className="flex gap-3">
              <AlertTriangle className={`mt-0.5 h-5 w-5 ${config.textColor}`} />
              <div>
                <p className={`text-sm font-bold ${config.textColor}`}>
                  Flight Delayed
                </p>
                {flight.delayMinutes !== undefined &&
                  flight.delayMinutes > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      Delayed by{" "}
                      <span className="font-bold">
                        {flight.delayMinutes} minutes
                      </span>
                    </p>
                  )}

                <p className="mt-1 text-xs text-red-600">
                  {flight.reason ||
                    "The flight has been delayed due to operational reasons."}
                </p>
                {flight.estimatedArrivalTime && (
                  <p className="mt-2 text-xs font-semibold text-red-700">
                    Revised arrival: {flight.estimatedArrivalTime}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Boarding */}
        {status === "BOARDING" && (
          <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex gap-3">
              <Bell className="h-5 w-5 text-yellow-600" />

              <div>
                <p className="text-sm font-bold text-yellow-700">
                  Boarding in Progress
                </p>
                <p className="mt-1 text-xs text-yellow-600">
                  Please proceed to the boarding gate.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cancelled */}
        {status === "CANCELLED" && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-bold text-gray-700">
                  Flight Cancelled
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {flight.reason || "This flight has been cancelled."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* On Time */}
        {status === "ON_TIME" && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-bold text-green-700">
                  Flight is On Time
                </p>
                <p className="mt-1 text-xs text-green-600">
                  {flight.reason ||
                    "The flight is operating according to schedule."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-gray-400">Last updated</span>
          <span className="text-xs font-medium text-gray-500">
            {flight.lastUpdated || "Just now"}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={onTrack}
            disabled={isTracked}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              isTracked
                ? "cursor-not-allowed bg-green-100 text-green-700"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {isTracked ? "✓ Tracking" : "Track Flight"}
          </button>

          <button
            onClick={handleViewDetails}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightStatusCard;
