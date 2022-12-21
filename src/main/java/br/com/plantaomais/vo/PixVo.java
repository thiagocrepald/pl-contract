package br.com.plantaomais.vo;

import br.com.plantaomais.entitybean.enums.PixKeyType;

import java.io.Serializable;


public class PixVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String pixKey;
    private PixKeyType pixKeyType;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPixKey() {
        return pixKey;
    }

    public void setPixKey(String pixKey) {
        this.pixKey = pixKey;
    }

    public PixKeyType getPixKeyType() {
        return pixKeyType;
    }

    public void setPixKeyType(PixKeyType pixKeyType) {
        this.pixKeyType = pixKeyType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PixVo that = (PixVo) o;

        return id != null ? id.equals(that.id) : that.id == null;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
