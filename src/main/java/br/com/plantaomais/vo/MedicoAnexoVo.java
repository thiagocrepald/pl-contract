package br.com.plantaomais.vo;

import java.util.Objects;

/**
 * Created by nextage on 19/06/2019.
 */
public class MedicoAnexoVo extends AuditoriaVo {

    private Integer id;
    private MedicoVo medico;
    private CampoAnexoVo campoAnexo;
    private String nomeAnexo;
    private String base64Anexo;
    private String tipoAnexo;
    private Boolean ehHistorico;
    private Boolean validado;
    private String observacaoValidacao;
    private AttachmentVo attachment;
    private Boolean ehVerso;
    private Long hash;
    private EspecialidadeVo especialidade;
    private Boolean visualizado;
    private MedicoCursoVo medicoCurso;
    private MedicoAnexoExtraVo extra;

    public Boolean getVisualizado() {
        return visualizado;
    }

    public void setVisualizado(Boolean visualizado) {
        this.visualizado = visualizado;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public MedicoVo getMedico() {
        return medico;
    }

    public void setMedico(MedicoVo medico) {
        this.medico = medico;
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

    public Boolean getEhHistorico() {
        return ehHistorico;
    }

    public void setEhHistorico(Boolean ehHistorico) {
        this.ehHistorico = ehHistorico;
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

    public Boolean getEhVerso() { return ehVerso; }

    public void setEhVerso(Boolean ehVerso) { this.ehVerso = ehVerso; }

    public Long getHash() { return hash; }

    public void setHash(Long hash) { this.hash = hash; }

    public EspecialidadeVo getEspecialidade() { return especialidade; }

    public void setEspecialidade(EspecialidadeVo especialidade) { this.especialidade = especialidade; }

    public MedicoAnexoExtraVo getExtra() { return extra; }

    public void setExtra(MedicoAnexoExtraVo extra) { this.extra = extra; }

    public MedicoCursoVo getMedicoCurso() {
        return medicoCurso;
    }

    public void setMedicoCurso(MedicoCursoVo medicoCurso) {
        this.medicoCurso = medicoCurso;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MedicoAnexoVo that = (MedicoAnexoVo) o;
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
