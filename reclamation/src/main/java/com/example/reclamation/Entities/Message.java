package com.example.reclamation.Entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender; // "admin" ou "user"
    private String content;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "reclamation_id")
    private Reclamation reclamation; // Lier les messages à une réclamation spécifique
}

