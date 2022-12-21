import UtilService from "./util.service";

class LoginService {

    static login = usuarioVo => {
        if (!!usuarioVo) {
            return UtilService.post('auth/login/', usuarioVo);
        }
    };


}

export default LoginService;