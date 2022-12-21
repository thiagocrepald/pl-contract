import { AxiosResponse } from 'axios';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { requestParamsFormatter } from '../util/api-utils';
import { Workplace } from './../model/workplace';
import { api as apiNew } from './api.new';

class WorkPlaceApi {
    static getAllWorkplaces = (pageable: Pageable, predicate: Predicate): Promise<AxiosResponse<PageableResponse<Workplace>>> => {
        console.log("predicate", predicate)
        const [pageParams, filterParams] = requestParamsFormatter(pageable, predicate);
        return apiNew.get<PageableResponse<Workplace>>('/workplaces' + (pageParams ? `?${pageParams}` : '') + (filterParams ? `&${filterParams}` : ''));
    };
}

export default WorkPlaceApi;