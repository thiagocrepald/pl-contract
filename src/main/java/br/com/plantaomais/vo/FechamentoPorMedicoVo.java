package br.com.plantaomais.vo;

import java.util.Date;

/**
 * Created by nextage on 04/07/2019.
 */
public class FechamentoPorMedicoVo extends FechamentBaseVO {

    public static final String VALOR_BRUTO = "valorBruto";
    public static final String NOME_ESCALA = "nomeEscala";
    public static final String DATA = "data";
    public static final String DURACAO_PLANTAO = "duracaoPlantao";
    public static final String PLANTAO = "plantao";
    public static final String HORA_INICIO = "horaInicio";
    public static final String HORA_FIM = "horaFim";

    private PlantaoVo plantao;
    private String nomeEscala;
    private Date data;
    private Double duracaoPlantao;

    public FechamentoPorMedicoVo(FechamentBaseVO baseVO) {
        super(baseVO);
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public String getNomeEscala() {
        return nomeEscala;
    }

    public void setNomeEscala(String nomeEscala) {
        this.nomeEscala = nomeEscala;
    }

    public PlantaoVo getPlantao() {
        return plantao;
    }

    public void setPlantao(PlantaoVo plantao) {
        this.plantao = plantao;
    }

    public Double getDuracaoPlantao() {
        return duracaoPlantao;
    }

    public void setDuracaoPlantao(Double duracaoPlantao) {
        this.duracaoPlantao = duracaoPlantao;
    }
}
