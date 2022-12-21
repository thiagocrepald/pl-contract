package br.com.plantaomais.vo;


/**
 * Created by nextage on 14/05/2019.
 */
public class EscalaPlantaoVo {
    private Integer id;
    private EscalaVo escala;
    private PlantaoVo plantao;

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

    public EscalaVo getEscala() {
        return escala;
    }

    public void setEscala(EscalaVo escala) {
        this.escala = escala;
    }
}
