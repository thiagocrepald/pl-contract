package br.com.plantaomais.vo;

import java.io.Serializable;
import java.util.Date;

public class AuditoriaVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private boolean excluido;
    private String usuarioInc;
    private String usuarioAlt;
    private String usuarioDel;
    private Date dataUsuarioInc;
    private Date dataUsuarioAlt;
    private Date dataUsuarioDel;

    public boolean isExcluido() {
        return excluido;
    }

    public void setExcluido(boolean excluido) {
        this.excluido = excluido;
    }

    public String getUsuarioInc() {
        return usuarioInc;
    }

    public void setUsuarioInc(String usuarioInc) {
        this.usuarioInc = usuarioInc;
    }

    public String getUsuarioAlt() {
        return usuarioAlt;
    }

    public void setUsuarioAlt(String usuarioAlt) {
        this.usuarioAlt = usuarioAlt;
    }

    public String getUsuarioDel() {
        return usuarioDel;
    }

    public void setUsuarioDel(String usuarioDel) {
        this.usuarioDel = usuarioDel;
    }

    public Date getDataUsuarioInc() {
        return dataUsuarioInc;
    }

    public void setDataUsuarioInc(Date dataUsuarioInc) {
        this.dataUsuarioInc = dataUsuarioInc;
    }

    public Date getDataUsuarioAlt() {
        return dataUsuarioAlt;
    }

    public void setDataUsuarioAlt(Date dataUsuarioAlt) {
        this.dataUsuarioAlt = dataUsuarioAlt;
    }

    public Date getDataUsuarioDel() {
        return dataUsuarioDel;
    }

    public void setDataUsuarioDel(Date dataUsuarioDel) {
        this.dataUsuarioDel = dataUsuarioDel;
    }
}
