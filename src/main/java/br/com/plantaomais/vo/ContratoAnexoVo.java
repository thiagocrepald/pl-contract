package br.com.plantaomais.vo;

import java.util.List;
import java.util.Objects;

/**
 * Created by nextage on 19/06/2019.
 */
public class ContratoAnexoVo extends AuditoriaVo {

    private Integer id;
    private ContratoVo contrato;
    private String nomeAnexo;
    private String base64Anexo;
    private String tipoAnexo;
    private AttachmentVo attachment;
    private Boolean validado;
    private String observacaoValidacao;
    private List<MedicoSimpleVo> listaMedicosVisualizaram;
    private Integer visualizacoes;

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

    public String getBase64Anexo() {
        return base64Anexo;
    }

    public void setBase64Anexo(String base64Anexo) {
        this.base64Anexo = base64Anexo;
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

    public void setVisualizacoes(Integer visualizacoes) {
        this.visualizacoes = visualizacoes;
    }

    public Integer getVisualizacoes() {
        return visualizacoes;
    }

    public void setListaMedicosVisualizaram(List<MedicoSimpleVo> listaMedicosVisualizaram) {
        this.listaMedicosVisualizaram = listaMedicosVisualizaram;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ContratoAnexoVo that = (ContratoAnexoVo) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public AttachmentVo getAttachment() {
        return attachment;
    }

    public void setAttachment(AttachmentVo attachment) {
        this.attachment = attachment;
    }
}
