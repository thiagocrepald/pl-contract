import moment from 'moment';
import { Company } from './company';
import { ILink } from './link';
import { Payment } from './payment';

// for PUT
export interface IBaseUpdate {
    id?: number;
    cnesInclusion?: string | Date | moment.Moment;
    cnesExclusion?: string | Date | moment.Moment;
    companyData?: {id?: number;};
    bond?: {id?: number;};
    paymentNature?: {id?: number;};
}

export interface IBase {
    id?: number;
    cnesInclusion?: string | Date | moment.Moment;
    cnesExclusion?: string | Date | moment.Moment;
    createdDate?: string | Date | moment.Moment;
    companyData?: Company,
    bond?: ILink,
    paymentNature?: Payment,
    contract?: { id?: number;};
    doctor?: {
        id?: number;
        name?: string;
        crmNumber?: string;
        identificationNumber?: string;
        legalEntityIdentificationNumber?: string;
        accountOwnerName?: string;
    };
}