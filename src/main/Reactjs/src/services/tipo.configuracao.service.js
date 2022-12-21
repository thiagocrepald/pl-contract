import UtilService from "./util.service";

class TipoConfiguracaoService {

    static listarComboTipoConfiguracao = () => {
        return UtilService.post('tipoConfiguracao/listarComboTipoConfiguracao');
    };

}
export default TipoConfiguracaoService;

