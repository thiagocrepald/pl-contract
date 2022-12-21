package br.com.plantaomais.vo;

import java.io.Serializable;

/**
 * Created by nextage on 14/05/2019.
 */
public class EspecialidadeVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String descricao;

    // Usado na tela de indicadores
    private Integer qtdMedicos;

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

    public Integer getQtdMedicos() {
        return qtdMedicos;
    }

    public void setQtdMedicos(Integer qtdMedicos) {
        this.qtdMedicos = qtdMedicos;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EspecialidadeVo that = (EspecialidadeVo) o;

        return id != null ? id.equals(that.id) : that.id == null;

    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
