package br.com.plantaomais.entitybean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Objects;

/**
 * Created by nextage on 14/05/2019.
 */
@Entity
@Table(name = "SETOR")
public class Setor extends Auditoria implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "setor";

    public static final String ID = "id";
    public static final String DESCRICAO = "descricao";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_SETOR_ID", allocationSize = 1)
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Setor setor = (Setor) o;
        return Objects.equals(id, setor.id) &&
                Objects.equals(descricao, setor.descricao);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, descricao);
    }
}
