import { AxiosResponse } from 'axios';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { requestParamsFormatter } from '../util/api-utils';
import { api } from './api.new';
import { PredicateOperators } from '../model/predicate-operators';
import { requestPredicateOperatorsFormatter } from '../util/predicate-operators-utils';
import { IRequest, IRequestStatusChange } from '../model/request';

class RequestApi {
    static getAllRequests = (predicate: Predicate, page: Pageable, predicateOperators?: PredicateOperators[]): Promise<AxiosResponse<PageableResponse<IRequest>>> => {
        const operators = requestPredicateOperatorsFormatter(predicateOperators);
        const [pageParams, filterParams] = requestParamsFormatter(page, predicate);
        return api.get<PageableResponse<IRequest>>(`/requests?${pageParams}&${filterParams}&${operators}`);
    };

    static createRequest = (request: IRequest): Promise<AxiosResponse<IRequest>> => {
        return api.post<IRequest>('/requests', request);
    };

    static updateRequest = (request: IRequest): Promise<AxiosResponse<IRequest>> => {
        return api.put<IRequest>('/requests', request);
    };

    static resolveRequest = (request: IRequest): Promise<AxiosResponse<IRequest>> => {
        return api.patch<IRequest>('/requests/resolve', request);
    };

    static changeStatus = (data: IRequestStatusChange): Promise<AxiosResponse<IRequest>> => {
        return api.patch<IRequest>('/requests/change-status', data);
    };
}

export default RequestApi;
