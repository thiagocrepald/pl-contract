package br.com.plantaomais.vo;

import java.io.Serializable;

/**
 * Created by nextage on 08/07/2019.
 */
public class ArquivoVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private byte[] arquivo;
    private String nmAnexo;
    private Boolean pdf;
    public ArquivoVo() {
    }

    public ArquivoVo(byte[] arquivo, String nmAnexo) {
        this.arquivo = arquivo;
        this.nmAnexo = nmAnexo;
    }

    public byte[] getArquivo() {
        return arquivo;
    }

    public void setArquivo(byte[] arquivo) {
        this.arquivo = arquivo;
    }

    public String getNmAnexo() {
        return nmAnexo;
    }

    public void setNmAnexo(String nmAnexo) {
        this.nmAnexo = nmAnexo;
    }

    public Boolean getPdf() {
        return pdf;
    }

    public void setPdf(Boolean pdf) {
        this.pdf = pdf;
    }
}
