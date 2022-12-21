import moment from 'moment';
import { Status } from './enums/status';
import { ContractState } from './enums/contract-state';

export interface Predicate {
    id?: number;
    name?: string;
    search?: string;
    archived?: boolean;
    ['state.id']?: number;
    ['user.name']?:string;
    ['onCall.id']?: number;
    ['brand.name']?: string;
    ['contract.id']?: number;
    ['resale.name']?: string;
    ['customer.name']?: string;
    ['brand.type.name']?: string;
    ['type.id']?: number | string;
    ['brand.id']?: number | string;
    status?: Status | ContractState | string;
    ['category.id']?: number | string;
    ['brand.type.category.name']?: string;
    ['onCall.doctor.id']?: number | string;
    endTime?: string | Date | moment.Moment;
    endDate?: string | Date | moment.Moment;
    startDate?: string | Date | moment.Moment;
    startTime?: string | Date | moment.Moment;
    ['customerResaleQuotation.client.name']?: string;
    ['onCall.schedule.contract.id']?: number | string;
    ['accessControl.id']?: number | string;
    ['selectFields']?: string;
    ['groupByFields']?: string;
    ['doctorsId']?: string;
    ['onCallsId']?: string;
    ['schedulesId']?: string;
    ['contractsId']?: string;
    searchCombobox?: string;
}
