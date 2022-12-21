package br.com.plantaomais.controller.push;

import br.com.plantaomais.entitybean.push.Platform;
import br.com.plantaomais.entitybean.push.PushMessage;

import java.util.Map;
import java.util.Set;

public interface PushSenderService {

    void sendMessage(Platform platform, Set<String> tokens, PushMessage message, PushSenderCallback callback);

    void updateInstallationsForCanonicalIDs(Map<String, String> changedTokens);

    void removeInstallationsForDeviceToken(String invalidToken);
}
