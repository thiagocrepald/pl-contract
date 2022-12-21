package br.com.plantaomais.entitybean;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * Created by nextage on 17/06/2019.
 */
@Entity
@Table(name = "CONFIGURACAO")
public class Configuracao implements Serializable {
    public static final String ALIAS_CLASSE = "configuracao";

    public static final String ID = "id";
    public static final String USUARIO = "usuario";
    public static final String TIPO_CONFIGURACAO = "tipoConfiguracao";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_CONFIGURACAO_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "USUARIO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Usuario usuario;

    @JoinColumn(name = "TIPO_CONFIGURACAO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private TipoConfiguracao tipoConfiguracao;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public TipoConfiguracao getTipoConfiguracao() {
        return tipoConfiguracao;
    }

    public void setTipoConfiguracao(TipoConfiguracao tipoConfiguracao) {
        this.tipoConfiguracao = tipoConfiguracao;
    }
}

