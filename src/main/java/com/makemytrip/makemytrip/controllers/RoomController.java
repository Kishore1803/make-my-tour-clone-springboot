package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Room;
import com.makemytrip.makemytrip.services.RoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/room")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // Get all rooms of a hotel
    @GetMapping("/hotel/{hotelId}")
    public List<Room> getRoomsByHotel(@PathVariable Long hotelId) {
        return roomService.getRoomsByHotel(hotelId);
    }

    // Get available rooms
    @GetMapping("/hotel/{hotelId}/available")
    public List<Room> getAvailableRooms(@PathVariable Long hotelId) {
        return roomService.getAvailableRooms(hotelId);
    }

    // Get specific room type
    @GetMapping("/{hotelId}/{roomType}")
    public Room getRoom(@PathVariable Long hotelId, @PathVariable String roomType) {
        return roomService.getRoom(hotelId, roomType);
    }

    // Get room by ID
    @GetMapping("/id/{roomId}")
    public Room getRoomById(@PathVariable Long roomId) {
        return roomService.getRoomById(roomId);
    }
}