import UtilService from './util.service';

class AddressService {

    static states = () => {
        return UtilService.get('states');
    };

    static cities = ( params ) => {
        return UtilService.get('cities', { params });
    };
    
}

export default AddressService;