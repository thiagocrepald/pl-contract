import { Importation } from "../model/importation-type";

export interface AnticipationValueType {
    id?: number;
    importation?: Importation;
    netValue?: string;
    grossValue?: string;
    discountMember?: string
    otherDiscounts?: string;
    prolaboreDiscount?: string;
    isProLabore?: boolean;
    hasAnticipatedProlabore?: boolean;
    isGenerated?: boolean;
    updatedDate?: string;
}
