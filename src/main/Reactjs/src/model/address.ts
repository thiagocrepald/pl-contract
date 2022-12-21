import { City } from './city';

export interface Address {
    id?: number;
    street?: string;
    number?: string;
    zipcode?: string;
    complement?: string;
    city?: City;
}
