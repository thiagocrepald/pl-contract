package br.com.plantaomais.entitybean;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "PREFERENCES_PERIODO")
public class PreferencesPeriodo {
    public static final String ALIAS_CLASSE = "preferencesPeriodo";

    public static final String ID = "id";
    public static final String MANHA = "manha";
    public static final String TARDE = "tarde";
    public static final String NOITE = "noite";
    public static final String CINDERELA = "cinderela";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_PREFERENCES_PERIODO_ID", allocationSize = 1)
    private Integer id;

    @Column(name = "MANHA")
    private Boolean manha;

    @Column(name = "TARDE")
    private Boolean tarde;

    @Column(name = "NOITE")
    private Boolean noite;

    @Column(name = "CINDERELA")
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
