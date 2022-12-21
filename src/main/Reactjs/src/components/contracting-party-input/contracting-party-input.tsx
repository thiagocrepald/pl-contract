import { FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import swal from 'sweetalert';
import CloseImg from '../../assets/img/svg/fechar-modal.svg';
import PenImg from '../../assets/vendor/@fortawesome/fontawesome-free/svgs/solid/pen.svg';
import { EntityStatus } from '../../model/company';
import { ContractingParty } from '../../model/contracting-party';
import { State } from '../../model/state';
import { City } from '../../model/city';
import { Contract } from '../../model/contract';
import ContractingPartyService from '../../services/contracting-party-service';
import BasicModal from '../BasicModal/basic-modal';
import CustomTextField from '../custom-text-field/custom-text-field';
import { Col, Row } from 'react-bootstrap';
import './contracting-party-input.scss';

interface Props {
    contractingParties?: ContractingParty[];
    selectedContractingParty?: ContractingParty;
    currentContractingParty?: ContractingParty;
    inputLabel?: string;
    contract: Contract;
    cities: City[];
    states: State[];
    setSelectedContractingParty: (...args) => void;
    setCurrentContractingParty: (...args) => void;
    setContract: (...args) => void;
    getAllCities: (...args) => void;
    getAllStates: (...args) => void;
    onChange: (...args: any) => void;
    getAll: (...args) => void;
}

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    }
}));

