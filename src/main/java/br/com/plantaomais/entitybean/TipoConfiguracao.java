package br.com.plantaomais.entitybean;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

/**
 * Created by nextage on 17/06/2019.
 */
@Entity
@Table(name = "TIPO_CONFIGURACAO")
public class TipoConfiguracao {
    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "tipoConfiguracao";

    public static final String ID = "id";
    public static final String DESCRICAO = "descricao";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_TIPO_CONFIGURACAO_ID", allocationSize = 1)
    private Integer id;

    @Column(name = "DESCRICAO")
    private String descricao;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
