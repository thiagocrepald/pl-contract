package br.com.plantaomais.vo;

import java.util.List;

public class PreferencesMedicVo {

    private Integer id;
    private PreferencesWeekdayVo preferencesWeekday;
    private PreferencesPeriodoVo preferencesPeriodo;
    private PreferencesSetorVo preferencesSetor;
    private List<PreferencesLocalityVo> preferencesLocalities;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public PreferencesWeekdayVo getPreferencesWeekday() {
        return preferencesWeekday;
    }

    public void setPreferencesWeekday(PreferencesWeekdayVo preferencesWeeday) {
        this.preferencesWeekday = preferencesWeeday;
    }

    public PreferencesPeriodoVo getPreferencesPeriodo() {
        return preferencesPeriodo;
    }

    public void setPreferencesPeriodo(PreferencesPeriodoVo preferencesPeriodo) {
        this.preferencesPeriodo = preferencesPeriodo;
    }

    public PreferencesSetorVo getPreferencesSetor() {
        return preferencesSetor;
    }

    public void setPreferencesSetor(PreferencesSetorVo preferencesSetor) {
        this.preferencesSetor = preferencesSetor;
    }

    public List<PreferencesLocalityVo> getPreferencesLocalities() {
        return preferencesLocalities;
    }

    public void setPreferencesLocalities(List<PreferencesLocalityVo> preferencesLocalities) {
        this.preferencesLocalities = preferencesLocalities;
    }
}

