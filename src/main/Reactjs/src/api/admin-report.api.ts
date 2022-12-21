import { AxiosResponse } from 'axios';
import { IAdminReport } from '../model/admin-report';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { Schedule } from '../model/schedule';
import { requestParamsFormatter } from '../util/api-utils';
import { api } from './api.new';
import { PredicateOperators } from '../model/predicate-operators';
import { requestPredicateOperatorsFormatter } from '../util/predicate-operators-utils';

class AdminReportApi {
    static getAllAdminReportData = (
        predicate: Predicate,
        page: Pageable,
        isOnCallsWithDoctor: boolean,
        orderByFields?: string[], 
        orderType?: string, 
        predicateOperators?: PredicateOperators[]
    ): Promise<AxiosResponse<PageableResponse<IAdminReport>>> => {
        const operators = requestPredicateOperatorsFormatter(predicateOperators);
        const [pageParams, filterParams] = requestParamsFormatter(page, predicate);
        return api.get<PageableResponse<IAdminReport>>(
                `/contract-report?onCallsWithDoctor=${isOnCallsWithDoctor}&${pageParams}&${filterParams}&${operators}orderByFields=${orderByFields ?? ""}&orderType=${orderType ?? ""}`
        );
    };

    // static getAdminReport = (id: number): Promise<AxiosResponse<IAdminReport>> => {
    //     return api.get<IAdminReport>(`/contract-report/${id}`);
    // };

    // static createAdminReport = (accessControl: IAdminReport): Promise<AxiosResponse<IAdminReport>> => {
    //     return api.post<IAdminReport>('/contract-report', accessControl);
    // };

}

export default AdminReportApi;
