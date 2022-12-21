import { AxiosResponse } from 'axios';
import { Pageable, PageableResponse } from '../model/pageable';
import { PredicateOperators } from '../model/predicate-operators';
import { Predicate } from '../model/predicate';
import { OnCall } from '../model/on-call';
import { requestParamsFormatter } from '../util/api-utils';
import { requestPredicateOperatorsFormatter } from '../util/predicate-operators-utils';
import { api } from './api.new';

class OnCallApi {
    
    static getOnCall = (onCallId: number): Promise<AxiosResponse<OnCall>> => {
        return api.get<OnCall>(`/on-calls/${onCallId}`);
    };

    static getAllOnCalls = (predicate: Predicate, page: Pageable, predicateOperators?: PredicateOperators[]): Promise<AxiosResponse<PageableResponse<OnCall>>> => {
        const operators = requestPredicateOperatorsFormatter(predicateOperators);
        const [pageParams, filterParams] = requestParamsFormatter(page, predicate);
        return api.get<PageableResponse<OnCall>>(`/on-calls?${pageParams}&${filterParams}&${operators}`);
    };

    static getSearchedOnCalls = (predicate: Predicate, page: Pageable, predicateOperators?: PredicateOperators[]): Promise<AxiosResponse<PageableResponse<OnCall>>> => {
        const operators = requestPredicateOperatorsFormatter(predicateOperators);
        const [pageParams, filterParams] = requestParamsFormatter(page, predicate);
        return api.get<PageableResponse<OnCall>>(`/on-calls/search?${pageParams}&${filterParams}`);
    };
      
}

export default OnCallApi;
