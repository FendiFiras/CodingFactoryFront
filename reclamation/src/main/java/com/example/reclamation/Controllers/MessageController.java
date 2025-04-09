package com.example.reclamation.Controllers;

import com.example.reclamation.Entities.Message;
import com.example.reclamation.Entities.Reclamation;
import com.example.reclamation.Repositories.MessageRepository;
import com.example.reclamation.Repositories.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ReclamationRepository reclamationRepository;

    @PostMapping
    public Message sendMessage(@RequestBody Message message) {
        System.out.println("message.getReclamation(): " + message.getReclamation());
        System.out.println("message.getReclamation().getId(): " + (message.getReclamation() != null ? message.getReclamation().getIdReclamation() : "null"));

        message.setTimestamp(LocalDateTime.now());

        Long reclamationId = message.getReclamation().getIdReclamation(); // ⚠️ si id == null → erreur ici

        Reclamation existingReclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new RuntimeException("Reclamation not found with id: " + reclamationId));

        message.setReclamation(existingReclamation);
        return messageRepository.save(message);
    }


    @GetMapping("/reclamation/{id}")
    public List<Message> getMessagesByReclamation(@PathVariable Long id) {
        return messageRepository.findByReclamation_IdReclamationOrderByTimestampAsc(id);
    }

    @GetMapping("/with-user-messages")
    public List<Long> getReclamationIdsWithUserMessages() {
        return messageRepository.findReclamationIdsWithUserMessages();
    }

}

