package br.com.plantaomais.vo;

/**
 * Created by nextage on 17/07/2019.
 */
public class BloqueioMedicoEscalaVo {

    private Integer id;
    private MedicoVo medico;
    private EscalaVo escala;

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

    public EscalaVo getEscala() {
        return escala;
    }

    public void setEscala(EscalaVo escala) {
        this.escala = escala;
    }
}
