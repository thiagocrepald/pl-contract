package br.com.plantaomais.vo.layoutEscala;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by nextage on 24/05/2019.
 */

public class DiasVo implements Serializable{
    private static final long serialVersionUID = 1L;

    private String str;
    private Date data;

    public String getStr() {
        return str;
    }

    public void setStr(String str) {
        this.str = str;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    //    private Integer chave;
//    private String dia;
//    private List<PlantaoVo> listaPlantao;
//
//    public Integer getChave() { return chave; }
//
//    public void setChave(Integer chave) { this.chave = chave; }
//
//    public String getDia() { return dia; }
//
//    public void setDia(String dia) { this.dia = dia; }
//
//    public List<PlantaoVo> getListaPlantao() { return listaPlantao; }
//
//    public void setListaPlantao(List<PlantaoVo> listaPlantao) { this.listaPlantao = listaPlantao; }
}
