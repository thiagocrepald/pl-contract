package br.com.plantaomais.entitybean;

import br.com.plantaomais.entitybean.aplicativo.TrocaVaga;
import br.com.plantaomais.entitybean.enums.NotificationStatus;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.io.Serializable;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "NOTIFICATION")
public class Notification  implements Serializable  {

    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "notification";

    public static final String ID = "id";
    public static final String MEDIC = "medic";
    public static final String MESSAGE = "message";
    public static final String DATE = "date";
    public static final String TYPE = "type";
    public static final String STATUS = "status";
    public static final String ESCALA = "escala";
    public static final String PLANTAO = "plantao";
    public static final String CANDIDATO_PLANTAO = "candidatoPlantao";
    public static final String TROCA_VAGA = "trocaVaga";
    public static final String EVENT = "event";

    public static List<String> getAllFields() {
        return Arrays.asList(
            ID,
            MEDIC,
            MESSAGE,
            DATE,
            TYPE,
            STATUS,
            ESCALA,
            PLANTAO,
            CANDIDATO_PLANTAO,
            TROCA_VAGA,
            EVENT
        );
    }
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_NOTIFICATION_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "MEDIC_ID", referencedColumnName = "ID")
    @ManyToOne
    private Medico medic;

    @Column(name = "MESSAGE")
    private String message;

    @Column(name = "DATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    @Column(name = "TYPE")
    private String type;

    @Column(name = "STATUS")
    @Enumerated(EnumType.STRING)
    private NotificationStatus status;

    @JoinColumn(name = "ESCALA_ID", referencedColumnName = "ID")
    @OneToOne
    private Escala escala;

    @JoinColumn(name = "PLANTAO_ID", referencedColumnName = "ID")
    @OneToOne
    private Plantao plantao;

    @JoinColumn(name = "CANDIDATO_PLANTAO_ID", referencedColumnName = "ID")
    @ManyToOne
    private CandidatoPlantao candidatoPlantao;

    @JoinColumn(name = "TROCA_VAGA_ID", referencedColumnName = "ID")
    @OneToOne
    private TrocaVaga trocaVaga;

    @JoinColumn(name = "EVENT_ID", referencedColumnName = "ID")
    @ManyToOne
    private Event event;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Medico getMedico() {
        return medic;
    }

    public void setMedico(Medico medico) {
        this.medic = medico;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public NotificationStatus getStatus() {
        return status;
    }

    public void setStatus(NotificationStatus status) {
        this.status = status;
    }

    public Plantao getPlantao() {
        return plantao;
    }

    public void setPlantao(Plantao plantao) {
        this.plantao = plantao;
    }

    public Escala getEscala() {
        return escala;
    }

    public void setEscala(Escala escala) {
        this.escala = escala;
    }

    public CandidatoPlantao getCandidatoPlantao() { return candidatoPlantao; }

    public void setCandidatoPlantao(CandidatoPlantao candidatoPlantao) { this.candidatoPlantao = candidatoPlantao; }

    public Medico getMedic() {
        return medic;
    }

    public void setMedic(Medico medic) {
        this.medic = medic;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public TrocaVaga getTrocaVaga() { return trocaVaga; }

    public void setTrocaVaga(TrocaVaga trocaVaga) { this.trocaVaga = trocaVaga; }
}
