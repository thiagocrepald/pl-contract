package br.com.plantaomais.vo.aplicativo;

import org.joda.time.LocalDate;

import java.io.Serializable;

/**
 * Created by nextage on 14/05/2019.
 */
public class PlantaoCalendarioVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private LocalDate data; //data mes (20/05, 21/05 ...)
    private Boolean disponivel;
    private Boolean emTroca;
    private Boolean doacao;
    private Boolean candidato;
    private Boolean confirmado;
    private Boolean aConfirmar;
    private Boolean recusado;
    private Boolean fixo;

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }


    public Boolean getDisponivel() {
        return disponivel;
    }

    public void setDisponivel(Boolean disponivel) {
        this.disponivel = disponivel;
    }

    public Boolean getEmTroca() {
        return emTroca;
    }

    public void setEmTroca(Boolean emTroca) {
        this.emTroca = emTroca;
    }

    public Boolean getCandidato() {
        return candidato;
    }

    public void setCandidato(Boolean candidato) {
        this.candidato = candidato;
    }

    public Boolean getConfirmado() {
        return confirmado;
    }

    public void setConfirmado(Boolean confirmado) {
        this.confirmado = confirmado;
    }

    public Boolean getaConfirmar() {
        return aConfirmar;
    }

    public void setaConfirmar(Boolean aConfirmar) {
        this.aConfirmar = aConfirmar;
    }

    public Boolean getFixo() {
        return fixo;
    }

    public void setFixo(Boolean fixo) {
        this.fixo = fixo;
    }

    public Boolean getDoacao() {
        return doacao;
    }

    public void setDoacao(Boolean doacao) {
        this.doacao = doacao;
    }

    public Boolean getRecusado() {
        return recusado;
    }

    public void setRecusado(Boolean recusado) {
        this.recusado = recusado;
    }
}
