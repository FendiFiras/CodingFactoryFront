package com.example.reclamation.Services;

import com.example.reclamation.Entities.*;
import com.example.reclamation.Repositories.MaterialRepository;
import com.example.reclamation.Repositories.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReclamationService {

    @Autowired
    private ReclamationRepository reclamationRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private EmailService emailService;

    public Reclamation addReclamation(Reclamation reclamation) {
        // Decrease material quantity
        if (reclamation.getMaterials() != null && !reclamation.getMaterials().isEmpty()) {
            Material material = reclamation.getMaterials().get(0); // Assume only one material per reclamation
            Material existingMaterial = materialRepository.findById(material.getIdMaterial()).orElse(null);

            if (existingMaterial != null) {
                int newQuantity = Math.max(0, existingMaterial.getQuantity() - reclamation.getQuantity());
                existingMaterial.setQuantity(newQuantity);
                materialRepository.save(existingMaterial);
            }
        }

        Reclamation savedReclamation = reclamationRepository.save(reclamation);

        // Check if the reclamation is related to MATERIAL
        if (savedReclamation.getType() == Type.MATERIAL && savedReclamation.getMaterials() != null) {
            for (Material material : savedReclamation.getMaterials()) {
                Material fetchedMaterial = materialRepository.findById(material.getIdMaterial()).orElse(null);
                if (fetchedMaterial != null && fetchedMaterial.getSupplier() != null) {
                    Supplier supplier = fetchedMaterial.getSupplier();
                    String email = supplier.getEmail();
                    if (email != null && !email.isEmpty()) {
                        String subject = "New Reclamation: " + savedReclamation.getTitle();
                        String body = "Dear " + supplier.getName() + ",\n\n"
                                + "A new reclamation has been created regarding your material: " + material.getLabel() + ".\n"
                                + "Description: " + savedReclamation.getDescription() + "\n"
                                + "Urgency Level: " + savedReclamation.getUrgencyLevel() + "\n"
                                + "Material Needed: " + material.getLabel() + "\n"
                                + "Required Quantity: " + savedReclamation.getQuantity() + "\n\n"
                                + "Best Regards,\n"
                                + "Reclamation Team";
                        emailService.sendEmail(email, subject, body);
                    }
                }
            }
        }

        return savedReclamation;
    }

    public Reclamation treatReclamation(Long id) {
        Reclamation reclamation = reclamationRepository.findById(id).orElse(null);

        if (reclamation != null && reclamation.getStatus() == TypeStatut.IN_WAIT) {
            // Increase material quantity when treating the reclamation
            if (reclamation.getMaterials() != null && !reclamation.getMaterials().isEmpty()) {
                Material material = reclamation.getMaterials().get(0);
                Material existingMaterial = materialRepository.findById(material.getIdMaterial()).orElse(null);

                if (existingMaterial != null) {
                    int newQuantity = existingMaterial.getQuantity() + reclamation.getQuantity();
                    existingMaterial.setQuantity(newQuantity);
                    materialRepository.save(existingMaterial);
                }
            }
            reclamation.setStatus(TypeStatut.TREATED);
            return reclamationRepository.save(reclamation);
        }

        return null;
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
