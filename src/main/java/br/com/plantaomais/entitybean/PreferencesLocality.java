package br.com.plantaomais.entitybean;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "PREFERENCES_LOCALITY")
public class PreferencesLocality {
    public static final String ALIAS_CLASSE = "preferencesLocality";

    public static final String ID = "id";
    public static final String PREFERENCES_MEDIC = "preferencesMedic";
    public static final String STATE = "state";
    public static final String CAPITAL = "capital";
    public static final String COUNTRYSIDE = "countryside";
    public static final String COASTAL = "coastal";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_PREFERENCES_LOCALITY_ID", allocationSize = 1)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="PREFERENCES_MEDIC_ID", referencedColumnName = "ID")
    private PreferencesMedic preferencesMedic;

    @JoinColumn(name = "STATE_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private State state;

    @Column(name = "CAPITAL")
    private Boolean capital;

    @Column(name = "COUNTRYSIDE")
    private Boolean countryside;

    @Column(name = "COASTAL")
    private Boolean coastal;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public PreferencesMedic getPreferencesMedic() {
        return preferencesMedic;
    }

    public void setPreferencesMedic(PreferencesMedic preferencesMedic) {
        this.preferencesMedic = preferencesMedic;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public Boolean getCapital() {
        return capital;
    }

    public void setCapital(Boolean capital) {
        this.capital = capital;
    }

    public Boolean getCountryside() {
        return countryside;
    }

    public void setCountryside(Boolean countryside) {
        this.countryside = countryside;
    }

    public Boolean getCoastal() {
        return coastal;
    }

    public void setCoastal(Boolean coastal) {
        this.coastal = coastal;
    }
}
