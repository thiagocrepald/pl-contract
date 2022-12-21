import { User } from './user'
import { Contract } from './contract'
export interface IMessage {
    id?: number;
    content?: string;
    contract?: Contract;
    incUser?: string;
    user?: User;
    incUserDate?: string;
    visible?: boolean;
    history?: Array<any>;
}

