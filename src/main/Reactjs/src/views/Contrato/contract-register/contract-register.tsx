import { CircularProgress, makeStyles, TextareaAutosize } from '@material-ui/core';
import _ from 'lodash';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Contract } from '../../../model/contract';
import { ContractingParty } from '../../../model/contracting-party';
import { Hired } from '../../../model/hired';
import { ServiceType } from '../../../model/service-type';
import { workplaceItemFieldsIsNotEmpty } from '../../../model/workplace-item';
import ContractService from '../../../services/contract-service';
import ContractingPartyService from '../../../services/contracting-party-service';
import HiredService from '../../../services/hired-service';
import { writeToISODuration } from '../../../util/ISODuration';
import { ifHasMaskRemove, removeCurrencyMask } from '../../../util/mask-utils';
import StringUtils from '../../../util/string-utils';
import ToastUtils from '../../../util/toast-utils';
import { toast } from "react-toastify";
import './../../../components/main.scss';
import './contract-register.scss';
import { AdditiveForm } from './forms/additive-form';
import { AuthorizedDoctorForm } from './forms/authorized-doctor-form';
import { ContractorsForm } from './forms/contractors-form';
import { CoordinatingDoctorsForm } from './forms/coordinating-doctors-form';
import { DelayParametersForm } from './forms/delay-parameters-form';
import { FilesForm } from './forms/files-form';
import { ResponsibleForm } from './forms/responsible-form';
import { WorkplaceForm } from './forms/workplace-form';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    }
}));

