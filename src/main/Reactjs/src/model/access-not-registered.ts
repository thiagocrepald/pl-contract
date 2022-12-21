import { Doctor } from './doctor';
import { Contract } from './contract';

export interface AccessNotRegistered {
    id?: number;
    doctor?: Doctor;
    contract?: Contract;
}
