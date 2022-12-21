import { AxiosResponse } from 'axios';
import ImportReportApi from '../api/importation.api';
import { isResponseSuccess } from '../util/api-utils';
import ToastUtils from '../util/toast-utils';
import { Pageable } from '../model/pageable';
import { Predicate } from '../model/predicate';
import { Importation, DataSearchImportationType } from '../model/importation-type';

class ImportationService {
    static getContracts = async () => {
        try {
            const result: AxiosResponse = await ImportReportApi.getContracts();
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getContract');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getContract');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static getResultsCenter = async (search: string) => {
        try {
            const result: AxiosResponse = await ImportReportApi.getResultsCenter(search);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('getContract');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getContract');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static saerchImportations = async (
        pageable: Pageable, 
        predicate: Predicate,
        contracId: number,
        timeCourse: string
    ) => {
        try {
            const result: AxiosResponse = await ImportReportApi.saerchImportations(pageable, predicate, contracId, timeCourse);
            if (isResponseSuccess(result.data != null, result.status)) {
                return Promise.resolve(result);
            }
            ToastUtils.emitErrorToast('getImportation');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('getImportation');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateDueDateImportation = async (updateDueDateImportation: DataSearchImportationType): Promise<DataSearchImportationType> => {
        try {
            const result: AxiosResponse<DataSearchImportationType> = await ImportReportApi.updateDueDateImportation(updateDueDateImportation);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateImportation');
            }
            ToastUtils.emitErrorToast('updateImportation');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateImportation');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateImportation = async (updateImportation: Importation): Promise<Importation> => {
        try {
            const result: AxiosResponse<Importation> = await ImportReportApi.updateImportation(updateImportation);
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateImportation');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updateImportation');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateImportation');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateGenerate = async () => {
        try {
            const result: AxiosResponse = await ImportReportApi.updateGenerate();
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateGenerate');
            }
            ToastUtils.emitErrorToast('updateGenerate');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateGenerate');
            return Promise.reject(error.response as AxiosResponse);
        }
    };

    static updateDoctorClosed = async ({ importationKey }: Importation): Promise<void> => {
        try {
            const result: AxiosResponse<void> = await ImportReportApi.updateDoctorClosed({importationKey});
            if (isResponseSuccess(result.data != null, result.status)) {
                ToastUtils.emitSuccessToast('updateDoctorClosed');
                return Promise.resolve(result.data);
            }
            ToastUtils.emitErrorToast('updateDoctorClosed');
            return Promise.reject(({ status: result.status, statusText: result.statusText } as unknown) as AxiosResponse);
        } catch (error) {
            console.error(error);
            ToastUtils.emitErrorToast('updateDoctorClosed');
            return Promise.reject(error.response as AxiosResponse);
        }
    };
}

export default ImportationService;
