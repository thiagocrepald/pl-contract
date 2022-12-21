import { User } from './user';
import { Contract } from './contract';
import { Moment } from 'moment';
import { Workplace } from './workplace';

export interface Schedule {
    id?: number;
    isActive?: boolean;
    coordinator?: User;
    contract?: Contract;
    scheduleName?: string;
    workplace?: Workplace;
    finalPeriod?: Date | string | Moment;
    initialPeriod?: Date | string | Moment;
    paymentPrevision?: Date | string | Moment;
}
