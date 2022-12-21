package br.com.plantaomais.vo;

import java.util.Date;

/**
 * Created by gmribas on 27/04/20.
 */
public class EventVO {

    private Integer id;

    private AttachmentVo attachment;

    private String imageBase64;

    private String title;

    private String description;

    private AddressVo address;

    private Date startDate;

    private Date startTime;

    private Date endDate;

    private Date endTime;

    private String link;

    private Boolean active;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public AttachmentVo getAttachment() {
        return attachment;
    }

    public void setAttachment(AttachmentVo attachment) {
        this.attachment = attachment;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
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

    public AddressVo getAddress() {
        return address;
    }

    public void setAddress(AddressVo address) {
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
