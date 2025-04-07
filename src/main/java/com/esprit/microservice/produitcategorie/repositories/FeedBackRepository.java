package com.esprit.microservice.produitcategorie.repositories;

import com.esprit.microservice.produitcategorie.entities.FeedBack;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedBackRepository extends JpaRepository<FeedBack, Long> {

}
