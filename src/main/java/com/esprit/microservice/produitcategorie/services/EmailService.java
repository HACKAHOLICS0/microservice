package com.esprit.microservice.produitcategorie.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationCode(String toEmail, String test) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("feedback add");
            message.setText("Votre code de commentaire  est : " + test);
            mailSender.send(message);
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de l'email à " + toEmail, e);
            throw new RuntimeException("Erreur lors de l'envoi de l'email");
        }
    }
}