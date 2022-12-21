import React from 'react';
import './contract-cost.scss';
import {Contract} from '../../../model/contract';
import { BoreCostTable, DifferentiatedValueTable, ExtraordinaryExpensesTable } from './contract-costs-tables';

interface IContractCost {
    contractId: number;
    contract?: Contract;
}

const ContractCost = ({ contractId, contract }: IContractCost): JSX.Element => {
    return (
        <>
            <div className='contract-detail__container--body-group'>
                <div className='contract-detail__container--body-title'>{contract?.contractingParty?.name ?? ''}</div>
            </div>
            <BoreCostTable contractId={contractId} contract={contract} />
            <hr style={{ marginTop: '-26px' }} />
            <DifferentiatedValueTable contractId={contractId} contract={contract} />
            <hr style={{ marginTop: '-26px' }} />
            <ExtraordinaryExpensesTable contractId={contractId} contract={contract} />
        </>
    );
};

export default ContractCost;
