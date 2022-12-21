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
@Table(name = "PLANTAO_ESPECIALIDADE")
public class PlantaoEspecialidade {
    // Constantes com os nomes da classe
    public static final String ALIAS_CLASSE = "plantaoEspecialidade";

    public static final String ID = "id";
    public static final String PLANTAO = "plantao";
    public static final String ESPECIALIDADE = "especialidade";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_PLANTAO_ESPECIALIDADE_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "PLANTAO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Plantao plantao;

    @JoinColumn(name = "ESPECIALIDADE_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Especialidade especialidade;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Plantao getPlantao() {
        return plantao;
    }

    public void setPlantao(Plantao plantao) {
        this.plantao = plantao;
    }

    public Especialidade getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(Especialidade especialidade) {
        this.especialidade = especialidade;
    }
}
