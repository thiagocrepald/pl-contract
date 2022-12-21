import { api } from '../api/api';
import ResetPasswordApi from '../api/resetPassword.api';

interface PropsPass {
    email?: string;
    login?: string;
    senha: string;
    resetKey: string;
}

class ResetPasswordService {
    static sendEmail = async (email: string) => {
        try {
            const response = await ResetPasswordApi.sendEmail(email);
            return response;
        } catch (e) {
            return e;
        }
    };

    static changePass = async (infos: PropsPass) => {
        try {
            if (infos.login) {
                const response = await ResetPasswordApi.changePassAdmin(infos);
                return response;
            }
            if (infos.email) {
                const response = await ResetPasswordApi.changePassDoctor(infos);
                return response;
            }
        } catch (e) {
            return e;
        }
    };
}

export default ResetPasswordService;
