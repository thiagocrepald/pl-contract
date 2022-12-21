package br.com.plantaomais.vo;

import br.com.plantaomais.vo.layoutEscala.LayoutEscalaVo;

import java.io.Serializable;
import java.util.List;

/**
 * Created by nextage on 31/05/2019.
 */
public class SemanaVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer semana;
    private List<DiaSemanaVo> listaDias;
    private List<LayoutEscalaVo> layoutEscala;


    public Integer getSemana() {
        return semana;
    }

    public void setSemana(Integer semana) {
        this.semana = semana;
    }

    public List<LayoutEscalaVo> getLayoutEscala() {
        return layoutEscala;
    }

    public void setLayoutEscala(List<LayoutEscalaVo> layoutEscala) {
        this.layoutEscala = layoutEscala;
    }

    public List<DiaSemanaVo> getListaDias() {
        return listaDias;
    }

    public void setListaDias(List<DiaSemanaVo> listaDias) {
        this.listaDias = listaDias;
    }
}
