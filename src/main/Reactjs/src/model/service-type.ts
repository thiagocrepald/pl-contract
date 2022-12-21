import { EntityStatus } from './company';

export interface ServiceType {
    id?: number;
    description?: string;
    status?: EntityStatus;
}