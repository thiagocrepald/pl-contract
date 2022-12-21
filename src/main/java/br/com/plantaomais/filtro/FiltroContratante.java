package br.com.plantaomais.filtro;

import java.io.Serializable;

/**
 * Created by nextage on 09/05/2019.
 */
public class FiltroContratante implements Serializable {

    private String nomeContratante;
    private String cidade;
    private String situacao;

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getNomeContratante() {
        return nomeContratante;
    }

    public void setNomeContratante(String nomeContratante) {
        this.nomeContratante = nomeContratante;
    }

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String situacao) {
        this.situacao = situacao;
    }
}
