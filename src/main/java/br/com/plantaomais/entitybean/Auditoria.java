package br.com.plantaomais.entitybean;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.io.Serializable;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@MappedSuperclass
public class Auditoria implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final String EXCLUIDO = "excluido";
    public static final String USUARIO_INC = "usuarioInc";
    public static final String USUARIO_ALT = "usuarioAlt";
    public static final String USUARIO_DEL = "usuarioDel";
    public static final String DATA_USUARIO_INC = "dataUsuarioInc";
    public static final String DATA_USUARIO_ALT = "dataUsuarioAlt";
    public static final String DATA_USUARIO_DEL = "dataUsuarioDel";

    public static List<String> getAllFields() {
        return Arrays.asList(
            EXCLUIDO,
            USUARIO_INC,
            USUARIO_ALT,
            USUARIO_DEL,
            DATA_USUARIO_INC,
            DATA_USUARIO_ALT,
            DATA_USUARIO_DEL
        );
    }

    @Column(name = "EXCLUIDO", length = 1, nullable = false)
    private boolean excluido;

    @Column(name = "USUARIO_INC", length = 500, nullable = false)
    private String usuarioInc;

    @Column(name = "USUARIO_ALT", length = 500, nullable = false)
    private String usuarioAlt;

    @Column(name = "USUARIO_DEL", length = 500)
    private String usuarioDel;

    @Column(name = "DATA_USUARIO_INC", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataUsuarioInc;

    @Column(name = "DATA_USUARIO_ALT", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataUsuarioAlt;

    @Column(name = "DATA_USUARIO_DEL")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataUsuarioDel;

    public boolean getExcluido() {
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
