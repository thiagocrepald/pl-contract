package br.com.plantaomais.vo;

import java.util.List;

/**
 * Created by gmribas on 09/04/20.
 */
public class ContratoAnexoGrupoVO {

    public ContratoAnexoGrupoVO(String name, List<ContratoAnexoVo> items) {
        this.name = name;
        this.items = items;
    }

    private String name;

    private List<ContratoAnexoVo> items;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ContratoAnexoVo> getItems() {
        return items;
    }

    public void setItems(List<ContratoAnexoVo> items) {
        this.items = items;
    }
}
