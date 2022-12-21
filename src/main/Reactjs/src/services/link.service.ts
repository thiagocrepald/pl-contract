import { AxiosResponse } from 'axios';
import { ICreateLink, ILink } from '../model/link';
import LinkApi from '../api/links.api';
import StatusCode from 'http-status-codes';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class LinkService {

    static getAllLinks = async (pageable: Pageable, predicate: Predicate): Promise<PageableResponse<ILink>> => {
        try {
            const result: AxiosResponse<PageableResponse<ILink>> = await LinkApi.getAllLinks(pageable, predicate);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getAllLinks');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllLinks');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getLink = async (id: number): Promise<ILink> => {
        try {
            const result: AxiosResponse<ILink> = await LinkApi.getLink(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getLink');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getLink');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static createLink = async (link: ICreateLink): Promise<ILink> => {
        try {
            const result: AxiosResponse<ICreateLink> = await LinkApi.createLink(link);
            if (isResponseSuccess(result.data != null, result.status, StatusCode.CREATED)) {
                ToastUtils.emitSuccessToast('createLink');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('createLink');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('createLink');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateLink = async (link: ILink): Promise<ILink> => {
        try {
            const result: AxiosResponse<ILink> = await LinkApi.updateLink(link);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateLink');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updateLink');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateLink');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static deleteLink = async (id: number): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await LinkApi.deleteLink(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('deleteLink');
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

    static activateLink = async (id: number): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await LinkApi.activateLink(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('activateLink');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('activateLink');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('activateLink');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default LinkService;
