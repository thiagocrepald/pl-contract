import { Document } from './document';

export interface Additive {
    id?: number;
    contractAdditive?: string;
    additiveTerm?: string;
    startTerm?: string;
    startDate?: string;
    attachment?: Document;
}
