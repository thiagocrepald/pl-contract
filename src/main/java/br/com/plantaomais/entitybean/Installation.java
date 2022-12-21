package br.com.plantaomais.entitybean;

import br.com.plantaomais.entitybean.push.Platform;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@Table(name = "installation")
public class Installation implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "installation";

    public static final String ID = "id";
    public static final String DEVICE_TOKEN = "deviceToken";
    public static final String DEVICE_TYPE = "deviceType";
    public static final String OS_VERSION = "osVersion";
    public static final String ALIAS = "alias";
    public static final String PLATFORM = "platform";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;

    @NotNull
    @Column(name = "device_token", nullable = false)
    private String deviceToken;

    @Column(name = "device_type")
    private String deviceType;

    @Column(name = "os_version")
    private String osVersion;

    @Column(name = "alias")
    private String alias;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "platform", nullable = false)
    private Platform platform;

    @JoinColumn(name = "MEDIC_ID", referencedColumnName = "ID")
    @ManyToOne
    private Medico medico;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDeviceToken() {
        return deviceToken;
    }

    public void setDeviceToken(String deviceToken) {
        this.deviceToken = deviceToken;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public String getOsVersion() {
        return osVersion;
    }

    public void setOsVersion(String osVersion) {
        this.osVersion = osVersion;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public Platform getPlatform() {
        return platform;
    }

    public void setPlatform(Platform platform) {
        this.platform = platform;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }
}
