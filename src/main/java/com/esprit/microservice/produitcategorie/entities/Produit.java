package com.esprit.microservice.produitcategorie.entities;

import java.io.Serializable;
import java.util.*;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Produit implements Serializable{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long idProduit;
	private String code;
	private String libelle;
	@Temporal(TemporalType.DATE)
	private Date dateCreation;
	@Temporal(TemporalType.DATE)
	private Date dateDerniereModification;
	private double prixUnitaire;
	private String imageProduit;
	private long quantiteEnStock;
	private double pourcentageRemise;

	@Transient
	private float moyenneNote;

	private boolean valeur;
	@ManyToOne()
	CategorieProduit categorieProduit;

    @Override
	public String toString() {
		return "Produit [idProduit=" + idProduit + ", code=" + code + ", libelle=" + libelle + ", dateCreation="
				+ dateCreation + ", dateDerniereModification=" + dateDerniereModification + ", prixUnitaire="
				+ prixUnitaire + ", image=" + imageProduit + ", quantiteEnStock=" + quantiteEnStock + ", pourcentageRemise="
				+ pourcentageRemise + ", categorieProduit=" + categorieProduit.toString() + "]";
	}
	
	

}
