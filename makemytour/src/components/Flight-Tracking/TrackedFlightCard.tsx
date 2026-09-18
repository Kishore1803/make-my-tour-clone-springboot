interface TrackedFlight {
  id?: number;
  flightId: number;
  flightNumber: string;
  status: string;
  reason?: string;
  departureTime?: string;
  arrivalTime?: string;
  estimatedArrivalTime?: string;
  lastUpdated?: string;
}

interface TrackedFlightCardProps {
  flight: TrackedFlight;
  onStopTracking: () => void;
}

const TrackedFlightCard = ({
  flight,
  onStopTracking,
}: TrackedFlightCardProps) => {
  const getStatusStyle = () => {
    switch (flight.status?.toUpperCase()) {
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

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      {/* Top */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Flight</p>
          <h3 className="font-bold text-gray-900">{flight.flightNumber}</h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle()}`}
        >
          {flight.status?.replace("_", " ")}
        </span>
      </div>

      {/* Route */}
      <div className="mt-4 flex items-center gap-3">
        <div>
          <p className="font-semibold text-gray-800">
            {flight.departureTime || "--:--"}
          </p>
          <p className="text-xs text-gray-500">Departure</p>
        </div>

        <div className="flex flex-1 items-center">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="px-2 text-sm">✈</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <div className="text-right">
          <p className="font-semibold text-gray-800">
            {flight.estimatedArrivalTime || flight.arrivalTime || "--:--"}
          </p>
          <p className="text-xs text-gray-500">Estimated Arrival</p>
        </div>
      </div>

      {/* Reason */}
      {flight.reason && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-500">Latest Update</p>
          <p className="mt-1 text-sm text-gray-700">{flight.reason}</p>
        </div>
      )}

      {/* Last Updated */}
      {flight.lastUpdated && (
        <p className="mt-3 text-[11px] text-gray-400">
          Last updated: {flight.lastUpdated}
        </p>
      )}

      {/* Stop Tracking */}
      <button
        onClick={onStopTracking}
        className="mt-4 w-full rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        Stop Tracking
      </button>
    </div>
  );
};

export default TrackedFlightCard;
