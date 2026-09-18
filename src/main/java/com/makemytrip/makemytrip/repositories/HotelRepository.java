package com.makemytrip.makemytrip.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.makemytrip.makemytrip.models.Hotel;

public interface HotelRepository extends JpaRepository<Hotel,Long>{
	Optional <Hotel> findById(Long id);
}