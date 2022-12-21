import { AxiosResponse } from 'axios';
import StatusCode from 'http-status-codes';
import ContractingPartyApi from '../api/contracting-party.api';
import { ContractingParty } from '../model/contracting-party';
import { ServiceType } from '../model/service-type';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class ContractingPartyService {
    static getAllActivated = async () => {
        try {
            const result: AxiosResponse = await ContractingPartyApi.getAllActivated();
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
            const result: AxiosResponse = await ContractingPartyApi.inactive(id);
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

    static create = async (contractingParty: ServiceType): Promise<ContractingParty> => {
        try {
            const result: AxiosResponse<ServiceType> = await ContractingPartyApi.create(contractingParty);
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

    static update = async (contractingParty: ContractingParty): Promise<ContractingParty> => {
        try {
            const result: AxiosResponse<ServiceType> = await ContractingPartyApi.update(contractingParty);
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

export default ContractingPartyService;


