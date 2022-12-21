import { AxiosResponse } from 'axios';
import { IBase, IBaseUpdate } from '../model/contract-base';
import ContractBaseApi from '../api/contract-base.api';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { PredicateOperators } from '../model/predicate-operators';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class ContractBaseService {
    static getAllBases = async (id: number, predicate: Predicate, pageable: Pageable, predicateOperators?: PredicateOperators[]): Promise<PageableResponse<IBase>> => {
        try {
            const result: AxiosResponse<PageableResponse<IBase>> = await ContractBaseApi.getAllBases(id, predicate, pageable, predicateOperators);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getAllBases');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllBases');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
    
    static updateBase = async (base: IBaseUpdate): Promise<IBase> => {
        try {
            const result: AxiosResponse<IBase> = await ContractBaseApi.updateBase(base);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateBase');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updateBase');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateBase');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
    // static getCompany = async (id: number): Promise<Company> => {
    //     try {
    //         const result: AxiosResponse<Company> = await CompanyApi.getCompany(id);
    //         if (isResponseSuccess(result.data != null, result.status)) {
    //             return Promise.resolve(result.data);
    //         }
    //         ToastUtils.emitErrorToast('getCompany');
    //         return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
    //     } catch (error) {
    //         console.error(error);
    //         ToastUtils.emitErrorToast('getCompany');
    //         return Promise.reject(error.response as AxiosResponse);
    //     }
    // };

    // static createCompany = async (company: Company): Promise<Company> => {
    //     try {
    //         const result: AxiosResponse<Company> = await CompanyApi.createCompany(company);
    //         if (isResponseSuccess(result.data != null, result.status, StatusCode.CREATED)) {
    //             ToastUtils.emitSuccessToast('createCompany');
    //             return Promise.resolve(result.data);
    //         }
    //         ToastUtils.emitErrorToast('createCompany');
    //         return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
    //     } catch (error) {
    //         console.error(error);
    //         ToastUtils.emitErrorToast('createCompany');
    //         return Promise.reject(error.response as AxiosResponse);
    //     }
    // };


    // static deleteCompany = async (id: number): Promise<void> => {
    //     try {
    //         const result: AxiosResponse<void> = await CompanyApi.deleteCompany(id);
    //         if (isResponseSuccess(result.data != null, result.status)) {
    //             ToastUtils.emitSuccessToast('deleteCompany');
    //             return Promise.resolve(result.data);

    //         }
    //         ToastUtils.emitErrorToast('deleteCompany');
    //         return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
    //     } catch (error) {
    //         console.error(error);
    //         ToastUtils.emitErrorToast('deleteCompany');
    //         return Promise.reject(error.response as AxiosResponse);
    //     }
    // };

    // static activateCompany = async (id: number): Promise<void> => {
    //     try {
    //         const result: AxiosResponse<void> = await CompanyApi.activateCompany(id);
    //         if (isResponseSuccess(result.data != null, result.status)) {
    //             ToastUtils.emitSuccessToast('activateCompany');
    //             return Promise.resolve(result.data);
    //         }
    //         ToastUtils.emitErrorToast('activateCompany');
    //         return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
    //     } catch (error) {
    //         console.error(error);
    //         ToastUtils.emitErrorToast('activateCompany');
    //         return Promise.reject(error.response as AxiosResponse);
    //     }
    // };
}

export default ContractBaseService;
