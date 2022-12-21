package br.com.plantaomais.job;

import br.com.plantaomais.config.ApplicationProperties;
import br.com.plantaomais.controller.PlantaoController;
import br.com.plantaomais.controller.PushNotificationController;
import br.com.plantaomais.entitybean.enums.NotificationStatus;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.vo.NotificationVo;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.aplicativo.PushNotificationVo;
import org.joda.time.DateTime;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by gmribas on 19/05/20.
 */
public class DoctorsOnCallNotificationJob implements Job {

    private PushNotificationController pushNotificationController;

    private final Logger log = Logger.getLogger("DoctorsOnCallNotificationJob");

    @SuppressWarnings("RedundantThrows")
    @Override
    public void execute(JobExecutionContext pArg0) throws JobExecutionException {

        if (ApplicationProperties.jobsBlocked()) {
            log.log(Level.INFO, "jobs are blocked");
            return;
        }

        try {
            log.log(Level.INFO, "DoctorsOnCallNotificationJob initiated");

            pushNotificationController = new PushNotificationController();
            PlantaoController controller = new PlantaoController();

            DateTime now = new DateTime();
            DateTime twoHourAhead = now.plusHours(2);
            DateTime threeHourAhead = now.plusHours(3);
            List<PlantaoVo> twoHourGroup = controller.getAllWithMedicBetweenDateTimes(twoHourAhead, threeHourAhead);

            DateTime twentyFourHourAhead = now.plusHours(24);
            DateTime twentyFiveHourAhead = now.plusHours(25);
            List<PlantaoVo> twentyFourHourGroup = controller.getAllWithMedicBetweenDateTimes(twentyFourHourAhead, twentyFiveHourAhead);

            twentyFourHourGroup
                    .stream()
                    .filter(it -> it.getEscala().getAtivo())
                    .forEach(p -> {
                String title = "Lembrete de Plantão nas próximas 24h";
                String message = "Plantão " + p.getEscala().getNomeEscala();
                sendNotifications(p, title, message);
            });

            twoHourGroup
                    .stream()
                    .filter(it -> it.getEscala().getAtivo())
                    .forEach(p -> {
                String title = "Lembrete de Plantão nas próximas 2h";
                String message = "Plantão " + p.getEscala().getNomeEscala();
                sendNotifications(p, title, message);
            });


        } catch (Exception ex) {
            log.log(Level.WARNING, "DoctorsOnCallNotificationJob");
            ex.printStackTrace();
        }
    }

    private void sendNotifications(PlantaoVo vo, String title, String message) {
        if (vo.getMedico() == null) {
            throw new IllegalArgumentException("medico cannot be null");
        }

        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTitle(title)
                .setBody(message)
                .setType(Constants.PUSH_TYPE_REMINDER)
                .buildDefault();

        NotificationVo notification = new NotificationVo.Builder()
                .setDate(new Date())
                .setStatus(NotificationStatus.PENDING)
                .setType(Constants.PUSH_TYPE_REMINDER)
                .setMessage(message)
                .setMedico(vo.getMedico())
                .setPlantao(vo)
                .create();

        pushNotificationController.sendNotification(pushNotification, notification);
    }
}
