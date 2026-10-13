package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.BrowserPushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BrowserPushSubscriptionRepository  extends JpaRepository<BrowserPushSubscription, Long> {
    Optional<BrowserPushSubscription> findByEndpoint(String endpoint);
    void deleteByEndpoint(String endpoint);
}