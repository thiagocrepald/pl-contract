package br.com.plantaomais.filtro;

import br.com.plantaomais.vo.EspecialidadeVo;

import java.util.List;

/**
 * Created by nextage on 14/05/2019.
 */
public class FiltroCalendario {
    private String estado;
    private String cidade;
    private List<EspecialidadeVo> listaEspecialidades;

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public List<EspecialidadeVo> getListaEspecialidades() {
        return listaEspecialidades;
    }

    public void setListaEspecialidades(List<EspecialidadeVo> listaEspecialidades) {
        this.listaEspecialidades = listaEspecialidades;
    }

}
