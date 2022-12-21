import { AxiosResponse } from 'axios';
import StatusCode from 'http-status-codes';
import ContractApi from '../api/contract.api';
import { Contract } from '../model/contract';
import { Pageable } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { ServiceType } from '../model/service-type';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class ContractService {
    static getAllContracts = async (pageable: Pageable, predicate: Predicate) => {
        try {
            const result: AxiosResponse = await ContractApi.getAllContracts(pageable, predicate);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getAllContracts');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllContracts');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getContract = async (id: number): Promise<Contract> => {
        try {
            const result: AxiosResponse<Contract> = await ContractApi.getContract(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getContract');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getContract');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static createContract = async (contract: Contract): Promise<Contract> => {
        try {
            const result: AxiosResponse<Contract> = await ContractApi.createContract(contract);
            if (isResponseSuccess(result.data != null, result.status, StatusCode.CREATED)) {
                ToastUtils.emitSuccessToast('createContract');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('createContract');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('createContract');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateContract = async (contract: Contract): Promise<Contract> => {
        try {
            const result: AxiosResponse<Contract> = await ContractApi.updateContract(contract);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateContract');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updateContract');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateContract');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static deleteContract = async (id: number): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await ContractApi.deleteContract(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('deleteContract');
                return Promise.resolve(result.data);

            }
            ToastUtils.emitErrorToast('deleteContract');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('deleteContract');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static activateContract = async (id: number): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await ContractApi.activateContract(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('activateContract');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('activateContract');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('activateContract');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getAllServicesTypes = async (predicate?: string) => {
        try {
            const result: AxiosResponse = await ContractApi.getAllServicesTypes(predicate);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllServicesTypes');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getAllActivatedServicesTypes = async () => {
        try {
            const result: AxiosResponse = await ContractApi.getAllActivatedServicesTypes();
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllActivatedServicesTypes');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static inactiveServicesType = async (id: number) => {
        try {
            const result: AxiosResponse = await ContractApi.inactiveServicesType(id);
            if (isResponseSuccess(true, result.status)) {
                return Promise.resolve(result.data);
            }
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('inactiveServicesType');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static createServiceType = async (serviceType: ServiceType): Promise<ServiceType> => {
        try {
            const result: AxiosResponse<ServiceType> = await ContractApi.createServiceType(serviceType);
            if (isResponseSuccess(result.data != null, result.status, StatusCode.CREATED)) {
                return Promise.resolve(result.data);
            }
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('createContract');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateServiceType = async (serviceType: ServiceType): Promise<ServiceType> => {
        try {
            const result: AxiosResponse<ServiceType> = await ContractApi.updateServiceType(serviceType);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateServiceType');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getUsers = async () => {
        try {
            const result: AxiosResponse = await ContractApi.getUsers();
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getContract');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getDoctors = async () => {
        try {
            const result: AxiosResponse = await ContractApi.getDoctors();
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getContract');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default ContractService;


