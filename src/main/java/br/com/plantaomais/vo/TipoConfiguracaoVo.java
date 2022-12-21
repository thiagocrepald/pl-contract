package br.com.plantaomais.vo;

/**
 * Created by nextage on 17/06/2019.
 */
public class TipoConfiguracaoVo {
    private Integer id;
    private String descricao;
    private Boolean checked;

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

    public Boolean getChecked() {
        return checked;
    }

    public void setChecked(Boolean checked) {
        this.checked = checked;
    }
}
