import { Predicate } from '../model/predicate';
import { Pageable, PageableResponse } from '../model/pageable';
import { PredicateOperators } from '../model/predicate-operators';
import { INotifications } from '../model/notifications';
import { AxiosResponse } from 'axios';
import NotificationApi from '../api/notification.api';
import StatusCode from 'http-status-codes';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class NotificationService {
    static getAllNotifications = async () => {
        try {
            const result: AxiosResponse<INotifications> = await NotificationApi.getAllNotifications();
            if (!isResponseSuccess(result.data != null, result.status)) {
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static seenNotification = async (id: number) => {
        try {
            const result: AxiosResponse = await NotificationApi.seenNotification(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            return Promise.reject(error.response as AxiosResponse);
        }
    };

}

export default NotificationService;
