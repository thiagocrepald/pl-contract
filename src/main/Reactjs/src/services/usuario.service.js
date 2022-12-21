import UtilService from './util.service';

class UsuarioService {

    static usuario = usuarioVo => {
        return UtilService.post('usuario/', usuarioVo);
    };

    static getById = usuarioVo => {
        return UtilService.post('usuario/getById/', usuarioVo);
    };

    static salvar = usuarioVo =>  {
        return UtilService.post('usuario/salvar/', usuarioVo);
    };

    static listar = filtro => {
        return UtilService.post('usuario/listar/', filtro);
    };

    static listarTipoPermissao() {
        return UtilService.post('usuario/listarTipoPermissao/');
    };

    static excluir = usuarioVo => {
        return UtilService.post('usuario/excluir/', usuarioVo);
    }

    static salvarSenhaExclusaoEscala = (id, password) => {
        return UtilService.put('usuario/salvarSenhaExclusaoEscala?id=' + id + '&password=' + password);
    }

    static verificaSenhaExclusaoEscala = (id, password) => {
        return UtilService.get('usuario/verificaSenhaExclusaoEscala?id=' + id + '&password=' + password);
    }
}

export default UsuarioService;