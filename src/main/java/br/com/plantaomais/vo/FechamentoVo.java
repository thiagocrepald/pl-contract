package br.com.plantaomais.vo;

import java.util.List;

/**
 * Created by nextage on 04/07/2019.
 */
public class FechamentoVo {

    public static final String VALOR_BRUTO_TOTAL = "valorBrutoTotal";
    public static final String CARGA_HORARIA_TOTAL = "cargaHorariaTotal";

    private List<FechamentoPorMedicoVo> listaFechamentoPorMedico;
    private List<FechamentoPorEscalaVo> listaFechamentoPorEscala;
    private Double valorBrutoTotal;
    private Double cargaHorariaTotal;
    private Integer layout;
    public List<FechamentoPorMedicoVo> getListaFechamentoPorMedico() {
        return listaFechamentoPorMedico;
    }

    public void setListaFechamentoPorMedico(List<FechamentoPorMedicoVo> listaFechamentoPorMedico) {
        this.listaFechamentoPorMedico = listaFechamentoPorMedico;
    }

    public List<FechamentoPorEscalaVo> getListaFechamentoPorEscala() {
        return listaFechamentoPorEscala;
    }

    public void setListaFechamentoPorEscala(List<FechamentoPorEscalaVo> listaFechamentoPorEscala) {
        this.listaFechamentoPorEscala = listaFechamentoPorEscala;
    }

    public Double getValorBrutoTotal() {
        return valorBrutoTotal;
    }

    public void setValorBrutoTotal(Double valorBrutoTotal) {
        this.valorBrutoTotal = valorBrutoTotal;
    }

    public Double getCargaHorariaTotal() {
        return cargaHorariaTotal;
    }

    public void setCargaHorariaTotal(Double cargaHorariaTotal) {
        this.cargaHorariaTotal = cargaHorariaTotal;
    }

    public Integer getLayout() {
        return layout;
    }

    public void setLayout(Integer layout) {
        this.layout = layout;
    }
}
