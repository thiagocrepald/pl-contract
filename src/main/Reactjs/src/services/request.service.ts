import { Predicate } from '../model/predicate';
import { Pageable, PageableResponse } from '../model/pageable';
import { PredicateOperators } from '../model/predicate-operators';
import { IRequest, IRequestStatusChange, IRequestPendingStatusChange } from '../model/request';
import { AxiosResponse } from 'axios';
import RequestApi from '../api/request.api';
import StatusCode from 'http-status-codes';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class RequestService {
    static getAllRequests = async (predicate: Predicate, pageable: Pageable, predicateOperators?: PredicateOperators[]): Promise<PageableResponse<IRequest>> => {
        try {
            const result: AxiosResponse<PageableResponse<IRequest>> = await RequestApi.getAllRequests(predicate, pageable, predicateOperators);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getAllRequests');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllRequests');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static createRequest = async (request: IRequest): Promise<IRequest> => {
        try {
            const result: AxiosResponse<IRequest> = await RequestApi.createRequest(request);
            if (isResponseSuccess(result.data != null, result.status, StatusCode.CREATED)) {
                ToastUtils.emitSuccessToast('createRequest');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('createRequest');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('createRequest');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateRequest = async (request: IRequest): Promise<IRequest> => {
        try {
            const result: AxiosResponse<IRequest> = await RequestApi.updateRequest(request);
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

    static resolveRequest = async (request: IRequest): Promise<IRequest> => {
        try {
            const result: AxiosResponse<IRequest> = await RequestApi.resolveRequest(request);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('resolveRequest');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('resolveRequest');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('resolveRequest');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static changeStatus = async (data: IRequestStatusChange): Promise<IRequest> => {
        try {
            const result: AxiosResponse<IRequest> = await RequestApi.changeStatus(data);
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

export default RequestService;
