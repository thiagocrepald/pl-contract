package br.com.plantaomais.vo;

import java.io.Serializable;
import java.security.Principal;
import java.util.Objects;

/**
 * Created by nextage on 04/06/2019.
 */
public class MedicoSimpleVo extends AuditoriaVo implements Serializable, Principal {
    private static final long serialVersionUID = 1L;


    private Integer id;
    private String nome;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MedicoSimpleVo medicoVo = (MedicoSimpleVo) o;
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
}
