import { AxiosResponse } from 'axios';
import { AccessControl } from '../model/access-control';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { requestParamsFormatter } from '../util/api-utils';
import { api } from './api.new';
import { PredicateOperators } from '../model/predicate-operators';
import { requestPredicateOperatorsFormatter } from '../util/predicate-operators-utils';
import { IRequestPendingStatusChange } from '../model/request';

class AccessControlApi {
    static getAllAccessControls = (predicate: Predicate, page: Pageable, predicateOperators?: PredicateOperators[]): Promise<AxiosResponse<PageableResponse<AccessControl>>> => {
        const operators = requestPredicateOperatorsFormatter(predicateOperators);
        const [pageParams, filterParams] = requestParamsFormatter(page, predicate);
        return api.get<PageableResponse<AccessControl>>(`/access-controls?${pageParams}&${filterParams}&${operators}`);
    };

    static getAccessControl = (id: number): Promise<AxiosResponse<AccessControl>> => {
        return api.get<AccessControl>(`/access-controls/${id}`);
    };

    static createAccessControl = (accessControl: AccessControl): Promise<AxiosResponse<AccessControl>> => {
        return api.post<AccessControl>('/access-controls', accessControl);
    };

    static changePendingStatus = (data: IRequestPendingStatusChange): Promise<AxiosResponse<AccessControl>> => {
        return api.patch<AccessControl>('/access-controls/change-status', data);
    };

    static changeToCompletedStatus = (id: number): Promise<AxiosResponse<AccessControl>> => {
        return api.patch<AccessControl>(`/access-controls/complete-access/${id}`);
    };
}

export default AccessControlApi;
