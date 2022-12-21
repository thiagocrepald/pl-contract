package br.com.plantaomais.entitybean.push;

import br.com.plantaomais.entitybean.push.sender.PushNotification;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class PushMessage {

    private String id = UUID.randomUUID().toString();

    private PushNotification notification;

    private String action;

    private NotificationType type;

    private int timeToLive = -1;

    private Map<String, Object> payload = new HashMap<>();

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Map<String, Object> getPayload() {
        return payload;
    }

    public void setPayload(Map<String, Object> payload) {
        this.payload = payload;
    }

    public int getTimeToLive() {
        return timeToLive;
    }

    public void setTimeToLive(int timeToLive) {
        this.timeToLive = timeToLive;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public PushNotification getNotification() {
        return notification;
    }

    public void setNotification(PushNotification notification) {
        this.notification = notification;
    }

}
