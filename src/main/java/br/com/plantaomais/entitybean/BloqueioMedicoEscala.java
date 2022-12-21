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
 * Created by nextage on 17/07/2019.
 */
@Entity
@Table(name = "BLOQUEIO_MEDICO_ESCALA")
public class BloqueioMedicoEscala {

    // Constantes com os nomes da classe
    public static final String ALIAS_CLASSE = "bloqueioMedicoEscala";

    public static final String ID = "id";
    public static final String MEDICO = "medico";
    public static final String ESCALA = "escala";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_BLOQUEIO_MEDICO_ESCALA_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "MEDICO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Medico medico;

    @JoinColumn(name = "ESCALA_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Escala escala;

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

    public Escala getEscala() {
        return escala;
    }

    public void setEscala(Escala escala) {
        this.escala = escala;
    }
}
