import { Moment } from 'moment';
import { Address } from './address';
import { Document } from './document';
import { Status } from './enums/status';
import { AccessNotRegistered } from './access-not-registered';
import { BoreCost } from './bore-cost';
import { OnCall } from './on-call';

export interface AccessControl {
    id?: number;
    status: Status;
    onCall?: OnCall;
    boreCost?: BoreCost;
    finalDoctorImage?: Document;
    finalDoctorLocation?: Address;
    initialDoctorImage?: Document;
    initialDoctorLocation?: Address;
    endTime?: Date | string | Moment;
    startTime?: Date | string | Moment;
    accessNotRegistered?: AccessNotRegistered;
    adjustedStartTime?: Date | string | Moment;
    adjustedFinalTime?: Date | string | Moment;
    onCallWorkload?: string;
    accomplishedWorkload?: string;
    requestStartTime?: Date | string | Moment;
    requestFinalTime?: Date | string | Moment;
};
