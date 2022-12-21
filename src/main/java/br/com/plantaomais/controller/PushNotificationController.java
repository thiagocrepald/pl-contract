package br.com.plantaomais.controller;

import br.com.plantaomais.config.ApplicationProperties;
import br.com.plantaomais.controller.push.PushService;
import br.com.plantaomais.entitybean.CandidatoPlantao;
import br.com.plantaomais.entitybean.Installation;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.entitybean.aplicativo.TrocaVaga;
import br.com.plantaomais.entitybean.push.NotificationType;
import br.com.plantaomais.entitybean.push.PushMessage;
import br.com.plantaomais.entitybean.push.sender.PushNotification;
import br.com.plantaomais.mapper.CandidatoPlantaoMapper;
import br.com.plantaomais.mapper.MedicoMapper;
import br.com.plantaomais.mapper.PlantaoMapper;
import br.com.plantaomais.mapper.aplicativo.TrocaVagaMapper;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.vo.CandidatoPlantaoVo;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.NotificationVo;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.aplicativo.PushNotificationVo;
import br.com.plantaomais.vo.aplicativo.TrocaVagaVo;
import com.google.gson.Gson;
import org.glassfish.jersey.client.ClientProperties;
import org.glassfish.jersey.client.filter.EncodingFilter;
import org.glassfish.jersey.message.DeflateEncoder;
import org.glassfish.jersey.message.GZipEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import java.security.Principal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by gmribas on 18/05/20.
 */
@Service
public class PushNotificationController extends Controller {

    private static final Logger logger = Logger.getLogger(PushNotificationController.class.getName());

    private static final DateTimeFormatter sdfHour = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final NotificationController notificationController;
    private final PushSenderController pushSenderController;

    public PushNotificationController() {
        this.notificationController = new NotificationController();
        this.pushSenderController = new PushSenderController();
    }

    public <T extends Principal> PushNotificationController(T vo) throws AuthenticationException {
        super(vo);
        notificationController = new NotificationController(vo);
        pushSenderController = new PushSenderController();
    }

    public void sendNotifications(HashMap<NotificationVo, PushNotificationVo> notifications) {
        notifications.forEach((notification, pushNotification) -> sendNotification(pushNotification, notification));
    }

    public void sendNotification(PushNotificationVo pushNotification, NotificationVo notification) {
        try {
            notificationController.save(notification);

            Optional<Installation> installation = Util.obtePushNotificationMedico(notification.getMedico().getId());

            if (!installation.isPresent()) {
                return;
            }

            pushNotification.setInstallation(installation.get());
            pushSenderController.sendPushNotification(pushNotification);
        } catch (Exception e) {
            logger.severe(e.getMessage());
            e.printStackTrace();
        }
    }

    public void sendNotificationToAllMedics(PushNotificationVo pushNotification, NotificationVo notification) {

        try {
            MedicoController medicoController = new MedicoController(usuarioVO);

            medicoController.listar(null, null, null, null, null, null, null, null, null).forEach(medico -> {
                if (medico.getTokenPushNotification() != null) {
                    PushNotificationVo pushCopy = pushNotification.copy();
                    NotificationVo notificationCopy = notification.copy();
                    notificationCopy.setMedico(medico);
                    sendNotification(pushCopy, notificationCopy);
                }
            });

        } catch (Exception e) {
            logger.severe(e.getMessage());
        }
    }

