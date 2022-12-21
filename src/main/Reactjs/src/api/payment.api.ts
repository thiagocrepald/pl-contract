import { AxiosResponse } from 'axios';
import { Payment } from '../model/payment';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { requestParamsFormatter } from '../util/api-utils';
import { api as apiNew } from './api.new';

class PaymentApi {

    static getAllPayments = (pageable: Pageable, predicate: Predicate): Promise<AxiosResponse<PageableResponse<Payment>>> => {
        const [pageParams, filterParams] = requestParamsFormatter(pageable, predicate);
        return apiNew.get<PageableResponse<Payment>>('/payment-natures' + (pageParams ? `?${pageParams}` : '') + (filterParams ? `&${filterParams}` : ''));
    };

    static getPayment = (id: number): Promise<AxiosResponse<Payment>> => {
        return apiNew.get<Payment>(`/payment-natures/${id}`);
    };

    static createPayment = (payment: Payment): Promise<AxiosResponse<Payment>> => {
        return apiNew.post<Payment>('/payment-natures', payment);
    };

    static updatePayment = (payment: Payment): Promise<AxiosResponse<Payment>> => {
        return apiNew.put<Payment>('/payment-natures', payment);
    };

    static deletePayment = (id: number): Promise<AxiosResponse<void>> => {
        return apiNew.delete(`/payment-natures/${id}`);
    };

    static activatePayment = (id: number): Promise<AxiosResponse<void>> => {
        return apiNew.patch<void>(`/payment-natures/activate/${id}`);
    };
}

export default PaymentApi;