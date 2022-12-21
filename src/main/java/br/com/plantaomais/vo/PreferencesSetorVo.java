package br.com.plantaomais.vo;

public class PreferencesSetorVo {
    private Integer id;

    private Boolean consultorio;
    private Boolean observacao;
    private Boolean emergencia;
    private Boolean pediatria;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Boolean getConsultorio() {
        return consultorio;
    }

    public void setConsultorio(Boolean consultorio) {
        this.consultorio = consultorio;
    }

    public Boolean getObservacao() {
        return observacao;
    }

    public void setObservacao(Boolean observacao) {
        this.observacao = observacao;
    }

    public Boolean getEmergencia() {
        return emergencia;
    }

    public void setEmergencia(Boolean emergencia) {
        this.emergencia = emergencia;
    }

    public Boolean getPediatria() {
        return pediatria;
    }

    public void setPediatria(Boolean pediatria) {
        this.pediatria = pediatria;
    }
}
