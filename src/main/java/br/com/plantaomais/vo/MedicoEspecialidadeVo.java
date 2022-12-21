package br.com.plantaomais.vo;


import java.util.List;

/**
 * Created by nextage on 14/05/2019.
 */
public class MedicoEspecialidadeVo {
    private Integer id;
    private MedicoVo medico;
    private EspecialidadeVo especialidade;
    private List<MedicAttachmentSimpleVO> anexos;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public EspecialidadeVo getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(EspecialidadeVo especialidade) {
        this.especialidade = especialidade;
    }

    public MedicoVo getMedico() {
        return medico;
    }

    public void setMedico(MedicoVo medico) {
        this.medico = medico;
    }

    public List<MedicAttachmentSimpleVO> getAnexos() {
        return anexos;
    }

    public void setAnexos(List<MedicAttachmentSimpleVO> anexos) {
        this.anexos = anexos;
    }
}
