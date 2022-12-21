import { AxiosResponse } from 'axios';
import { Company } from '../model/company';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { requestParamsFormatter } from '../util/api-utils';
import { api as apiNew } from './api.new';

class CompanyApi {

    static getAllCompanies = (pageable: Pageable, predicate: Predicate): Promise<AxiosResponse<PageableResponse<Company>>> => {
        const [pageParams, filterParams] = requestParamsFormatter(pageable, predicate);
        return apiNew.get<PageableResponse<Company>>('/company-data' + (pageParams ? `?${pageParams}` : '') + (filterParams ? `&${filterParams}` : ''));
    };

    static getCompany = (id: number): Promise<AxiosResponse<Company>> => {
        return apiNew.get<Company>(`/company-data/${id}`);
    };

    static createCompany = (company: Company): Promise<AxiosResponse<Company>> => {
        return apiNew.post<Company>('/company-data', company);
    };

    static updateCompany = (company: Company): Promise<AxiosResponse<Company>> => {
        return apiNew.put<Company>('/company-data', company);
    };

    static deleteCompany = (id: number): Promise<AxiosResponse<void>> => {
        return apiNew.delete(`/company-data/${id}`);
    };

    static activateCompany = (id: number): Promise<AxiosResponse<void>> => {
        return apiNew.patch<void>(`/company-data/activate/${id}`);
    };
}

export default CompanyApi;