import { AxiosResponse } from 'axios';
import StatusCode from 'http-status-codes';
import HiredApi from '../api/hired.api';
import { Hired } from '../model/hired';
import { ServiceType } from '../model/service-type';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class HiredService {
    static getAllActivated = async () => {
        try {
            const result: AxiosResponse = await HiredApi.getAllActivated();
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllActivated');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static inactive = async (id: number) => {
        try {
            const result: AxiosResponse = await HiredApi.inactive(id);
            if (isResponseSuccess(true, result.status)) {
                return Promise.resolve(result.data);
            }
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('inactive');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static create = async (hired: ServiceType): Promise<Hired> => {
        try {
            const result: AxiosResponse<ServiceType> = await HiredApi.create(hired);
            if (isResponseSuccess(result.data != null, result.status, StatusCode.CREATED)) {
                return Promise.resolve(result.data);
            }
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('create');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static update = async (hired: Hired): Promise<Hired> => {
        try {
            const result: AxiosResponse<ServiceType> = await HiredApi.update(hired);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('update');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default HiredService;


