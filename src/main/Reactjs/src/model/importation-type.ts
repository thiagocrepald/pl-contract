import { Contract } from "./contract";
import { Doctor } from "./doctor";

export interface ImportationType {
    contract?: Contract;
    importations?: Content;
}

export interface Content {
    content?: Importation[];
}

export interface Importation {
    id?: number;
    dueDate?: string;
    isDoctorWaiting?: boolean;
    importationKey?: ImportationKeyType;
    doctorName?: string;
    payingCompanyCode?: string;
    companyReceiver?: string;
    nameCompanyCode?: string;
    cpfCnpj?: string;
    typePayment?: string;
    typePrepayment?: string;
    grossValue?: string;
    otherDiscounts?: string;
    anticipatedValue?: string;
    membershipFee?: string;
    observation?: string;
    membershipFeeUpdated?: boolean;
    isGenerated?: boolean;
    netValue?: string;
    prolaboreNetValue?: string;
    prolaboreDiscount?: string;
    prolaboreGrossValue?: string;
    hasAnticipatedProlabore?: boolean;
}

export interface ImportationKeyType {
    contract?: Contract;
    doctor?: Doctor;
    timeCourse?: string;
}

export interface DataSearchImportationType {
    dueDate?: string;
    contractId?: number;
    timeCourse?: string;
}
