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

@Entity
@Table(name = "BLOQUEIO_MEDICO_CONTRATO")
public class BloqueioMedicoContrato {

    // Constantes com os nomes da classe
    public static final String ALIAS_CLASSE = "bloqueioMedicoContrato";

    public static final String ID = "id";
    public static final String MEDICO = "medico";
    public static final String CONTRATO = "contrato";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_BLOQUEIO_MEDICO_CONTRATO_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "MEDICO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Medico medico;

    @JoinColumn(name = "CONTRATO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Contract contrato;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public Contract getContrato() {
        return contrato;
    }

    public void setContrato(Contract contrato) {
        this.contrato = contrato;
    }
}
