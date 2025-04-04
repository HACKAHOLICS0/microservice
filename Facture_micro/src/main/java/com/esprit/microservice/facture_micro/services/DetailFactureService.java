package com.esprit.microservice.facture_micro.services;

import java.util.List;
import com.esprit.microservice.facture_micro.entities.DetailFacture;

public interface DetailFactureService {
	public List<DetailFacture> retrieveAlldetailFactures();
	public DetailFacture adddetailFacture(DetailFacture f);
	public void deletedetailFacture(Long id);
	public DetailFacture updatedetailFacture(DetailFacture f);
	public DetailFacture retrievedetailFacture(Long id);
	public int updatedetailFactureQuantite(DetailFacture df);
}
