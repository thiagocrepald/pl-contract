import { AxiosResponse } from 'axios';
import { PredicateOperators } from '../model/predicate-operators';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { OnCall } from '../model/on-call';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';
import OnCallApi from '../api/on-call.api';

class OnCallService {
    
    static getOnCall = async (id: number): Promise<OnCall> => {
        try {
            const result: AxiosResponse<OnCall> = await OnCallApi.getOnCall(id);
            if (!isResponseSuccess(result.data != null, result.status)) {
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            return Promise.reject(error.response as AxiosResponse);
        }
    };
    
    static getAllOnCalls = async (predicate: Predicate, pageable: Pageable, predicateOperators?: PredicateOperators[]): Promise<PageableResponse<OnCall>> => {
        try {
            const result: AxiosResponse<PageableResponse<OnCall>> = await OnCallApi.getAllOnCalls(predicate, pageable, predicateOperators);
            if (!isResponseSuccess(result.data != null, result.status)) {
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getOnCalls');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getSearchedOnCalls = async (predicate: Predicate, pageable: Pageable, predicateOperators?: PredicateOperators[]): Promise<PageableResponse<OnCall>> => {
        try {
            const result: AxiosResponse<PageableResponse<OnCall>> = await OnCallApi.getSearchedOnCalls(predicate, pageable, predicateOperators);
            if (!isResponseSuccess(result.data != null, result.status)) {
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getOnCalls');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default OnCallService;
