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
@Table(name = "PREFERENCES_SETOR")
public class PreferencesSetor {
    public static final String ALIAS_CLASSE = "preferencesSetor";

    public static final String ID = "id";
    public static final String CONSULTORIO = "consultorio";
    public static final String OBSERVACAO = "observacao";
    public static final String EMERGENCIA = "emergencia";
    public static final String PEDIATRIA = "pediadria";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_PREFERENCES_SETOR_ID", allocationSize = 1)
    private Integer id;

    @Column(name = "CONSULTORIO")
    private Boolean consultorio;

    @Column(name = "OBSERVACAO")
    private Boolean observacao;

    @Column(name = "EMERGENCIA")
    private Boolean emergencia;

    @Column(name = "PEDIATRIA")
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
