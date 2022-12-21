package br.com.plantaomais.entitybean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by nextage
 * on 19/10/2018.
 */
@Entity
@Table(name = "USUARIO")
public class Usuario extends Auditoria implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "usuario";

    public static final String ID = "id";
    public static final String NOME = "nome";
    public static final String SENHA = "senha";
    public static final String SENHA_EXCLUSAO_ESCALA = "senhaEsclusaoEscala";
    public static final String LOGIN = "login";
    public static final String TOKEN = "token";
    public static final String DATA_EXPIRACAO_TOKEN = "dataExpiracaoToken";
    public static final String DATA_ALTERACAO_SENHA = "dataAlteracaoSenha";
    public static final String REQUISITADO_NOVA_SENHA = "requisitadoNovaSenha";
    public static final String TELEFONE = "telefone";
    public static final String RESET_KEY = "resetKey";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_USUARIO_ID", allocationSize = 1)
    private Integer id;

    @Column(name = "NOME", length = 100, nullable = false)
    private String nome;

    @Column(name = "SENHA", length = 60, nullable = false)
    private String senha;

    @Column(name = "SENHA_EXCLUSAO_ESCALA", length = 50)
    private String senhaEsclusaoEscala;

    @Column(name = "LOGIN", length = 100, nullable = false)
    private String login;

    /*CONTROLE DE ACESSO*/
    @Column(name = "TOKEN", columnDefinition = "TEXT")
    private String token;

    @Column(name = "DATA_EXPIRACAO_TOKEN")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataExpiracaoToken;

    @Column(name = "DATA_ALTERACAO_SENHA")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataAlteracaoSenha;

    @Column(name = "REQUISITADO_NOVA_SENHA")
    private Boolean requisitadoNovaSenha;

    @Column(name = "TELEFONE")
    private String telefone;

    @Column(name = "RESET_KEY", length = 20)
    private String resetKey;

    public String getResetKey() {
        return resetKey;
    }

    public void setResetKey(String resetKey) {
        this.resetKey = resetKey;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public Date getDataExpiracaoToken() {
        return dataExpiracaoToken;
    }

    public void setDataExpiracaoToken(Date dataExpiracaoToken) {
        this.dataExpiracaoToken = dataExpiracaoToken;
    }

    public Date getDataAlteracaoSenha() {
        return dataAlteracaoSenha;
    }

    public void setDataAlteracaoSenha(Date dataAlteracaoSenha) {
        this.dataAlteracaoSenha = dataAlteracaoSenha;
    }

    public Boolean getRequisitadoNovaSenha() {
        return requisitadoNovaSenha;
    }

    public void setRequisitadoNovaSenha(Boolean requisitadoNovaSenha) {
        this.requisitadoNovaSenha = requisitadoNovaSenha;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getSenhaEsclusaoEscala() {
        return senhaEsclusaoEscala;
    }

    public void setSenhaEsclusaoEscala(String senhaEsclusaoEscala) {
        this.senhaEsclusaoEscala = senhaEsclusaoEscala;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        if (!(object instanceof Usuario)) {
            return false;
        }
        Usuario other = (Usuario) object;
        return !((this.id == null && other.id != null) || (this.id != null && !this.id
                .equals(other.id)));
    }

    @Override
    public String toString() {
        return this.getClass().getName() + "[id=" + id + "]";
    }
}
