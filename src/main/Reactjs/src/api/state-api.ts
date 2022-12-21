import { AxiosResponse } from 'axios';
import { PageableResponse } from '../model/pageable';
import { State } from '../model/state';
import { api } from './api.new';

class StateApi {
    static getAllStates = (): Promise<AxiosResponse<PageableResponse<State>>> => {
        return api.get<PageableResponse<State>>('/states?size=27');
    };
}

export default StateApi;
