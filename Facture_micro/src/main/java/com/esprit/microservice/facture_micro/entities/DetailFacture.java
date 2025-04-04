package com.esprit.microservice.facture_micro.entities;

import java.io.Serializable;

import com.esprit.microservice.facture_micro.utils.StaticData;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "facture")
public class DetailFacture implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDetailFacture;
    
    private Long productId;  // ID du produit (référence statique)
    private Integer qte = 0;
    
    @ManyToOne()
    @JoinColumn(name = "facture_id")
    @JsonIgnore
    private Facture facture;

    public Long getIdDetailFacture() {
        return idDetailFacture;
    }

    public void setIdDetailFacture(Long idDetailFacture) {
        this.idDetailFacture = idDetailFacture;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQte() {
        return qte;
    }

    public void setQte(Integer qte) {
        this.qte = qte;
    }

    public Facture getFacture() {
        return facture;
    }

    public void setFacture(Facture facture) {
        this.facture = facture;
    }
}