const ContractRegister = (props) => {
    const classes = useStyles();

    // CHANGE COLOR FOR THIS PAGE ONLY AND CLEAN-UP WHEN LEAVING THE PAGE
    useLayoutEffect(() => {
        window.document.body.style.background = 'white';
        return () => {
            window.document.body.style.background = '';
        };
    });

    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(false);
    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([{}]);
    const [sankhyaCodeHasError, setSankhyaCodeHasError] = useState<boolean>(false);
    const [resultsCenterHasError, setResultsCenterHasError] = useState<boolean>(false);
    const [hires, setHires] = useState<Hired[]>([{}]);
    const [contractingParties, setContractingParties] = useState<ContractingParty[]>([{}]);
    const [contract, setContract] = useState<Contract>({
        additives: [{}],
        workplaces: [{ timeControlOnApp: true, workplaceItems: [{}] }],
        coordinatingDoctors: [{}],
        contractAttachments: [],
        contractDoctorLocks: []
    });

    const match = useRouteMatch('/admin/contract-register/:id');

    useEffect(() => {
        const { id } = match?.params as any ?? { id: undefined };
        
        if (id != null) {
            getContract();
        } else {
            getAllHires();
            getAllServiceTypes();
            getAllContractingParties();
        }
    }, []);

    const getContract = () => {
        const { id } = match?.params as any ?? { id: undefined };
        ContractService.getContract(Number(id)).then((result) => {
            const entity = {
                ...result,
                exitDelayTolerance: StringUtils.convertDuration(result.exitDelayTolerance),
                entryDelayTolerance: StringUtils.convertDuration(result.entryDelayTolerance),
                integralDelayTolerance: StringUtils.convertDuration(result.integralDelayTolerance)
            };
            setContract(entity);
            getAllHires(entity);
            getAllServiceTypes(entity);
            getAllContractingParties(entity);
        });
    };

    const getAllServiceTypes = (newContract?: Contract) => {
        const currentContract = newContract ?? contract;
        ContractService.getAllActivatedServicesTypes().then((result: ServiceType[]) => {
            const hasValidServiceTypeMacroSelected = currentContract?.serviceTypeMacro?.id != null
                && Number(currentContract?.serviceTypeMacro?.id) !== 0
                && !result.some(it => it.id === currentContract?.serviceTypeMacro?.id)

            if (hasValidServiceTypeMacroSelected) {
                result.push(currentContract?.serviceTypeMacro!)
            }

            _.uniqBy(currentContract?.workplaces?.filter(it => it.serviceType != null)
                .map(it => it.serviceType)
                .filter(it => !result.some(st => st.id === it?.id)),
                'id'
            ).forEach(it => result.push(it!))
            setServiceTypes(result);
        });
    };

    const getAllHires = (newContract?: Contract) => {
        const currentContract = newContract ?? contract;
        HiredService.getAllActivated().then((result: Hired[]) => {
            const hasValidHiredSelected = currentContract?.hired?.id != null
                && Number(currentContract?.hired?.id) !== 0
                && !result.some(it => it.id === currentContract?.hired?.id)

            if (hasValidHiredSelected) {
                result.push(currentContract?.hired!)
            }
            setHires(result);
        });
    };

    const getAllContractingParties = (newContract?: Contract) => {
        const currentContract = newContract ?? contract;
        ContractingPartyService.getAllActivated().then((result: ContractingParty[]) => {
            const hasValidPartySelected = currentContract?.contractingParty?.id != null
                && Number(currentContract?.contractingParty?.id) !== 0
                && !result.some(it => it.id === currentContract?.contractingParty?.id)

            if (hasValidPartySelected) {
                result.push(currentContract?.contractingParty!)
            }
            setContractingParties(result);
        });
    };

    const createOrUpdateContract = async () => {
        setLoading(true);
        try {
            const { id } = match?.params as any ?? { id: undefined };

            let contractUpdated = { ...contract };

            if (contract.sankhyaCode == null || contract.resultsCenter == null) {
                setSankhyaCodeHasError(contract.sankhyaCode == null);
                setResultsCenterHasError(contract.resultsCenter == null);
                setLoading(false);
                return;
            }

            if (contractUpdated?.coordinatingDoctors != null && contractUpdated?.coordinatingDoctors[0] != null && Object.keys(contractUpdated?.coordinatingDoctors[0]).length === 0) {
                contractUpdated?.coordinatingDoctors?.pop();
            }

            if (contractUpdated?.additives != null && contractUpdated?.additives[0] != null && Object.keys(contractUpdated?.additives![0]).length === 0) {
                contractUpdated?.additives?.pop();
            }

            const updatedDoctors = contractUpdated?.coordinatingDoctors?.map((doctor) => ({
                ...doctor,
                minimumHours: doctor.minimumHours ?? undefined,
                fixedValueAmount: ifHasMaskRemove(doctor.fixedValueAmount!),
                hourValueAmount: ifHasMaskRemove(doctor.hourValueAmount!)
            }));


            console.log(contractUpdated?.workplaces);
            const updatedWorkplaces = contractUpdated?.workplaces?.map((workplace) => ({
                ...workplace,
                discountAmount: ifHasMaskRemove(workplace?.discountAmount!),
                workplaceItems: workplace.workplaceItems?.filter(it => workplaceItemFieldsIsNotEmpty(it)).map((item) => ({
                    id: item?.id!,
                    item: item?.item!,
                    object: item?.object!,
                    quantity: item?.quantity!,
                    paymentPjAmount: ifHasMaskRemove(item?.paymentPjAmount!),
                    receivableAmount: ifHasMaskRemove(item?.receivableAmount!),
                    paymentRpaAmount: ifHasMaskRemove(item?.paymentRpaAmount!),
                    payablePartnerAmount: ifHasMaskRemove(item?.payablePartnerAmount!)
                }))
            }));

            contractUpdated = {
                ...contract,
                coordinatingDoctors: updatedDoctors,
                entryDelayTolerance: writeToISODuration(contract?.entryDelayTolerance),
                integralDelayTolerance: writeToISODuration(contract?.integralDelayTolerance),
                exitDelayTolerance: writeToISODuration(contract?.exitDelayTolerance),
                workplaces: updatedWorkplaces
            };

            if (id != null) {
                const toUpdate = { ...contractUpdated, id };
                await ContractService.updateContract(toUpdate);
                props.history.replace('/admin/contracts');
            } else {
                await ContractService.createContract(contractUpdated);
                props.history.replace('/admin/contracts');
            }
        } catch (e) {
            console.log(e.message);
        }

        setLoading(false);
    };

    const cancelAction = () => {
        props.history.replace('/admin/contracts');
    };

    return (
        <div className='contract-register__container'>
            <div className='contract-register__container--header'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        className='back-button'
                        onClick={() => {
                            cancelAction();
                        }}>
                        <div className='arrow-white' />
                    </div>
                    <div className='text-title'> {t('contractRegister.header.title')}</div>
                </div>
            </div>
            <div className='contract-register__container--body'>
                <Container>
                    <ContractorsForm
                        hires={hires}
                        classes={classes}
                        contract={contract}
                        sankhyaCodeHasError={sankhyaCodeHasError}
                        resultsCenterHasError={resultsCenterHasError}
                        getAllHires={getAllHires}
                        setContract={setContract}
                        serviceTypes={serviceTypes}
                        contractingParties={contractingParties}
                        getAllServiceTypes={getAllServiceTypes}
                        getAllContractingParties={getAllContractingParties} />
                    <hr style={{ margin: '0' }} />

                    <AdditiveForm contract={contract} setContract={setContract} />
                    <hr style={{ marginBottom: '0' }} />

                    <WorkplaceForm
                        classes={classes}
                        contract={contract}
                        getAllServiceTypes={getAllServiceTypes}
                        serviceTypes={serviceTypes}
                        setContract={setContract} />
                    <hr style={{ marginBottom: '0' }} />

                    <ResponsibleForm classes={classes} contract={contract} setContract={setContract} />
                    <hr style={{ marginBottom: '0' }} />

                    <CoordinatingDoctorsForm classes={classes} contract={contract} setContract={setContract} />
                    <hr style={{ marginBottom: '0' }} />

                    <AuthorizedDoctorForm classes={classes} contract={contract} setContract={setContract} />
                    <hr style={{ marginBottom: '0' }} />

                    <DelayParametersForm contract={contract} setContract={setContract} />
                    <hr style={{ marginBottom: '0' }} />

                    <FilesForm contract={contract} setContract={setContract} />
                    <hr style={{ marginBottom: '0' }} />

                    <div className='contract-register__container--body-title'>{t('contractRegister.body.observation.title')}</div>
                    <TextareaAutosize
                        className='text-area'
                        rowsMin={4}
                        rowsMax={4}
                        placeholder={t('contractRegister.body.observation.textField.insert')}
                        value={contract?.notes}
                        onChange={(e) => {
                            setContract({ ...contract, notes: e.target.value });
                        }}
                    />
                    <div style={{ marginBottom: '80px' }} />
                </Container>
            </div>
            <div className='contract-register__container--footer'>
                <Container>
                    <div className='contract-register__container--footer-button'>
                        <button className='button-cancel' onClick={() => cancelAction()}>
                            {t('contractRegister.footer.cancel')}
                        </button>
                        <button className='button-save' onClick={() => createOrUpdateContract()}>
                            {!loading ? t('contractRegister.footer.save') : <span className='circular-progress' >{t('contractRegister.footer.saving')} <CircularProgress /></span>}
                        </button>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default ContractRegister;
