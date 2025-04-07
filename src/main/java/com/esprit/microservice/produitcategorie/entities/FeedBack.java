package com.esprit.microservice.produitcategorie.entities;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@Builder
public class FeedBack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private int rating;
    @Column(name = "comment", length = 10000)  // or use TEXT for larger comments
    private String comment;

    private LocalDateTime createdAt;

    protected FeedBack() {
    }

    // Constructeur avec paramètres
    public FeedBack(int rating, String comment) {

        this.rating = rating;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    // Getters et setters
    public Long getId() {
        return id;
    }


    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
