import { AnticipationValueType } from '../model/anticipation-value-type';
import { AxiosResponse } from 'axios';
import { api as apiNew } from './api.new';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { Doctor } from '../model/doctor';
import { requestParamsFormatter } from '../util/api-utils';

class AnticipationValueApi {
    static getAnticipationValue = (pageable: Pageable, predicate: Predicate): Promise<AxiosResponse<PageableResponse<AnticipationValueType>>> => {
        const [pageParams, filterParams] = requestParamsFormatter(pageable, predicate);
        return apiNew.get<PageableResponse<AnticipationValueType>>(
            '/anticipations/' + (pageParams ? `?${pageParams}` : '') + (filterParams ? `&${filterParams}` : '')
        );
    };

    static getDoctors = (contractId: number, timeCourse: string, predicate: Predicate): Promise<AxiosResponse<Doctor>> => {
        const [pageParams, filterParams] = requestParamsFormatter({}, predicate);
        return apiNew.get<Doctor>("/importations/doctors?contractId=" + contractId + "&timeCourse=" + timeCourse + (filterParams ? `&${filterParams}` : ""));
    };

    static createAnticipationValue = (createAnticipationValue: AnticipationValueType): Promise<AxiosResponse<AnticipationValueType>> => {
        return apiNew.post<AnticipationValueType>("/anticipations", createAnticipationValue);
    };

    static updateAnticipationValues = (updateAnticipationValues: AnticipationValueType): Promise<AxiosResponse<AnticipationValueType>> => {
        return apiNew.put<AnticipationValueType>("/anticipations", updateAnticipationValues);
    };

    static deleteAnticipationValue = (id: number): Promise<AxiosResponse<void>> => {
        return apiNew.delete(`/anticipations/${id}`);
    };

    static updateGenerate = (listId: number[]): Promise<AxiosResponse<void>> => {
        return apiNew.patch("/anticipations/generate?anticipationsIds=" + listId);
    };
}

export default AnticipationValueApi;
