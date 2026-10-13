interface Room {
  id: number;
  roomType: string;
  pricePerNight: number;
  availableRooms: number;
  description: string;
  imageUrl?: string;
  previewUrl?: string;
}

interface RoomCardProps {
  room: Room;
  selected?: boolean;
  onSelect: () => void;
}

const RoomCard = ({ room, selected = false, onSelect }: RoomCardProps) => {
  const unavailable = room.availableRooms <= 0;

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition ${
        selected ? "border-blue-600 ring-2 ring-blue-100" : "border-gray-200"
      }`}
    >
      {/* Room Image */}
      <div className="relative h-48 bg-gray-100">
        {room.imageUrl ? (
          <img
            src={room.imageUrl}
            alt={room.roomType}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No room image
          </div>
        )}

        {room.availableRooms > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            {room.availableRooms} available
          </span>
        )}
      </div>

      {/* Room Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{room.roomType}</h3>
        <p className="mt-2 min-h-[40px] text-sm text-gray-500">
          {room.description}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xl font-bold text-gray-800">
              ₹{room.pricePerNight.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">per night</p>
          </div>

          <button
            type="button"
            disabled={unavailable}
            onClick={onSelect}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              unavailable
                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                : selected
                  ? "bg-blue-600 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {unavailable
              ? "Unavailable"
              : selected
                ? "Selected"
                : "Select Room"}
          </button>
        </div>

        {room.previewUrl && (
          <a
            href={room.previewUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-center text-sm font-medium text-blue-600 hover:underline"
          >
            View Room Preview
          </a>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
