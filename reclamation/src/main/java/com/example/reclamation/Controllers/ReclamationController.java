package com.example.reclamation.Controllers;

import com.example.reclamation.Entities.Reclamation;
import com.example.reclamation.Services.ReclamationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Reclamation> createReclamation(
            @RequestPart("reclamation") Reclamation reclamation,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        if (file != null && !file.isEmpty()) {
            reclamation.setFile(file.getBytes());
            reclamation.setFileName(file.getOriginalFilename());
        }

        return ResponseEntity.ok(reclamationService.addReclamation(reclamation));
    }

    @GetMapping("/file/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable Long id) {
        Reclamation reclamation = reclamationService.getReclamationById(id);
        if (reclamation != null && reclamation.getFile() != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + reclamation.getFileName() + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, "application/octet-stream")
                    .body(reclamation.getFile());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

  @GetMapping("/material-stats")
  public ResponseEntity<?> getMaterialStats() {
    return ResponseEntity.ok(reclamationService.getMostUsedMaterials());
  }
}
