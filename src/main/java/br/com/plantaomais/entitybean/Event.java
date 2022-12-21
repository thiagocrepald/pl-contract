package br.com.plantaomais.entitybean;

import javax.persistence.Column;
import javax.persistence.Entity;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * Created by gmribas on 27/04/20.
 */
@Entity
@Table(name = "EVENTO")
public class Event extends Auditoria implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "evento";

    public static final String ID = "id";
    public static final String ATTACHMENT = "attachment";
    public static final String TITLE = "title";
    public static final String DESCRIPTION = "description";
    public static final String ADDRESS = "address";
    public static final String START_DATE = "startDate";
    public static final String START_TIME = "startTime";
    public static final String END_DATE = "endDate";
    public static final String END_TIME = "endTime";
    public static final String LINK = "link";
    public static final String ACTIVE = "active";

    public static List<String> getAllFields() {
        List<String> parentFields = Auditoria.getAllFields();

        List<String> fields = Arrays.asList(
                ID,
                ATTACHMENT,
                TITLE,
                DESCRIPTION,
                ADDRESS,
                START_DATE,
                START_TIME,
                END_DATE,
                END_TIME,
                LINK,
                ACTIVE
        );

        return new ArrayList<String>() {{
            addAll(parentFields);
            addAll(fields);
        }};
    }

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_EVENTO_ID", allocationSize = 1)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "ATTACHMENT_ID", referencedColumnName = "ID")
    private Attachment attachment;

    @Column(name = "TITULO", length = 100, nullable = false)
    private String title;

    @Column(name = "DESCRICAO")
    private String description;

    @JoinColumn(name = "ENDERECO_ID", referencedColumnName = "ID")
    @OneToOne
    private Address address;

    @Column(name = "DATA_INICIO", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Column(name = "HORA_INICIO", nullable = false)
    @Temporal(TemporalType.TIME)
    private Date startTime;

    @Column(name = "DATA_FIM", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date endDate;

    @Column(name = "HORA_FIM", nullable = false)
    @Temporal(TemporalType.TIME)
    private Date endTime;

    @Column(name = "LINK")
    private String link;

    @Column(name = "ATIVO", nullable = false)
    private Boolean active;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Attachment getAttachment() {
        return attachment;
    }

    public void setAttachment(Attachment attachment) {
        this.attachment = attachment;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
