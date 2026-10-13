package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.PriceFreeze;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PriceFreezeRepository extends JpaRepository<PriceFreeze, Long> {

    Optional<PriceFreeze>
    findFirstByUserIdAndItemTypeAndItemIdAndStatusOrderByExpiresAtDesc(Long userId, String itemType, Long itemId, String status);
}