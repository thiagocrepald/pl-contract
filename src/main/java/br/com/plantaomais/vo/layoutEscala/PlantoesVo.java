package br.com.plantaomais.vo.layoutEscala;

import br.com.plantaomais.vo.PlantaoVo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.Optional.ofNullable;

public class PlantoesVo {

    private List<PlantaoVo> segunda;
    private List<PlantaoVo> terca;
    private List<PlantaoVo> quarta;
    private List<PlantaoVo> quinta;
    private List<PlantaoVo> sexta;
    private List<PlantaoVo> sabado;
    private List<PlantaoVo> domingo;

    public List<PlantaoVo> getSegunda() {
        return segunda;
    }

    public void setSegunda(List<PlantaoVo> segunda) {
        this.segunda = segunda;
    }

    public List<PlantaoVo> getTerca() {
        return terca;
    }

    public void setTerca(List<PlantaoVo> terca) {
        this.terca = terca;
    }

    public List<PlantaoVo> getQuarta() {
        return quarta;
    }

    public void setQuarta(List<PlantaoVo> quarta) {
        this.quarta = quarta;
    }

    public List<PlantaoVo> getQuinta() {
        return quinta;
    }

    public void setQuinta(List<PlantaoVo> quinta) {
        this.quinta = quinta;
    }

    public List<PlantaoVo> getSexta() {
        return sexta;
    }

    public void setSexta(List<PlantaoVo> sexta) {
        this.sexta = sexta;
    }

    public List<PlantaoVo> getSabado() {
        return sabado;
    }

    public void setSabado(List<PlantaoVo> sabado) {
        this.sabado = sabado;
    }

    public List<PlantaoVo> getDomingo() {
        return domingo;
    }

    public void setDomingo(List<PlantaoVo> domingo) {
        this.domingo = domingo;
    }

    public LinkedHashMap<String, List<PlantaoVo>> toWeekMap() {
        var linkedMap = new LinkedHashMap<String, List<PlantaoVo>>();
        linkedMap.put("segunda", ofNullable(this.segunda).orElse(new ArrayList<>()));
        linkedMap.put("terca", ofNullable(this.terca).orElse(new ArrayList<>()));
        linkedMap.put("quarta", ofNullable(this.quarta).orElse(new ArrayList<>()));
        linkedMap.put("quinta", ofNullable(this.quinta).orElse(new ArrayList<>()));
        linkedMap.put("sexta", ofNullable(this.sexta).orElse(new ArrayList<>()));
        linkedMap.put("sabado", ofNullable(this.sabado).orElse(new ArrayList<>()));
        linkedMap.put("domingo", ofNullable(this.domingo).orElse(new ArrayList<>()));
        return linkedMap;
    }
}
