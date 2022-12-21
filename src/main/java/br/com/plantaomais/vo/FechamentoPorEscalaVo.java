package br.com.plantaomais.vo;

import java.util.Date;

/**
 * Created by nextage on 04/07/2019.
 */
public class FechamentoPorEscalaVo extends FechamentBaseVO {

    public static final String MEDICO = "medico.nome";
    public static final String VALOR_BRUTO = "valorBruto";
    public static final String CARGA_HORARIA = "cargaHoraria";

    private MedicoVo medico;
    private Date data;
    private Double cargaHoraria;

    public FechamentoPorEscalaVo(FechamentBaseVO baseVO) {
        super(baseVO);
    }

    public MedicoVo getMedico() {
        return medico;
    }

    public void setMedico(MedicoVo medico) {
        this.medico = medico;
    }

    public Double getCargaHoraria() {
        return cargaHoraria;
    }

    public void setCargaHoraria(Double cargaHoraria) {
        this.cargaHoraria = cargaHoraria;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }
}
