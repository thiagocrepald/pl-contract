import { AxiosResponse } from 'axios';
import { Result } from '../model/result';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { requestParamsFormatter } from '../util/api-utils';
import { api } from './api';

class ResultApi {
    static getAllResults = (pageable: Pageable, predicate: Predicate): Promise<AxiosResponse<PageableResponse<Result>>> => {
        const [pageParams, filterParams] = requestParamsFormatter(pageable, predicate);
        if (filterParams) {
            return api.get<PageableResponse<Result>>(`/results/${pageParams}&${filterParams}`);
        }
        return api.get<PageableResponse<Result>>(`/results/${pageParams}`);
    };

    static getResult = (id: number): Promise<AxiosResponse<Result>> => {
        return api.get<Result>(`/results/${id}`);
    };

    static createResult = (result: Result): Promise<AxiosResponse<Result>> => {
        return api.post<Result>('/results', result);
    };

    static updateResult = (result: Result): Promise<AxiosResponse<Result>> => {
        return api.put<Result>('/results', result);
    };

    static deleteResult = (id: number): Promise<AxiosResponse<void>> => {
        return api.delete(`/results/${id}`);
    };

    static activateResult = (id: number): Promise<AxiosResponse<void>> => {
        return api.put<void>(`/results/activate-deactivate/${id}`);
    };
}

export default ResultApi;