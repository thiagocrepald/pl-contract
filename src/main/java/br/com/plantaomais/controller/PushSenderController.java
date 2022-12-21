package br.com.plantaomais.controller;

import br.com.plantaomais.config.ApplicationProperties;
import br.com.plantaomais.controller.push.FCMSenderService;
import br.com.plantaomais.controller.push.PushSenderService;
import br.com.plantaomais.controller.push.PushService;
import br.com.plantaomais.entitybean.push.NotificationType;
import br.com.plantaomais.entitybean.push.PushMessage;
import br.com.plantaomais.entitybean.push.sender.PushNotification;
import br.com.plantaomais.vo.aplicativo.PushNotificationVo;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class PushSenderController {

    private static final Logger logger = Logger.getLogger(PushSenderController.class.getName());

    public void sendPushNotification(@NotNull final PushNotificationVo listaPushNotificationVo) {
        List<PushSenderService> services = Arrays.asList(new FCMSenderService());
        PushService pushService = new PushService(services);
        if (ApplicationProperties.pushBlocked()) {
            logger.log(Level.INFO, "push are blocked {0}", listaPushNotificationVo.getBody());
            return;
        }

        var builder = new PushNotification.Builder("default");
        builder.title(listaPushNotificationVo.getTitle());
        builder.body(listaPushNotificationVo.getBody());

        var message = new PushMessage();
        message.setNotification(builder.build());
        message.setType(NotificationType.QUOTATION_CHANGED);
//        message.getPayload().put(NotificationType.Extras.PAYLOAD, listaPushNotificationVo.getBody());

        pushService.sendMessageForProviders(Arrays.asList(listaPushNotificationVo.getInstallation()), message);
    }

}
