package com.example.elearningbackend.mail;

import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

public class MailUtils {

    public static final String mailHost = "smtp.gmail.com";
    public static final String mailPort = "587";
    public static final String mailUsername = "lenguyen1382@gmail.com";
    public static final String mailPassword = "woyf uund almv lhmu";

    public static JavaMailSenderImpl getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(mailHost);
        mailSender.setPort(Integer.parseInt(mailPort));
        mailSender.setUsername(mailUsername);
        mailSender.setPassword(mailPassword);
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        return mailSender;
    }
}
