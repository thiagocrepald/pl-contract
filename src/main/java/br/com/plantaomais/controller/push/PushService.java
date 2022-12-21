package br.com.plantaomais.controller.push;

import br.com.plantaomais.entitybean.Installation;
import br.com.plantaomais.entitybean.push.Platform;
import br.com.plantaomais.entitybean.push.PushMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.framework.AopProxyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class PushService {

    private final Logger log = LoggerFactory.getLogger(PushService.class);

    private final HashMap<Platform, PushSenderService> instances;

    @Autowired
    public PushService(List<PushSenderService> services) {
        instances = new HashMap<>();
        for (PushSenderService service : services) {
            SenderType annotation = AopProxyUtils.ultimateTargetClass(service).getAnnotation(SenderType.class);
            if (annotation != null && annotation.active()) {
                Platform[] platform = annotation.values();
                for (Platform p : platform) {
                    instances.put(p, service);
                }
            }
        }
    }

    public void sendMessageForProviders(List<Installation> all, PushMessage message) {
        Map<Platform, Set<String>> tokensMap = new HashMap<>();

        for (Platform platform : Platform.values()) {
            tokensMap.put(platform, new HashSet<>());
        }

        all.parallelStream()
            .forEach(i -> tokensMap.get(i.getPlatform()).add(i.getDeviceToken()));

        for (Map.Entry<Platform, Set<String>> entry : tokensMap.entrySet()) {
            sendMessageForProvider(entry.getKey(), entry.getValue(), message);
        }
    }

    public void sendMessageSingularInstallation(Installation installation, PushMessage message) {
        Map<Platform, Set<String>> tokensMap = new HashMap<>();

        for (Platform platform : Platform.values()) {
            tokensMap.put(platform, new HashSet<>());
        }

        tokensMap.get(installation.getPlatform()).add(installation.getDeviceToken());

        for (Map.Entry<Platform, Set<String>> entry : tokensMap.entrySet()) {
            sendMessageForProvider(entry.getKey(), entry.getValue(), message);
        }
    }

    @Async
    public void sendMessageForProvider(Platform platform, Set<String> tokens, PushMessage message) {
        try {
            instances.get(platform).sendMessage(platform, tokens, message, new PushSenderCallback() {
                @Override
                public void onSuccess() {
                    log.info("Pushes sent to destination : {}, platform: {}", tokens, platform);
                }

                @Override
                public void onError(String reason) {
                    log.info("Error sent pushes to destination : {}, platform: {}", tokens, platform);
                }
            });
        } catch (Exception e) {
            log.error("Error sending Push Notifications for platform: " + platform, e);
        }

    }

}
