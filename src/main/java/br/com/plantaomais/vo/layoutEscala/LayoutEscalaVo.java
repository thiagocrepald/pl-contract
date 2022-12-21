package br.com.plantaomais.vo.layoutEscala;

import java.io.Serializable;
import java.util.List;

/**
 * Created by nextage on 23/05/2019.
 */
public class LayoutEscalaVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer numSemana;
    private List<DiasVo> DIAS;
    private List<TurnosVo> TURNOS;

    public Integer getNumSemana() {
        return numSemana;
    }

    public void setNumSemana(Integer numSemana) {
        this.numSemana = numSemana;
    }

    public List<DiasVo> getDIAS() {
        return DIAS;
    }

    public void setDIAS(List<DiasVo> DIAS) {
        this.DIAS = DIAS;
    }

    public List<TurnosVo> getTURNOS() {
        return TURNOS;
    }

    public void setTURNOS(List<TurnosVo> TURNOS) {
        this.TURNOS = TURNOS;
    }

    //    private SetorVo setorVo;
//    private List<DiasVo> listaDias;
//
//    public SetorVo getSetorVo() { return setorVo; }
//
//    public void setSetorVo(SetorVo setorVo) { this.setorVo = setorVo; }
//
//    public List<DiasVo> getListaDias() { return listaDias; }
//
//    public void setListaDias(List<DiasVo> listaDias) { this.listaDias = listaDias; }
}
