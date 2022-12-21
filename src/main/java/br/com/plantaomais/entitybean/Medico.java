package br.com.plantaomais.entitybean;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Created by nextage on 04/06/2019.
 */
@Getter
@Setter
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@ToString
@Table(name = "MEDICO")
public class Medico extends Auditoria implements Serializable {
    private static final long serialVersionUID = 1L;
    public static final String ALIAS_CLASSE = "medico";

    public static final String ID = "id";
    public static final String NOME = "nome";
    public static final String EMAIL = "email";
    public static final String SENHA = "senha";
    public static final String TELEFONE = "telefone";
    public static final String EH_CONTA_EMPRESA = "ehContaEmpresa";
    public static final String BANCO = "banco";
    public static final String AGENCIA = "agencia";
    public static final String OPERACAO = "operacao";
    public static final String CONTA = "conta";
    public static final String CPF = "cpf";
    public static final String CNPJ = "cnpj";
    public static final String NOME_TITULAR = "nomeTitular";
    public static final String NUMERO_PIS = "numeroPis";
    public static final String TIPO_RECEBIMENTO = "tipoRecebimento";
    public static final String UF_CONSELHO_MEDICO = "ufConselhoMedico";
    public static final String SEXO = "sexo";
    public static final String ANEXO_FOTO = "anexoFoto";
    public static final String NOME_ANEXO_FOTO = "nomeAnexoFoto";
    public static final String TIPO_ANEXO_FOTO = "tipoAnexoFoto";
    public static final String TOKEN = "token";
    public static final String DATA_EXPIRACAO_TOKEN = "dataExpiracaoToken";
    public static final String DATA_ALTERACAO_SENHA = "dataAlteracaoSenha";
    public static final String VALIDADO = "validado";
    public static final String OBSERVACOES_VALIDACAO = "observacoesValidacao";
    public static final String TOKEN_PUSH_NOTIFICATION = "tokenPushNotification";
    public static final String STATUS = "status";
    public static final String CADASTRO_COMPLETO = "cadastroCompleto";
    public static final String EMAIL_VALIDADO = "emailValidado";
    public static final String NUMERO_CRM = "numeroCrm";
    public static final String NUMERO_CRM_ADICIONAL = "numeroCrmAdicional";
    public static final String UF_CONSELHO_MEDICO_ADICIONAL = "ufConselhoMedicoAdicional";
    public static final String VERSAO_LOGIN = "versaoLogin";
    public static final String DATA_ULTIMO_LOGIN = "dataUltimoLogin";
    public static final String MEDICO_ACESSO = "medicoAcesso";
    public static final String ATIVO = "ativo";
    public static final String ADDRESS = "address";
    public static final String BIRTH_DATE = "birthDate";
    public static final String CRM_ISSUE_DATE = "crmIssueDate";
    public static final String PONTUACAO = "pontuacao";
    public static final String CRM_ADICIONAL_ISSUE_DATE = "crmAdicionalIssueDate";
    public static final String ATTACHMENT = "attachment";
    public static final String PUBLIC_KEY = "publicKey";
    public static final String SIGNATURE = "signature";
    public static final String RESET_KEY = "resetKey";

    @Id
    @Column(name = "ID")
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_MEDICO_ID", allocationSize = 1)
    private Integer id;

    @Column(name = "NOME", length = 100, nullable = false)
    private String nome;

    @Column(name = "EMAIL", length = 100, nullable = false)
    private String email;

    @Column(name = "SENHA", length = 60, nullable = false)
    private String senha;

    @Column(name = "TELEFONE", length = 40, nullable = false)
    private String telefone;

    @Column(name = "UF_CONSELHO_MEDICO", length = 40, nullable = false)
    private String ufConselhoMedico;

    @Column(name = "SEXO", length = 10, nullable = false)
    private String sexo;

    // FOTO
    @Lob
    @Column(name = "ANEXO_FOTO")
    private byte[] anexoFoto;

    @ManyToOne
    @JoinColumn(name = "ATTACHMENT_ID", referencedColumnName = "ID")
    private Attachment attachment;

    @Column(name = "NOME_ANEXO_FOTO", length = 200)
    private String nomeAnexoFoto;

    @Column(name = "TIPO_ANEXO_FOTO", length = 20)
    private String tipoAnexoFoto;


    /*CONTROLE DE ACESSO*/
    @Column(name = "TOKEN", columnDefinition = "TEXT")
    private String token;

    @Column(name = "DATA_EXPIRACAO_TOKEN")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataExpiracaoToken;

    @Column(name = "DATA_ULTIMO_LOGIN")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataUltimoLogin;

    @Column(name = "DATA_ALTERACAO_SENHA")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataAlteracaoSenha;

    @Column(name = "VALIDADO")
    private Boolean validado;

    @Column(name = "EH_CONTA_EMPRESA")
    private Boolean ehContaEmpresa;

    @Column(name = "TIPO_RECEBIMENTO", length = 10)
    private String tipoRecebimento;

    @Column(name = "OBSERVACOES_VALIDACAO", length = 200)
    private String observacoesValidacao;

    @Column(name = "BANCO", length = 50)
    private String banco;

    @Column(name = "AGENCIA", length = 50)
    private String agencia;

    @Column(name = "OPERACAO", length = 50)
    private String operacao;

    @Column(name = "CONTA", length = 50)
    private String conta;

    @Column(name = "CPF", length = 50)
    private String cpf;

    @Column(name = "CNPJ", length = 50)
    private String cnpj;

    @Column(name = "NOME_TITULAR", length = 50)
    private String nomeTitular;

    @Column(name = "NUMERO_PIS", length = 50)
    private String numeroPis;

    @Column(name = "STATUS", length = 50)
    private String status;

    @Column(name = "TOKEN_PUSH_NOTIFICATION", length = 100)
    private String tokenPushNotification;

    // Dados Cadastro
    @Column(name = "CADASTRO_COMPLETO")
    private Boolean cadastroCompleto;

    @Column(name = "EMAIL_VALIDADO")
    private Boolean emailValidado;

    @Column(name = "NUMERO_CRM", length = 20)
    private String numeroCrm;

    @Column(name = "UF_CONSELHO_MEDICO_ADICIONAL", length = 40)
    private String ufConselhoMedicoAdicional;

    @Column(name = "NUMERO_CRM_ADICIONAL", length = 20)
    private String numeroCrmAdicional;

    @Column(name = "VERSAO_LOGIN", length = 20)
    private String versaoLogin;

    @Column(name = "MEDICO_ACESSO", length = 20)
    private Integer medicoAcesso;

    @Column(name = "ATIVO")
    private Boolean ativo;

    @JoinColumn(name = "ADDRESS_ID", referencedColumnName = "ID")
    @OneToOne
    private Address address;

    @Column(name = "BIRTH_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date birthDate;

    @Column(name = "CRM_ISSUE_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date crmIssueDate;

    @Column(name = "CRM_ADICIONAL_ISSUE_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date crmAdicionalIssueDate;

    @Column(name = "PONTUACAO", length = 20)
    private String pontuacao;

    @Column(name = "RESET_KEY", length = 20)
    private String resetKey;

    @Column(name = "BIOMETRY_PUBLIC_KEY")
    private String publicKey;

    @Column(name = "BIOMETRY_SIGNATURE")
    private String signature;

}
