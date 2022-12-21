import { AxiosResponse } from 'axios';
import { LogType } from '../model/contract-log-type';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { requestParamsFormatter } from '../util/api-utils';
import { api as apiNew } from './api.new';

class ContractLogsApi {
    static getLogs = (pageable: Pageable, predicate: Predicate, contractId: number): Promise<AxiosResponse<PageableResponse<LogType>>> => {
        const [pageParams, filterParams] = requestParamsFormatter(pageable, predicate);

        return apiNew.get<PageableResponse<LogType>>(
            '/audit/contracts/' + contractId + (pageParams ? `?${pageParams}` : '') + (filterParams ? `&${filterParams}` : '')
        );
    };
}

export default ContractLogsApi;
