import UtilService from "./util.service";

class GestaoEscalaService {

    static listaLayoutEscala = filtro => {
        return UtilService.post('gestaoEscala/listaLayoutEscala', filtro);
    };

    static gerarExcel = filtro => {
        return UtilService.post('gestaoEscala/gerarExcel', filtro);
    };

    static atualizaPlantaoGestaoEscala = plantaoVo => {
        return UtilService.post('plantao/atualizaPlantaoGestaoEscala', plantaoVo);
    };

    static adicionarMedicoPlantao = plantaoVo => {
        return UtilService.post('plantao/adicionarMedicoPlantao', plantaoVo);
    };

    static listarCandidatosPlantao = plantaoVo => {
        return UtilService.post('gestaoEscala/listaCanditadosPlantao', plantaoVo);
    };

    static aceitaMedico = plantaoVo => {
        return UtilService.post('gestaoEscala/aceitaMedico', plantaoVo);
    };
    static recusaMedico = id => {
        return UtilService.post(`gestaoEscala/recusaMedico?candidatos=${id}`);
    };
    

}

export default GestaoEscalaService;