    public void sendPushDonationOpenMyOwn(Plantao entity) {

        String type = Constants.PUSH_TYPE_DONATION_OPEN_MY_OWN_DUTY;
        String text = String.format("Seu plantão %s teve status alterado para 'doação'",
        getInfoDuty(entity));

        PlantaoVo plantao = PlantaoMapper.convertToVo(entity);
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(plantao.getMedico())
                .setMessage(text)
                .setType(type)
                .setPlantao(plantao)
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTo(plantao.getMedico().getTokenPushNotification())
                .setTitle("Doação de plantão")
                .setBody(text)
                .setType(type)
                .setObjeto(notification.getPlantao())
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    public void sendPushUpdateDutyValue(Plantao entity) {

        String notificationBody = String.format(
                "O seu plantão %s teve valor alterado para R$ %s",
                getInfoDuty(entity),
                String.format("%.2f", entity.getValor()));

        PlantaoVo plantao = PlantaoMapper.convertToVo(entity);
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(plantao.getMedico())
                .setMessage(notificationBody)
                .setType(Constants.TIPO_PUSH_MUDANCA_STATUS_PLANTAO)
                .setPlantao(plantao)
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTo(plantao.getMedico().getTokenPushNotification())
                .setTitle("Valor do plantão")
                .setBody(notificationBody)
                .setType(Constants.TIPO_PUSH_MUDANCA_STATUS_PLANTAO)
                .setObjeto(notification.getPlantao())
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    public void sendPushUpdateDutyStatus(Plantao entity, String status) {

        String notificationBody = String.format(
                "O status do seu plantão %s foi alterado para '%s'",
                getInfoDuty(entity),
                status);

        PlantaoVo plantao = PlantaoMapper.convertToVo(entity);
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(plantao.getMedico())
                .setMessage(notificationBody)
                .setType(Constants.TIPO_PUSH_MUDANCA_STATUS_PLANTAO)
                .setPlantao(plantao)
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTo(plantao.getMedico().getTokenPushNotification())
                .setTitle("Status de plantão")
                .setBody(notificationBody)
                .setType(Constants.TIPO_PUSH_MUDANCA_STATUS_PLANTAO)
                .setObjeto(notification.getPlantao())
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    /**
     * Send push notification to medics of contracts related with 'plantao'
     * to alert a new donation open
     */
    public void sendPushDonationNewOpen(List<MedicoVo> medics, Plantao entity) {

        String notificationBody = String.format("O plantão %s está disponível para 'doação'",
                getInfoDuty(entity));
        String title = "Novo plantão disponível";

        PlantaoVo plantao = PlantaoMapper.convertToVo(entity);
        for (MedicoVo medic : medics) {

            NotificationVo notification = new NotificationVo.Builder()
                    .setMedico(medic)
                    .setMessage(notificationBody)
                    .setType(Constants.PUSH_TYPE_DONATION_NEW_OPEN)
                    .setPlantao(plantao)
                    .create();

            PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                    .setTo(medic.getTokenPushNotification())
                    .setTitle(title)
                    .setBody(notificationBody)
                    .setType(Constants.PUSH_TYPE_DONATION_NEW_OPEN)
                    .setObjeto(notification.getPlantao())
                    .buildDefault();

            this.sendNotification(pushNotification, notification);
        }
    }

    public void sendPushDonationNewApplicant(Medico medicoPlantao, CandidatoPlantao candidatoPlantao) {

        String notificationBody = String.format("Candidato (%s) ao seu plantão doado %s",
                candidatoPlantao.getMedico().getNome(),
                getInfoDuty(candidatoPlantao.getPlantao()));

        String type = Constants.PUSH_TYPE_DONATION_NEW_APPLICANT;

        CandidatoPlantaoVo candidatoPlantaoVo = CandidatoPlantaoMapper.convertToVo(candidatoPlantao);
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(MedicoMapper.convertToVo(medicoPlantao))
                .setMessage(notificationBody)
                .setType(type)
                .setCandidatoPlantao(candidatoPlantaoVo)
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTo(medicoPlantao.getTokenPushNotification())
                .setTitle("Candidato ao seu plantão doado")
                .setBody("Toque para ver")
                .setType(type)
                .setObjeto(candidatoPlantaoVo)
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    public void sendPushApplicantReceived(Medico medico, Plantao entity) {

        String notificationBody = String.format("Candidatura recebida com sucesso ao plantão %s",
                getInfoDuty(entity));

        String type = Constants.PUSH_TYPE_APPLICANT_RECEIVED;

        PlantaoVo plantao = PlantaoMapper.convertToVo(entity);
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(MedicoMapper.convertToVo(medico))
                .setMessage(notificationBody)
                .setType(type)
                .setPlantao(plantao)
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTo(medico.getTokenPushNotification())
                .setTitle("Candiatura recebida com sucesso ao plantão")
                .setBody("Toque para ver")
                .setType(type)
                .setObjeto(plantao)
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    public void sendPushDonationApplicantReceived(Medico medico, Plantao entity) {

        String notificationBody = String.format("Candidatura recebida com sucesso ao plantão %s",
                getInfoDuty(entity));
        String type = Constants.PUSH_TYPE_DONATION_APPLICANT_RECEIVED;

        PlantaoVo plantao = PlantaoMapper.convertToVo(entity);
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(MedicoMapper.convertToVo(medico))
                .setMessage(notificationBody)
                .setType(type)
                .setPlantao(plantao)
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTo(medico.getTokenPushNotification())
                .setTitle("Candiatura recebida com sucesso ao plantão")
                .setBody("Toque para ver")
                .setType(type)
                .setObjeto(plantao)
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    public void sendPushDonationAccepted(MedicoVo medicoCandidato, Plantao entity) {
        String title = "Plantão doado";
        String type = Constants.PUSH_TYPE_DONATION_ACCEPTED;
        String text = String.format("Seu plantão %s foi doado para %s",
                getInfoDuty(entity),
                entity.getMedico().getNome());

        PlantaoVo plantao = PlantaoMapper.convertToVo(entity);
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(medicoCandidato)
                .setMessage(text)
                .setType(type)
                .setPlantao(plantao)
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTitle(title)
                .setBody(text)
                .setType(type)
                .setObjeto(plantao)
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    public void sendPushDonationApplicantAccepted(MedicoVo medicoCandidato, MedicoVo medicoAtual, Plantao entity) {
        String title = "Plantão aceito";
        String type = Constants.PUSH_TYPE_DONATION_APPLICANT_ACCEPTED;
        String text = String.format("Sua candidatura ao plantão doado por %s %s foi aceita",
                medicoAtual.getNome(),
                getInfoDuty(entity));

        PlantaoVo plantao = PlantaoMapper.convertToVo(entity);
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(medicoCandidato)
                .setMessage(text)
                .setType(type)
                .setPlantao(plantao)
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTitle(title)
                .setBody(text)
                .setType(type)
                .setObjeto(plantao)
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    public void sendPushDonationDeclined(MedicoVo medicoCandidato, Plantao entity) {
        String title = "Plantão não aceito";
        String text = String.format("Sua candidatura ao plantão doado %s não foi aceita",
                getInfoDuty(entity));
        String type = Constants.PUSH_TYPE_DONATION_DECLINED;

        PlantaoVo plantao = PlantaoMapper.convertToVo(entity);
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(medicoCandidato)
                .setMessage(text)
                .setType(type)
                .setPlantao(plantao)
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTitle(title)
                .setBody(text)
                .setType(type)
                .setObjeto(plantao)
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    public void sendPushChangeDuty(TrocaVaga entity) {

        String title = "Troca de plantão solicitada";
        String type = Constants.PUSH_TYPE_CHANGE_DUTY;

        String text = String.format("O médico %s deseja trocar o plantão %s com o seu plantão %s",
                entity.getMedicoRequisitante().getNome(),
                getInfoDuty(entity.getPlantaoRequisitante()),
                getInfoDuty(entity.getPlantaoVaga())
        );

        TrocaVagaVo trocaVaga = TrocaVagaMapper.convertToVo(entity);
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(trocaVaga.getMedicoVaga())
                .setMessage(text)
                .setType(type)
                .setTrocaVaga(trocaVaga)
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTitle(title)
                .setBody(text)
                .setType(type)
                .setObjeto(trocaVaga)
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    public void sendPushChangeDutyAccepted(TrocaVaga entity) {
        String title = "Troca de plantões";
        String type = Constants.PUSH_TYPE_CHANGE_DUTY_ACCEPTED;
        String text = String.format("Seu plantão %s foi trocado pelo plantão %s com médico %s",
                getInfoDuty(entity.getPlantaoRequisitante()),
                getInfoDuty(entity.getPlantaoVaga()),
                entity.getMedicoRequisitante().getNome()
        );

        TrocaVagaVo trocaVaga = TrocaVagaMapper.convertToVo(entity);
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(trocaVaga.getMedicoVaga())
                .setMessage(text)
                .setType(type)
                .setPlantao(trocaVaga.getPlantaoVaga())
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTitle(title)
                .setBody(text)
                .setType(type)
                .setObjeto(trocaVaga.getPlantaoVaga())
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    public void sendPushChangeDutyDeclined(TrocaVaga entity) {
        String title = "Troca de plantões";
        String type = Constants.PUSH_TYPE_CHANGE_DUTY_DECLINED;
        String text = String.format("O médico %s não aceitou realizar a troca. Seu plantão %s continua disponível para troca",
                entity.getMedicoVaga().getNome(),
                getInfoDuty(entity.getPlantaoRequisitante())
        );

        TrocaVagaVo trocaVagaVo = TrocaVagaMapper.convertToVo(entity);
        MedicoVo medic = trocaVagaVo.getMedicoRequisitante();
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(medic)
                .setMessage(text)
                .setType(type)
                .setPlantao(trocaVagaVo.getPlantaoRequisitante())
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTitle(title)
                .setBody(text)
                .setType(type)
                .setObjeto(trocaVagaVo.getPlantaoRequisitante())
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    public void sendPushApplicantAccepted(Plantao entity) {
        String title = "Plantão aceito";
        String text = String.format("Sua candidatura ao plantão %s foi aceita com o status '%s'",
                getInfoDuty(entity),
                getLabelStatus(entity));
        String type = Constants.TIPO_PUSH_CANDIDATURA_ACEITA;

        PlantaoVo plantao = PlantaoMapper.convertToVo(entity);
        MedicoVo medic = plantao.getMedico();
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(medic)
                .setMessage(text)
                .setType(type)
                .setPlantao(plantao)
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTitle(title)
                .setBody(text)
                .setType(type)
                .setObjeto(plantao)
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    private String getLabelStatus(Plantao plantao) {
        if (plantao.getStatus().equals(Constants.STATUS_PLANTAO_FIXO)) {
            return "fixo";
        } else if (plantao.getStatus().equals(Constants.STATUS_PLANTAO_A_CONFIRMAR)) {
            return "a confirmar";
        } else {
            return "confirmado";
        }
    }

    public void sendPushApplicantDeclined(CandidatoPlantao candidatoPlantao) {

        String title = "Plantão não aceito";
        String text = String.format("Sua candidatura ao plantão %s não foi aceita",
                getInfoDuty(candidatoPlantao.getPlantao()));
        String type = Constants.TIPO_PUSH_CANDIDATURA_RECUSADA;

        PlantaoVo plantao = PlantaoMapper.convertToVo(candidatoPlantao.getPlantao());
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(plantao.getMedico())
                .setMessage(text)
                .setType(type)
                .setPlantao(plantao)
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTitle(title)
                .setBody(text)
                .setType(type)
                .setObjeto(plantao)
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    public void sendPushNewAttachment() {
        String title = "Documento adicional disponível";
        String text = "Novo documento adicional disponível!";
        String type = Constants.TIPO_PUSH_DOCUMENTO_ADICIONAL;
        NotificationVo notification = new NotificationVo.Builder()
                .setMedico(this.medicoVO)
                .setMessage(text)
                .setType(type)
                .create();

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTitle(title)
                .setBody(text)
                .setType(type)
                .buildDefault();

        this.sendNotification(pushNotification, notification);
    }

    private String getInfoDuty(Plantao plantao) {

        String horaFim = LocalDateTime.ofInstant(plantao.getHoraFim().toInstant(), ZoneId.of("America/Sao_Paulo")).format(sdfHour);
        String horaInicio = LocalDateTime.ofInstant(plantao.getHoraInicio().toInstant(), ZoneId.of("America/Sao_Paulo"))
                .format(sdfHour);

        String date = LocalDateTime.ofInstant(plantao.getData().toInstant(), ZoneId.of("UTC"))
                .format(dateFormatter);

        var dia = plantao.getDia();
        if (plantao.getDia().equals("sabado")){
            // fix typo on Constants
            dia = "sábado";
        }
        try {
//            String local = plantao.getEscala().getContrato().getLocal();
            return String.format("de %s %s %s - %s %s", dia, date, horaInicio, horaFim, "");
        }
        catch (NullPointerException npe) {
            logger.log(Level.SEVERE, "IllegalState - plantao.escala.contrato.local is null");
            return String.format("de %s %s %s - %s", dia, date, horaInicio, horaFim);
        }
    }

}
