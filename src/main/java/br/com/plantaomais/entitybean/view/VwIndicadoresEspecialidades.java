package br.com.plantaomais.entitybean.view;

import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Objects;

/**
 * @author Matheus Toledo
 */
@Entity
@Immutable
@Table(name = "VW_INDICADORES_ESPECIALIDADES")
public class VwIndicadoresEspecialidades  implements Serializable {
    private static final long serialVersionUID = 1L;


    public static final String ALIAS_CLASSE = "vwIndicadoresEspecialidades";

    public static final String ESPECIALIDADE_ID = "especialidadeId";
    public static final String ESPECIALIDADE = "especialidade";
    public static final String QUANTIDADE = "quantidade";


    @Id
    @Column(name = "ESPECIALIDADE_ID")
    private Integer especialidadeId;

    @Column(name = "ESPECIALIDADE", length = 50)
    private String especialidade;

    @Column(name = "QUANTIDADE")
    private Integer quantidade;

    public Integer getEspecialidadeId() {
        return especialidadeId;
    }

    public void setEspecialidadeId(Integer especialidadeId) {
        this.especialidadeId = especialidadeId;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VwIndicadoresEspecialidades that = (VwIndicadoresEspecialidades) o;
        return Objects.equals(especialidadeId, that.especialidadeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(especialidadeId);
    }
}
