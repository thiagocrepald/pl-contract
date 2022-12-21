package br.com.plantaomais.vo.aplicativo;

import java.io.Serializable;

/**
 * Created by nextage on 26/06/2019.
 */
public class MinhaAgendaVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private DiaMinhaAgendaVo seg;
    private DiaMinhaAgendaVo ter;
    private DiaMinhaAgendaVo qua;
    private DiaMinhaAgendaVo qui;
    private DiaMinhaAgendaVo sex;
    private DiaMinhaAgendaVo sab;
    private DiaMinhaAgendaVo dom;

    public DiaMinhaAgendaVo getSeg() {
        return seg;
    }

    public void setSeg(DiaMinhaAgendaVo seg) {
        this.seg = seg;
    }

    public DiaMinhaAgendaVo getTer() {
        return ter;
    }

    public void setTer(DiaMinhaAgendaVo ter) {
        this.ter = ter;
    }

    public DiaMinhaAgendaVo getQua() {
        return qua;
    }

    public void setQua(DiaMinhaAgendaVo qua) {
        this.qua = qua;
    }

    public DiaMinhaAgendaVo getQui() {
        return qui;
    }

    public void setQui(DiaMinhaAgendaVo qui) {
        this.qui = qui;
    }

    public DiaMinhaAgendaVo getSex() {
        return sex;
    }

    public void setSex(DiaMinhaAgendaVo sex) {
        this.sex = sex;
    }

    public DiaMinhaAgendaVo getSab() {
        return sab;
    }

    public void setSab(DiaMinhaAgendaVo sab) {
        this.sab = sab;
    }

    public DiaMinhaAgendaVo getDom() {
        return dom;
    }

    public void setDom(DiaMinhaAgendaVo dom) {
        this.dom = dom;
    }
}