import { EntityStatus } from './company';
import { Address } from './address';

export interface Hired {
    id?: number;
    name?: string;
    status?: EntityStatus;
    cnpj?: string;
    address?: Address;
}