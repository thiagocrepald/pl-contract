import { AxiosResponse } from 'axios';
import CityApi from '../api/city-api';
import { isResponseSuccess } from '../util/api-utils';

class CityService {
    static getAllCities = async (id: number) => {
        try {
            const result: AxiosResponse = await CityApi.getAllCities(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);  
            }
            return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            
        } catch (error) {
            console.error(error);
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default CityService;
