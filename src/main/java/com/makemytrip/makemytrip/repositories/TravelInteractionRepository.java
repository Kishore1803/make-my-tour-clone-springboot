package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.TravelInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TravelInteractionRepository extends JpaRepository<TravelInteraction, Long> {

    List<TravelInteraction> findByUserId(Long userId);
    List<TravelInteraction> findByUserIdIn(List<Long> userIds);
}
