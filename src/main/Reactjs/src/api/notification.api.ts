import { AxiosResponse } from 'axios';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { requestParamsFormatter } from '../util/api-utils';
import { api } from './api.new';
import { PredicateOperators } from '../model/predicate-operators';
import { requestPredicateOperatorsFormatter } from '../util/predicate-operators-utils';
import { IMessage } from '../model/message';

class  NotificationApi{
    static getAllNotifications = (): Promise<AxiosResponse> => {
        return api.get(`/notifications/current-user`);
    };

    static seenNotification = (id: number): Promise<AxiosResponse> => {
        return api.patch(`/notifications/seen/${id}`);
    };
}

export default NotificationApi;
