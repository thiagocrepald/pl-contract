package br.com.plantaomais.vo;

/**
 * Created by nextage on 17/07/2019.
 */
public class BloqueioMedicoContratoVo {

    private Integer id;
    private MedicoVo medico;
    private ContratoVo contrato;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public MedicoVo getMedico() {
        return medico;
    }

    public void setMedico(MedicoVo medico) {
        this.medico = medico;
    }

    public ContratoVo getContrato() { return contrato; }

    public void setContrato(ContratoVo contrato) {
        this.contrato = contrato;
    }
}
