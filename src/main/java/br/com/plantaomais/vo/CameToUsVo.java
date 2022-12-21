package br.com.plantaomais.vo;

import java.io.Serializable;


public class CameToUsVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private Boolean googleOrSite;
    private Boolean recruitment;
    private Boolean colleagueIndication;
    private Boolean provideServiceAtWork;
    private Boolean socialMedia;
    private Boolean other;
    private String recruiterName;
    private String otherDescription;


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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CameToUsVo that = (CameToUsVo) o;

        return id != null ? id.equals(that.id) : that.id == null;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
