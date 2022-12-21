import { Doctor } from '../model/doctor';
import { Contract } from '../model/contract';
import { OnCall } from '../model/on-call';
import { AxiosError } from 'axios';

export interface BoreCostType {
    id?: number;
    doctor?: Doctor;
    contract?: Contract;
    onCall?: OnCall;
    date?: string;
    time?: string;
    amount?: string;
}

export interface DifferentiatedValueType {
    doctor?: Doctor;
    contract?: Contract;
    id?: number;
    name?: string;
    startDate?: string;
    endDate?: string;
    amount?: string;
    incUserDate?: string;
    updateUserDate?: string;
    isLast?: boolean;
    code?: AxiosError;
}

export interface ExtraordinaryExpenseType {
    id?: number;
    doctor?: Doctor;
    contract?: Contract;
    description?: string;
    amount?: string;
    incUserDate?: string;
}
