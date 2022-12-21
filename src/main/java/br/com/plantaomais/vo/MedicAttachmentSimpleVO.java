package br.com.plantaomais.vo;

/**
 * Created by gmribas on 23/03/20.
 */
public class MedicAttachmentSimpleVO extends AuditoriaVo {

    private Integer id;
    private CampoAnexoVo campoAnexo;
    private String nomeAnexo;
    private String tipoAnexo;
    private Boolean validado;
    private String observacaoValidacao;
    private Boolean ehVerso;
    private Boolean visualizado;
    private AttachmentVo attachment;
    private String extra;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public CampoAnexoVo getCampoAnexo() {
        return campoAnexo;
    }

    public void setCampoAnexo(CampoAnexoVo campoAnexo) {
        this.campoAnexo = campoAnexo;
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

    public Boolean getEhVerso() {
        return ehVerso;
    }

    public void setEhVerso(Boolean ehVerso) {
        this.ehVerso = ehVerso;
    }

    public Boolean getVisualizado() {
        return visualizado;
    }

    public void setVisualizado(Boolean visualizado) {
        this.visualizado = visualizado;
    }

    public AttachmentVo getAttachment() {
        return attachment;
    }

    public void setAttachment(AttachmentVo attachment) {
        this.attachment = attachment;
    }

    public String getExtra() { return extra; }

    public void setExtra(String extra) { this.extra = extra; }
}
