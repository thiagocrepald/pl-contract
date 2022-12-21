import { AxiosResponse } from 'axios';
import { City } from '../model/city';
import { PageableResponse } from '../model/pageable';
import { api } from './api.new';

class CityApi {
    static getAllCities = (id: number): Promise<AxiosResponse<PageableResponse<City>>> => {
        return api.get<PageableResponse<City>>(`cities?state.id=${id}&size=855`);
    };
}

export default CityApi;
