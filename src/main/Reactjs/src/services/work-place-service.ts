import { AxiosResponse } from 'axios';
import WorkPlaceApi from '../api/workplace.api';
import { Pageable } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class WorkplaceService {
    static getAllWorkplaces = async (pageable: Pageable, predicate: Predicate) => {
        try {
            const result: AxiosResponse = await WorkPlaceApi.getAllWorkplaces(pageable, predicate);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getAllWorkPlaces');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllWorkPlaces');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default WorkplaceService;


