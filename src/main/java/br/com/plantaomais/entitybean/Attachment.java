package br.com.plantaomais.entitybean;

import br.com.plantaomais.entitybean.enums.AttachmentType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "ATTACHMENT")
public class Attachment implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "medicoAnexo";

    public static final String ID = "id";
    public static final String CONTENT_TYPE = "contentType";
    public static final String ATTACHMENT_TYPE = "type";
    public static final String NAME = "name";
    public static final String FILE_NAME = "fileName";
    public static final String URL = "url";
    public static final String ATTACHMENT_KEY = "key";
    public static final String PROCESSED = "processed";
    public static final String DOCUMENT_FILE = "file";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "CONTENT_TYPE")
    private String contentType;

    @Column(name = "ATTACHMENT_TYPE")
    @Enumerated(EnumType.STRING)
    private AttachmentType type;

    @Column(name = "NAME")
    private String name;

    @Column(name = "FILE_NAME")
    private String fileName;

    @Column(name = "URL")
    private String url;

    @Column(name = "ATTACHMENT_KEY")
    private String key;

    @Column(name = "PROCESSED")
    private Boolean processed;

    @Lob
    @Column(name = "DOCUMENT_FILE")
    private byte[] file;

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getProcessed() {
        return processed;
    }

    public void setProcessed(Boolean processed) {
        this.processed = processed;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public AttachmentType getType() {
        return type;
    }

    public void setType(AttachmentType type) {
        this.type = type;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
