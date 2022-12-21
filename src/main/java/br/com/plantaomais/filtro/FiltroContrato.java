package br.com.plantaomais.filtro;

import java.io.Serializable;

/**
 * Created by nextage on 10/05/2019.
 */
public class FiltroContrato implements Serializable {
    private String codigo;
    private String situacao;

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String situacao) {
        this.situacao = situacao;
    }
}
