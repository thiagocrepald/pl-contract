package br.com.plantaomais.vo;

public class PreferencesLocalityVo {

    private Integer id;

    private StateVo state;
    private Boolean capital;
    private Boolean countryside;
    private Boolean coastal;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public StateVo getState() {
        return state;
    }

    public void setState(StateVo state) {
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
