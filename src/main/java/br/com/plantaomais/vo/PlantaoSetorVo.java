package br.com.plantaomais.vo;


import java.io.Serializable;

/**
 * Created by nextage on 14/05/2019.
 */
public class PlantaoSetorVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private PlantaoVo plantao;
    private SetorVo setor;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public PlantaoVo getPlantao() {
        return plantao;
    }

    public void setPlantao(PlantaoVo plantao) {
        this.plantao = plantao;
    }

    public SetorVo getSetor() {
        return setor;
    }

    public void setSetor(SetorVo setor) {
        this.setor = setor;
    }
}
