import { AxiosResponse } from 'axios';
import { Contract } from '../model/contract';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { ServiceType } from '../model/service-type';
import { requestParamsFormatter } from '../util/api-utils';
import { api } from './api';
import { api as apiNew } from './api.new';

class ContractApi {
    static getAllContracts = (pageable: Pageable, predicate: Predicate): Promise<AxiosResponse<PageableResponse<Contract>>> => {
        const [pageParams, filterParams] = requestParamsFormatter(pageable, predicate);
        return apiNew.get<PageableResponse<Contract>>('/contracts' + (pageParams ? `?${pageParams}` : '') + '&sort=status,asc' + (filterParams ? `&${filterParams}` : '')); 
    };

    static getContract = (id: number): Promise<AxiosResponse<Contract>> => {
        return apiNew.get<Contract>(`/contracts/${id}`);
    };

    static createContract = (contract: Contract): Promise<AxiosResponse<Contract>> => {
        return apiNew.post<Contract>('/contracts', contract);
    };

    static updateContract = (contract: Contract): Promise<AxiosResponse<Contract>> => {
        return apiNew.put<Contract>('/contracts', contract);
    };

    static deleteContract = (id: number): Promise<AxiosResponse<void>> => {
        return apiNew.delete(`/contracts/${id}`);
    };

    static activateContract = (id: number): Promise<AxiosResponse<void>> => {
        return apiNew.patch<void>(`/contracts/activate/${id}`);
    };

    static getAllServicesTypes = (predicate?: string): Promise<AxiosResponse<PageableResponse<ServiceType>>> => {
        return apiNew.get<PageableResponse<ServiceType>>(`/service-types?${predicate}`);
    };

    static getAllActivatedServicesTypes = (): Promise<AxiosResponse<ServiceType[]>> => {
        return apiNew.get<ServiceType[]>(`/service-types/activated`);
    };
    
    static inactiveServicesType = (id: number): Promise<AxiosResponse<void>> => {
        return apiNew.patch<void>(`/service-types/activate/${id}`);
    };

    static createServiceType = (serviceType: ServiceType): Promise<AxiosResponse<ServiceType>> => {
        return apiNew.post<ServiceType>('/service-types', serviceType);
    };

    static updateServiceType = (serviceType: ServiceType): Promise<AxiosResponse<ServiceType>> => {
        return apiNew.put<ServiceType>('/service-types', serviceType);
    };

    static getUsers = (): Promise<AxiosResponse> => {
        return api.post('/usuario/listar');
    };

    static getDoctors = (): Promise<AxiosResponse> => {
        return api.post('/medico/listar');
    };
}

export default ContractApi;
