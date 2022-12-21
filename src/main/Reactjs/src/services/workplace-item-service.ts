import { AxiosResponse } from 'axios';
import WorkplaceItemApi from '../api/workplace-item.api';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class WorkplaceItemService {
    static getAllByWorkplaceId = async (id: number) => {
        try {
            const result: AxiosResponse = await WorkplaceItemApi.getAllByWorkplaceId(id);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getAllByWorkplaceId');
            return Promise.reject({ status: result.status, statusText: result.statusText } as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getAllByWorkplaceId');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default WorkplaceItemService;


