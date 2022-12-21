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
@Table(name="PREFERENCES_WEEKDAY")
public class PreferencesWeekday {
    public static final String ALIAS_CLASSE = "preferencesWeekday";

    public static final String ID = "id";
    public static final String MONDAY = "monday";
    public static final String TUESDAY = "tuesday";
    public static final String WEDNESDAY = "wednesday";
    public static final String THURSDAY = "thursday";
    public static final String FRIDAY = "friday";
    public static final String SATURDAY = "saturday";
    public static final String SUNDAY = "sunday";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_PREFERENCES_WEEKDAY_ID", allocationSize = 1)
    private Integer id;

    @Column(name = "MONDAY")
    private Boolean monday;

    @Column(name = "TUESDAY")
    private Boolean tuesday;

    @Column(name = "WEDNESDAY")
    private Boolean wednesday;

    @Column(name = "THURSDAY")
    private Boolean thursday;

    @Column(name = "FRIDAY")
    private Boolean friday;

    @Column(name = "SATURDAY")
    private Boolean saturday;

    @Column(name = "SUNDAY")
    private Boolean sunday;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Boolean getMonday() {
        return monday;
    }

    public void setMonday(Boolean monday) {
        this.monday = monday;
    }

    public Boolean getTuesday() {
        return tuesday;
    }

    public void setTuesday(Boolean tuesday) {
        this.tuesday = tuesday;
    }

    public Boolean getWednesday() {
        return wednesday;
    }

    public void setWednesday(Boolean wednesday) {
        this.wednesday = wednesday;
    }

    public Boolean getThursday() {
        return thursday;
    }

    public void setThursday(Boolean thursday) {
        this.thursday = thursday;
    }

    public Boolean getFriday() {
        return friday;
    }

    public void setFriday(Boolean friday) {
        this.friday = friday;
    }

    public Boolean getSaturday() {
        return saturday;
    }

    public void setSaturday(Boolean saturday) {
        this.saturday = saturday;
    }

    public Boolean getSunday() {
        return sunday;
    }

    public void setSunday(Boolean sunday) {
        this.sunday = sunday;
    }
}
