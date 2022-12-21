import UtilService from "./util.service";

class IndicadoresService {

    static criarIndicadores = (filtro) => {
            return UtilService.post('indicadores/criarIndicadores/', filtro);
    };

    static profissionaisMaisAtivos = (filtro) => {
        return UtilService.post('indicadores/profissionaisMaisAtivos/', filtro);
    };

    static criarIndicadorGestaoEscala = (filtro) => {
        return UtilService.post('indicadores/criarIndicadoGestaoEscala/', filtro);
    };

    static criarIndicadorPoporcaoSexo = (filtro) => {
        return UtilService.post('indicadores/criarIndicadorPoporcaoSexo/', filtro);
    };


}

export default IndicadoresService;
