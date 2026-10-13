package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "recommendation_items")
public class RecommendationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // DESTINATION, HOTEL, FLIGHT
    private String title;
    private String destination;
    private String category; // BEACH, ADVENTURE, CITY, etc.
    private String tags; // comma-separated tags
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private boolean active = true;

    public RecommendationItem() {}

    public Long getId() { return id; }
    public String getType() { return type; }
    public String getTitle() { return title; }
    public String getDestination() { return destination; }
    public String getCategory() { return category; }
    public String getTags() { return tags; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public BigDecimal getPrice() { return price; }
    public boolean isActive() { return active; }

    public void setId(Long id) { this.id = id; }
    public void setType(String type) { this.type = type; }
    public void setTitle(String title) { this.title = title; }
    public void setDestination(String destination) {
        this.destination = destination;
    }
    public void setCategory(String category) { this.category = category; }
    public void setTags(String tags) { this.tags = tags; }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setActive(boolean active) { this.active = active; }
}
