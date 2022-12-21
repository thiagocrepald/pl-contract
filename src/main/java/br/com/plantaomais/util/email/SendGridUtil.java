package br.com.plantaomais.util.email;

import br.com.plantaomais.config.AmazonSESConfiguration;
import br.com.plantaomais.config.ApplicationProperties;
import br.com.plantaomais.controller.AuthController;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Util;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.model.RawMessage;
import com.amazonaws.services.simpleemail.model.SendRawEmailRequest;

import javax.activation.DataHandler;
import javax.mail.Address;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;

/**
 * Responsável por enviar emails utilizando o Sendgrid
 *
 * @author NextAge
 * @classname CategoriaClassifLinearController
 */
public class SendGridUtil {

    private static final Logger logger = Logger.getLogger(AuthController.class.getName());

    /**
     * Envia email utilizando o sendgrid
     *
     * @param esg
     * @return retorna true se o envio deu certo
     */
    public static boolean enviar(EmailSendGrid esg) {

        if (Stream.of(esg.getEmails()).noneMatch(it -> it.contains("@esparta.io")) && ApplicationProperties.mailBlocked()) {
            logger.log(Level.INFO, "mail are blocked {0}", esg.getTituloEmail());
            return true;
        }
        logger.log(Level.INFO, "Início método de envio de email");

        CompletableFuture.runAsync(() -> {
            logger.log(Level.INFO, "Início async");
            Session session = Session.getDefaultInstance(new Properties());
            AmazonSimpleEmailService amazonSimpleEmailService = AmazonSESConfiguration.getS3Instance();
            boolean enviado = false;
            try {
                String linkConfig = Constants.URL_SYSTEM;

                MimeMessage message = new MimeMessage(session);
                esg.setTituloEmail(Constants.NOME_PROJETO + " - " + esg.getTituloEmail());
                //Monta o template de email
                if (!esg.getNaoUsarTemplate()) {
    /*                if (logoConfig != null) {
                        String cid = "logotemplate";
                        String logoBase64 = logoConfig.getValor();
                        byte[] logo = Util.base64StringToByte(logoBase64);
                        String nomeLogo = "";
                        if (logoBase64.contains("image/png")) {
                            nomeLogo = "logo.png";
                        } else if (logoBase64.contains("image/jpg")) {
                            nomeLogo = "logo.jpg";
                        }
                        InputStream file = new ByteArrayInputStream(logo);
                        email.addAttachment(nomeLogo, file);
                        email.addContentId(nomeLogo, cid);
                    }*/
                    String html = "";
                    html += "<html><body>";

                    html += "<div class='cabecalho-email'>";
                    html += "<a href='" + linkConfig + "' style='width:95%;display:block;padding: 20px;'>";
                    // html += "<img style='max-height:120px;margin: auto;display: block;' src='cid:logotemplate'/>";
                    html += "</a>";
                    html += "<h1 style='text-align:center;color:615d5d;margin-top:-15px;' >" + esg.getTituloEmail() + "</h1>";
                    html += "</div>";

                    html += "<div class='corpo-email'>";
                    html += esg.getHtml();
                    html += "<a href='" + linkConfig + "' style='width:100%;display:block;padding: 20px 0px 20px 0px;font-size: 18px;font-weight: bold;'>" + Constants.NOME_PROJETO + "</a>";
                    html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
                    html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
                    html += "</div>";
                    html += "</body></html>";
                    esg.setHtml(html);
                }

                if (!Util.isNullOrEmpty(esg.getListaAnexo())) {
                    int i = 0;
                    for (EmailSendGrid.EmailAnexo emailAnexo : esg.getListaAnexo()) {
                        InputStream file = new ByteArrayInputStream(emailAnexo.getAnexo());

                        MimeBodyPart messageBodyPart = new MimeBodyPart();
                        Multipart multipart = new MimeMultipart();
                        ByteArrayDataSource source = new ByteArrayDataSource(file, emailAnexo.getNome());
                        messageBodyPart.setDataHandler(new DataHandler(source));
                        messageBodyPart.setFileName(emailAnexo.getNome());
                        multipart.addBodyPart(messageBodyPart);
                        message.setContent(multipart);

                        i++;
                    }
                }

                List<InternetAddress> addresses = new ArrayList<>();
                for (String emailStr : esg.getEmails().split(";")) {
                    addresses.add(new InternetAddress(emailStr));
                }

                InternetAddress[] addressesArray = new InternetAddress[addresses.size()];
                for (int i = 0; i < addresses.size(); i++) {
                    addressesArray[i] = addresses.get(i);
                }

                message.setRecipients(Message.RecipientType.TO, addressesArray);

                message.setFrom(new InternetAddress(Constants.EMAIL_NOTIFICACOES, Constants.NOME_PROJETO));
                message.setSubject(esg.getTituloEmail());
                message.setContent(esg.getHtml(), "text/html; charset=utf-8");

                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                message.writeTo(outputStream);
                RawMessage rawMessage =
                        new RawMessage(ByteBuffer.wrap(outputStream.toByteArray()));

                SendRawEmailRequest rawEmailRequest =
                        new SendRawEmailRequest(rawMessage);

                amazonSimpleEmailService.sendRawEmail(rawEmailRequest);

                logger.log(Level.INFO, "Emails enviados para: {0}", esg.getEmails());
            } catch (Exception e) {
                logger.log(Level.SEVERE, e.toString(), e);
            }
//            return enviado;
        });
        return true;
    }

}
