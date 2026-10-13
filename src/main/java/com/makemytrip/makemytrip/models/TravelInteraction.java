
package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "travel_interactions")
public class TravelInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long itemId;
    private String interactionType; // VIEW, CLICK, BOOK, SEARCH
    private String category;
    private String destination;

    private LocalDateTime createdAt = LocalDateTime.now();

    public TravelInteraction() {}

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getItemId() { return itemId; }
    public String getInteractionType() { return interactionType; }
    public String getCategory() { return category; }
    public String getDestination() { return destination; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public void setInteractionType(String interactionType) {
        this.interactionType = interactionType;
    }
    public void setCategory(String category) { this.category = category; }
    public void setDestination(String destination) {
        this.destination = destination;
    }
}
