import { Predicate } from '../model/predicate';
import { Pageable, PageableResponse } from '../model/pageable';
import { PredicateOperators } from '../model/predicate-operators';
import { Doctor } from '../model/doctor';
import { AxiosResponse } from 'axios';
import DoctorApi from '../api/doctor.api';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';


class DoctorService {
    static getAllDoctors = async (predicate: Predicate, pageable: Pageable, predicateOperators?: PredicateOperators[]): Promise<PageableResponse<Doctor>> => {
        try {
            const result: AxiosResponse<PageableResponse<Doctor>> = await DoctorApi.getAllDoctors(pageable, predicate, predicateOperators);
            if (!isResponseSuccess(result.data != null, result.status)) {
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            ToastUtils.emitErrorToast('getAllDoctors');
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllDoctors');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getAllDoctorsNew = async (predicate: Predicate) => {
        try {
            const result: AxiosResponse = await DoctorApi.getAllDoctorsNew(predicate);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getAllDoctors');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllDoctors');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
    static getDoctors = async (page, offset, size, specialtyId, startDate, endDate, state ,status, active, search) => {
        try {
            const result: AxiosResponse = await DoctorApi.getDoctors(page, offset, size, specialtyId, startDate, endDate, state, status, active, search);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getAllDoctors');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllDoctors');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
    static getPartialDoctors = async (predicate: Predicate, pageable: Pageable, predicateOperators?: PredicateOperators[]) => {
        try {
            const result: AxiosResponse = await DoctorApi.getPartialDoctors(predicate, pageable, predicateOperators);
            if (!isResponseSuccess(result.data != null, result.status)) {
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllDoctors');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getDoctorNew = async (id: number): Promise<Doctor> => {
        try {
            const result: AxiosResponse<Doctor> = await DoctorApi.getDoctor(id);
            if (!isResponseSuccess(result.data != null, result.status)) {
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getDoctor');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getDoctor = async (id: number): Promise<Doctor> => {
        try {
            const result: AxiosResponse<Doctor> = await DoctorApi.getDoctor(id);
            if (!isResponseSuccess(result.data != null, result.status)) {
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            ToastUtils.emitErrorToast('getDoctor');
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getDoctor');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default DoctorService;
