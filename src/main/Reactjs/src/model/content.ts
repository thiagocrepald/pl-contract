import {IRequest} from './request'
export interface Content {
    id?: number;
    incUserDate: string;
    message?: string;
    notificationType?: string;
    request?: IRequest;
    seen?: boolean;
    title?: string;
}

