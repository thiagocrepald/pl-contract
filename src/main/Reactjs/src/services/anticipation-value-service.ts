import { AxiosResponse } from 'axios';
import AnticipationValueApi from '../api/anticipation-value.api';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';
import { Pageable } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { AnticipationValueType } from '../model/anticipation-value-type';
import StatusCode from 'http-status-codes';

class AnticipationValueService {
    static getAnticipationValue = async (pageable: Pageable, predicate: Predicate) => {
        try {
            const result: AxiosResponse = await AnticipationValueApi.getAnticipationValue(pageable, predicate);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result);
            }
            ToastUtils.emitErrorToast('getAnticipationValue');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAnticipationValue');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getDoctors = async (contractId: number, timeCourse: string, predicate: Predicate) => {
        try {
            const result: AxiosResponse = await AnticipationValueApi.getDoctors(contractId, timeCourse, predicate);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getAllDoctors');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllDoctors');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static createAnticipationValue = async (createAnticipationValue: AnticipationValueType): Promise<AnticipationValueType> => {
        try {
            const result: AxiosResponse<AnticipationValueType> = await AnticipationValueApi.createAnticipationValue(createAnticipationValue);
            if (isResponseSuccess(result.data != null, result.status, StatusCode.CREATED)) {
                ToastUtils.emitSuccessToast('createAnticipationValue');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('createAnticipationValue');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('createAnticipationValue');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateAnticipationValues = async (updateAnticipationValues: AnticipationValueType): Promise<AnticipationValueType> => {
        try {
            const result: AxiosResponse<AnticipationValueType>  = await AnticipationValueApi.updateAnticipationValues(updateAnticipationValues);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateAnticipationValues');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updateAnticipationValues');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateAnticipationValues');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static deleteAnticipationValue = async (id: number): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await AnticipationValueApi.deleteAnticipationValue(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('deleteAnticipationValue');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('deleteAnticipationValue');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('deleteAnticipationValue');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateGenerate = async (listId: number[]): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await AnticipationValueApi.updateGenerate(listId);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateGenerate');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updateGenerate');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateGenerate');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default AnticipationValueService;
