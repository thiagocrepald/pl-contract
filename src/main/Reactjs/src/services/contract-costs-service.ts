import { AxiosResponse, AxiosError } from 'axios';
import ContractCostsApi from '../api/contract-costs.api';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';
import { BoreCostType, DifferentiatedValueType, ExtraordinaryExpenseType } from '../model/contract-costs-type';
import { Pageable } from '../model/pageable';
import { Predicate } from '../model/predicate';
import StatusCode from 'http-status-codes';

class ContractCostsService {
    static createBoreCost = async (newBorCost: BoreCostType): Promise<BoreCostType> => {
        try {
            const result: AxiosResponse<BoreCostType> = await ContractCostsApi.createBoreCost(newBorCost);
            if (isResponseSuccess(result.data != null, result.status, StatusCode.CREATED)) {
                ToastUtils.emitSuccessToast('createBoreCost');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('createBoreCost');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('createBoreCost');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getAllBoreCost = async (pageable: Pageable, predicate: Predicate, contractId: number) => {
        try {
            const result: AxiosResponse = await ContractCostsApi.getAllBoreCost(pageable, predicate, contractId);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getBoreCost');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getBoreCost');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateBoreCost = async (updateBoreCost: BoreCostType): Promise<BoreCostType> => {
        try {
            const result: AxiosResponse<BoreCostType> = await ContractCostsApi.updateBoreCost(updateBoreCost);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateBoreCost');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updateBoreCost');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateBoreCost');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static deleteBoreCost = async (id: number): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await ContractCostsApi.deleteBoreCost(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('deleteBoreCost');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('deleteBoreCost');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('deleteBoreCost');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getSchedules = async (contractId: number) => {
        try {
            const result: AxiosResponse = await ContractCostsApi.getSchedules(contractId);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getSchedules');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getSchedules');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getOnCalls = async scheduleId => {
        try {
            const result: AxiosResponse = await ContractCostsApi.getOnCalls(scheduleId);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getOnCalls');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getOnCalls');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static createDifferentiatedValue = async (newDifferentiatedValue: DifferentiatedValueType): Promise<DifferentiatedValueType> => {
        try {
            const result: AxiosResponse<DifferentiatedValueType> = await ContractCostsApi.createDifferentiatedValue(newDifferentiatedValue);
            if (isResponseSuccess(result.data != null, result.status, StatusCode.CREATED)) {
                ToastUtils.emitSuccessToast('createDifferentiatedValue');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('createDifferentiatedValue');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('createDifferentiatedValue');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getAllDifferentiatedValue = async (pageable: Pageable, predicate: Predicate, contractId) => {
        try {
            const result: AxiosResponse = await ContractCostsApi.getAllDifferentiatedValue(pageable, predicate, contractId);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getDifferentiatedValue');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getDifferentiatedValue');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateDifferentiatedValue = async (updateDifferentiatedValue: DifferentiatedValueType): Promise<DifferentiatedValueType> => {
        try {
            const result: AxiosResponse<DifferentiatedValueType> = await ContractCostsApi.updateDifferentiatedValue(updateDifferentiatedValue);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateDifferentiatedValue');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updateDifferentiatedValue');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            const errorResult: AxiosError = error;
            ToastUtils.emitErrorToast('updateDifferentiatedValue');
            return Promise.resolve(errorResult.response?.data.code);
        }
    };

    static deleteDifferentiatedValue = async (id: number): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await ContractCostsApi.deleteDifferentiatedValue(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('deleteDifferentiatedValue');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('deleteDifferentiatedValue');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('deleteDifferentiatedValue');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static checkIfTheDoctorExistsInDifferentValue = async (contractId: number, doctorId: number) => {
        try {
            const result: AxiosResponse = await ContractCostsApi.checkIfTheDoctorExistsInDifferentValue(contractId, doctorId);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('checkIfTheDoctorExistsInDifferentValue');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('checkIfTheDoctorExistsInDifferentValue');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static createExtraordinaryExpense = async (newExtraordinaryExpense: ExtraordinaryExpenseType): Promise<ExtraordinaryExpenseType> => {
        try {
            const result: AxiosResponse<ExtraordinaryExpenseType> = await ContractCostsApi.createExtraordinaryExpense(newExtraordinaryExpense);
            if (isResponseSuccess(result.data != null, result.status, StatusCode.CREATED)) {
                ToastUtils.emitSuccessToast('createExtraordinaryExpense');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('createExtraordinaryExpense');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('createExtraordinaryExpense');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getAllExtraordinaryExpenses = async (pageable: Pageable, predicate: Predicate, contractId: number) => {
        try {
            const result: AxiosResponse = await ContractCostsApi.getAllExtraordinaryExpenses(pageable, predicate, contractId);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getExtraordinaryExpenses');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getExtraordinaryExpenses');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateExtraordinaryExpense = async (updateExtraordinaryExpense: ExtraordinaryExpenseType): Promise<ExtraordinaryExpenseType> => {
        try {
            const result: AxiosResponse<ExtraordinaryExpenseType> = await ContractCostsApi.updateExtraordinaryExpense(updateExtraordinaryExpense);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateExtraordinaryExpense');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updateExtraordinaryExpense');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateExtraordinaryExpense');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static deleteExtraordinaryExpense = async (id: number): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await ContractCostsApi.deleteExtraordinaryExpense(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('deleteExtraordinaryExpense');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('deleteExtraordinaryExpense');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('deleteExtraordinaryExpense');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default ContractCostsService;
