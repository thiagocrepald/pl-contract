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
@Table(name = "PLANTAO_SETOR")
public class PlantaoSetor {
    // Constantes com os nomes da classe
    public static final String ALIAS_CLASSE = "plantaoSetor";

    public static final String ID = "id";
    public static final String PLANTAO = "plantao";
    public static final String SETOR = "setor";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_PLANTAO_SETOR_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "PLANTAO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Plantao plantao;

    @JoinColumn(name = "SETOR_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Setor setor;

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

    public Setor getSetor() {
        return setor;
    }

    public void setSetor(Setor setor) {
        this.setor = setor;
    }
}
