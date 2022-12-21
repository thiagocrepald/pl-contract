package br.com.plantaomais.vo;

import br.com.plantaomais.entitybean.view.VwIndicadoresEspecialidades;

import java.io.Serializable;
import java.util.List;

public class IndicadoresVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private List<VwIndicadoresEspecialidades> especialidades;
    private List<IndicadoresEstadosVo> estados;
    private List<MedicoVo> medicos;
    private Integer faltasPlantao; // -> doações
    private Integer trocasPlantao;
    private Integer cancelamentosPlantao;
    private List<IndicadoresProfissionaisVo> profissionais;
    private Double sexoMasculino;
    private Double sexoFeminino;

    public List<VwIndicadoresEspecialidades> getEspecialidades() {
        return especialidades;
    }

    public void setEspecialidades(List<VwIndicadoresEspecialidades> especialidades) {
        this.especialidades = especialidades;
    }

    public List<IndicadoresEstadosVo> getEstados() {
        return estados;
    }

    public void setEstados(List<IndicadoresEstadosVo> estados) {
        this.estados = estados;
    }

    public List<MedicoVo> getMedicos() {
        return medicos;
    }

    public void setMedicos(List<MedicoVo> medicos) {
        this.medicos = medicos;
    }

    public Integer getFaltasPlantao() {
        return faltasPlantao;
    }

    public void setFaltasPlantao(Integer faltasPlantao) {
        this.faltasPlantao = faltasPlantao;
    }

    public Integer getTrocasPlantao() {
        return trocasPlantao;
    }

    public void setTrocasPlantao(Integer trocasPlantao) {
        this.trocasPlantao = trocasPlantao;
    }

    public Integer getCancelamentosPlantao() {
        return cancelamentosPlantao;
    }

    public void setCancelamentosPlantao(Integer cancelamentosPlantao) {
        this.cancelamentosPlantao = cancelamentosPlantao;
    }

    public List<IndicadoresProfissionaisVo> getProfissionais() {
        return profissionais;
    }

    public void setProfissionais(List<IndicadoresProfissionaisVo> profissionais) {
        this.profissionais = profissionais;
    }

    public Double getSexoMasculino() {
        return sexoMasculino;
    }

    public void setSexoMasculino(Double sexoMasculino) {
        this.sexoMasculino = sexoMasculino;
    }

    public Double getSexoFeminino() {
        return sexoFeminino;
    }

    public void setSexoFeminino(Double sexoFeminino) {
        this.sexoFeminino = sexoFeminino;
    }
}
