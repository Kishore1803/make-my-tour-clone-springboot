package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.RecommendationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecommendationItemRepository extends JpaRepository<RecommendationItem, Long> {
    List<RecommendationItem> findByActiveTrue();
}
