package br.com.plantaomais.vo.layoutEscala;

import java.util.List;

public class TurnosVo {

    public TurnosVo() {
    }

    public TurnosVo(String des, List<SetoresVo> SETORES) {
        this.desc = des;
        this.SETORES = SETORES;
    }

    private String desc;
    private List<SetoresVo> SETORES;

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public List<SetoresVo> getSETORES() {
        return SETORES;
    }

    public void setSETORES(List<SetoresVo> SETORES) {
        this.SETORES = SETORES;
    }
}
