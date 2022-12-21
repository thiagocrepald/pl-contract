package br.com.plantaomais.vo.layoutEscala;

public class SetoresVo {

    public SetoresVo() {

    }

    public SetoresVo(String desc) {
        this.desc = desc;
    }

    private String desc;
    private PlantoesVo PLANTOES;

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public PlantoesVo getPLANTOES() {
        return PLANTOES;
    }

    public void setPLANTOES(PlantoesVo PLANTOES) {
        this.PLANTOES = PLANTOES;
    }
}
