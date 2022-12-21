package br.com.plantaomais.vo.aplicativo;

import br.com.plantaomais.entitybean.Installation;
import br.com.plantaomais.vo.PushNotificationDataVo;

import java.io.Serializable;
import java.util.Objects;

public class PushNotificationVo implements Serializable {

    private String to;
    private String sound;
    private String title;
    private String body;
    private Installation installation;

    private PushNotificationDataVo data;

    public PushNotificationVo() {
    }

    private PushNotificationVo(String to, String sound, String title, String body, PushNotificationDataVo data) {
        this.to = to;
        this.sound = sound;
        this.title = title;
        this.body = body;
        this.data = data;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getSound() {
        return sound;
    }

    public void setSound(String sound) {
        this.sound = sound;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Object getData() {
        return data;
    }

    public void setData(PushNotificationDataVo data) {
        this.data = data;
    }

    public Installation getInstallation() {
        return installation;
    }

    public void setInstallation(Installation installation) {
        this.installation = installation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PushNotificationVo that = (PushNotificationVo) o;
        return Objects.equals(to, that.to) &&
                Objects.equals(body, that.body);
    }

    @Override
    public int hashCode() {
        return Objects.hash(to, body);
    }

    public PushNotificationVo copy() {
        String type = null;
        Object objeto = null;
        if (data != null){
            type = data.getTipo();
            objeto = data.getObjeto();
        }
        return new Builder()
                .setTo(to)
                .setSound(sound)
                .setTitle(title)
                .setBody(body)
                .setType(type)
                .setObjeto(objeto)
                .buildDefault();
    }

    public static class Builder {
        private String to;
        private String sound;
        private String title;
        private String body;
        private String type;
        private Object objeto;

        public Builder setTo(String to) {
            this.to = to;
            return this;
        }

        public Builder setSound(String sound) {
            this.sound = sound;
            return this;
        }

        public Builder setTitle(String title) {
            this.title = title;
            return this;
        }

        public Builder setBody(String body) {
            this.body = body;
            return this;
        }

        public Builder setType(String type) {
            this.type = type;
            return this;
        }

        public Builder setObjeto(Object objeto) {
            this.objeto = objeto;
            return this;
        }

        public PushNotificationVo build() {
            PushNotificationDataVo data = new PushNotificationDataVo();
            data.setTipo(type);
            return new PushNotificationVo(to, sound, title, body, data);
        }

        public PushNotificationVo buildDefault() {
            PushNotificationDataVo data = new PushNotificationDataVo();
            data.setObjeto(objeto);
            data.setTipo(type);
            return new PushNotificationVo(to, "default", title, body, data);
        }
    }
}
