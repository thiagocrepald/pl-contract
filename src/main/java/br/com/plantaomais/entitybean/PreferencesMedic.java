package br.com.plantaomais.entitybean;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "PREFERENCES_MEDIC")
public class PreferencesMedic {
    public static final String ALIAS_CLASSE = "preferencesMedic";

    public static final String ID = "id";
    public static final String PREFERENCES_WEEKDAY = "preferencesWeekday";
    public static final String PREFERENCES_PERIODO = "preferencesPeriodo";
    public static final String PREFERENCES_SETOR = "preferencesSetor";
    public static final String MEDICO = "medico";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_PREFERENCES_MEDIC_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "MEDIC_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Medico medico;

    @JoinColumn(name = "PREFERENCES_WEEKDAY_ID", referencedColumnName = "ID")
    @OneToOne
    private PreferencesWeekday preferencesWeekday;

    @JoinColumn(name = "PREFERENCES_PERIODO_ID", referencedColumnName = "ID")
    @OneToOne
    private PreferencesPeriodo preferencesPeriodo;

    @JoinColumn(name = "PREFERENCES_SETOR_ID", referencedColumnName = "ID")
    @OneToOne
    private PreferencesSetor preferencesSetor;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public PreferencesWeekday getPreferencesWeekday() {
        return preferencesWeekday;
    }

    public void setPreferencesWeekday(PreferencesWeekday preferencesWeekday) {
        this.preferencesWeekday = preferencesWeekday;
    }

    public PreferencesPeriodo getPreferencesPeriodo() {
        return preferencesPeriodo;
    }

    public void setPreferencesPeriodo(PreferencesPeriodo preferencesPeriodo) {
        this.preferencesPeriodo = preferencesPeriodo;
    }

    public PreferencesSetor getPreferencesSetor() {
        return preferencesSetor;
    }

    public void setPreferencesSetor(PreferencesSetor preferencesSetor) {
        this.preferencesSetor = preferencesSetor;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

}
