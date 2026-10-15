package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.dto.PushSubscriptionRequest;
import com.makemytrip.makemytrip.services.WebPushService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/push")
public class PushSubscriptionController {

    @Autowired
    private WebPushService webPushService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody PushSubscriptionRequest request) {
        if (request.getEndpoint() == null || request.getP256dh() == null || request.getAuth() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing subscription details"));
        }

        webPushService.saveSubscription(request.getEndpoint(), request.getP256dh(), request.getAuth());
        return ResponseEntity.ok(Map.of("message", "Push subscription saved"));
    }

    @DeleteMapping("/unsubscribe")
    public ResponseEntity<?> unsubscribe(@RequestParam String endpoint) {
        webPushService.deleteSubscription(endpoint);
        return ResponseEntity.ok(Map.of("message", "Push subscription removed"));
    }
}