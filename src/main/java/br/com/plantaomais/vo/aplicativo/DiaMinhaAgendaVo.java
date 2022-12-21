package br.com.plantaomais.vo.aplicativo;

import br.com.plantaomais.vo.PlantaoVo;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Created by nextage on 26/06/2019.
 */
public class DiaMinhaAgendaVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private String diaMes;
    private Date data;
    private List<PlantaoVo> listaPlantao;

    public String getDiaMes() {
        return diaMes;
    }

    public void setDiaMes(String diaMes) {
        this.diaMes = diaMes;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public List<PlantaoVo> getListaPlantao() {
        return listaPlantao;
    }

    public void setListaPlantao(List<PlantaoVo> listaPlantao) {
        this.listaPlantao = listaPlantao;
    }
}
