import UtilService from './util.service';

class PreferencesMedicUtilsService {

    static weekdays = () => {
        return UtilService.get('utils/weekdays');
    };

    static periodo = () => {
        return UtilService.get('utils/periodo');
    };

    static setor = () => {
        return UtilService.get('utils/setor');
    };

    static locality = () => {
        return UtilService.get('utils/locality');
    };
}

export default PreferencesMedicUtilsService;