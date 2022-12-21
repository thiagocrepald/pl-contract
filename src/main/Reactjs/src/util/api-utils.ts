import qs from 'qs';
import StatusCode from 'http-status-codes';
import { Pageable } from '../model/pageable';
import { Predicate } from '../model/predicate';

export const isResponseSuccess = (validation: boolean, status: number, expectedStatus?: number): boolean => {
    const compareStatus = expectedStatus || StatusCode.OK;
    return status === compareStatus && validation;
};

export const requestParamsFormatter = (page: Pageable, predicateOperator: Predicate, predicateParams?: object) => {
    const pageParams = qs.stringify({ ...page });
    const filterParams: string = Object.keys(predicateOperator)
        .filter(key => predicateOperator[key] != null)
        .map(key => (Array.isArray(predicateOperator[key])
            ? `${key}=${(predicateOperator[key].map(item => item[predicateParams?.[key] || 'name'])).join(',')}`
            : `${key}=${predicateOperator[key]}`))
        .join('&');
    return [pageParams, filterParams];
};
