package br.com.plantaomais.entitybean;

import javax.persistence.Basic;
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
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by nextage on 19/06/2019.
 */
@Entity
@Table(name = "CONTRATO_ANEXO")
public class ContratoAnexo extends Auditoria implements Serializable {
    private static final long serialVersionUID = 1L;
    // Constantes com os nomes da classe
    public static final String ALIAS_CLASSE = "contratoAnexo";

    public static final String ID = "id";
    public static final String CONTRATO = "contrato";
    public static final String NOME_ANEXO = "nomeAnexo";
    public static final String TIPO_ANEXO = "tipoAnexo";
    public static final String BASE64_ANEXO = "base64Anexo";
    public static final String VALIDADO = "validado";
    public static final String OBSERVACAO_VALIDACAO = "observacaoValidacao";
    public static final String ATTACHMENT = "attachment";


    public static List<String> getAllFields() {
        List<String> parentFields = Auditoria.getAllFields();

        List<String> fields = Arrays.asList(
                ID,
                CONTRATO,
                NOME_ANEXO,
                TIPO_ANEXO,
                ATTACHMENT,
                BASE64_ANEXO,
                VALIDADO,
                OBSERVACAO_VALIDACAO
        );

        return new ArrayList<String>() {{
            addAll(parentFields);
            addAll(fields);
        }};
    }

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_CONTRATO_ANEXO_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "CONTRATO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Contract contrato;

    @Column(name = "NOME_ANEXO", length = 200)
    private String nomeAnexo;

    @Lob
    @Column(name = "BASE64_ANEXO")
    private byte[] base64Anexo;

    @Column(name = "TIPO_ANEXO", length = 20)
    private String tipoAnexo;

    @Column(name = "VALIDADO")
    private Boolean validado;

    @Column(name = "OBSERVACAO_VALIDACAO", length = 500)
    private String observacaoValidacao;

    @ManyToOne
    @JoinColumn(name = "ATTACHMENT_ID", referencedColumnName = "ID")
    private Attachment attachment;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Contract getContrato() {
        return contrato;
    }

    public void setContrato(Contract contrato) {
        this.contrato = contrato;
    }

    public String getNomeAnexo() {
        return nomeAnexo;
    }

    public void setNomeAnexo(String nomeAnexo) {
        this.nomeAnexo = nomeAnexo;
    }

    public byte[] getBase64Anexo() {
        return base64Anexo;
    }

    public void setBase64Anexo(byte[] base64Anexo) {
        this.base64Anexo = base64Anexo;
    }

    public String getTipoAnexo() {
        return tipoAnexo;
    }

    public void setTipoAnexo(String tipoAnexo) {
        this.tipoAnexo = tipoAnexo;
    }

    public Boolean getValidado() {
        return validado;
    }

    public void setValidado(Boolean validado) {
        this.validado = validado;
    }

    public String getObservacaoValidacao() {
        return observacaoValidacao;
    }

    public void setObservacaoValidacao(String observacaoValidacao) {
        this.observacaoValidacao = observacaoValidacao;
    }

    public Attachment getAttachment() {
        return attachment;
    }

    public void setAttachment(Attachment attachment) {
        this.attachment = attachment;
    }
}
