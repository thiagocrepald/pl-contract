import { api } from "./api"

interface PropsPass {
    email?: string;
    login?: string;
    senha: string;
    resetKey: string;
}

interface Response {
    erro: string,
    mensagem: string,
    tipo: string
}

export default class ResetPasswordApi {
    static sendEmail = async (email: string) => {
        return api.post<Response>('/auth/enviarEmailAtualizarSenhaAdmin', { email });
    }

    static changePassAdmin = async (infos: PropsPass) => {
        return api.post<string>('/auth/atualizarSenhaAdmin', infos);
    }

    static changePassDoctor = async (infos: PropsPass) => {
        return api.post<string>('/auth/atualizarSenha', infos);
    }
}