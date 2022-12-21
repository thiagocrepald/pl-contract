import { AxiosResponse } from 'axios';
import { Pageable, PageableResponse } from '../model/pageable';
import { PredicateOperators } from '../model/predicate-operators';
import { Predicate } from '../model/predicate';
import { Schedule } from '../model/schedule';
import { requestParamsFormatter } from '../util/api-utils';
import { requestPredicateOperatorsFormatter } from '../util/predicate-operators-utils';
import { api } from './api';
import { api as apiNew } from './api.new';

class ScheduleApi {
    static getSchedule = (scheduleId: number): Promise<AxiosResponse<Schedule>> => {
        return apiNew.get<Schedule>(`/schedules/${scheduleId}`);
    };

    static getAllSchedules = (predicate: Predicate, page: Pageable, predicateOperators?: PredicateOperators[]): Promise<AxiosResponse<PageableResponse<Schedule>>> => {
        const operators = requestPredicateOperatorsFormatter(predicateOperators);
        const [pageParams, filterParams] = requestParamsFormatter(page, predicate);
        return apiNew.get<PageableResponse<Schedule>>(`/schedules?${pageParams}&${filterParams}&${operators}`);
    };
}

export default ScheduleApi;
