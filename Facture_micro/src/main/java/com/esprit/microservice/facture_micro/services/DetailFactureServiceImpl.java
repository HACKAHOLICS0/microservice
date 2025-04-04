package com.esprit.microservice.facture_micro.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.esprit.microservice.facture_micro.entities.DetailFacture;
import com.esprit.microservice.facture_micro.repositories.DetailFactureRepository;

@Service
public class DetailFactureServiceImpl implements DetailFactureService {
	@Autowired
	DetailFactureRepository detailFactureRepository;
	
	@Override
	public List<DetailFacture> retrieveAlldetailFactures() {
		return (List<DetailFacture>) detailFactureRepository.findAll();
	}

	@Override
	@Transactional
	public DetailFacture adddetailFacture(DetailFacture f) {

		return detailFactureRepository.save(f);
	}

	@Override
	public void deletedetailFacture(Long id) {
		DetailFacture f = new DetailFacture ();
		f.setIdDetailFacture(id);
		detailFactureRepository.delete(f);
	}

	@Override
	@Transactional
	public DetailFacture updatedetailFacture(DetailFacture f) {
	return detailFactureRepository.save(f);


	}

	@Override
	public DetailFacture retrievedetailFacture(Long id) {
		return detailFactureRepository.findById(id).orElse(null);
	}


	@Override
	public int updatedetailFactureQuantite( DetailFacture df) {
		return detailFactureRepository.updatedetailFactureQuantite(df.getQte(), df.getIdDetailFacture());

	}
}