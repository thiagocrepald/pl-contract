package br.com.plantaomais.entitybean;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

import static br.com.plantaomais.util.Constants.STATUS_PLANTAO_A_CONFIRMAR;
import static br.com.plantaomais.util.Constants.STATUS_PLANTAO_CONFIRMADO;
import static br.com.plantaomais.util.Constants.STATUS_PLANTAO_DOACAO;
import static br.com.plantaomais.util.Constants.STATUS_PLANTAO_FIXO;

/**
 * Created by nextage on 14/05/2019.
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Table(name = "PLANTAO")
public class Plantao extends Auditoria implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "plantao";

    public static final String ID = "id";
    public static final String HORA_INICIO = "horaInicio";
    public static final String HORA_FIM = "horaFim";
    public static final String DIA = "dia"; //dia de semana (segunda, terça ...)
    public static final String DATA = "data"; //data do mes (20/05/19, 21/05/19 ...)
    public static final String TURNO = "turno";
    public static final String VALOR = "valor";
    public static final String ESCALA = "escala";
    public static final String NUMERO_VAGA = "numeroVaga";
    public static final String BLOQUEADO = "bloqueado";
    public static final String MEDICO = "medico";
    public static final String STATUS = "status";
    public static final String VAGA = "vaga";
    public static final String DISPONIVEL = "disponivel";
    public static final String EM_TROCA = "emTroca";
    public static final String WOKRPLACE_ITEM = "workplaceItem";
    public static final String BLOCKED_REASON = "blockedReason";

    @Id
    @Column(name = "ID")
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_PLANTAO_ID", allocationSize = 1)
    private Integer id;

    @Column(name = "HORA_INICIO")
    @Temporal(TemporalType.TIMESTAMP)
    private Date horaInicio;

    @Column(name = "HORA_FIM")
    @Temporal(TemporalType.TIMESTAMP)
    private Date horaFim;

    //dia de semana (segunda, terça ...)
    @Column(name = "DIA" , length = 50)
    private String dia;

    //data do mes (20/05/19, 21/05/19 ...)
    @Column(name = "DATA")
    @Temporal(TemporalType.TIMESTAMP)
    private Date data;

    @Column(name = "TURNO" , length = 50)
    private String turno;

    @Column(name = "VALOR")
    private Double valor;

    @JoinColumn(name = "ESCALA_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Escala escala;

    @Column(name = "NUMERO_VAGA")
    private Integer numeroVaga;

    @Column(name = "BLOQUEADO")
    private Boolean bloqueado;

    @JoinColumn(name = "MEDICO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = true)
    private Medico medico;

    @Column(name = "STATUS", length = 50)
    private String status;

    @Column(name = "VAGA")
    private Boolean vaga;

    @Column(name = "DISPONIVEL")
    private Boolean disponivel;

    @Column(name = "EM_TROCA")
    private Boolean emTroca;

    @JoinColumn(name = "workplace_item_id", referencedColumnName = "ID")
    @ManyToOne
    private WorkplaceItem workplaceItem;

    @Size(max = 2048)
    @Column(name = "blocked_reason", length = 2048, columnDefinition = "text")
    private String blockedReason;

    public String getLabelOfStatus() {
        if (this.status == null) {
            return "";
        }
        switch (this.status) {
            case STATUS_PLANTAO_FIXO:
                return "Fixo";

            case STATUS_PLANTAO_CONFIRMADO:
                return "Confirmado";

            case STATUS_PLANTAO_A_CONFIRMAR:
                return "A Confirmar";

            case STATUS_PLANTAO_DOACAO:
                if (this.emTroca == null || this.emTroca == false) {
                    return "Em Troca";
                }
                return "Em Doação";

            default:
                return "";
        }
    }
}
