import { EntityStatus } from './company';
import { Address } from './address';

export interface ContractingParty {
    id?: number;
    name?: string;
    status?: EntityStatus;
    cnpj?: string;
    address?: Address;
}