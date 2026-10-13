package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.dto.*;
import com.makemytrip.makemytrip.models.*;
import com.makemytrip.makemytrip.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

	@Autowired
    private RecommendationItemRepository itemRepository;
	
	@Autowired
    private TravelInteractionRepository interactionRepository;
	
	@Autowired
    private RecommendationFeedbackRepository feedbackRepository;

    public List<RecommendationResponse> recommend(Long userId, String requestedType) {
        List<TravelInteraction> history = interactionRepository.findByUserId(userId);
        List<RecommendationFeedback> feedback = feedbackRepository.findByUserId(userId);

        Set<Long> previouslyInteracted = history.stream()
            .filter(i -> "BOOK".equalsIgnoreCase(i.getInteractionType()))
            .map(TravelInteraction::getItemId)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

        Map<String, Long> categoryCounts = history.stream()
            .filter(i -> i.getCategory() != null)
            .collect(Collectors.groupingBy(
                i -> i.getCategory().toUpperCase(),
                Collectors.counting()));

        Map<Long, Boolean> feedbackByItem = feedback.stream()
            .collect(Collectors.toMap(
                RecommendationFeedback::getItemId,
                RecommendationFeedback::isHelpful,
                (first, second) -> second));

        return itemRepository.findByActiveTrue().stream()
            .filter(item -> requestedType == null
                || requestedType.isBlank() || item.getType().equalsIgnoreCase(requestedType))
            .filter(item -> !previouslyInteracted.contains(item.getId()))
            .map(item -> {
                String category = item.getCategory() == null
                    ? "" : item.getCategory().toUpperCase();

                long categoryCount = categoryCounts.getOrDefault(category, 0L);
                Boolean helpful = feedbackByItem.get(item.getId());

                double score = 10 + categoryCount * 5;

                if (helpful != null) {
                    score += helpful ? 10 : -20;
                }

                String reason = categoryCount > 0 ? "You have explored " + category.toLowerCase()
                        + " travel before." : "Discover something new in "
                        + (item.getDestination() == null ? "this destination" : item.getDestination()) + ".";

                if (Boolean.FALSE.equals(helpful)) {
                    reason = "A different option to explore based on " + "the available travel catalog.";
                }

                return new RecommendationResponse(item.getId(), item.getType(), item.getTitle(),
                    item.getDestination(), item.getCategory(), item.getDescription(),
                    item.getImageUrl(), item.getPrice(), score, reason );
            })
            .filter(item -> item.score() > 0)
            .sorted(Comparator.comparingDouble(
                RecommendationResponse::score).reversed())
            .limit(12)
            .toList();
    }

    @Transactional
    public RecommendationFeedback saveFeedback(FeedbackRequest request) {
        RecommendationFeedback feedback = feedbackRepository
                .findByUserIdAndItemId(request.userId(), request.itemId())
                .orElseGet(RecommendationFeedback::new);

        feedback.setUserId(request.userId());
        feedback.setItemId(request.itemId());
        feedback.setHelpful(request.helpful());
        feedback.setReason(request.reason());
        return feedbackRepository.save(feedback);
    }

    @Transactional
    public TravelInteraction recordInteraction(Long userId, Long itemId, String interactionType) {
        RecommendationItem item = itemRepository.findById(itemId)
            .orElseThrow(() -> new IllegalArgumentException("Recommendation not found"));

        TravelInteraction interaction = new TravelInteraction();
        interaction.setUserId(userId);
        interaction.setItemId(itemId);
        interaction.setInteractionType(interactionType.toUpperCase());
        interaction.setCategory(item.getCategory());
        interaction.setDestination(item.getDestination());
        return interactionRepository.save(interaction);
    }
}
