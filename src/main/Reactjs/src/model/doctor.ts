import { Contract } from './contract';
import { User } from './user';

export interface Doctor {
    id?: number;
    doctor?: User;
    name?: string;
    crmNumber?: string;
    minimumHours?: number;
    contracts?: Contract[];
    fixedValueAmount?: number | string;
    hourValueAmount?:  number | string;
    active?: string;
    additionalCrmNumber?: string;
    additionalMedicalCouncilUf?: string;
    doctorAccess?: number;
    email?: string;
    gender?: string;
    image?: string;
    imageName?: string;
    imageType?: string;
    medicalCouncilUf?: string;
    phone?: string;
    status?: string;
    tokenPushNotification?: string;
    validatedEmail?: boolean;
}
