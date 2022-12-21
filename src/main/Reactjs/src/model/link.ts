import { Payment } from './payment';

export const enum EntityStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
};
export interface ILink {
    id?: number;
    name?: string;
    status?: EntityStatus;
    paymentNature?: Payment;
}

export interface ICreateLink {
    name?: string;
    paymentNature?: {id?: number};
}
