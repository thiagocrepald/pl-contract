import { AxiosResponse } from 'axios';
import { ICreateLink, ILink } from '../model/link';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { requestParamsFormatter } from '../util/api-utils';
import { api as apiNew } from './api.new';

class LinkApi {

    static getAllLinks = (pageable: Pageable, predicate: Predicate): Promise<AxiosResponse<PageableResponse<ILink>>> => {
        const [pageParams, filterParams] = requestParamsFormatter(pageable, predicate);
        return apiNew.get<PageableResponse<ILink>>('/bonds' + (pageParams ? `?${pageParams}` : '') + (filterParams ? `&${filterParams}` : ''));
    };

    static getLink = (id: number): Promise<AxiosResponse<ILink>> => {
        return apiNew.get<ILink>(`/bonds/${id}`);
    };

    static createLink = (link: ICreateLink): Promise<AxiosResponse<ILink>> => {
        return apiNew.post<ICreateLink>('/bonds', link);
    };

    static updateLink = (link: ILink): Promise<AxiosResponse<ILink>> => {
        return apiNew.put<ILink>('/bonds', link);
    };

    static deleteLink = (id: number): Promise<AxiosResponse<void>> => {
        return apiNew.delete(`/bonds/${id}`);
    };

    static activateLink = (id: number): Promise<AxiosResponse<void>> => {
        return apiNew.patch<void>(`/bonds/activate/${id}`);
    };
}

export default LinkApi;
