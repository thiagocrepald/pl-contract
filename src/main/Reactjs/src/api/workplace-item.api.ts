import { AxiosResponse } from 'axios';
import { WorkplaceItem } from '../model/workplace-item';
import { api as apiNew } from './api.new';

class WorkplaceItemApi {
    static getAllByWorkplaceId = (id: number): Promise<AxiosResponse<WorkplaceItem[]>> => {
        return apiNew.get<WorkplaceItem[]>('/workplace-items/' + id);
    };
}

export default WorkplaceItemApi;