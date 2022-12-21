import { Document } from './document';
import { Moment } from 'moment';
import { AccessControl } from './access-control';
import { Status } from './enums/status';
import { UserType } from './enums/contract-request';

export interface IRequest {
    id?: number;
    doctorFile?: Document;
    managerFile?: Document;
    doctorJustification?: string;
    managerJustification?: string;
    accessControl?: AccessControl;
    doctorJustificationNotAccepted?: string;
    originator?: UserType;
    adjustedFinalTime?: Date | string | Moment;
    adjustedStartTime?: Date | string | Moment;
};

export interface IRequestStatusChange {
    id?: number;
    accessControl?: {
        status?: Status;
    }
};

export interface IRequestPendingStatusChange {
    id?: number;
    status?: Status;
};