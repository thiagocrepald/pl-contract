package br.com.plantaomais.filtro.aplicativo;


import br.com.plantaomais.vo.MedicoVo;

import java.util.Date;

/**
 * Created by nextage on 26/06/2019.
 */
public class FiltroMinhaAgenda {

    private MedicoVo medico;
    private Date data;

    public MedicoVo getMedico() {
        return medico;
    }

    public void setMedico(MedicoVo medico) {
        this.medico = medico;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }
}
