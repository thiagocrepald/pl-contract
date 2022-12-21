import { AxiosResponse } from 'axios';
import { Hired } from '../model/hired';
import { api as apiNew } from './api.new';

class HiredApi {

    static getAllActivated = (): Promise<AxiosResponse<Hired[]>> => {
        return apiNew.get<Hired[]>(`/hires/activated`);
    };
    
    static inactive = (id: number): Promise<AxiosResponse<void>> => {
        return apiNew.patch<void>(`/hires/activate/${id}`);
    };

    static create = (hired: Hired): Promise<AxiosResponse<Hired>> => {
        return apiNew.post<Hired>('/hires', hired);
    };

    static update = (hired: Hired): Promise<AxiosResponse<Hired>> => {
        return apiNew.put<Hired>('/hires', hired);
    };
}

export default HiredApi;
