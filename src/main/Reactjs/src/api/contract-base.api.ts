import { AxiosResponse } from 'axios';
import { IBase, IBaseUpdate } from '../model/contract-base';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { requestParamsFormatter } from '../util/api-utils';
import { api as apiNew } from './api.new';
import { PredicateOperators } from '../model/predicate-operators';
import { requestPredicateOperatorsFormatter } from '../util/predicate-operators-utils';

class ContractBaseApi {
    static getAllBases = (id: number, predicate: Predicate, pageable: Pageable, predicateOperators?: PredicateOperators[]): Promise<AxiosResponse<PageableResponse<IBase>>> => {
        const operators = requestPredicateOperatorsFormatter(predicateOperators);
        const [pageParams, filterParams] = requestParamsFormatter(pageable, predicate);
        return apiNew.get<PageableResponse<IBase>>(`/bases/contracts/${id}?${pageParams}&${filterParams}&${operators}`);
    };

    static updateBase = (base: IBaseUpdate): Promise<AxiosResponse<IBase>> => {
        return apiNew.put<IBaseUpdate>('/bases', base);
    };
}

export default ContractBaseApi;
