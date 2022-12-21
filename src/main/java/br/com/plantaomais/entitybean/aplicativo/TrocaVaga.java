package br.com.plantaomais.entitybean.aplicativo;

import br.com.plantaomais.entitybean.Auditoria;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.Plantao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * Created by nextage on 28/06/2019.
 */
@Entity
@Table(name = "TROCA_VAGA")
public class TrocaVaga extends Auditoria implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "trocaVaga";

    public static final String ID = "id";
    public static final String MEDICO_VAGA = "medicoVaga";
    public static final String MEDICO_REQUISITANTE = "medicoRequisitante";
    public static final String PLANTAO_VAGA = "plantaoVaga";
    public static final String PLANTAO_REQUISITANTE = "plantaoRequisitante";
    public static final String TROCA_EFETUADA = "trocaEfetuada";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_ESPECIALIDADE_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "MEDICO_VAGA_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Medico medicoVaga;

    @JoinColumn(name = "MEDICO_REQUISITANTE_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Medico medicoRequisitante;

    @JoinColumn(name = "PLANTAO_VAGA_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Plantao plantaoVaga;

    @JoinColumn(name = "PLANTAO_REQUISITANTE_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Plantao plantaoRequisitante;

    @Column(name = "TROCA_EFETUADA")
    private Boolean trocaEfetuada;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Medico getMedicoVaga() {
        return medicoVaga;
    }

    public void setMedicoVaga(Medico medicoVaga) {
        this.medicoVaga = medicoVaga;
    }

    public Medico getMedicoRequisitante() {
        return medicoRequisitante;
    }

    public void setMedicoRequisitante(Medico medicoRequisitante) {
        this.medicoRequisitante = medicoRequisitante;
    }

    public Plantao getPlantaoVaga() {
        return plantaoVaga;
    }

    public void setPlantaoVaga(Plantao plantao) {
        this.plantaoVaga = plantao;
    }

    public Plantao getPlantaoRequisitante() {
        return plantaoRequisitante;
    }

    public void setPlantaoRequisitante(Plantao plantao) {
        this.plantaoRequisitante = plantao;
    }

    public Boolean getTrocaEfetuada() {
        return trocaEfetuada;
    }

    public void setTrocaEfetuada(Boolean trocaEfetuada) {
        this.trocaEfetuada = trocaEfetuada;
    }
}
