import { Predicate } from '../model/predicate';
import { Pageable, PageableResponse } from '../model/pageable';
import { PredicateOperators } from '../model/predicate-operators';
import { IMessage } from '../model/message';
import { AxiosResponse } from 'axios';
import MessageApi from '../api/message.api';
import StatusCode from 'http-status-codes';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class MessageService {
    static getAllMessages = async (predicate: Predicate, pageable: Pageable, predicateOperators?: PredicateOperators[]): Promise<PageableResponse<IMessage>> => {
        try {
            const result: AxiosResponse<PageableResponse<IMessage>> = await MessageApi.getAllMessages(predicate, pageable, predicateOperators);
            if (!isResponseSuccess(result.data != null, result.status)) {
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllMessages');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getMessage = async (id: number | string): Promise<IMessage> => {
        try {
            const result: AxiosResponse<IMessage> = await MessageApi.getMessage(id);
            if (!isResponseSuccess(result.data != null, result.status)) {
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static createMessage = async (message: IMessage): Promise<IMessage> => {
        try {
            const result: AxiosResponse<IMessage> = await MessageApi.createMessage(message);
            if (isResponseSuccess(result.data != null, result.status, StatusCode.CREATED)) {
                ToastUtils.emitSuccessToast('createMessage');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('createMessage');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('createMessage');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static editMessage = async (message: IMessage): Promise<IMessage> => {
        try {
            const result: AxiosResponse<IMessage> = await MessageApi.editMessage(message);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('editMessage');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('editMessage');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('editMessage');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static activateMessage = async (message: IMessage, type: string): Promise<IMessage> => {
        let responseMessage = '';
        if (type === 'ACTIVATE') {
            responseMessage = 'activateMessage';
        };
        if (type === 'DEACTIVATE') {
            responseMessage = 'deactivateMessage';
        };
        try {
            const result: AxiosResponse<IMessage> = await MessageApi.activateMessage(message);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast(responseMessage);
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast(responseMessage);
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast(responseMessage);
            return Promise.reject(error.response as AxiosResponse);
        }
    };

}

export default MessageService;
