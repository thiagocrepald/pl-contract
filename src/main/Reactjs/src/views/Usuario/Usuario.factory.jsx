import React from "react";
import UtilService from "../../services/util.service";

class UsuarioFactory extends React.Component{


    //Function que recupera o usuario logado
    static getUsuarioLogado(){

        if (!localStorage.getItem("_wt_usr")){
            return null;
        }
        let usuario = UtilService.base64decode(localStorage.getItem("_wt_usr"));
        usuario = JSON.parse(usuario);
        return usuario;
    }

    static getTokenUsuario(){
        if (!localStorage.getItem("_wt_token")){
            return null;
        }
        return localStorage.getItem("_wt_token");
    }

}

export default UsuarioFactory;
