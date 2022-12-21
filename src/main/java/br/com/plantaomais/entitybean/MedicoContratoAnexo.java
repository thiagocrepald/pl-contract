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
@Table(name = "MEDICO_CONTRATO_ANEXO")
public class MedicoContratoAnexo {
    // Constantes com os nomes da classe
    public static final String ALIAS_CLASSE = "medicoContratoAnexo";

    public static final String ID = "id";
    public static final String MEDICO= "medico";
    public static final String CONTRATO_ANEXO = "contratoAnexo";

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_MEDICO_CONTRATO_ANEXO_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "MEDICO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Medico medico;

    @JoinColumn(name = "CONTRATO_ANEXO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private ContratoAnexo contratoAnexo;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ContratoAnexo getContratoAnexo() {
        return contratoAnexo;
    }

    public void setContratoAnexo(ContratoAnexo contratoAnexo) {
        this.contratoAnexo = contratoAnexo;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }
}
