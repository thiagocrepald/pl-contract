package br.com.plantaomais.vo;

public class PreferencesPeriodoVo {

    Integer id;

    private Boolean manha;
    private Boolean tarde;
    private Boolean noite;
    private Boolean cinderela;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Boolean getManha() {
        return manha;
    }

    public void setManha(Boolean manha) {
        this.manha = manha;
    }

    public Boolean getTarde() {
        return tarde;
    }

    public void setTarde(Boolean tarde) {
        this.tarde = tarde;
    }

    public Boolean getNoite() {
        return noite;
    }

    public void setNoite(Boolean noite) {
        this.noite = noite;
    }

    public Boolean getCinderela() {
        return cinderela;
    }

    public void setCinderela(Boolean cinderela) {
        this.cinderela = cinderela;
    }
}
