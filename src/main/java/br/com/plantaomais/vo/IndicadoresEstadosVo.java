package br.com.plantaomais.vo;

import java.io.Serializable;

public class IndicadoresEstadosVo implements Serializable {

    private String estado;
    private Double cargaHoraria;
    private String cor;

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Double getCargaHoraria() {
        return cargaHoraria;
    }

    public void setCargaHoraria(Double cargaHoraria) {
        this.cargaHoraria = cargaHoraria;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }
}
