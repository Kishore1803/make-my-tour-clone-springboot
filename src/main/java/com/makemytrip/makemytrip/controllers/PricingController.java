package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.dto.PricingDtos.*;
import com.makemytrip.makemytrip.services.PricingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pricing")
public class PricingController {
	
	@Autowired
    private PricingService pricingService;

    @GetMapping("/{type}/{itemId}")
    public ResponseEntity<PriceResponse> getCurrentPrice(@PathVariable String type, @PathVariable Long itemId, @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(pricingService.getCurrentPrice(type, itemId, userId));
    }

    @GetMapping("/{type}/{itemId}/history")
    public ResponseEntity<List<HistoryResponse>> getPriceHistory(@PathVariable String type, @PathVariable Long itemId) {
        return ResponseEntity.ok(pricingService.getHistory(type, itemId));
    }

    @PostMapping("/{type}/{itemId}/freeze")
    public ResponseEntity<FreezeResponse> freezePrice(@PathVariable String type, @PathVariable Long itemId, @RequestBody FreezeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pricingService.freezePrice(type, itemId, request.userId()));
    }

    @GetMapping("/freezes/{freezeId}")
    public ResponseEntity<FreezeResponse> getFreeze(@PathVariable Long freezeId) {
        return ResponseEntity.ok(pricingService.getFreeze(freezeId));
    }

    // Protect this endpoint with admin authentication before production use.
    @PutMapping("/admin/{type}/{itemId}")
    public ResponseEntity<PriceResponse> updatePricing(@PathVariable String type, @PathVariable Long itemId, @RequestBody AdminUpdateRequest request) {
        return ResponseEntity.ok(pricingService.updatePricing(type, itemId, request));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException ex) {
        String message = ex.getMessage() == null ? "Invalid request" : ex.getMessage();
        HttpStatus status = message.toLowerCase().contains("not found")
                ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(Map.of("message", message));
    }
}
