package br.com.plantaomais.vo;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

/**
 * @author Matheus Toledo
 */
public class CandidatoPlantaoVo extends AuditoriaVo implements Serializable {

    private Integer id;
    private PlantaoVo plantao;
    private MedicoVo medico;
    private Date dataCandidatura;
    private Boolean aceito;
    private Boolean doacao;
    private Boolean cancelado;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public PlantaoVo getPlantao() {
        return plantao;
    }

    public void setPlantao(PlantaoVo plantao) {
        this.plantao = plantao;
    }

    public MedicoVo getMedico() {
        return medico;
    }

    public void setMedico(MedicoVo medico) {
        this.medico = medico;
    }

    public Date getDataCandidatura() {
        return dataCandidatura;
    }

    public void setDataCandidatura(Date dataCandidatura) {
        this.dataCandidatura = dataCandidatura;
    }

    public Boolean getAceito() {
        return aceito;
    }

    public void setAceito(Boolean aceito) {
        this.aceito = aceito;
    }

    public Boolean getDoacao() {
        return doacao;
    }

    public void setDoacao(Boolean doacao) {
        this.doacao = doacao;
    }

    public Boolean getCancelado() {
        return cancelado;
    }

    public void setCancelado(Boolean cancelado) {
        this.cancelado = cancelado;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CandidatoPlantaoVo that = (CandidatoPlantaoVo) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
