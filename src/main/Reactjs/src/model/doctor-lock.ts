import { User } from './user';

export interface DoctorLock {
    id?: number;
    name?: string;
    doctor?: User;
}
