import UtilService from "./util.service";

class FechamentoService {

    static listar = filtroFechamento =>{
        return UtilService.post('fechamento/listar', filtroFechamento);
    };

    static gerarExcel = filtroFechamento =>{
        return UtilService.post('fechamento/gerarExcel', filtroFechamento);
    };
}

export default FechamentoService;