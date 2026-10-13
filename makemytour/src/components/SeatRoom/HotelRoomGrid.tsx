import { useEffect, useState } from "react";
import { getRoomsByHotel } from "@/api/SeatRoomApi";

import RoomCard from "./RoomCard";

interface Room {
  id: number;
  hotelId: number;
  roomType: string;
  pricePerNight: number;
  availableRooms: number;
  description: string;
  imageUrl?: string;
  previewUrl?: string;
}

interface HotelRoomGridProps {
  hotelId: number;
  selectedRoom?: Room | null;
  onRoomSelect: (room: Room) => void;
}

const HotelRoomGrid = ({
  hotelId,
  selectedRoom,
  onRoomSelect,
}: HotelRoomGridProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const response = await getRoomsByHotel(hotelId);
      setRooms(response.data);
    } catch (error) {
      console.error("Failed to load rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hotelId) {
      fetchRooms();
    }
  }, [hotelId]);

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">
        Loading room options...
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center text-gray-500">
        No room options available.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-800">Select Your Room</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose a room type based on your preference and budget.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            selected={selectedRoom?.id === room.id}
            onSelect={() => onRoomSelect(room)}
          />
        ))}
      </div>
    </div>
  );
};

export default HotelRoomGrid;
