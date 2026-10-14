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

    // 1. Get current calculated price
    @GetMapping("/{type}/{itemId}")
    public ResponseEntity<PriceResponse> getCurrentPrice(@PathVariable String type, @PathVariable Long itemId, @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(pricingService.getCurrentPrice(type, itemId, userId));
    }

    // 2. Get the latest 30 price history records
    @GetMapping("/{type}/{itemId}/history")
    public ResponseEntity<List<HistoryResponse>> getPriceHistory(@PathVariable String type, @PathVariable Long itemId) {
        return ResponseEntity.ok(pricingService.getHistory(type, itemId));
    }

    // 3. Freeze the current price for 30 minutes
    @PostMapping("/{type}/{itemId}/freeze")
    public ResponseEntity<FreezeResponse> freezePrice(@PathVariable String type, @PathVariable Long itemId, @RequestBody FreezeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pricingService.freezePrice(type, itemId, request.userId()));
    }

    // 4. Check the freeze status
    @GetMapping("/freezes/{freezeId}")
    public ResponseEntity<FreezeResponse> getFreeze(@PathVariable Long freezeId) {
        return ResponseEntity.ok(pricingService.getFreeze(freezeId));
    }

    // 5. Create or update pricing data
    @PutMapping("/admin/{type}/{itemId}")
    public ResponseEntity<PriceResponse> updatePricing(@PathVariable String type, @PathVariable Long itemId, @RequestBody AdminUpdateRequest request) {
        return ResponseEntity.ok(pricingService.updatePricing(type, itemId, request));
    }

    // Convert service validation errors to readable JSON
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException exception) {

        String message = exception.getMessage();

        HttpStatus status = message != null
                && message.contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;

        return ResponseEntity.status(status).body(
            Map.of("message",message != null ? message : "Invalid request"));
    }
}