package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.dto.PricingDtos.*;
import com.makemytrip.makemytrip.services.PricingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pricing")
public class PricingController {

	@Autowired
    private PricingService pricingService;

    @GetMapping("/{type}/{itemId}")
    public ResponseEntity<PriceResponse> getPrice(@PathVariable String type, @PathVariable Long itemId, @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(pricingService.getCurrentPrice(type, itemId, userId));
    }

    @GetMapping("/{type}/{itemId}/history")
    public ResponseEntity<List<HistoryResponse>> getHistory(@PathVariable String type,@PathVariable Long itemId) {
        return ResponseEntity.ok(pricingService.getHistory(type, itemId));
    }

    @PostMapping("/{type}/{itemId}/freeze")
    public ResponseEntity<FreezeResponse> freeze(@PathVariable String type,@PathVariable Long itemId, @RequestBody FreezeRequest request) {
        return ResponseEntity.ok(pricingService.freezePrice(type, itemId, request.userId()));
    }

    @GetMapping("/freezes/{freezeId}")
    public ResponseEntity<FreezeResponse> getFreeze(@PathVariable Long freezeId) {
        return ResponseEntity.ok(pricingService.getFreeze(freezeId));
    }

    @PutMapping("/admin/{type}/{itemId}")
    public ResponseEntity<PriceResponse> updatePricing(@PathVariable String type, @PathVariable Long itemId, @RequestBody AdminUpdateRequest request) {
        return ResponseEntity.ok(pricingService.updatePricing(type, itemId, request));
    }
}
