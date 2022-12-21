package br.com.plantaomais.vo;


import java.util.Date;

public class MedicoCursoVo {
    private Integer id;
    private MedicoVo medico;
    private CursoVo curso;
    private Date dataVencimento;

    private MedicoAnexoVo medicoAnexo;

    public CursoVo getCurso() { return curso; }

    public void setCurso(CursoVo curso) { this.curso = curso; }

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

    public Date getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(Date dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public MedicoAnexoVo getMedicoAnexo() {
        return medicoAnexo;
    }

    public void setMedicoAnexo(MedicoAnexoVo medicoAnexo) {
        this.medicoAnexo = medicoAnexo;
    }
}
