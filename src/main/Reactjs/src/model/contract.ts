import moment from 'moment';
import ContractStatus from './enums/contract-status';
import { Additive } from './additive';
import { Doctor } from './doctor';
import { Workplace } from './workplace'
import { ServiceType } from './service-type';
import { Address } from './address';
import { ContractAttachment } from './contract-attachment';
import { User } from './user';
import { DoctorLock } from './doctor-lock';
import { ContractState } from './enums/contract-state';
import { Hired } from './hired';
import { ContractingParty } from './contracting-party';

export interface Contract {
    id?: number;
    contractNumber?: string;
    startDate?: string;
    endDate?: string;
    contractEndTerm?: string;
    acronym?: string;
    sankhyaCode?: number;
    datePaymentPayroll?: string;
    deadlineReceipt?: string;
    entryDelayTolerance?: string;
    integralDelayTolerance?: string;
    hired?: Hired;
    hiredPartyCnpj?: string;
    biddingReference?: string;
    administrativeProcess?: string;
    contractingParty?: ContractingParty;
    contractingPartyCnpj?: string;
    contractualGuarantee?: string;
    readjustmentIndex?: string;
    notes?: string;
    serviceType?: ServiceType;
    serviceTypeMacro?: ServiceType;
    responsibleAccessUser?: User;
    closingOfficerUser?: User;
    contractingPartyAddress?: Address;
    coordinatingDoctors?: Doctor[];
    workplaces?: Workplace[];
    additives?: Additive[];
    contractAttachments?: ContractAttachment[];
    contractDoctorLocks?: DoctorLock[];
    resultsCenter?: string;
    contractStatus?: ContractStatus;
    responsibleUser?: User;
    exitDelayTolerance?: string;
    accumulateDelayTolerance?: boolean;
    isCurrentUserResponsible?: boolean;

    //APAGAR APÓS FINALIZAR INTEGRAÇÃO COM O BACKEND
    scale?: string;
    local?: string;
    month?: string;
    year?: string;
    status?: ContractState;
    doctor?: Doctor;
    specialty?: string;
    sector?: string;
    date?: string;
    time?: string;
    finalTime?: string;
    estimatedTime?: string;
    hours?: string;
}

export interface ContractBaseContent {
    crm?: string;
    name?: string;
    cpf?: string;
    cnpj?: string;
    link?: string;
    pj?: string;
    payer?: string;
    code?: number;
    payment?: string;
    earlyPayment?: string;
    inclusionCns?: string | Date | moment.Moment;
    exclusionCnes?: string | Date | moment.Moment;
}

export interface ContractRequestContent {
    crm?: string;
    doctorName?: string;
    scale?: string;
    sector?: string;
    day?: string;
    date?: string;
    estimatedTime?: string;
    expectedWorkload?: string;
    time?: string;
    accomplishedWorkload?: string;
    status?: string;
    doctor?: string;
    accessResponsible?: string;
}
