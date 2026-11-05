package com.zerobroker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("ZeroBroker - Password Reset OTP");

        message.setText(
            "Hello,\n\n" +
            "Your OTP for resetting your ZeroBroker password is: " + otp + "\n\n" +
            "Please do not share this OTP with anyone.\n\n" +
            "Regards,\nZeroBroker Team"
        );

        mailSender.send(message);
    }
}
