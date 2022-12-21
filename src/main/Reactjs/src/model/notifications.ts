import { User } from './user'
import { Contract } from './contract'
import { Pageable } from './pageable'
import {Content} from './content'

export interface INotifications {
    content?: Array<Content>;
    empty?: boolean;
    first?: boolean;
    last?: boolean;
    number?: number;
    numberOfElements?: number;
    pageable?: Pageable;
    size?: number;
    sort?: {unsorted: boolean, sorted: boolean, empty: boolean};
    totalElements?: number;
    totalPages?: number;
}