export const ContractingPartyInput = (props: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const addressDefault = {
        street: '',
        number: '',
        zipcode: '',
        complement: '',
        city: undefined
    };
    const [contractingParty, setContractingParty] = useState<ContractingParty>({ name: '', cnpj: '', address: addressDefault, status: EntityStatus.ACTIVE });
    const { t } = useTranslation();
    const classes = useStyles();
    const i18nDefaultPath = 'contractRegister.body.generalDate';

    const save = async () => {
        if(contractingParty.id != null) {
            await ContractingPartyService.update(contractingParty)
                .then((res: ContractingParty) => {
                    props.getAll();
                    props.setContract({...props.contract, contractingParty: {...res}});
                    props.onChange({target: {value: res.id}});
                    props.setSelectedContractingParty(res);
                    props.setCurrentContractingParty(res);
                });
        } else {
            await ContractingPartyService.create(contractingParty)
                .then((res: ContractingParty) => { 
                    props.getAll();
                    props.setContract({...props.contract, contractingParty: {...res}});
                    props.onChange({target: {value: res.id}});
                    props.setSelectedContractingParty(res);
                    props.setCurrentContractingParty(res);
                });
        };
    };

    const renderCreateInput = () => {
        return (
            <>
            <Row>
                <Col>
                    <CustomTextField
                        id={'newContractingParty'}
                        label={'Nome'}
                        placeholder={'Nome'}
                        value={contractingParty.name}
                        className={'custom-text-field-reference'}
                        onChange={(e) => setContractingParty({ ...contractingParty, name: e })}
                    />
                </Col>
                <Col>
                    <CustomTextField
                        mask={'99.999.999/9999-99'}
                        id={t(`${i18nDefaultPath}.textField.cnpj`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.cnpj`)}
                        placeholder={t(`${i18nDefaultPath}.textField.cnpj`)}
                        value={contractingParty?.cnpj}
                        onChange={(e) => {
                            setContractingParty({ ...contractingParty, cnpj: e });
                        }}
                    />
                </Col>
            </Row>
            <Row className="hired-input__modal--row-middle">
                <Col md='6'>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.employerAddress`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.employerAddress`)}
                        placeholder={t(`${i18nDefaultPath}.textField.employerAddress`)}
                        value={contractingParty?.address?.street}
                        onChange={(e) => {
                            const newAddress = { ...contractingParty?.address, street: e };
                            setContractingParty({ ...contractingParty, address: newAddress });
                        }}
                    />
                </Col>
                <Col md='3'>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.number`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.number`)}
                        placeholder={t(`${i18nDefaultPath}.textField.number`)}
                        value={contractingParty?.address?.number}
                        onChange={(e) => {
                            const newAddress = { ...contractingParty?.address, number: e };
                            setContractingParty({ ...contractingParty, address: newAddress });
                        }}
                    />
                </Col>
                <Col md='3'>
                    <CustomTextField
                        mask={'99.999-999'}
                        id={t(`${i18nDefaultPath}.textField.cep`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.cep`)}
                        placeholder={t(`${i18nDefaultPath}.textField.cep`)}
                        value={contractingParty?.address?.zipcode}
                        onChange={(e) => {
                            const newAddress = { ...contractingParty?.address, zipcode: e };
                            setContractingParty({ ...contractingParty, address: newAddress });
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormControl variant='filled' className={classes.formControl}>
                        <InputLabel style={{ paddingLeft: '2px', top: '1px' }} htmlFor='filled-age-native-simple'>{t(`${i18nDefaultPath}.textField.state`)}</InputLabel>
                        <Select
                            placeholder={t(`${i18nDefaultPath}.textField.state`)}
                            onChange={(e) => {
                                const newAddress = {
                                    ...contractingParty?.address,
                                    city: {
                                        ...contractingParty?.address?.city,
                                        state: {
                                            ...contractingParty?.address?.city?.state,
                                            id: Number(e.target.value)
                                        }
                                    }
                                };
                                setContractingParty({ ...contractingParty, address: newAddress });
                                props.getAllCities(Number(e.target.value));
                            }}
                            value={contractingParty?.address?.city?.state?.id ?? 0}
                        >
                            {props.states?.map((state, index) => (
                                <MenuItem key={index} value={state?.id}>{state?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Col>
                <Col>
                    <FormControl variant='filled' className={classes.formControl}>
                        <InputLabel style={{ paddingLeft: '2px', top: '1px' }} htmlFor='filled-age-native-simple'>{t(`${i18nDefaultPath}.textField.city`)}</InputLabel>
                        <Select
                            value={contractingParty?.address?.city?.id ?? 0}
                            onChange={(e) => {
                                const newAddress = {
                                    ...contractingParty?.address,
                                    city: {
                                        ...contractingParty?.address?.city,
                                        id: Number(e.target.value)
                                    }
                                };
                                setContractingParty({ ...contractingParty, address: newAddress });
                            }}>
                            {props.cities?.map((city, index) => (
                                <MenuItem key={index} value={city?.id}>{city?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Col>
            </Row>
            </>
        );
    };

    const handleInactive = (contractingParty: ContractingParty) => {
        props.onChange({ target: { value: { id: 0 } } })
        swal({
            title: t('contractingPartyInput.confirmDeleteTittle'),
            text: t('contractingPartyInput.confirmDeleteMessage'),
            icon: "warning",
            buttons: [true, true],
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                await ContractingPartyService.inactive(contractingParty.id ?? 0)
                    .then(() => {
                        props.getAll();
                    });
            };
        });
    };

    const handleEdit = (contractingParty: ContractingParty) => {
        if (contractingParty.address?.city?.state?.id) {
            props.getAllCities(contractingParty.address.city.state.id);
        };
        setContractingParty(contractingParty);
        setIsModalOpen(true);
    };

    const getContractingPartyData = async (id: number) => {
        const contractingParty = await props.contractingParties?.filter((item) => item.id === id )[0];
        
        if (contractingParty) {
            if (contractingParty.address?.city?.state?.id) {
                props.getAllCities(contractingParty.address.city.state.id);
            };
            props.setSelectedContractingParty(contractingParty);
            props.setCurrentContractingParty(contractingParty);
        } else {
            props.setSelectedContractingParty({}); 
        };
    };


    return (
        <>
            <FormControl variant={'filled'} className={classes.formControl}>
                <InputLabel htmlFor={'filled-age-native-simple'}>{props.inputLabel}</InputLabel>
                <Select
                    value={props.selectedContractingParty?.id ?? 0}
                    onChange={(e) => {props.onChange(e); getContractingPartyData(Number(e.target.value))}}>
                    <MenuItem value='' color={'#149372'} onClick={() => {setContractingParty({ name: '', cnpj: '', address: addressDefault, status: EntityStatus.ACTIVE }); setIsModalOpen(true)}}>
                        {t('contractingPartyInput.add')}
                    </MenuItem>
                    {props.contractingParties?.map((contractingParty, index) => (
                        <MenuItem key={index} value={contractingParty?.id}>
                            <div className={'menu-item-service'}>
                                {contractingParty?.name}
                                {(contractingParty?.status === 'ACTIVE' ) && (
                                    <div className="menu-item-service__icons">
                                    <div>
                                        <img height={'16px'}
                                            width={'16px'}
                                            src={PenImg}
                                            className={'pen-img'}
                                            alt={t('hiredInput.edit')}
                                            onClick={() => handleEdit(contractingParty)} />
                                    </div>
                                    <div>
                                        <img 
                                            src={CloseImg}
                                            // className={'close-img'}
                                            alt={t('hiredInput.delete')}
                                            onClick={() => handleInactive(contractingParty)} />
                                    </div>
                                </div>
                                )}
                            </div>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <BasicModal
                modalClassName="contracting-party-input__modal"
                modalTitle={contractingParty?.id != null ?
                    t('contractRegister.body.generalDate.editContractingParty')
                    : t('contractRegister.body.generalDate.addNewContractingParty')}
                secondaryButtonTitle={t('management.buttons.goBack')}
                secondaryButtonAction={() => {setIsModalOpen(false); props.setSelectedContractingParty({...props.currentContractingParty})}}
                primaryButtonTitle={t('management.buttons.save')}
                inputs={renderCreateInput()}
                onClose={() => {
                    setIsModalOpen(false);
                    setContractingParty({ name: '', cnpj: '', address: addressDefault, status: EntityStatus.ACTIVE });
                }}
                primaryButtonAction={() => {
                    save();
                    setIsModalOpen(false);
                    setContractingParty({ name: '', cnpj: '', address: addressDefault, status: EntityStatus.ACTIVE });
                }}
                showModal={isModalOpen}
                toggleModal={() => {}}
                hasTwoButtons
                centralized
            />
        </>
    );
}

export default ContractingPartyInput;
