package com.example.reclamation.Controllers;

import com.example.reclamation.Entities.Material;
import com.example.reclamation.Services.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materials")
@CrossOrigin(origins = "http://localhost:4200")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @PostMapping
    public Material addMaterial(@RequestBody Material material) {
        return materialService.addMaterial(material);
    }

    @PutMapping
    public Material updateMaterial(@RequestBody Material material) {
        return materialService.updateMaterial(material);
    }

    @DeleteMapping("/{id}")
    public void deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
    }

    @GetMapping("/{id}")
    public Material getMaterialById(@PathVariable Long id) {
        return materialService.getMaterialById(id);
    }

    @GetMapping
    public List<Material> getAllMaterials() {
        List<Material> materials = materialService.getAllMaterials();
        materials.forEach(material -> System.out.println(
                "Material - ID: " + material.getIdMaterial() +
                        ", Label: " + material.getLabel() +
                        ", Quantity: " + material.getQuantity() +
                        ", Supplier: " + (material.getSupplier() != null ? material.getSupplier().getName() : "No Supplier")
        ));
        return materials;
    }
}
