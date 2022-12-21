import { AxiosResponse } from 'axios';
import { Doctor } from '../model/doctor';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { requestParamsFormatter } from '../util/api-utils';
import { api } from './api';
import { requestPredicateOperatorsFormatter } from '../util/predicate-operators-utils';
import { PredicateOperators } from '../model/predicate-operators';
import { api as apiNew } from './api.new';

class DoctorApi {
    static getAllDoctors = (
        pageable: Pageable,
        predicate: Predicate,
        predicateOperators?: PredicateOperators[]
    ): Promise<AxiosResponse<PageableResponse<Doctor>>> => {
        const operators = requestPredicateOperatorsFormatter(predicateOperators);
        const [pageParams, filterParams] = requestParamsFormatter(pageable, predicate);
        return api.get<PageableResponse<Doctor>>(
            '/doctors' + (pageParams ? `?${pageParams}` : '') + (filterParams ? `&${filterParams}` : '') + (operators ? `&${operators}` : '')
        );
    };

    static getAllDoctorsNew = (predicate: Predicate): Promise<AxiosResponse<Doctor>> => {
        const [pageParams, filterParams] = requestParamsFormatter({}, predicate);
        return apiNew.get<Doctor>('/doctors' + (filterParams ? `?${filterParams}` : ''));
    };

    static getDoctors = (page, offset, size, specialityId, startDate, endDate, status, state, active, search): Promise<AxiosResponse<Doctor>> => {
        return apiNew.get(
            `/doctors?excluded=false&${page != null ? `page=${page}&` : ''}${
                offset != null ? `offset=${offset}&` : ''}${
                size != null ? `size=${size}&` : ''}${
                    specialityId != null ? `specialityId=${specialityId}&` : ''}${
                        startDate != null ? `startDate=${startDate}&` : ''}${
                            endDate != null ? `endDate=${endDate}&` : ''}${
                                state != null ? `state=${state}&` : ''}${
                                status != null ? `status=${status}&` : ''}${
                                    active != null ? `active=${active}&` : ''}${
                                        search != null ? `search=${search}&` : ''}`
        );
        
    };

    static getPartialDoctors = (predicate: Predicate, page: Pageable, predicateOperators?: PredicateOperators[]): Promise<AxiosResponse<Doctor>> => {
        const operators = requestPredicateOperatorsFormatter(predicateOperators);
        const [pageParams, filterParams] = requestParamsFormatter(page, predicate);
        return apiNew.get<Doctor>(`/doctors?${pageParams}&${filterParams}&${operators}`);
    };

    static getDoctorNew = (doctorId: number): Promise<AxiosResponse<Doctor>> => {
        return api.get<Doctor>(`/doctors/${doctorId}`);
    };

    // static getAllDifferentiatedValue = (pageable: Pageable, predicate: Predicate, contractId: Costs): Promise<AxiosResponse<PageableResponse<DifferentiatedValueType>>> => {
    //     const [pageParams, filterParams] = requestParamsFormatter(pageable, predicate);
    //     return apiNew.get<PageableResponse<DifferentiatedValueType>>('/different-value-costs/contracts/' + contractId + (pageParams ? `?${pageParams}` : '') + (filterParams ? `&${filterParams}` : ''));
    // };

    static getDoctor = (id: number): Promise<AxiosResponse<Doctor>> => {
        return api.get<Doctor>(`/doctors/${id}`);
    };

    static createDoctor = (doctor: Doctor): Promise<AxiosResponse<Doctor>> => {
        return api.post<Doctor>('/doctors', doctor);
    };

    static updateDoctor = (doctor: Doctor): Promise<AxiosResponse<Doctor>> => {
        return api.post<Doctor>('/doctors', doctor);
    };

    static deleteDoctor = (id: number): Promise<AxiosResponse<void>> => {
        return api.delete(`/doctors/${id}`);
    };

    static activateDoctor = (id: number): Promise<AxiosResponse<void>> => {
        return api.patch<void>(`/doctors/activate/${id}`);
    };
}

export default DoctorApi;
