package br.com.plantaomais.vo;

import java.io.Serializable;

/**
 * Created by nextage on 14/05/2019.
 */
public class SetorVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
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
