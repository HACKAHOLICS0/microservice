package com.esprit.microservice.produitcategorie.services;
import com.esprit.microservice.produitcategorie.entities.FeedBack;
import com.esprit.microservice.produitcategorie.repositories.FeedBackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class FeedBackService {

    private static final Logger logger = LoggerFactory.getLogger(FeedBackService.class);

    @Autowired
    private FeedBackRepository feedbackRepository;

    // Save feedback
    public FeedBack saveFeedback(FeedBack feedback) {
        try {


            // Save the feedback
            FeedBack savedFeedback = feedbackRepository.save(feedback);
            logger.info("Feedback saved with ID: {}", savedFeedback.getId());

            // Send an email notification
            String subject = "New Feedback Submitted";
            String text = "A new feedback has been submitted:\n\n" +
                    "Rating: " + feedback.getRating() + "\n" +
                    "Comment: " + feedback.getComment();

            // Sending email to the teacher (hardcoded email)
            logger.info("Email sent to teacher: firaslabidi17@gmail.com");

            return savedFeedback;
        } catch (Exception e) {
            logger.error("Error saving feedback or sending email", e);
            throw new RuntimeException("Error saving feedback or sending email", e);  // Re-throwing to be handled by controller
        }
    }


    public List<FeedBack> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public FeedBack getFeedbackById(Long id) {
        return feedbackRepository.findById(id).orElse(null);
    }

    public FeedBack updateFeedback(Long id, FeedBack updatedFeedback) {
        return feedbackRepository.findById(id).map(existing -> {
            existing.setRating(updatedFeedback.getRating());
            existing.setComment(updatedFeedback.getComment());
            return feedbackRepository.save(existing);
        }).orElse(null);
    }

    public boolean deleteFeedback(Long id) {
        if (feedbackRepository.existsById(id)) {
            feedbackRepository.deleteById(id);
            return true;
        }
        return false;
    }
}