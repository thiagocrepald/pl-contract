package br.com.plantaomais.entitybean;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

/**
 * Created by nextage on 14/05/2019.
 */
@Entity
@Table(name = "MEDICO_ANEXO_ESPECIALIDADE")
public class MedicoAnexoEspecialidade {
    // Constantes com os nomes da classe
    public static final String ALIAS_CLASSE = "medicoAnexoEspecialidade";

    public static final String ID = "id";
    public static final String MEDICO_ANEXO = "medicoAnexo";
    public static final String ESPECIALIDADE = "especialidade";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_MEDICO_ANEXO_ESPECIALIDADE_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "MEDICO_ANEXO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private MedicoAnexo medicoAnexo;

    @JoinColumn(name = "ESPECIALIDADE_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Especialidade especialidade;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Especialidade getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(Especialidade especialidade) {
        this.especialidade = especialidade;
    }

    public MedicoAnexo getMedicoAnexo() {
        return medicoAnexo;
    }

    public void setMedicoAnexo(MedicoAnexo medicoAnexo) {
        this.medicoAnexo = medicoAnexo;
    }
}
