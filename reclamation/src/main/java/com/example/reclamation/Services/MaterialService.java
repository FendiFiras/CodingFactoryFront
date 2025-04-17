package com.example.reclamation.Services;

import com.example.reclamation.Entities.Material;
import com.example.reclamation.Repositories.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService {
    @Autowired
    private MaterialRepository materialRepository;

    public Material addMaterial(Material material) {
        return materialRepository.save(material);
    }

    public Material updateMaterial(Material material) {
        return materialRepository.save(material);
    }

    public void deleteMaterial(Long id) {
        materialRepository.deleteById(id);
    }

    public Material getMaterialById(Long id) {
        return materialRepository.findById(id).orElse(null);
    }

    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }
}
