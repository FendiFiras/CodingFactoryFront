package com.example.reclamation.Entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSupplier;

    private String name;

    private String email;

    private String address;

    private String phone;

    @OneToOne
    @JoinColumn(name = "material_id")
    @JsonManagedReference
    private Material material;
}
