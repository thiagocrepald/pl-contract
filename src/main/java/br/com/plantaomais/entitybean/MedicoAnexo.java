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
@Table(name = "MEDICO_ANEXO")
public class MedicoAnexo extends Auditoria implements Serializable {
    private static final long serialVersionUID = 1L;
    // Constantes com os nomes da classe
    public static final String ALIAS_CLASSE = "medicoAnexo";

    public static final String ID = "id";
    public static final String MEDICO = "medico";
    public static final String CAMPO_ANEXO = "campoAnexo";
    public static final String NOME_ANEXO = "nomeAnexo";
    public static final String BASE64_ANEXO = "base64Anexo";
    public static final String TIPO_ANEXO = "tipoAnexo";
    public static final String EH_HISTORICO = "ehHistorico";
    public static final String VALIDADO = "validado";
    public static final String OBSERVACAO_VALIDACAO = "observacaoValidacao";
    public static final String EH_VERSO = "ehVerso";
    public static final String HASH = "hash";
    public static final String ESPECIALIDADE = "especialidade";
    public static final String VISUALIZADO = "visualizado";
    public static final String MEDICO_CURSO = "medicoCurso";
    public static final String EXTRA = "extra";
    public static final String ATTACHMENT = "attachment";


    public static List<String> getAllFields() {
        List<String> parentFields = Auditoria.getAllFields();

        List<String> fields = Arrays.asList(
                ID,
                MEDICO,
                CAMPO_ANEXO,
                NOME_ANEXO,
                BASE64_ANEXO,
                TIPO_ANEXO,
                EH_HISTORICO,
                VALIDADO,
                OBSERVACAO_VALIDACAO,
                EH_VERSO,
                HASH,
                ESPECIALIDADE,
                VISUALIZADO,
                MEDICO_CURSO,
                ATTACHMENT,
                EXTRA
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
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_MEDICO_ANEXO_ID", allocationSize = 1)
    private Integer id;

    @JoinColumn(name = "MEDICO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private Medico medico;

    @JoinColumn(name = "ESPECIALIDADE_ID", referencedColumnName = "ID")
    @ManyToOne(optional = true)
    private Especialidade especialidade;

    @JoinColumn(name = "MEDICO_CURSO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = true)
    private MedicoCurso medicoCurso;

    @JoinColumn(name = "CAMPO_ANEXO_ID", referencedColumnName = "ID")
    @ManyToOne(optional = false)
    private CampoAnexo campoAnexo;

    @Column(name = "NOME_ANEXO", length = 200)
    private String nomeAnexo;

    @Lob
    @Column(name = "BASE64_ANEXO")
    private byte[] base64Anexo;

    @Column(name = "TIPO_ANEXO", length = 20)
    private String tipoAnexo;

    @Column(name = "EH_HISTORICO")
    private Boolean ehHistorico;

    @Column(name = "VALIDADO")
    private Boolean validado;

    @Column(name = "OBERVACAO_VALIDACAO", length = 500)
    private String observacaoValidacao;

    @Column(name = "EH_VERSO")
    private Boolean ehVerso;

    @Column(name = "HASH")
    private Long hash;

    @Column(name = "VISUALIZADO")
    private Boolean visualizado;

    @Column(name = "EXTRA")
    private String extra;

    @ManyToOne
    @JoinColumn(name = "ATTACHMENT_ID", referencedColumnName = "ID")
    private Attachment attachment;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public CampoAnexo getCampoAnexo() {
        return campoAnexo;
    }

    public void setCampoAnexo(CampoAnexo campoAnexo) {
        this.campoAnexo = campoAnexo;
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

    public Boolean getEhHistorico() {
        return ehHistorico;
    }

    public void setEhHistorico(Boolean ehHistorico) {
        this.ehHistorico = ehHistorico;
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

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public Boolean getEhVerso() {
        return ehVerso;
    }

    public void setEhVerso(Boolean ehVerso) {
        this.ehVerso = ehVerso;
    }

    public Long getHash() {
        return hash;
    }

    public void setHash(Long hash) {
        this.hash = hash;
    }

    public Especialidade getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(Especialidade especialidade) {
        this.especialidade = especialidade;
    }

    public Boolean getVisualizado() {
        return visualizado;
    }

    public void setVisualizado(Boolean visualizado) {
        this.visualizado = visualizado;
    }

    public void setExtra(String extra) {
        this.extra = extra;
    }

    public String getExtra() {
        return this.extra;
    }

    public MedicoCurso getMedicoCurso() {
        return medicoCurso;
    }

    public void setMedicoCurso(MedicoCurso medicoCurso) {
        this.medicoCurso = medicoCurso;
    }

    public Attachment getAttachment() {
        return attachment;
    }

    public void setAttachment(Attachment attachment) {
        this.attachment = attachment;
    }
}
