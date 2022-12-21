import { AxiosResponse } from 'axios';
import StateApi from '../api/state-api';
import { isResponseSuccess } from '../util/api-utils';

class StateService {
    static getAllStates = async () => {
        try {
            const result: AxiosResponse = await StateApi.getAllStates();
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

export default StateService;
