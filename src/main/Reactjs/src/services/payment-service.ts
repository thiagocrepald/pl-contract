import { AxiosResponse } from 'axios';
import { Payment } from '../model/payment';
import PaymentApi from '../api/payment.api';
import StatusCode from 'http-status-codes';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class PaymentService {
    static getAllPayments = async (pageable: Pageable, predicate: Predicate): Promise<PageableResponse<Payment>> => {
        try {
            const result: AxiosResponse<PageableResponse<Payment>> = await PaymentApi.getAllPayments(pageable, predicate);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getAllPayments');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllPayments');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getPayment = async (id: number): Promise<Payment> => {
        try {
            const result: AxiosResponse<Payment> = await PaymentApi.getPayment(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getPayment');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getPayment');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static createPayment = async (payment: Payment): Promise<Payment> => {
        try {
            const result: AxiosResponse<Payment> = await PaymentApi.createPayment(payment);
            if (isResponseSuccess(result.data != null, result.status, StatusCode.CREATED)) {
                ToastUtils.emitSuccessToast('createPayment');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('createPayment');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('createPayment');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updatePayment = async (payment: Payment): Promise<Payment> => {
        try {
            const result: AxiosResponse<Payment> = await PaymentApi.updatePayment(payment);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updatePayment');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updatePayment');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updatePayment');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static deletePayment = async (id: number): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await PaymentApi.deletePayment(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('deletePayment');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('deletePayment');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('deletePayment');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static activatePayment = async (id: number): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await PaymentApi.activatePayment(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('activatePayment');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('activatePayment');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('activatePayment');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default PaymentService;