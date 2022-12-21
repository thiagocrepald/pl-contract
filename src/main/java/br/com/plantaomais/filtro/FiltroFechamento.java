package br.com.plantaomais.filtro;

import br.com.plantaomais.vo.EscalaVo;
import br.com.plantaomais.vo.MedicoVo;

import java.util.Date;

/**
 * Created by nextage on 04/07/2019.
 */
public class FiltroFechamento {

    private EscalaVo escala;
    private MedicoVo medico;
    private Date dataInicio;
    private Date dataFim;
    private String nomeMedico;


    public EscalaVo getEscala() {
        return escala;
    }

    public void setEscala(EscalaVo escala) {
        this.escala = escala;
    }

    public MedicoVo getMedico() {
        return medico;
    }

    public void setMedico(MedicoVo medico) {
        this.medico = medico;
    }

    public Date getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(Date dataInicio) {
        this.dataInicio = dataInicio;
    }

    public Date getDataFim() {
        return dataFim;
    }

    public void setDataFim(Date dataFim) {
        this.dataFim = dataFim;
    }

    public String getNomeMedico() {
        return nomeMedico;
    }

    public void setNomeMedico(String nomeMedico) {
        this.nomeMedico = nomeMedico;
    }
}
