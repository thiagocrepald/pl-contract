package br.com.plantaomais.vo;

import java.io.Serializable;

public class ContratoVo extends AuditoriaVo implements Serializable {

    private Long id;
    private String notes;
    private String codigo;
    private String local;
    private Integer sankhyaCode;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public Integer getSankhyaCode() {
        return sankhyaCode;
    }

    public void setSankhyaCode(Integer sankhyaCode) {
        this.sankhyaCode = sankhyaCode;
    }
}
