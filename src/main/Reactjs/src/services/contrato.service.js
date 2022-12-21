import UtilService from "./util.service";

class ContratoService {

    static listar = filtro =>{
        return UtilService.post('contracts');
    };

    static getById = contratoVo =>{
        return UtilService.post('contrato/getById/', contratoVo);
    };

    static salvar = contratoVo =>{
        return UtilService.post('contrato/salvar/', contratoVo);
    };

    static excluir = contratoVo =>{
        return UtilService.post('contrato/excluir/', contratoVo);
    };

    static possuiEscala = contratoVo =>{
        return UtilService.post('contrato/possuiEscala/', contratoVo);
    };

    static listarComboTipoServico = () =>{
        return UtilService.post('tipoServico/listar/');
    };

    static salvarTipoServico = tipoServico =>{
        return UtilService.post('tipoServico/salvar/', tipoServico);
    };

    static ativarContrato = contratoVo =>{
        return UtilService.post('contrato/ativarContrato/', contratoVo);
    };

    // static carregaCombos = () =>{
    //     Api.all([
    //         Api.post('contratante/listar'),
    //         Api.post('tipoServico/listar/')
    //     ]).then(Api.spread((googleRes, appleRes) => {
    //         return {response: {googleRes, appleRes}};
    //     }));
    // };

}

export default ContratoService;