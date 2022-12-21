package br.com.plantaomais.filtro.aplicativo;

import br.com.plantaomais.vo.EscalaVo;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.PlantaoVo;


/**
 * Created by nextage on 28/06/2019.
 */
public class FiltroTrocaVaga {

    private EscalaVo escala;
    private MedicoVo medicoVaga;
    private MedicoVo medicoRequisitante;
    private PlantaoVo plantaoVaga;
    private PlantaoVo plantaoRequisitante;

    public EscalaVo getEscala() {
        return escala;
    }

    public void setEscala(EscalaVo escala) {
        this.escala = escala;
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
}

