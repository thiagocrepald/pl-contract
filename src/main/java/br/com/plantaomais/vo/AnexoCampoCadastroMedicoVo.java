package br.com.plantaomais.vo;

/**
 * Created by nextage on 19/06/2019.
 */
public class AnexoCampoCadastroMedicoVo {
    private Integer id;
    private CampoAnexoVo campoAnexo;
    private String base64Anexo;
    private String tipoAnexo;
    private String nomeAnexo;
    private String observacaoValidacao;
    private Boolean validado;


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

    public String getNomeAnexo() {
        return nomeAnexo;
    }

    public void setNomeAnexo(String nomeAnexo) {
        this.nomeAnexo = nomeAnexo;
    }

    public CampoAnexoVo getCampoAnexo() {
        return campoAnexo;
    }

    public void setCampoAnexo(CampoAnexoVo campoAnexo) {
        this.campoAnexo = campoAnexo;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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
}
