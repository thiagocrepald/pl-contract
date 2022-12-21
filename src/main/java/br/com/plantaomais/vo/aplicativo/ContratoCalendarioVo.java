package br.com.plantaomais.vo.aplicativo;

import br.com.plantaomais.vo.AuditoriaVo;
import br.com.plantaomais.vo.WorkplaceSimpleVo;

import java.io.Serializable;
import java.util.List;

/**
 * Created by derick on 29/04/2020.
 */
public class ContratoCalendarioVo extends AuditoriaVo implements Serializable {

    private Integer id;
    private String local;
    private List<WorkplaceSimpleVo> workplaces;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public List<WorkplaceSimpleVo> getWorkplaces() {
        return workplaces;
    }

    public void setWorkplaces(List<WorkplaceSimpleVo> workplaces) {
        this.workplaces = workplaces;
    }
}
