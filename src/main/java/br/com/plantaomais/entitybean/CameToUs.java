package br.com.plantaomais.entitybean;

import br.com.plantaomais.entitybean.enums.PaymentType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@Table(name = "came_to_us")
public class CameToUs implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "cameToUs";

    public static final String ID = "id";
    public static final String GOOGLE_OR_SITE = "googleOrSite";
    public static final String RECRUITMENT = "recruitment";
    public static final String RECRUITER_NAME = "recruiterName";
    public static final String COLLEAGUE_INDICATION = "colleagueIndication";
    public static final String PROVIDE_SERVICE_AT_WORK = "provideServiceAtWork";
    public static final String SOCIAL_MEDIA = "socialMedia";
    public static final String OTHER = "other";
    public static final String OTHER_DESCRIPTION = "otherDescription";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @NotNull
    @Column(name = "GOOGLE_OR_SITE", nullable = false)
    private Boolean googleOrSite;

    @NotNull
    @Column(name = "RECRUITMENT", nullable = false)
    private Boolean recruitment;

    @NotNull
    @Column(name = "COLLEAGUE_INDICATION", nullable = false)
    private Boolean colleagueIndication;

    @NotNull
    @Column(name = "PROVIDE_SERVICE_AT_WORK", nullable = false)
    private Boolean provideServiceAtWork;

    @NotNull
    @Column(name = "SOCIAL_MEDIA", nullable = false)
    private Boolean socialMedia;

    @NotNull
    @Column(name = "OTHER", nullable = false)
    private Boolean other;

    @Column(name = "RECRUITER_NAME")
    private String recruiterName;

    @Lob
    @Column(name = "OTHER_DESCRIPTION")
    private String otherDescription;

    @JoinColumn(name = "MEDIC_ID", referencedColumnName = "ID")
    @OneToOne
    private Medico medico;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Boolean getGoogleOrSite() {
        return googleOrSite;
    }

    public void setGoogleOrSite(Boolean googleOrSite) {
        this.googleOrSite = googleOrSite;
    }

    public Boolean getRecruitment() {
        return recruitment;
    }

    public void setRecruitment(Boolean recruitment) {
        this.recruitment = recruitment;
    }

    public Boolean getColleagueIndication() {
        return colleagueIndication;
    }

    public void setColleagueIndication(Boolean colleagueIndication) {
        this.colleagueIndication = colleagueIndication;
    }

    public Boolean getProvideServiceAtWork() {
        return provideServiceAtWork;
    }

    public void setProvideServiceAtWork(Boolean provideServiceAtWork) {
        this.provideServiceAtWork = provideServiceAtWork;
    }

    public Boolean getSocialMedia() {
        return socialMedia;
    }

    public void setSocialMedia(Boolean socialMedia) {
        this.socialMedia = socialMedia;
    }

    public Boolean getOther() {
        return other;
    }

    public void setOther(Boolean other) {
        this.other = other;
    }

    public String getRecruiterName() {
        return recruiterName;
    }

    public void setRecruiterName(String recruiterName) {
        this.recruiterName = recruiterName;
    }

    public String getOtherDescription() {
        return otherDescription;
    }

    public void setOtherDescription(String otherDescription) {
        this.otherDescription = otherDescription;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }
}
