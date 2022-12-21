package br.com.plantaomais.vo;

import java.util.List;
import java.util.Objects;

/**
 * Created by nextage on 19/06/2019.
 */
public class ContratoAnexoSimpleVo extends AuditoriaVo {

    private Integer id;
    private ContratoVo contrato;
    private String nomeAnexo;
    private String tipoAnexo;
    private Boolean validado;
    private String observacaoValidacao;
    private List<MedicoSimpleVo> listaMedicosVisualizaram;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ContratoVo getContrato() {
        return contrato;
    }

    public void setContrato(ContratoVo contrato) {
        this.contrato = contrato;
    }

    public String getNomeAnexo() {
        return nomeAnexo;
    }

    public void setNomeAnexo(String nomeAnexo) {
        this.nomeAnexo = nomeAnexo;
    }

    public String getTipoAnexo() {
        return tipoAnexo;
    }

    public void setTipoAnexo(String tipoAnexo) {
        this.tipoAnexo = tipoAnexo;
    }

    public Boolean getValidado() {
        return validado;
    }

    public void setValidado(Boolean validado) {
        this.validado = validado;
    }

    public String getObservacaoValidacao() {
        return observacaoValidacao;
    }

    public void setObservacaoValidacao(String observacaoValidacao) {
        this.observacaoValidacao = observacaoValidacao;
    }

    public List<MedicoSimpleVo> getListaMedicosVisualizaram() {
        return listaMedicosVisualizaram;
    }

    public void setListaMedicosVisualizaram(List<MedicoSimpleVo> listaMedicosVisualizaram) {
        this.listaMedicosVisualizaram = listaMedicosVisualizaram;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ContratoAnexoSimpleVo that = (ContratoAnexoSimpleVo) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
