package br.com.plantaomais.filtro;

import br.com.plantaomais.vo.PlantaoVo;

/**
 * Created by nextage on 04/06/2019.
 */
public class FiltroMedico {
    private Integer id;
    private String nome;
    private Boolean especialidadeNaoCadastrada;
    private Boolean especialidadeNaoValidada;
    private Boolean jaTemCandidatura;
    private Boolean cadastroCompleto;
    private Boolean emAnalise;

    private PlantaoVo plantao;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

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

    public Boolean getEspecialidadeNaoCadastrada() {
        return especialidadeNaoCadastrada;
    }

    public void setEspecialidadeNaoCadastrada(Boolean especialidadeNaoCadastrada) {
        this.especialidadeNaoCadastrada = especialidadeNaoCadastrada;
    }

    public Boolean getCadastroCompleto() {
        return cadastroCompleto;
    }

    public void setCadastroCompleto(Boolean cadastroCompleto) {
        this.cadastroCompleto = cadastroCompleto;
    }

    public Boolean getJaTemCandidatura() {
        return jaTemCandidatura;
    }

    public void setJaTemCandidatura(Boolean jaTemCandidatura) {
        this.jaTemCandidatura = jaTemCandidatura;
    }

    public Boolean getEmAnalise() {
        return emAnalise;
    }

    public void setEmAnalise(Boolean emAnalise) {
        this.emAnalise = emAnalise;
    }

    public Boolean getEspecialidadeNaoValidada() {
        return especialidadeNaoValidada;
    }

    public void setEspecialidadeNaoValidada(Boolean especialidadeNaoValidada) {
        this.especialidadeNaoValidada = especialidadeNaoValidada;
    }
}
