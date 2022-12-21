package br.com.plantaomais.entitybean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "MOBILE_VERSION")
public class MobileVersion implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "mobileVersion";

    public static final String ID = "id";
    public static final String ANDROID_VERSION = "androidVersion";
    public static final String IOS_VERSION = "iosVersion";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_CURSO_ID", allocationSize = 1)
    private Integer id;

    @Column(name = "ANDROID_VERSION")
    private String androidVersion;

    @Column(name = "IOS_VERSION")
    private String iosVersion;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getAndroidVersion() {
        return androidVersion;
    }

    public void setAndroidVersion(String androidVersion) {
        this.androidVersion = androidVersion;
    }

    public String getIosVersion() {
        return iosVersion;
    }

    public void setIosVersion(String iosVersion) {
        this.iosVersion = iosVersion;
    }
}
