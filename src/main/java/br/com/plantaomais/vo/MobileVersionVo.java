package br.com.plantaomais.vo;

public class MobileVersionVo {

    private Integer id;
    private String androidVersion;
    private String iosVersion;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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
