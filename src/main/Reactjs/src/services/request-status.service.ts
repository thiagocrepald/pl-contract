import RequestService from './request.service';
import AccessControlService from './access-control-service';
import { Tag } from '../model/enums/contract-request';

class RequestStatusService {
    static changeStatus = (requestId: number, newStatus: Tag) => {
        const data = {};
        data['id'] = requestId;
        data['accessControl'] = { "status": newStatus };
        return RequestService.changeStatus(data);
    };

    static changePendingStatus = (accessControlId: number, newStatus: Tag) => {
        const data = {};
        data['id'] = accessControlId;
        data['status'] = { "status": newStatus };
        return AccessControlService.changePendingStatus(data);
    };

    static changeToCompletedStatus = (accessControlId: number) => {
        return AccessControlService.changeToCompletedStatus(accessControlId);
    };
    
}

export default RequestStatusService;
