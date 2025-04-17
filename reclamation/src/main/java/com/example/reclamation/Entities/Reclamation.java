package com.example.reclamation.Entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReclamation;
    private String title;
    private String description;
    private Date creationDate = new Date();

    @Enumerated(EnumType.STRING)
    private Type type;

    @Enumerated(EnumType.STRING)
    private TypeStatut status = TypeStatut.IN_WAIT;

    private Integer urgencyLevel;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
    @JoinTable(
            name = "reclamation_materials",
            joinColumns = @JoinColumn(name = "reclamation_id"),
            inverseJoinColumns = @JoinColumn(name = "material_id")
    )
    private List<Material> materials;

    private Integer quantity;

    private int idUser;

    @Lob
    @Column(name = "file", columnDefinition = "LONGBLOB")
    @JsonProperty("file")
    private byte[] file;

    private String fileName;

}
