package br.com.plantaomais.vo;

import java.io.Serializable;
import java.security.Principal;
import java.util.Date;
import java.util.List;

public class UsuarioVo extends AuditoriaVo implements Serializable, Principal {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String nome;
    private String senha;
    private String confirmarSenha;
    private String login;
    private String token;
    private Date dataExpiracaoToken;
    private Date dataAlteracaoSenha;
    private Boolean requisitadoNovaSenha;
    private Integer minutosAtualizarToken;
    private String telefone;
    private String resetKey;
    private List<TipoPermissaoVo> listaTipoPermissao;
    private List<UsuarioTipoPermissaoVo> listaUsuarioTipoPermissao;
    private List<TipoConfiguracaoVo> listaTipoConfiguracao;
    private List<ConfiguracaoVo> listaConfiguracao;

    public UsuarioVo() {

    }

    public UsuarioVo(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public void setPassword(String password) {
        setSenha(password);
    }

    public String getPassword() {
        return getSenha();
    }

    public void setEmail(String email) {
        setLogin(email);
    }

    public String getEmail() {
        return getLogin();
    }

    public String getConfirmarSenha() {
        return confirmarSenha;
    }

    public void setConfirmarSenha(String confirmarSenha) {
        this.confirmarSenha = confirmarSenha;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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

    public Integer getMinutosAtualizarToken() {
        return minutosAtualizarToken;
    }

    public void setMinutosAtualizarToken(Integer minutosAtualizarToken) {
        this.minutosAtualizarToken = minutosAtualizarToken;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public List<TipoPermissaoVo> getListaTipoPermissao() {
        return listaTipoPermissao;
    }

    public void setListaTipoPermissao(List<TipoPermissaoVo> listaTipoPermissao) {
        this.listaTipoPermissao = listaTipoPermissao;
    }

    public List<UsuarioTipoPermissaoVo> getListaUsuarioTipoPermissao() {
        return listaUsuarioTipoPermissao;
    }

    public void setListaUsuarioTipoPermissao(List<UsuarioTipoPermissaoVo> listaUsuarioTipoPermissao) {
        this.listaUsuarioTipoPermissao = listaUsuarioTipoPermissao;
    }

    public List<TipoConfiguracaoVo> getListaTipoConfiguracao() {
        return listaTipoConfiguracao;
    }

    public void setListaTipoConfiguracao(List<TipoConfiguracaoVo> listaTipoConfiguracao) {
        this.listaTipoConfiguracao = listaTipoConfiguracao;
    }

    public List<ConfiguracaoVo> getListaConfiguracao() {
        return listaConfiguracao;
    }

    public void setListaConfiguracao(List<ConfiguracaoVo> listaConfiguracao) {
        this.listaConfiguracao = listaConfiguracao;
    }

    public String getResetKey() {
        return resetKey;
    }

    public void setResetKey(String resetKey) {
        this.resetKey = resetKey;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        if (!(object instanceof UsuarioVo)) {
            return false;
        }
        UsuarioVo other = (UsuarioVo) object;
        return !((this.id == null && other.id != null) || (this.id != null && !this.id
                .equals(other.id)));
    }

    @Override
    public String toString() {
        return "User [id=" + id + ", login=" + login + ", nome=" + nome + "]";
    }

    @Override
    public String getName() {
        return nome;
    }

}
