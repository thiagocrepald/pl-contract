package br.com.plantaomais.filtro;

import java.io.Serializable;


public class FiltroUsuario implements Serializable {

    private String nome;
    private String login;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }
}
