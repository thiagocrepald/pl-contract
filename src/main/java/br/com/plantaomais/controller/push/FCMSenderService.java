package br.com.plantaomais.controller.push;

import br.com.plantaomais.entitybean.push.Platform;
import br.com.plantaomais.entitybean.push.PushMessage;
import br.com.plantaomais.entitybean.push.sender.Constants;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.AndroidConfig;
import com.google.firebase.messaging.AndroidNotification;
import com.google.firebase.messaging.ApnsConfig;
import com.google.firebase.messaging.Aps;
import com.google.firebase.messaging.BatchResponse;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.MulticastMessage;
import com.google.firebase.messaging.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;

/**
 * Created by deividi on 04/08/16.
 */
@Service
@SenderType(values = {Platform.ANDROID, Platform.IOS, Platform.WEB})
public class FCMSenderService implements PushSenderService {

    private static final Set<String> GCM_ERROR_CODES = new HashSet<>(Arrays.asList(Constants.ERROR_INVALID_REGISTRATION, Constants.ERROR_NOT_REGISTERED));
    private final Logger log = LoggerFactory.getLogger(FCMSenderService.class);
    private volatile static FirebaseApp INSTANCE;

    public FCMSenderService() {
        if (INSTANCE != null) {
            return;
        }

        var refreshToken = FCMSenderService.class.getClassLoader().getResourceAsStream("plantao-mais-3f99f-firebase-adminsdk-kizkl-27807c9e85.json");

        FirebaseOptions options = null;
        try {
            options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(refreshToken))
                    .setDatabaseUrl("https://plantao-mais-3f99f.firebaseio.com")
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
        }
        INSTANCE = FirebaseApp.initializeApp(options);
    }

    @Override
    public void sendMessage(Platform platform, Set<String> tokens, PushMessage message, PushSenderCallback callback) {

        log.info("Sending messages to FCM");

        if (tokens.isEmpty()) {
            if (callback != null) {
                callback.onSuccess();
            }
            return;
        }

        final List<String> registrationIDs = new ArrayList<>(tokens);

        var fcmBuilder = MulticastMessage.builder();

        var topic = message.getAction();
        var android = AndroidConfig.builder()
                .setTtl(Duration.ofMinutes(100).toMillis())
                .setCollapseKey(topic)
                .setPriority(AndroidConfig.Priority.HIGH)
                .setNotification(AndroidNotification.builder()
                        .setTag(topic).build()).build();

        var ios = ApnsConfig.builder()
                .setAps(Aps.builder().setCategory(topic).setThreadId(topic).build())
                .build();

        fcmBuilder.setAndroidConfig(android);
        fcmBuilder.setApnsConfig(ios);

        var data = new HashMap<String, String>();
        message.getPayload()
                .keySet()
                .forEach(key -> {
                    try {
                        if (message.getPayload().get(key) != null) {
                            if (message.getPayload().get(key) instanceof String) {
                                data.put(key, (String) message.getPayload().get(key));
                            } else {
//                                data.put(key, mapper.writeValueAsString(message.getPayload().get(key)));
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });


        fcmBuilder.setNotification(Notification.builder()
                .setBody(message.getNotification().getBody())
                .setImage(message.getNotification().getIcon())
                .setTitle(message.getNotification().getTitle())
                .build());

        data.put("type", message.getType().name());

        data.put("push_id", message.getId());

        fcmBuilder.putAllData(data);

        try {
            BatchResponse multicastResult = FirebaseMessaging
                    .getInstance()
                    .sendMulticastAsync(fcmBuilder.addAllTokens(tokens).build())
                    .get();
            callback.onSuccess();
            cleanupInvalidRegistrationIDsForVariant(multicastResult, registrationIDs, message);

        } catch (InterruptedException | ExecutionException e) {
            log.error("Error", e);
            callback.onError("Error sending payload to GCM server");
        }

    }

    private void cleanupInvalidRegistrationIDsForVariant(BatchResponse multicastResult, List<String> registrationIDs, PushMessage message) {

        // TODO
//        final List<SendResponse> results = multicastResult.getResponses();
//        multicastResult.getCanonicalIds();
//
//        final Set<String> inactiveTokens = new HashSet<>();
//        final Map<String, String> changedTokens = new HashMap<>();
//
//        for (int i = 0; i < results.size(); i++) {
//            final SendResponse result = results.get(i);
//
//            final String errorCodeName = result.getException().getMessagingErrorCode().name();
//
//            if (errorCodeName != null && GCM_ERROR_CODES.contains(errorCodeName)) {
//                log.warn("Token has been invalidated: {}", registrationIDs.get(i));
//                inactiveTokens.add(registrationIDs.get(i));
//            }
//
//            if (errorCodeName != null && ERROR_MESSAGE_TOO_BIG.contains(errorCodeName)) {
//                log.error("Message too big! {}", message);
//            }
//
//            if (result.getCanonicalRegistrationId() != null) {
//                log.warn("Token {} has a new canonical ID: {}", registrationIDs.get(i), results.get(i).getCanonicalRegistrationId());
//                changedTokens.put(registrationIDs.get(i), results.get(i).getCanonicalRegistrationId());
//            }
//        }
//
//        installationService.removeInstallationsForDeviceTokens(inactiveTokens);
//        installationService.updateInstallationsForCanonicalIDs(changedTokens);
    }

    @Override
    public void updateInstallationsForCanonicalIDs(Map<String, String> changedTokens) {
        log.info("Update tokens for new canonical tokens: {}", changedTokens);
//        for (Map.Entry<String, String> entry : changedTokens.entrySet()) {
//            repository.updateTokenForCanonicalID(entry.getKey(), entry.getValue());
//        }
    }

    @Override
    public void removeInstallationsForDeviceToken(String invalidToken) {
//        List<Installation> expired = repository.findByDeviceToken(invalidToken);
//        if (expired != null && !expired.isEmpty()) {
//            log.info("Removing from database the following Token: {}", invalidToken);
//            repository.deleteAll(expired);
//        }
    }


}
