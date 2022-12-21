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
@Table(name = "CITY")
public class City {

    public static final String ALIAS_CLASSE = "city";

    public static final String ID = "id";
    public static final String NAME = "name";
    public static final String ACTIVE = "active";
    public static final String STATE = "state";
    public static final String CAPITAL = "capital";
    public static final String COASTAL = "coastal";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_CITY_ID", allocationSize = 1)
    private Integer id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "ACTIVE")
    private Boolean active;

    @JoinColumn(name = "STATE_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private State state;

    @Column(name = "CAPITAL")
    private Boolean capital;

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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public Boolean getCapital() { return capital; }

    public void setCapital(Boolean capital) {
        this.capital = capital;
    }

    public Boolean getCoastal() { return coastal; }

    public void setCoastal(Boolean coastal) { this.coastal = coastal; }
}
