import UtilService from "./util.service";

class ContratoAnexoService {

    static getById = contratoAnexoId =>{
        return UtilService.get(`contratoAnexo/getById?id=${contratoAnexoId}`);
    };

}

export default ContratoAnexoService;