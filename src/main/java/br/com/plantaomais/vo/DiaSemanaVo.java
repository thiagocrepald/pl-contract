package br.com.plantaomais.vo;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by nextage on 31/05/2019.
 */
public class DiaSemanaVo implements Serializable {
    private static final long serialVersionUID = 1L;
    private String dia;
    private Integer chave;
    private Date dataExt;

    public DiaSemanaVo(String dia,Integer chave){
        this.dia = dia;
        this.chave = chave;
    }

    public String getDia() {
        return dia;
    }

    public void setDia(String dia) {
        this.dia = dia;
    }

    public Integer getChave() {
        return chave;
    }

    public void setChave(Integer chave) {
        this.chave = chave;
    }

    public Date getDataExt() {
        return dataExt;
    }

    public void setDataExt(Date dataExt) {
        this.dataExt = dataExt;
    }
}
