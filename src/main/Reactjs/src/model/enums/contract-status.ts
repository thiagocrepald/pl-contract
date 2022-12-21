import moment from 'moment';
import { Contract } from '../contract';
import { ContractState } from './contract-state';

enum ContractStatus {
    ONE_MONTH = "oneMonth",
    TWO_MONTH = "twoMonth",
    ARCHIVED = "archived",
    WORKING = "working"
}

// eslint-disable-next-line no-redeclare
namespace ContractStatus {
    export function getBackgroundColorByStatus(status: ContractStatus): string {
        switch (status) {
            case ContractStatus.ARCHIVED:
                return '#F9F9F9';
            case ContractStatus.ONE_MONTH:
                return '#FFF4F4';
            case ContractStatus.TWO_MONTH:
                return '#FFF9EB';
            default:
                return 'white';
        }
    }
    export function getColorByStatus(status: ContractStatus): string {
        switch (status) {
            case ContractStatus.ARCHIVED:
                return '#979797';
            case ContractStatus.ONE_MONTH:
                return '#FF0101';
            case ContractStatus.TWO_MONTH:
                return '#FFB801';
            default:
                return '#FFFFFF';
        }
    }

    export function getContractStatusByDate(contract: Contract): ContractStatus {
        if (contract.status !== ContractState.ACTIVE) {
            return ContractStatus.ARCHIVED;
        }
        let endDate;
        if (contract.contractEndTerm != null) {
            endDate = contract.contractEndTerm;
        } else if ((contract?.additives?.length ?? 0) > 0) {
            endDate = contract.additives?.filter(it => it.startDate != null)
                .map(it => moment(it.startDate).add(it.additiveTerm, 'day').toDate())
                ?.reduce(function (a, b) { return (a ?? 0) > (b ?? 0) ? a : b; }) ?? undefined;
        } else {
            endDate = contract.endDate;
        }

        if (endDate != null) {
            const diff = moment(endDate).diff(moment(), 'days') + 1;
            if (diff <= 31) {
                return ContractStatus.ONE_MONTH;
            }
            if (diff <= 62) {
                return ContractStatus.TWO_MONTH;
            }
        }


        return ContractStatus.WORKING;
    }
}

export default ContractStatus;
