package br.com.plantaomais.vo;

public class CityVo {

    private Integer id;
    private String name;

    private Boolean capital;
    private Boolean coastal;

    private StateVo state;

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

    public StateVo getState() { return state; }

    public void setState(StateVo stateVo) { this.state = stateVo; }

    public Boolean getCapital() { return capital; }

    public void setCapital(Boolean capital) { this.capital = capital; }

    public Boolean getCoastal() { return coastal; }

    public void setCostal(Boolean coastal) { this.coastal = coastal; }
}
