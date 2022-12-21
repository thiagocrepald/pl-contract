package br.com.plantaomais.vo.aplicativo;

import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.PlantaoVo;

import java.io.Serializable;

/**
 * Created by nextage on 28/06/2019.
 */
public class TrocaVagaVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private MedicoVo medicoVaga;
    private MedicoVo medicoRequisitante;
    private PlantaoVo plantaoVaga;
    private PlantaoVo plantaoRequisitante;
    private Boolean trocaEfetuada;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public MedicoVo getMedicoVaga() {
        return medicoVaga;
    }

    public void setMedicoVaga(MedicoVo medicoVaga) {
        this.medicoVaga = medicoVaga;
    }

    public MedicoVo getMedicoRequisitante() {
        return medicoRequisitante;
    }

    public void setMedicoRequisitante(MedicoVo medicoRequisitante) {
        this.medicoRequisitante = medicoRequisitante;
    }

    public PlantaoVo getPlantaoVaga() {
        return plantaoVaga;
    }

    public void setPlantaoVaga(PlantaoVo plantaoVaga) {
        this.plantaoVaga = plantaoVaga;
    }

    public PlantaoVo getPlantaoRequisitante() {
        return plantaoRequisitante;
    }

    public void setPlantaoRequisitante(PlantaoVo plantaoRequisitante) {
        this.plantaoRequisitante = plantaoRequisitante;
    }

    public Boolean getTrocaEfetuada() {
        return trocaEfetuada;
    }

    public void setTrocaEfetuada(Boolean trocaEfetuada) {
        this.trocaEfetuada = trocaEfetuada;
    }
}

