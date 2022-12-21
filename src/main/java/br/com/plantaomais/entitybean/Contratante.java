package br.com.plantaomais.entitybean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * Created by nextage on 09/05/2019.
 */
@Entity
@Table(name = "CONTRATANTE")
public class Contratante extends Auditoria implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final String ID = "id";
    public static final String NOME_CONTRATANTE = "nomeContratante";
    public static final String CIDADE = "cidade";
    public static final String UF = "uf";
    public static final String CNPJ = "cnpj";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_CONTRATANTE_ID", allocationSize = 1)
    private Integer id;

    @Column(name= "NOME_CONTRATANTE" , length = 100)
    private String nomeContratante;

    @Column(name= "CIDADE", length = 50)
    private String cidade;

    @Column(name= "UF", length = 10)
    private String uf;

    @Column(name= "CNPJ", length = 18)
    private String cnpj;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNomeContratante() {
        return nomeContratante;
    }

    public void setNomeContratante(String nomeContratante) {
        this.nomeContratante = nomeContratante;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        if (!(object instanceof Contratante)) {
            return false;
        }
        Contratante other = (Contratante) object;
        return !((this.id == null && other.id != null) || (this.id != null && !this.id
                .equals(other.id)));
    }

    @Override
    public String toString() {
        return this.getClass().getName() + "[id=" + id + "]";
    }
}