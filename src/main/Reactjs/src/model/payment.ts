export const enum EntityStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
   }
export interface Payment {
    id?: number;
    code?: number | string;
    paymentType?: string;
    prepaymentType?: string;
    status?: EntityStatus;
    prepaymentCode?: number | string;
}