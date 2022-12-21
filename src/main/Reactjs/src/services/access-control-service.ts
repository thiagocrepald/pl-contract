import { Predicate } from '../model/predicate';
import { Pageable, PageableResponse } from '../model/pageable';
import { PredicateOperators } from '../model/predicate-operators';
import { AccessControl } from '../model/access-control';
import { IRequestPendingStatusChange } from '../model/request';
import { AxiosResponse } from 'axios';
import AccessControlApi from '../api/access-control.api';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class AccessControlService {
    static getAllAccessControls = async (predicate: Predicate, pageable: Pageable, predicateOperators?: PredicateOperators[]): Promise<PageableResponse<AccessControl>> => {
        try {
            const result: AxiosResponse<PageableResponse<AccessControl>> = await AccessControlApi.getAllAccessControls(predicate, pageable, predicateOperators);
            if (!isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitErrorToast('getAllAccessControls');
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllAccessControls');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getAccessControl = async (id: number): Promise<AccessControl> => {
        try {
            const result: AxiosResponse<AccessControl> = await AccessControlApi.getAccessControl(id);
            if (!isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitErrorToast('getAccessControl');
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAccessControl');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static changePendingStatus = async (data: IRequestPendingStatusChange): Promise<AccessControl> => {
        try {
            const result: AxiosResponse<AccessControl> = await AccessControlApi.changePendingStatus(data);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateRequest');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updateRequest');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateRequest');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static changeToCompletedStatus = async (id: number): Promise<AccessControl> => {
        try {
            const result: AxiosResponse<AccessControl> = await AccessControlApi.changeToCompletedStatus(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateRequest');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updateRequest');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateRequest');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default AccessControlService;
