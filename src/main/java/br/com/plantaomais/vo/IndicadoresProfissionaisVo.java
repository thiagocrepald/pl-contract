package br.com.plantaomais.vo;

import java.io.Serializable;

/**
 * Created by nextage on 09/07/2019.
 */
public class IndicadoresProfissionaisVo implements Serializable {

    private MedicoVo medico;
    private Integer qndPlantoes;
    private Double porcentagem;
    private String especialidade;

    public MedicoVo getMedico() {
        return medico;
    }

    public void setMedico(MedicoVo medico) {
        this.medico = medico;
    }

    public Integer getQndPlantoes() {
        return qndPlantoes;
    }

    public void setQndPlantoes(Integer qndPlantoes) {
        this.qndPlantoes = qndPlantoes;
    }

    public Double getPorcentagem() {
        return porcentagem;
    }

    public void setPorcentagem(Double porcentagem) {
        this.porcentagem = porcentagem;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }
}
