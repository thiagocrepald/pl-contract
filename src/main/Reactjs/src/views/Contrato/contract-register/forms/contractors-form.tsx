import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import ContractingPartyInput from '../../../../components/contracting-party-input/contracting-party-input';
import CustomTextField from '../../../../components/custom-text-field/custom-text-field';
import HiredInput from '../../../../components/hired-input/hired-input';
import '../../../../components/main.scss';
import ServiceTypeInput from '../../../../components/service-type-input/service-type-input';
import { City } from '../../../../model/city';
import { Contract } from '../../../../model/contract';
import { ContractingParty } from '../../../../model/contracting-party';
import { ServiceType } from '../../../../model/service-type';
import { State } from '../../../../model/state';
import { Hired } from '../../../../model/hired';
import CityService from '../../../../services/city-service';
import StateService from '../../../../services/state-service';
import '../contract-register.scss';

interface Props {
    classes: any;
    contract: Contract;
    serviceTypes: ServiceType[];
    hires: Hired[];
    sankhyaCodeHasError: boolean;
    resultsCenterHasError: boolean;
    contractingParties: ContractingParty[];
    getAllContractingParties: (...args) => void;
    getAllServiceTypes: (...args) => void;
    getAllHires: (...args) => void;
    setContract: (contract: Contract) => void;
}

