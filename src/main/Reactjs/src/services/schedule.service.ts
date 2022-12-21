import { AxiosResponse } from 'axios';
import { Pageable, PageableResponse } from '../model/pageable';
import { PredicateOperators } from '../model/predicate-operators';
import { Predicate } from '../model/predicate';
import { Schedule } from '../model/schedule';
import ScheduleApi from '../api/schedule.api';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';

class ScheduleService {
    
    static getSchedule = async (id: number): Promise<Schedule> => {
        try {
            const result: AxiosResponse<Schedule> = await ScheduleApi.getSchedule(id);
            if (!isResponseSuccess(result.data != null, result.status)) {
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getAllSchedules = async (predicate: Predicate, pageable: Pageable, predicateOperators?: PredicateOperators[]): Promise<PageableResponse<Schedule>> => {
        try {
            const result: AxiosResponse<PageableResponse<Schedule>> = await ScheduleApi.getAllSchedules(predicate, pageable, predicateOperators);
            if (!isResponseSuccess(result.data != null, result.status)) {
                return Promise.reject({status: result.status, statusText: result.statusText } as AxiosResponse);
            }
            return Promise.resolve(result.data);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getSchedules');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default ScheduleService;
