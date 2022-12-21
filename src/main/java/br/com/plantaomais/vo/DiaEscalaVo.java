package br.com.plantaomais.vo;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public class DiaEscalaVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private String dia;
    private Date data;
    private List<SetorPlantaoDiaVo> listaSetores;

    public String getDia() {
        return dia;
    }

    public void setDia(String dia) {
        this.dia = dia;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public List<SetorPlantaoDiaVo> getListaSetores() {
        return listaSetores;
    }

    public void setListaSetores(List<SetorPlantaoDiaVo> listaSetores) {
        this.listaSetores = listaSetores;
    }
}
