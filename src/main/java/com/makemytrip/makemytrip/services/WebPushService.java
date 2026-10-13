package com.makemytrip.makemytrip.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.makemytrip.makemytrip.models.BrowserPushSubscription;
import com.makemytrip.makemytrip.repositories.BrowserPushSubscriptionRepository;

import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;

import org.apache.http.HttpResponse;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Security;
import java.util.HashMap;
import java.util.Map;

@Service
public class WebPushService {

    private final BrowserPushSubscriptionRepository repository;
    private final ObjectMapper objectMapper;
    private final PushService pushService;

    public WebPushService(BrowserPushSubscriptionRepository repository, ObjectMapper objectMapper,
            @Value("${VAPID_PUBLIC_KEY}") String publicKey,
            @Value("${VAPID_PRIVATE_KEY}") String privateKey,
            @Value("${VAPID_SUBJECT:mailto:admin@example.com}") String subject) throws Exception {
        this.repository = repository;
        this.objectMapper = objectMapper;

        // Register Bouncy Castle before initializing Web Push
        if (Security.getProvider("BC") == null) {
            Security.addProvider(new BouncyCastleProvider());
        }

        this.pushService = new PushService(publicKey, privateKey, subject);
    }

    // Save or update a browser subscription
    @Transactional
    public void saveSubscription(String endpoint, String p256dh, String auth) {

        BrowserPushSubscription subscription = repository
                .findByEndpoint(endpoint)
                .orElseGet(BrowserPushSubscription::new);

        subscription.setEndpoint(endpoint);
        subscription.setP256dh(p256dh);
        subscription.setAuth(auth);

        repository.save(subscription);
    }

    // Delete a browser subscription
    @Transactional
    public void deleteSubscription(String endpoint) {
        repository.deleteByEndpoint(endpoint);
    }

    // Send notifications to all registered browsers
    public void sendToAll(String flightNumber, String message) throws Exception {

        Map<String, String> payload = new HashMap<>();
        payload.put("title", "MakeMyTour Flight Update");
        payload.put("flightNumber", flightNumber);
        payload.put("message", message);
        payload.put("url", "/flight-status");

        String json = objectMapper.writeValueAsString(payload);

        for (BrowserPushSubscription saved : repository.findAll()) {
            try {
                Subscription subscription = new Subscription(
                        saved.getEndpoint(),
                        new Subscription.Keys(
                                saved.getP256dh(),
                                saved.getAuth()));

                Notification notification = new Notification(subscription, json);
                HttpResponse response = pushService.send(notification);

                int statusCode = response.getStatusLine().getStatusCode();

                if (statusCode >= 200 && statusCode < 300) {
                    System.out.println("Push notification sent for flight: " + flightNumber);
                } else if (statusCode == 404 || statusCode == 410) {
                    deleteSubscription(saved.getEndpoint());
                    System.out.println("Removed expired push subscription: " + saved.getId());
                } else {
                    System.err.println("Push notification failed. HTTP status: " + statusCode);
                }

            } catch (Exception exception) {
                System.err.println("Push failed for subscription " + saved.getId() + ": " + exception.getMessage());
            }
        }
    }
}