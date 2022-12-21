package br.com.plantaomais.entitybean;

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
@Table(name = "STATE")
public class State {

    public static final String ALIAS_CLASSE = "state";

    public static final String ID = "id";
    public static final String NAME = "name";
    public static final String ACRONYM = "acronym";
    public static final String ACTIVE = "active";
    public static final String COUNTRY = "country";
    public static final String COASTAL = "coastal";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_STATE_ID", allocationSize = 1)
    private Integer id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "ACRONYM")
    private String acronym;

    @Column(name = "ACTIVE")
    private Boolean active;

    @JoinColumn(name = "COUNTRY_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Country country;

    @Column(name = "COASTAL")
    private Boolean coastal;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAcronym() {
        return acronym;
    }

    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public Boolean getCoastal() { return coastal; }

    public void setCoastal(Boolean coastal) { this.coastal = coastal; }
}
