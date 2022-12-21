package br.com.plantaomais.entitybean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * Created by nextage on 10/05/2019.
 */
@Entity
@Table(name = "TIPO_SERVICO")
public class TipoServico extends Auditoria implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "tipoServico";

    public static final String ID = "id";
    public static final String DESCRICAO = "descricao";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_TIPO_SERVICO_ID", allocationSize = 1)
    private Integer id;

    @Column(name = "DESCRICAO", length = 500, nullable = false)
    private String descricao;

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
