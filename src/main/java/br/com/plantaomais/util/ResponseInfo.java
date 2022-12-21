/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.plantaomais.util;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

/**
 * @author Juliano A. Felipe
 *         <p/>
 *         Classe com as mensagens de Sucesso e Erro que serão enviados para o Flex.
 */

@Getter
@Setter
public class ResponseInfo<T> {

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
    private T objeto;
    private String command;

    /**
     * Construtor
     */
    public ResponseInfo() {
    }

    public ResponseInfo(boolean erro, String mensagem, T objeto) {
        this.erro = erro;
        if (erro) {
            this.tipo = ResponseInfo.TIPO_MSG_DANGER;
            this.mensagem = mensagem;
        } else {
            this.tipo = ResponseInfo.TIPO_MSG_SUCCESS;
            this.mensagem = mensagem;
        }
        this.objeto = objeto;
    }

    public boolean IsSuccess(ResponseInfo<T> info) {
        return info != null && info.getErro() == null;
    }

    public ResponseInfo<T> success() {
        return new ResponseInfo<T>(false, "", null);
    }

    public ResponseInfo<T> success(String mensagem) {
        return new ResponseInfo<T>(false, mensagem, null);
    }

    public ResponseInfo<T> success(T obj) {
        return new ResponseInfo<T>(false, "", obj);
    }

    public ResponseInfo<T> success(String msg, T obj) {
        return new ResponseInfo<T>(false, msg, obj);
    }

    public ResponseInfo<T> error(String msg) {
        return new ResponseInfo<T>(true, msg, null);
    }

    public ResponseInfo<T> error(String msg, T obj) {
        return new ResponseInfo<T>(true, msg, obj);
    }

    public Boolean getErro() {
        if(Objects.equals(tipo, TIPO_MSG_DANGER)){
            erro = true;
        }else{
            erro= false;
        }

        return erro;

    }

}
