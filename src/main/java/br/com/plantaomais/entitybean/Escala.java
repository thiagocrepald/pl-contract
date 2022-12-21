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
import java.io.Serializable;
import java.util.Date;

/**
 * Created by nextage on 14/05/2019.
 */
@Entity
@Table(name = "ESCALA")
public class Escala extends Auditoria implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "escala";

    public static final String ID = "id";
    public static final String COORDENADOR = "coordenador";
    public static final String CONTRATO = "contrato";
    public static final String WORK_PLACE = "workplace";
    public static final String NOME_ESCALA = "nomeEscala";
    public static final String PERIODO_INICIO = "periodoInicio";
    public static final String PERIODO_FIM = "periodoFim";
    public static final String PREVISAO_PAGAMENTO = "previsaoPagamento";
    public static final String ATIVO = "ativo";
    public static final String IS_DRAFT = "isDraft";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_ESCALA_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "USUARIO_ID", referencedColumnName = "ID")
    @ManyToOne
    private Usuario coordenador;

    @JoinColumn(name = "CONTRATO_ID", referencedColumnName = "ID")
    @ManyToOne
    private Contract contrato;

    @JoinColumn(name = "WORK_PLACE_ID", referencedColumnName = "ID")
    @ManyToOne
    private Workplace workplace;

    @Column(name = "NOME_ESCALA", length = 100, nullable = false)
    private String nomeEscala;

    @Column(name = "PERIODO_INICIO")
    @Temporal(TemporalType.TIMESTAMP)
    private Date periodoInicio;

    @Column(name = "PERIODO_FIM")
    @Temporal(TemporalType.TIMESTAMP)
    private Date periodoFim;

    @Column(name = "PREVISAO_PAGAMENTO")
    @Temporal(TemporalType.TIMESTAMP)
    private Date previsaoPagamento;

    @Column(name = "ATIVO")
    private Boolean ativo;

    @Column(name = "IS_DRAFT")
    private Boolean isDraft;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Usuario getCoordenador() {
        return coordenador;
    }

    public void setCoordenador(Usuario coordenador) {
        this.coordenador = coordenador;
    }

    public Contract getContrato() {
        return contrato;
    }

    public void setContrato(Contract contrato) {
        this.contrato = contrato;
    }

    public String getNomeEscala() {
        return nomeEscala;
    }

    public void setNomeEscala(String nomeEscala) {
        this.nomeEscala = nomeEscala;
    }

    public Date getPeriodoInicio() {
        return periodoInicio;
    }

    public void setPeriodoInicio(Date periodoInicio) {
        this.periodoInicio = periodoInicio;
    }

    public Date getPeriodoFim() {
        return periodoFim;
    }

    public void setPeriodoFim(Date periodoFim) {
        this.periodoFim = periodoFim;
    }

    public Date getPrevisaoPagamento() {
        return previsaoPagamento;
    }

    public void setPrevisaoPagamento(Date previsaoPagamento) {
        this.previsaoPagamento = previsaoPagamento;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Boolean getIsDraft() {
        return isDraft;
    }

    public void setIsDraft(Boolean draft) {
        isDraft = draft;
    }

    public Workplace getWorkplace() {
        return workplace;
    }

    public void setWorkplace(Workplace workplace) {
        this.workplace = workplace;
    }
}
