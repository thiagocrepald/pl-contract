import UtilService from './util.service';

class ContratanteService {

    static listar = filtro =>{
        return UtilService.post('contratante/listar', filtro);
    };

    static getById = contratanteVo =>{
        return UtilService.post('contratante/getById/', contratanteVo);
    };

    static salvar = contratanteVo =>{
        return UtilService.post('contratante/salvar/', contratanteVo);
    };

    static excluir = contratanteVo =>{
        return UtilService.post('contratante/excluir/', contratanteVo);
    };
    static ativarContratante = contratanteVo =>{
        return UtilService.post('contratante/ativarContratante/', contratanteVo);
    };
}

export default ContratanteService;