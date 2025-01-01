package com.example.elearningbackend.mail;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MailService {

    private String loadEmailTemplate(String path) throws IOException {
        InputStream resource = new ClassPathResource(path).getInputStream();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource))) {
            return reader.lines().collect(Collectors.joining("\n"));
        }
    }

  public void sendEmailResetPassword(String email, long userId, String token)
      throws MessagingException, IOException, jakarta.mail.MessagingException {

        String link = "http://localhost:4200/reset-password?token=" + token + "&userId=" + userId;

        String htmlContent = loadEmailTemplate("templates/mail-resert-password.html");
        htmlContent = htmlContent.replace("{{email}}", email);
        htmlContent = htmlContent.replace("{{link_resert_password}}", link);

        JavaMailSenderImpl mailSender = MailUtils.getJavaMailSender();

        MimeMessage mimeMessage = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(MailUtils.mailUsername);
        helper.setTo(email);
        helper.setSubject("Reset Password");
        helper.setText(htmlContent, true);

        // send email
        mailSender.send(mimeMessage);
    }

    public void sendEmailPurchaseSuccess(String email, String courseName, String alias)
      throws MessagingException, IOException, jakarta.mail.MessagingException {
        String link = "http://localhost:4200/course/" + alias;
        String htmlContent = loadEmailTemplate("templates/purchased-course.html");
        htmlContent = htmlContent.replace("{{courseName}}", courseName);
        htmlContent = htmlContent.replace("{{link_open_course}}", link);
        htmlContent = htmlContent.replace("{{email}}", email);
        JavaMailSenderImpl mailSender = MailUtils.getJavaMailSender();

        MimeMessage mimeMessage = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(MailUtils.mailUsername);
        helper.setTo(email);
        helper.setSubject("Purchase Success");
        helper.setText(htmlContent, true);

        // send email
        mailSender.send(mimeMessage);
    }

    public void sendEmailVerification(String email, long userId, String token)
      throws MessagingException, IOException, jakarta.mail.MessagingException {
        String link = "http://localhost:4200/verify-email?token=" + token + "&userId=" + userId;
        String htmlContent = loadEmailTemplate("templates/verify-mail.html");
        htmlContent = htmlContent.replace("{{email}}", email);
        htmlContent = htmlContent.replace("{{link_verify}}", link);
        JavaMailSenderImpl mailSender = MailUtils.getJavaMailSender();

        MimeMessage mimeMessage = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(MailUtils.mailUsername);
        helper.setTo(email);
        helper.setSubject("Verify Email");
        helper.setText(htmlContent, true);

        // send email
        mailSender.send(mimeMessage);
    }
}
