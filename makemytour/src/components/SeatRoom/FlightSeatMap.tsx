import { useEffect, useState } from "react";
import { getSeatsByFlight } from "@/api/SeatRoomApi";

interface Seat {
  id: number;
  flightId: number;
  seatNumber: string;
  seatType: string;
  price: number;
  available: boolean;
}

interface FlightSeatMapProps {
  flightId: number;
  selectedSeat?: Seat | null;
  onSeatSelect: (seat: Seat) => void;
}

const FlightSeatMap = ({
  flightId,
  selectedSeat,
  onSeatSelect,
}: FlightSeatMapProps) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSeats = async () => {
    try {
      const response = await getSeatsByFlight(flightId);
      setSeats(response.data);
    } catch (error) {
      console.error("Failed to load seats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (flightId) {
      fetchSeats();
    }
  }, [flightId]);

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">Loading seat map...</div>
    );
  }

  if (seats.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center text-gray-500">
        No seats available for this flight.
      </div>
    );
  }

  const getSeatClass = (seat: Seat) => {
    if (!seat.available) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed";
    }

    if (selectedSeat?.id === seat.id) {
      return "bg-blue-600 text-white border-blue-600";
    }

    if (seat.seatType?.toLowerCase() === "premium") {
      return "bg-yellow-100 text-yellow-800 border-yellow-400 hover:bg-yellow-200";
    }

    if (seat.seatType?.toLowerCase() === "business") {
      return "bg-purple-100 text-purple-800 border-purple-400 hover:bg-purple-200";
    }

    return "bg-green-100 text-green-800 border-green-400 hover:bg-green-200";
  };

  return (
    <div className="rounded-xl border bg-white p-5">
      <h2 className="mb-5 text-xl font-bold text-gray-800">Select Your Seat</h2>
      
      <div className="mb-5 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded border bg-green-100" />
          Available
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded border bg-yellow-100" />
          Premium
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded border bg-purple-100" />
          Business
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded border bg-gray-300" />
          Occupied
        </div>
      </div>

      <div className="mx-auto grid max-w-xl grid-cols-4 gap-3">
        {seats.map((seat) => (
          <button
            key={seat.id}
            type="button"
            disabled={!seat.available}
            onClick={() => onSeatSelect(seat)}
            className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${getSeatClass(
              seat,
            )}`}
          >
            <div>{seat.seatNumber}</div>
            {seat.price > 0 && (
              <div className="mt-1 text-xs">₹{seat.price.toLocaleString()}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FlightSeatMap;
