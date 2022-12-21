import { AxiosResponse } from 'axios';
import { Pageable, PageableResponse } from '../model/pageable';
import { PredicateOperators } from '../model/predicate-operators';
import { IAdminReport } from '../model/admin-report';
import { Predicate } from '../model/predicate';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';
import AdminReportApi from '../api/admin-report.api';

class AdminReportService {
    static getAllAdminReportData = async (
        predicate: Predicate,
        pageable: Pageable,
        isOnCallsWithDoctor: boolean,
        orderByFields?: string[],
        orderType?: string,
        predicateOperators?: PredicateOperators[]
    ): Promise<PageableResponse<IAdminReport>> => {
        try {
            const result: AxiosResponse<PageableResponse<IAdminReport>> = await AdminReportApi.getAllAdminReportData(
                predicate,
                pageable,
                isOnCallsWithDoctor,
                orderByFields,
                orderType,
                predicateOperators
            );
            if (!isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitErrorToast('getAllAdminReportData');
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllAdminReportData');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

}

export default AdminReportService;
