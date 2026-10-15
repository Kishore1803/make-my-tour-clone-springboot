package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.PricingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PricingItemRepository extends JpaRepository<PricingItem, Long> {
    Optional<PricingItem> findByItemTypeAndItemId(String itemType, Long itemId);
}
