package br.com.plantaomais.vo;


/**
 * Created by nextage on 14/05/2019.
 */
public class PlantaoEspecialidadeVo {
    private Integer id;
    private PlantaoVo plantao;
    private EspecialidadeVo especialidade;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public PlantaoVo getPlantao() {
        return plantao;
    }

    public void setPlantao(PlantaoVo plantao) {
        this.plantao = plantao;
    }

    public EspecialidadeVo getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(EspecialidadeVo especialidade) {
        this.especialidade = especialidade;
    }

}
