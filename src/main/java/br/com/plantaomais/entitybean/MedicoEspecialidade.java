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
@Table(name = "MEDICO_ESPECIALIDADE")
public class MedicoEspecialidade {
    // Constantes com os nomes da classe
    public static final String ALIAS_CLASSE = "medicoEspecialidade";

    public static final String ID = "id";
    public static final String MEDICO = "medico";
    public static final String ESPECIALIDADE = "especialidade";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_MEDICO_ESPECIALIDADE_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "MEDICO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Medico medico;

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

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }
}
