import { Address } from './address';
import { ServiceType } from './service-type';
import { WorkplaceItem } from './workplace-item';

export interface Workplace {
    id?: number;
    unitName?: string;
    discountAmount?: number | string;
    reference?: string;
    administrativeProcess?: string;
    workplaceItems?: WorkplaceItem[];
    address?: Address;
    serviceType?: ServiceType;
    timeControlOnApp?: boolean;
}
