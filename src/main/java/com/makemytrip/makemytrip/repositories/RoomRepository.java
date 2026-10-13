package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByHotelIdOrderByPricePerNightAsc(Long hotelId);
    List<Room> findByHotelIdAndAvailableRoomsGreaterThan(Long hotelId, int availableRooms);
    Optional<Room> findByHotelIdAndRoomType(Long hotelId, String roomType);
}