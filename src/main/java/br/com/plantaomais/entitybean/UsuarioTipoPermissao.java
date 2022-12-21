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
import java.util.Objects;

/**
 * Created by nextage on 09/05/2019.
 */
@Entity
@Table(name = "USUARIO_TIPO_PERMISSAO")
public class UsuarioTipoPermissao {
    // Constantes com os nomes da classe
    public static final String ALIAS_CLASSE = "usuarioTipoPermissao";

    public static final String ID = "id";
    public static final String USUARIO = "usuario";
    public static final String TIPO_PERMISSAO = "tipoPermissao";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_USUARIO_TIPO_PERMISSAO_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "USUARIO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Usuario usuario;

    @JoinColumn(name = "TIPO_PERMISSAO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private TipoPermissao tipoPermissao;

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

    public TipoPermissao getTipoPermissao() {
        return tipoPermissao;
    }

    public void setTipoPermissao(TipoPermissao tipoPermissao) {
        this.tipoPermissao = tipoPermissao;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UsuarioTipoPermissao that = (UsuarioTipoPermissao) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(usuario, that.usuario) &&
                Objects.equals(tipoPermissao, that.tipoPermissao);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, usuario, tipoPermissao);
    }
}