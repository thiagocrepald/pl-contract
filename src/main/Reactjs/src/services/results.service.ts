import { AxiosResponse } from 'axios';
import { Result } from '../model/result';
import ResultApi from '../api/result.api';
import StatusCode from 'http-status-codes';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class ResultService {
    static getAllResults = async (pageable: Pageable, predicate: Predicate): Promise<PageableResponse<Result>> => {
        try {
            const result: AxiosResponse<PageableResponse<Result>> = await ResultApi.getAllResults(pageable, predicate);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getAllResults');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllResults');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getResult = async (id: number): Promise<Result> => {
        try {
            const result: AxiosResponse<Result> = await ResultApi.getResult(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getResult');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getResult');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static createResult = async (results: Result): Promise<Result> => {
        try {
            const result: AxiosResponse<Result> = await ResultApi.createResult(results);
            if (isResponseSuccess(result.data != null, result.status, StatusCode.CREATED)) {
                ToastUtils.emitSuccessToast('createResult');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('createResult');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('createResult');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateResult = async (results: Result): Promise<Result> => {
        try {
            const result: AxiosResponse<Result> = await ResultApi.updateResult(results);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateResult');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updateResult');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateResult');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static deleteResult = async (id: number): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await ResultApi.deleteResult(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('deleteResult');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('deleteResult');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('deleteResult');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static activateResult = async (id: number): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await ResultApi.activateResult(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('activateResult');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('activateResult');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('activateResult');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default ResultService;