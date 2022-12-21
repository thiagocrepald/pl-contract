import { PaymentType } from './enums/payment-type';
import { Doctor } from './doctor';

export interface PaymentData {
    id?: number;
    bank?: string;
    medic?: Doctor;
    agency?: string;
    pisNumber?: string;
    bankAccount?: string;
    transaction?: string;
    type?: PaymentType;
    accountOwnerName?: string;
    isCompanyAccount?: boolean;
}
