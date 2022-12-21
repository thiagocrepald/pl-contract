package br.com.plantaomais.vo;

import java.io.Serializable;

/**
 * Created by nextage on 19/04/2016.
 */
public class UsuarioAuditoriaVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String nomeUsuario;
    private String email;
    private String login;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNomeUsuario() {
        return nomeUsuario;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }
}
