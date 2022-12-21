import { AxiosResponse } from 'axios';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { requestParamsFormatter } from '../util/api-utils';
import { api } from './api.new';
import { PredicateOperators } from '../model/predicate-operators';
import { requestPredicateOperatorsFormatter } from '../util/predicate-operators-utils';
import { IMessage } from '../model/message';

class MessageApi {
    static getAllMessages = (predicate: Predicate, page: Pageable, predicateOperators?: PredicateOperators[]): Promise<AxiosResponse<PageableResponse<IMessage>>> => {
        const operators = requestPredicateOperatorsFormatter(predicateOperators);
        const [pageParams, filterParams] = requestParamsFormatter(page, predicate);
        return api.get<PageableResponse<IMessage>>(`/messages?${pageParams}&${filterParams}&${operators}`);
    };

    static getMessage = (id: number | string): Promise<AxiosResponse<IMessage>> => {
        return api.get<IMessage>(`/messages/${id}`);
    };

    static createMessage = (message: IMessage): Promise<AxiosResponse<IMessage>> => {
        return api.post<IMessage>('/messages', message);
    };

    static editMessage = (message: IMessage): Promise<AxiosResponse<IMessage>> => {
        return api.put<IMessage>('/messages', message);
    };

    static activateMessage = (message: IMessage): Promise<AxiosResponse<IMessage>> => {
        return api.patch<IMessage>(`/messages/activate/${message.id}`, message);
    };
}

export default MessageApi;
