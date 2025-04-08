package com.example.reclamation.Controllers;

import com.example.reclamation.Entities.Reclamation;
import com.example.reclamation.Services.ReclamationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reclamations")
@CrossOrigin(origins = "http://localhost:4200")
public class ReclamationController {
    @Autowired
    private ReclamationService reclamationService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Reclamation addReclamation(@RequestBody Reclamation reclamation) {
        System.out.println("Received Reclamation: " + reclamation);
        return reclamationService.addReclamation(reclamation);
    }

    @PutMapping
    public Reclamation updateReclamation(@RequestBody Reclamation reclamation) {
        return reclamationService.updateReclamation(reclamation);
    }

    @DeleteMapping("/{id}")
    public void deleteReclamation(@PathVariable Long id) {
        reclamationService.deleteReclamation(id);
    }

    @GetMapping("/{id}")
    public Reclamation getReclamationById(@PathVariable Long id) {
        return reclamationService.getReclamationById(id);
    }

    @GetMapping
    public List<Reclamation> getAllReclamations() {
        return reclamationService.getAllReclamations();
    }

    @PutMapping("/treat/{id}/{quantity}")
    public Reclamation treatReclamation(@PathVariable Long id, @PathVariable int quantity) {
        return reclamationService.treatReclamation(id, quantity);
    }
}
