import UtilService from './util.service';

class EscalaService {
    static listar = (ativo, dataInicio, dataFim,codContrato) => {
        return UtilService.post(`escala/listar?${ativo != null ? `ativo=${ativo}&` : ''}${dataInicio != null ? `dataInicio=${dataInicio}&` : ''}${dataFim != null ? `dataFim=${dataFim}&` : ''}${codContrato != null ? `contractId=${codContrato}&` : ''}
        `);
    };

    static salvar = escalaVo => {
        return UtilService.post('escala/salvar/', escalaVo);
    };

    static salvarLista = lista => {
        return UtilService.post('escala/salvar/lista/', lista);
    };

    static getById = escalaVo => {
        return UtilService.post('escala/getById/', escalaVo);
    };

    static listarEscalaPlantao = escalaVo => {
        return UtilService.post('escala/listarEscalaPlantao/', escalaVo);
    };

    static excluir = escalaVo => {
        return UtilService.post('escala/excluir/', escalaVo);
    };

    static listarComboEspecialidade = () => {
        return UtilService.post('especialidade/listar/');
    };

    static listarComboSetor = () => {
        return UtilService.post('setor/listar/');
    };

    static excluirEscalaPlantao = plantaoVo => {
        return UtilService.post('plantao/excluirPlantao/', plantaoVo);
    };

    static salvarSetor = setorVo => {
        return UtilService.post('setor/salvar/', setorVo);
    };

    static salvarEspecialidade = especialidadeVo => {
        return UtilService.post('especialidade/salvar/', especialidadeVo);
    };

    static listarComboEscala = () => {
        return UtilService.post('escala/listarComboEscala/');
    };

    static replicarEscala = escalaVo => {
        return UtilService.post('escala/replicarEscala/', escalaVo);
    };

    static notifyMedics = escalaVo => {
        return UtilService.post(`escala/${escalaVo.id}/notify-medics`, escalaVo);
    };

    static divulgarPlantoesEscala = escalaVo => {
        return UtilService.post('escala/divulgarPlantoesEscala/', escalaVo);
    };

    static compartilharPlantoesEscala = (idEscala: number) => {
        return UtilService.get(`plantaoApp/escala/gerarUrl?escalaId=${idEscala}`);
    };

    static compartilharPlantao = (idPlantao: number) => {
        return UtilService.get(`plantaoApp/plantao/escalista/gerarUrl?plantaoId=${idPlantao}`);
    };
}

export default EscalaService;
