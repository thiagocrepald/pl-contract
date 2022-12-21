package br.com.plantaomais.vo.aplicativo;

import br.com.plantaomais.vo.AttachmentVo;
import br.com.plantaomais.vo.AuditoriaVo;

import java.io.Serializable;
import java.security.Principal;
import java.util.Objects;

/**
 * Created by nextage on 04/06/2019.
 */
public class MedicoPlantaoSimpleVo extends AuditoriaVo implements Serializable, Principal {
    private static final long serialVersionUID = 1L;


    private Integer id;
    private String nome;
    private AttachmentVo attachment;
    private String anexoFoto;
    private String numeroCrm;
    private String telefone;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MedicoPlantaoSimpleVo medicoVo = (MedicoPlantaoSimpleVo) o;
        return Objects.equals(id, medicoVo.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String getName() {
        return nome;
    }

    public AttachmentVo getAttachment() {
        return attachment;
    }

    public void setAttachment(AttachmentVo attachment) {
        this.attachment = attachment;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getAnexoFoto() {
        return anexoFoto;
    }

    public void setAnexoFoto(String anexoFoto) {
        this.anexoFoto = anexoFoto;
    }

    public String getNumeroCrm() {
        return numeroCrm;
    }

    public void setNumeroCrm(String numeroCrm) {
        this.numeroCrm = numeroCrm;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
}
