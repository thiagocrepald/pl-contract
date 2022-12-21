package br.com.plantaomais.entitybean;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;
import java.util.Objects;

/**
 * @author Matheus Toledo
 */
@Entity
@Table(name = "CANDIDATO_PLANTAO")
public class CandidatoPlantao extends Auditoria {

    public static final String ALIAS_CLASSE = "candidatoPlantao";

    public static final String ID = "id";
    public static final String PLANTAO = "plantao";
    public static final String MEDICO = "medico";
    public static final String DATA_CANDIDATURA = "dataCandidatura";
    public static final String ACEITO = "aceito";
    public static final String DOACAO = "doacao";
    public static final String CANCELADO = "cancelado";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_CANDIDATO_PLANTAO_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "PLANTAO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Plantao plantao;

    @JoinColumn(name = "MEDICO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Medico medico;

    @Column(name = "DATA_CANDIDATURA")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataCandidatura;

    @Column(name = "ACEITO")
    private Boolean aceito;

    @Column(name = "DOACAO")
    private Boolean doacao;

    @Column(name = "CANCELADO")
    private Boolean cancelado;


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

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public Date getDataCandidatura() {
        return dataCandidatura;
    }

    public void setDataCandidatura(Date dataCandidatura) {
        this.dataCandidatura = dataCandidatura;
    }

    public Boolean getAceito() {
        return aceito;
    }

    public void setAceito(Boolean aceito) {
        this.aceito = aceito;
    }

    public Boolean getDoacao() {
        return doacao;
    }

    public void setDoacao(Boolean doacao) {
        this.doacao = doacao;
    }

    public Boolean getCancelado() {
        return cancelado;
    }

    public void setCancelado(Boolean cancelado) {
        this.cancelado = cancelado;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CandidatoPlantao that = (CandidatoPlantao) o;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
