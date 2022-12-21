export enum EntityStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
};
export interface Company {
    id?: number;
    code?: number | string | undefined;
    company?: string;
    companyName?: string;
    status?: EntityStatus;
}