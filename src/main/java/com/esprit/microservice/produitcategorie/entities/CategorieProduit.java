package com.esprit.microservice.produitcategorie.entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategorieProduit implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long idCategorieProduit;
	private String libelle;
	private String categorieProduitIcone;

	@OneToMany(mappedBy = "categorieProduit", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
	@JsonIgnore
	private List<Produit> produits = new ArrayList<>();

	@Override
	public String toString() {
		StringBuilder resultat = new StringBuilder();
		resultat.append("CategorieProduit [idCategorieProduit=")
				.append(idCategorieProduit)
				.append(", libelle=")
				.append(libelle)
				.append(", produits=");

		for (Produit p : produits) {
			resultat.append(p.toString());
		}
		resultat.append("]");

		return resultat.toString();
	}
}
