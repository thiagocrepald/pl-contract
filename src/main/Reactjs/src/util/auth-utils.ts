import jwt_decode from 'jwt-decode';
import { AUTHORITIES } from '../config/constants';
import UsuarioFactory from '../views/Usuario/Usuario.factory';
import { User } from '../model/user';

class AuthUtils {
    static AUTH_TOKEN_KEY = '_wt_token';

    static isUser = () => {
        const token = AuthUtils.getToken();
        if (token != null && token.trim() !== '') {
            // @ts-ignore
            return jwt_decode(token).auth.includes(AUTHORITIES.USER);
        }
        return false;
    }

    static isAdmin = () => {
        const token = AuthUtils.getToken();
        if (token != null && token.trim() !== '') {
            // @ts-ignore
            return jwt_decode(token).auth.includes(AUTHORITIES.ADMIN);
        }
        return false;
    }

    static isFgs = () => {
        return AuthUtils.isAdmin() || AuthUtils.isUser();
    }

    static getToken = () => {
        return localStorage.getItem(AuthUtils.AUTH_TOKEN_KEY);
    }

    static setToken = (token: string) => {
        localStorage.setItem(AuthUtils.AUTH_TOKEN_KEY, token);
    }

    static removeToken = () => {
        localStorage.removeItem(AuthUtils.AUTH_TOKEN_KEY);
    }

    static userHasPermission = (permissionId: number) => {
        let hasPermission = false;
        const loggedUser = UsuarioFactory.getUsuarioLogado() as any;
        loggedUser?.listaUsuarioTipoPermissao?.forEach(item => {
            if (item.tipoPermissao?.id === permissionId) hasPermission = true;
        });
        return hasPermission;
    }

    static getLoggedUser= () => {
        const token = AuthUtils.getToken();
        let user: User = {};

        if (token != null) {
            user = jwt_decode(token);
        }

        return user;
    }
}

export default AuthUtils;
