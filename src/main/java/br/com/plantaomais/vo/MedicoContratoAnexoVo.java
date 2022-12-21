package br.com.plantaomais.vo;

/**
 * Created by nextage on 19/06/2019.
 */
public class MedicoContratoAnexoVo {
    private Integer id;
    private MedicoVo medico;
    private ContratoAnexoVo contratoAnexo;

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

    public ContratoAnexoVo getContratoAnexo() {
        return contratoAnexo;
    }

    public void setContratoAnexo(ContratoAnexoVo contratoAnexo) {
        this.contratoAnexo = contratoAnexo;
    }
}
