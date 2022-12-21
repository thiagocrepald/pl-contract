import { AxiosResponse } from 'axios';
import { Company } from '../model/company';
import CompanyApi from '../api/company.api';
import StatusCode from 'http-status-codes';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class CompanyService {

    static getAllCompanies = async (pageable: Pageable, predicate: Predicate): Promise<PageableResponse<Company>> => {
        try {
            const result: AxiosResponse<PageableResponse<Company>> = await CompanyApi.getAllCompanies(pageable, predicate);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getAllCompanies');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllCompanies');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getCompany = async (id: number): Promise<Company> => {
        try {
            const result: AxiosResponse<Company> = await CompanyApi.getCompany(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getCompany');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getCompany');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static createCompany = async (company: Company): Promise<Company> => {
        try {
            const result: AxiosResponse<Company> = await CompanyApi.createCompany(company);
            if (isResponseSuccess(result.data != null, result.status, StatusCode.CREATED)) {
                ToastUtils.emitSuccessToast('createCompany');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('createCompany');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('createCompany');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateCompany = async (company: Company): Promise<Company> => {
        try {
            const result: AxiosResponse<Company> = await CompanyApi.updateCompany(company);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateCompany');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updateCompany');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateCompany');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static deleteCompany = async (id: number): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await CompanyApi.deleteCompany(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('deleteCompany');
                return Promise.resolve(result.data);

            }
            ToastUtils.emitErrorToast('deleteCompany');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('deleteCompany');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static activateCompany = async (id: number): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await CompanyApi.activateCompany(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('activateCompany');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('activateCompany');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('activateCompany');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default CompanyService;
