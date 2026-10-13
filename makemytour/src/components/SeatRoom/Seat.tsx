interface SeatProps {
  seatNumber: string;
  seatType: string;
  price: number;
  available: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const Seat = ({
  seatNumber,
  seatType,
  price,
  available,
  selected = false,
  onClick,
}: SeatProps) => {
  const getSeatStyle = () => {
    if (!available) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed";
    }

    if (selected) {
      return "bg-blue-600 text-white border-blue-600";
    }

    if (seatType?.toLowerCase() === "premium") {
      return "bg-yellow-100 text-yellow-800 border-yellow-400";
    }

    if (seatType?.toLowerCase() === "business") {
      return "bg-purple-100 text-purple-800 border-purple-400";
    }
    return "bg-green-100 text-green-800 border-green-400";
  };

  return (
    <button
      type="button"
      disabled={!available}
      onClick={onClick}
      className={`min-h-[55px] rounded-lg border px-3 py-2 transition hover:scale-105 ${getSeatStyle()}`}
    >
      <div className="text-sm font-bold">{seatNumber}</div>

      <div className="text-xs">
        {price > 0 ? `₹${price.toLocaleString()}` : "Free"}
      </div>
    </button>
  );
};

export default Seat;
