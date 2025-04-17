package com.example.reclamation.Repositories;

import com.example.reclamation.Entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReclamation_IdReclamationOrderByTimestampAsc(Long idReclamation);

    @Query("SELECT DISTINCT m.reclamation.idReclamation FROM Message m WHERE m.sender = 'user'")
    List<Long> findReclamationIdsWithUserMessages();
}
