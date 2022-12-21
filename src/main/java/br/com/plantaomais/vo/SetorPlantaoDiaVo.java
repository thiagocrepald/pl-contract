package br.com.plantaomais.vo;

import java.io.Serializable;
import java.util.List;

public class SetorPlantaoDiaVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private SetorVo setor;
    private List<PlantaoVo> listaPlantao;

    public SetorVo getSetor() {
        return setor;
    }

    public void setSetor(SetorVo setor) {
        this.setor = setor;
    }

    public List<PlantaoVo> getListaPlantao() {
        return listaPlantao;
    }

    public void setListaPlantao(List<PlantaoVo> listaPlantao) {
        this.listaPlantao = listaPlantao;
    }
}
