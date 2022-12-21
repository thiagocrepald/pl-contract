import { AxiosResponse } from 'axios';
import { ContractingParty } from './../model/contracting-party';
import { api as apiNew } from './api.new';

class ContractingPartyApi {

    static getAllActivated = (): Promise<AxiosResponse<ContractingParty[]>> => {
        return apiNew.get<ContractingParty[]>(`/contracting-parties/activated`);
    };
    
    static inactive = (id: number): Promise<AxiosResponse<void>> => {
        return apiNew.patch<void>(`/contracting-parties/activate/${id}`);
    };

    static create = (contractingParty: ContractingParty): Promise<AxiosResponse<ContractingParty>> => {
        return apiNew.post<ContractingParty>('/contracting-parties', contractingParty);
    };

    static update = (contractingParty: ContractingParty): Promise<AxiosResponse<ContractingParty>> => {
        return apiNew.put<ContractingParty>('/contracting-parties', contractingParty);
    };
}

export default ContractingPartyApi;
