package br.com.plantaomais.vo;

/**
 * Created by nextage on 19/06/2019.
 */
public class MedicoAnexoEspecialidadeVo {
    private Integer id;
    private MedicoAnexoVo medicoAnexo;
    private EspecialidadeVo especialidade;

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

    public MedicoAnexoVo getMedicoAnexo() {
        return medicoAnexo;
    }

    public void setMedicoAnexo(MedicoAnexoVo medicoAnexo) {
        this.medicoAnexo = medicoAnexo;
    }
}
