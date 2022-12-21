package br.com.plantaomais.filtro;

import br.com.plantaomais.vo.EscalaVo;

import java.util.Date;

/**
 * Created by nextage on 14/05/2019.
 */
public class FiltroGestaoEscala {

    private EscalaVo escalaVo;
    private String tipo;
    private Date data;
    private Boolean pdf;
    private Boolean newPdf;

    public EscalaVo getEscalaVo() {
        return escalaVo;
    }

    public void setEscalaVo(EscalaVo escalaVo) {
        this.escalaVo = escalaVo;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public Boolean getPdf() {
        return pdf;
    }

    public void setPdf(Boolean pdf) {
        this.pdf = pdf;
    }

    public Boolean getNewPdf() {
        return newPdf;
    }

    public void setNewPdf(Boolean newPdf) {
        this.newPdf = newPdf;
    }
}
