import { AxiosResponse } from 'axios';
import ToastUtils from '../util/toast-utils';
import { isResponseSuccess } from '../util/api-utils';
import { Pageable } from '../model/pageable';
import { Predicate } from '../model/predicate';
import ContractLogsApi from '../api/contract-logs.api';

class ContractLogsService {
    static getLogs = async (pageable: Pageable, predicate: Predicate, contractId: number) => {
        try {
            const result: AxiosResponse = await ContractLogsApi.getLogs(pageable, predicate, contractId);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getLogs');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.log(error);
            ToastUtils.emitErrorToast('getLogs');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default ContractLogsService;
