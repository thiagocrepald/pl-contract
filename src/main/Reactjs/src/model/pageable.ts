export interface PageableResponse<T> {
    size: number;
    content: T[];
    last: boolean;
    first: boolean;
    number: number;
    sort: PageableSort;
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    numberOfElements: number;
}

export interface Pageable {
    size?: number;
    page?: number;
    sort?: string;
    totalPages?: number;
    totalElements?: number;
}

export interface PageableSort {
    sorted: boolean;
    unsorted: boolean;
}
