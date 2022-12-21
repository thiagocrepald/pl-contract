import { ImportationType, Importation, DataSearchImportationType } from '../model/importation-type';
import { AxiosResponse } from 'axios';
import { api as apiNew } from './api.new';
import { Pageable, PageableResponse } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { requestParamsFormatter } from '../util/api-utils';
import { Contract } from '../model/contract';

class ImportationApi {
    static getContracts = (): Promise<AxiosResponse<Contract>> => {
        return apiNew.get<Contract>('/contracts');
    };

    static getResultsCenter = (search): Promise<AxiosResponse<Contract>> => {
        return apiNew.get<Contract>(`/contracts?resultsCenter=contains(${search})`);
    };

    static saerchImportations = (
        pageable: Pageable,
        predicate: Predicate,
        contracId: number,
        timeCourse: string
    ): Promise<AxiosResponse<PageableResponse<ImportationType>>> => {
        const [pageParams, filterParams] = requestParamsFormatter(pageable, predicate);
        return apiNew.get<PageableResponse<ImportationType>>(
            '/importations?contractId=' +
                contracId +
                '&timeCourse=' +
                timeCourse +
                '&updateImportations=true' +
                (pageParams ? `&${pageParams}` : '') +
                (filterParams ? `&${filterParams}` : '')
        );
    };

    static updateImportation = (updateImportation: Importation): Promise<AxiosResponse<Importation>> => {
        return apiNew.put<Importation>('/importations', updateImportation);
    };

    static updateDoctorClosed = ({ importationKey }: Importation): Promise<AxiosResponse<void>> => {
        return apiNew.patch(
            '/importations/toggle/doctor-waiting?contractId=' +
                importationKey?.contract?.id +
                '&doctorId=' +
                importationKey?.doctor?.id +
                '&timeCourse=' +
                importationKey?.timeCourse
        );
    };

    static updateDueDateImportation = ({ contractId, timeCourse, dueDate }: DataSearchImportationType): Promise<AxiosResponse<DataSearchImportationType>> => {
        return apiNew.patch<DataSearchImportationType>('/importations/due-date?contractId=' + contractId + '&timeCourse=' + timeCourse + '&dueDate=' + dueDate);
    };

    static updateGenerate = (): Promise<AxiosResponse> => {
        return apiNew.patch('/aticipations/generate');
    };
}

export default ImportationApi;