export const ContractorsForm = (props: Props) => {
    const { classes, setContract, contract,
        getAllServiceTypes, serviceTypes, hires, getAllHires,
        contractingParties, getAllContractingParties,
        sankhyaCodeHasError, resultsCenterHasError } = props;

    const { t } = useTranslation();
    const i18nDefaultPath = 'contractRegister.body.generalDate';

    const [states, setStates] = useState<State[]>([{}]);
    const [cities, setCities] = useState<City[]>([{}]);

    const [currentContractingParty, setCurrentContractingParty] = useState<ContractingParty>({});
    const [selectedContractingParty, setSelectedContractingParty] = useState<ContractingParty>({});
    
    const [currentHired, setCurrentHired] = useState<Hired>({});
    const [selectedHired, setSelectedHired]  =  useState<Hired>({});

    useEffect(() => {
        getAllStates();
    }, []);

    useEffect(() => {
        if (contract?.contractingParty) {
            setSelectedContractingParty(contract.contractingParty);
            setCurrentContractingParty(contract.contractingParty);
        };

        if (contract?.hired) {
            setSelectedHired(contract.hired);
            setCurrentHired(contract.hired);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract.id]);

    useEffect(() => {
        if (selectedHired?.address?.city?.state?.id) {
            getAllCities(selectedHired.address.city.state.id);
        };
    }, [selectedHired]);

    useEffect(() => {
        if (selectedContractingParty?.address?.city?.state?.id) {
            getAllCities(selectedContractingParty.address.city.state.id);
        };
    }, [selectedContractingParty]);

    const getAllCities = async (id: number) => {
        await CityService.getAllCities(id).then((result) => setCities(result.content));
    };

    const getAllStates = () => {
        StateService.getAllStates().then((result) => setStates(result.content));
    };

    return (
        <>
            <div className='contract-register__container--body-title'>{t(`${i18nDefaultPath}.title`)}</div>
            <Row>
                <Col md='3'>
                    <CustomTextField
                        id='contractNumber'
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.contractNumber`)}
                        placeholder={t(`${i18nDefaultPath}.textField.contractNumber`)}
                        value={contract?.contractNumber}
                        onChange={(e) => {
                            setContract({ ...contract, contractNumber: e });
                        }}
                    />
                </Col>
                <Col md='3'>
                    <CustomTextField
                        id='dateStart'
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.dateStart`)}
                        placeholder={t(`${i18nDefaultPath}.textField.dateStart`)}
                        value={contract?.startDate}
                        onChange={(e) => {
                            setContract({ ...contract, startDate: e });
                        }}
                        isDate
                    />
                </Col>
                <Col md='3'>
                    <CustomTextField
                        id='dateEnd'
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.dateEnd`)}
                        placeholder={t(`${i18nDefaultPath}.textField.dateEnd`)}
                        value={contract?.endDate}
                        onChange={(e) => {
                            setContract({ ...contract, endDate: e });
                        }}
                        isDate
                    />
                </Col>
                <Col md='3'>
                    <CustomTextField
                        placeholder={t(`${i18nDefaultPath}.textField.realEndDate`)}
                        label={t(`${i18nDefaultPath}.textField.realEndDate`)}
                        className={'custom-text-field-reference'}
                        value={contract?.contractEndTerm}
                        onChange={() => null}
                        id='realEndDate'
                        isDisabled
                        isDate
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.resultsCenter`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.resultsCenter`)}
                        placeholder={t(`${i18nDefaultPath}.textField.resultsCenter`)}
                        value={contract?.resultsCenter}
                        onChange={(e) => {
                            setContract({ ...contract, resultsCenter: e.toUpperCase() });
                        }}
                        error={resultsCenterHasError}
                        errorText={'Preencha com uma sigla válida'}
                    />
                </Col>
                <Col>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.code`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.code`)}
                        placeholder={t(`${i18nDefaultPath}.textField.code`)}
                        value={contract?.sankhyaCode?.toString()}
                        onChange={(e) => {
                            setContract({ ...contract, sankhyaCode: Number(e.replace(/[^0-9]/g,'')) });
                        }}
                        error={sankhyaCodeHasError}
                        errorText={'Preencha com um código válido'}
                    />
                </Col>
                <Col>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.paymentDate`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.paymentDate`)}
                        placeholder={t(`${i18nDefaultPath}.textField.paymentDate`)}
                        value={contract?.datePaymentPayroll}
                        onChange={(e) => {
                            setContract({ ...contract, datePaymentPayroll: e });
                        }}
                    />
                </Col>
                <Col>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.received`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.received`)}
                        placeholder={t(`${i18nDefaultPath}.textField.received`)}
                        value={contract?.deadlineReceipt}
                        onChange={(e) => {
                            setContract({ ...contract, deadlineReceipt: e });
                        }}
                    />
                </Col>
            </Row>
            
            <Row>
                <Col>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.bid`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.bid`)}
                        placeholder={t(`${i18nDefaultPath}.textField.bid`)}
                        value={contract?.biddingReference}
                        onChange={(e) => {
                            setContract({ ...contract, biddingReference: e });
                        }}
                    />
                </Col>
                <Col>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.process`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.process`)}
                        placeholder={t(`${i18nDefaultPath}.textField.process`)}
                        value={contract?.administrativeProcess}
                        onChange={(e) => {
                            setContract({ ...contract, administrativeProcess: e });
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col md='6'>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.guarantee`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.guarantee`)}
                        placeholder={t(`${i18nDefaultPath}.textField.guarantee`)}
                        value={contract?.contractualGuarantee}
                        onChange={(e) => {
                            setContract({ ...contract, contractualGuarantee: e });
                        }}
                    />
                </Col>
                <Col md='3'>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.readjustment`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.readjustment`)}
                        placeholder={t(`${i18nDefaultPath}.textField.readjustment`)}
                        value={contract?.readjustmentIndex}
                        onChange={(e) => {
                            setContract({ ...contract, readjustmentIndex: e });
                        }}
                    />
                </Col>
                <Col md='3'>
                    <ServiceTypeInput
                        inputLabel={t(`${i18nDefaultPath}.textField.macroService`)}
                        selectedServiceType={contract?.serviceTypeMacro}
                        getAllServiceTypes={getAllServiceTypes}
                        serviceTypes={serviceTypes}
                        onChange={(e) => {
                            setContract({ ...contract, serviceTypeMacro: { id: Number(e.target.value) } });
                        }}
                    />
                </Col>
            </Row>

            <hr style={{ margin: '0' }} />
            <div className='contract-register__container--body-title'>{t(`${i18nDefaultPath}.titleEmployer`)}</div>
            <Row>
                <Col>
                    <ContractingPartyInput
                        inputLabel={t(`${i18nDefaultPath}.textField.employerName`)}
                        selectedContractingParty={selectedContractingParty}
                        currentContractingParty={currentContractingParty}
                        contract={contract}
                        cities={cities}
                        states={states}
                        contractingParties={contractingParties}
                        setSelectedContractingParty={setSelectedContractingParty}
                        setCurrentContractingParty={setCurrentContractingParty}
                        setContract={setContract}
                        getAll={getAllContractingParties}
                        getAllCities={getAllCities}
                        getAllStates={getAllStates}
                        onChange={(e) => {
                            setContract({ ...contract, contractingParty: { id: Number(e.target.value) } });
                        }}
                    />
                </Col>
                <Col>
                    <CustomTextField
                        mask={'99.999.999/9999-99'}
                        id={t(`${i18nDefaultPath}.textField.cnpj`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.cnpj`)}
                        placeholder={t(`${i18nDefaultPath}.textField.cnpj`)}
                        value={currentContractingParty?.cnpj}
                        onChange={()=>{}}
                    />
                </Col>
            </Row>
            <Row>
                <Col md='6'>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.employerAddress`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.employerAddress`)}
                        placeholder={t(`${i18nDefaultPath}.textField.employerAddress`)}
                        value={currentContractingParty?.address?.street}
                        onChange={()=>{}}
                        isDisabled={true}
                    />
                </Col>
                <Col md='3'>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.number`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.number`)}
                        placeholder={t(`${i18nDefaultPath}.textField.number`)}
                        value={currentContractingParty?.address?.number}
                        onChange={()=>{}}
                        isDisabled={true}
                    />
                </Col>
                <Col md='3'>
                    <CustomTextField
                        mask={'99.999-999'}
                        id={t(`${i18nDefaultPath}.textField.cep`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.cep`)}
                        placeholder={t(`${i18nDefaultPath}.textField.cep`)}
                        value={currentContractingParty?.address?.zipcode}
                        onChange={()=>{}}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.label.state`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.label.state`)}
                        placeholder={t(`${i18nDefaultPath}.label.state`)}
                        value={currentContractingParty?.address?.city?.state?.name}
                        onChange={()=>{}}
                        isDisabled={true}
                    />
                </Col>
                <Col>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.label.city`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.label.city`)}
                        placeholder={t(`${i18nDefaultPath}.label.city`)}
                        value={currentContractingParty?.address?.city?.name}
                        onChange={()=>{}}
                        isDisabled={true}
                    />
                </Col>
            </Row>
            
            <hr style={{ margin: '0' }} />
            <div className='contract-register__container--body-title'>{t(`${i18nDefaultPath}.titleHired`)}</div>
            <Row>
                <Col>
                    <HiredInput
                        inputLabel={t(`${i18nDefaultPath}.textField.hiredName`)}
                        selectedHired={selectedHired}
                        currentHired={currentHired}
                        contract={contract}
                        cities={cities}
                        states={states}
                        hires={hires}
                        setSelectedHired={setSelectedHired}
                        setCurrentHired={setCurrentHired}
                        setContract={setContract}
                        getAll={getAllHires}
                        getAllCities={getAllCities}
                        getAllStates={getAllStates}
                        onChange={(e) => {
                            setContract({ ...contract, hired: { id: Number(e.target.value) } });
                        }}
                    />
                </Col>
                <Col>
                    <CustomTextField
                        mask={'99.999.999/9999-99'}
                        id={t(`${i18nDefaultPath}.textField.cnpj`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.cnpj`)}
                        placeholder={t(`${i18nDefaultPath}.textField.cnpj`)}
                        value={currentHired?.cnpj}
                        onChange={()=>{}}
                    />
                </Col>
            </Row>
            <Row>
                <Col md='6'>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.hiredAddress`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.hiredAddress`)}
                        placeholder={t(`${i18nDefaultPath}.textField.hiredAddress`)}
                        value={currentHired?.address?.street}
                        onChange={()=>{}}
                        isDisabled={true}
                    />
                </Col>
                <Col md='3'>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.number`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.number`)}
                        placeholder={t(`${i18nDefaultPath}.textField.number`)}
                        value={currentHired?.address?.number}
                        onChange={()=>{}}
                        isDisabled={true}
                    />
                </Col>
                <Col md='3'>
                    <CustomTextField
                        mask={'99.999-999'}
                        id={t(`${i18nDefaultPath}.textField.cep`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.cep`)}
                        placeholder={t(`${i18nDefaultPath}.textField.cep`)}
                        value={currentHired?.address?.zipcode}
                        onChange={()=>{}}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.label.state`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.label.state`)}
                        placeholder={t(`${i18nDefaultPath}.label.state`)}
                        value={currentHired?.address?.city?.state?.name}
                        onChange={()=>{}}
                        isDisabled={true}
                    />
                </Col>
                <Col>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.label.city`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.label.city`)}
                        placeholder={t(`${i18nDefaultPath}.label.city`)}
                        value={currentHired?.address?.city?.name}
                        onChange={()=>{}}
                        isDisabled={true}
                    />
                </Col>
            </Row>
        </>
    );
};