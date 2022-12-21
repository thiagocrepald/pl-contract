import { Doctor } from './doctor';
import { Moment } from 'moment';
import { Schedule } from './schedule';
import { Sector } from './sector';
import { Speciality } from './speciality';
import Shift from './enums/shift';

export interface OnCall {
    id?: number;
    day?: string;
    shift?: Shift;
    value?: number;
    status?: string;
    doctor?: Doctor;
    sectors?: Sector[];
    isVacant?: boolean;
    schedule?: Schedule;
    isBlocked?: boolean;
    isExchange?: boolean;
    isAvailable?: boolean;
    vacancyNumber?: number;
    specialities?: Speciality[];
    date?: Date | string | Moment;
    endTime?: Date | string | Moment;
    startTime?: Date | string | Moment;
}
