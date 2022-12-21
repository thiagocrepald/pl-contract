/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.plantaomais.util;

/**
 * @author Juliano A. Felipe
 *         <p/>
 *         Classe com as mensagens de Sucesso e Erro que serão enviados para o Flex.
 */
public class Info {

    /**
     * ***********************************************************************
     */
    /**
     * ***************** Constantes com os códigos dos erros HTML5
     * *****************
     */
    public static String TIPO_MSG_WARNING = "warning";
    public static String TIPO_MSG_DANGER = "danger";
    public static String TIPO_MSG_SUCCESS = "success";

    /**
     * ***********************************************************************
     */
    /**
     * Atributos da classe *
     */
    private String mensagem;
    private Boolean erro;
    private Integer idObjetoSalvo;
    private String tipo;
    private Object objeto;
    private String command;

    /**
     * Construtor
     */
    public Info() {

    }

    public Info(boolean erro, String mensagem, Object objeto) {
        this.erro = erro;
        if (erro) {
            this.tipo = Info.TIPO_MSG_DANGER;
            this.mensagem = mensagem;
        } else {
            this.tipo = Info.TIPO_MSG_SUCCESS;
            this.mensagem = mensagem;
        }
        this.objeto = objeto;
    }

    public static boolean IsSuccess(Info info) {
        return info != null && info.getErro() == null;
    }

    public static Info GetSuccess() {
        return new Info(false, "", null);
    }

    public static Info GetSuccess(String mensagem) {
        return new Info(false, mensagem, null);
    }

    public static Info GetSuccess(Object obj) {
        return new Info(false, "", obj);
    }

    public static Info GetSuccess(String msg, Object obj) {
        return new Info(false, msg, obj);
    }

    public static Info GetError(String msg) {
        return new Info(true, msg, null);
    }

    public static Info GetError(String msg, Object obj) {
        return new Info(true, msg, obj);
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public Boolean getErro() {
        if(tipo == TIPO_MSG_DANGER){
            erro = true;
        }else{
            erro= false;
        }

        return erro;

    }

    public void setErro(Boolean erro) {
        this.erro = erro;
    }

    public Integer getIdObjetoSalvo() {
        return idObjetoSalvo;
    }

    public void setIdObjetoSalvo(Integer idObjetoSalvo) {
        this.idObjetoSalvo = idObjetoSalvo;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Object getObjeto() {
        return objeto;
    }

    public void setObjeto(Object objeto) {
        this.objeto = objeto;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }
}
