package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.RecommendationFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RecommendationFeedbackRepository extends JpaRepository<RecommendationFeedback, Long> {

    List<RecommendationFeedback> findByUserId(Long userId);
    Optional<RecommendationFeedback> findByUserIdAndItemId(Long userId, Long itemId);
}
