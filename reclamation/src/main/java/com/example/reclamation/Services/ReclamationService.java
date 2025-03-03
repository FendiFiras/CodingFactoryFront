package com.example.reclamation.Services;

import com.example.reclamation.Entities.Reclamation;
import com.example.reclamation.Repositories.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReclamationService {

    @Autowired
    private ReclamationRepository reclamationRepository;

    public Reclamation addReclamation(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }

    public Reclamation updateReclamation(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }

    public void deleteReclamation(Long id) {
        reclamationRepository.deleteById(id);
    }

    public Reclamation getReclamationById(Long id) {
        return reclamationRepository.findById(id).orElse(null);
    }

    public List<Reclamation> getAllReclamations() {
        return reclamationRepository.findAll();
    }
}
