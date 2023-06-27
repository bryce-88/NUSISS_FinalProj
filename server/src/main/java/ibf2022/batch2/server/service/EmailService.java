package ibf2022.batch2.server.service;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;


@Service
public class  EmailService {
    
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);


    /*
    private String recipient;
    private String msgBody;
    private String subject;
    private String attachment;
     */

    public String sendMailWithAttachment(String recipient, String msgBody, String subject, MultipartFile attachment) throws IOException {

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper;
        log.info(">>> Email Service called ");
        log.info(">>> Attachment " + attachment);

        try {
            mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
            mimeMessageHelper.setFrom(sender);
            mimeMessageHelper.setTo(recipient);
            mimeMessageHelper.setText(msgBody);
            mimeMessageHelper.setSubject(subject);

            // Adding the attachment
            // FileSystemResource file = new FileSystemResource(
            //                             new File(details.getAttachment()));
            ByteArrayResource file = new ByteArrayResource(attachment.getBytes());

            mimeMessageHelper.addAttachment(attachment.getOriginalFilename(), file);

            // Sending the mail
            javaMailSender.send(mimeMessage);
            log.info("EmailService: Send successful");
            return "Mail sent";
        } catch (MessagingException e) {
            log.info("Error in EmailService: " + e);
            return "Messaging error";
        }
    }

}
