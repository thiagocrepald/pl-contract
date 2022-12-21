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
@Table(name = "ESCALA_PLANTAO")
public class EscalaPlantao {
    // Constantes com os nomes da classe
    public static final String ALIAS_CLASSE = "escalaPlantao";

    public static final String ID = "id";
    public static final String ESCALA = "escala";
    public static final String PLANTAO = "plantao";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_ESCALA_PLANTAO_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "ESCALA_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Escala escala;

    @JoinColumn(name = "PLANTAO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Plantao plantao;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Escala getEscala() {
        return escala;
    }

    public void setEscala(Escala escala) {
        this.escala = escala;
    }

    public Plantao getPlantao() {
        return plantao;
    }

    public void setPlantao(Plantao plantao) {
        this.plantao = plantao;
    }
}
