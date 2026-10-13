package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Room;
import com.makemytrip.makemytrip.repositories.RoomRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    // Get all rooms of a hotel
    public List<Room> getRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotelIdOrderByPricePerNightAsc(hotelId);
    }

    // Get only available rooms
    public List<Room> getAvailableRooms(Long hotelId) {
        return roomRepository.findByHotelIdAndAvailableRoomsGreaterThan(hotelId, 0);
    }

    // Get specific room
    public Room getRoom(Long hotelId, String roomType) {
        return roomRepository.findByHotelIdAndRoomType(hotelId, roomType)
                .orElseThrow(() -> new RuntimeException("Room type not found"));
    }

    // Get room by ID
    public Room getRoomById(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    // Save room
    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    // Update room availability
    public void updateRoomAvailability(Long roomId, int availableRooms) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->new RuntimeException("Room not found"));

        if (availableRooms < 0) {
            throw new RuntimeException("Available rooms cannot be negative");
        }

        room.setAvailableRooms(availableRooms);
        roomRepository.save(room);
    }
}