import { FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BasicModal from '../BasicModal/basic-modal';
import swal from 'sweetalert';
import CustomTextField from '../custom-text-field/custom-text-field';
import { Col, Row } from 'react-bootstrap';
import CloseImg from '../../assets/img/svg/fechar-modal.svg';
import PenImg from '../../assets/vendor/@fortawesome/fontawesome-free/svgs/solid/pen.svg';
import './hired-input.scss';
import '../../views/Contrato/contract-register/contract-register.scss';
import { EntityStatus } from '../../model/company';
import { Hired } from '../../model/hired';
import { State } from '../../model/state';
import { City } from '../../model/city';
import { Contract } from '../../model/contract';
import HiredService from '../../services/hired-service';

interface Props {
    hires?: Hired[];
    selectedHired?: Hired;
    currentHired?: Hired;
    inputLabel?: string;
    contract: Contract;
    cities: City[];
    states: State[];
    setSelectedHired: (...args) => void;
    setCurrentHired: (...args) => void;
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

export const HiredInput = (props: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const addressDefault = {
        street: '',
        number: '',
        zipcode: '',
        complement: '',
        city: undefined
    };
    const [hired, setHired] = useState<Hired>({ name: '', cnpj: '', address: addressDefault, status: EntityStatus.ACTIVE });
    const { t } = useTranslation();
    const classes = useStyles();
    const i18nDefaultPath = 'contractRegister.body.generalDate';

    const save = async () => {
        if (hired.id != null) {
            await HiredService.update(hired)
                .then((res: Hired) => {
                    props.getAll();
                    props.setContract({...props.contract, hired: {...res}});
                    props.onChange({ target: { value: res.id } });
                    props.setSelectedHired(res);
                    props.setCurrentHired(res);
                });
        } else {
            await HiredService.create(hired)
                .then((res: Hired) => {
                    props.getAll();
                    props.setContract({...props.contract, hired: {...res}});
                    props.onChange({ target: { value: res.id } });
                    props.setSelectedHired(res);
                    props.setCurrentHired(res);
                });
        };
    };

    const renderCreateInput = () => {
        return (
            <>
            <Row>
                <Col>
                    <CustomTextField
                        id={'newHired'}
                        value={hired.name}
                        label={'Nome'}
                        placeholder={'Nome'}
                        className={'custom-text-field-reference'}
                        onChange={(e) => setHired({ ...hired, name: e })}
                    />
                </Col>
                <Col>
                    <CustomTextField
                        mask={'99.999.999/9999-99'}
                        id={t(`${i18nDefaultPath}.textField.cnpj`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.cnpj`)}
                        placeholder={t(`${i18nDefaultPath}.textField.cnpj`)}
                        value={hired?.cnpj}
                        onChange={(e) => {
                            setHired({ ...hired, cnpj: e });
                        }}
                    />
                </Col>
            </Row>
            <Row className="hired-input__modal--row-middle">
                <Col md='6'>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.hiredAddress`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.hiredAddress`)}
                        placeholder={t(`${i18nDefaultPath}.textField.hiredAddress`)}
                        value={hired?.address?.street}
                        onChange={(e) => {
                            const newAddress = { ...hired?.address, street: e };
                            setHired({ ...hired, address: newAddress });
                        }}
                    />
                </Col>
                <Col md='3'>
                    <CustomTextField
                        id={t(`${i18nDefaultPath}.textField.number`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.number`)}
                        placeholder={t(`${i18nDefaultPath}.textField.number`)}
                        value={hired?.address?.number}
                        onChange={(e) => {
                            const newAddress = { ...hired?.address, number: e };
                            setHired({ ...hired, address: newAddress });
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
                        value={hired?.address?.zipcode}
                        onChange={(e) => {
                            const newAddress = { ...hired?.address, zipcode: e };
                            setHired({ ...hired, address: newAddress });
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
                                    ...hired?.address,
                                    city: {
                                        ...hired?.address?.city,
                                        state: {
                                            ...hired?.address?.city?.state,
                                            id: Number(e.target.value)
                                        }
                                    }
                                };
                                setHired({ ...hired, address: newAddress });
                                props.getAllCities(Number(e.target.value));
                            }}
                            value={hired?.address?.city?.state?.id ?? 0}
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
                            value={hired?.address?.city?.id ?? 0}
                            onChange={(e) => {
                                const newAddress = {
                                    ...hired?.address,
                                    city: {
                                        ...hired?.address?.city,
                                        id: Number(e.target.value)
                                    }
                                };
                                setHired({ ...hired, address: newAddress });
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

    const handleInactive = (hired: Hired) => {
        props.onChange({ target: { value: { id: 0 } } })
        swal({
            title: t('hiredInput.confirmDeleteTittle'),
            text: t('hiredInput.confirmDeleteMessage'),
            icon: "warning",
            buttons: [true, true],
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                await HiredService.inactive(hired.id ?? 0)
                    .then(() => {
                        props.getAll();
                    });
            };
        });
    };

    const handleEdit = (hired: Hired) => {
        if (hired.address?.city?.state?.id) {
            props.getAllCities(hired.address.city.state.id);
        };
        setHired(hired);
        setIsModalOpen(true);
    };

    const getHiredData = async (id: number) => {
        const hired = await props.hires?.filter((item) => item.id === id )[0];
        
        if (hired) {
            if (hired.address?.city?.state?.id) {
                props.getAllCities(hired.address.city.state.id);
            };
            props.setSelectedHired(hired);
            props.setCurrentHired(hired);
        } else {
            props.setSelectedHired({});        }
    };

    return (
        <>
            <FormControl variant={'filled'} className={classes.formControl}>
                <InputLabel htmlFor={'filled-age-native-simple'}>{props.inputLabel}</InputLabel>
                <Select
                    value={props.selectedHired?.id ?? 0}
                    onChange={(e) => {props.onChange(e); getHiredData(Number(e.target.value));}}>
                    <MenuItem value='' color={'#149372'} onClick={() => {setHired({ name: '', cnpj: '', address: addressDefault, status: EntityStatus.ACTIVE }); setIsModalOpen(true)}}>
                        {t('hiredInput.add')}
                    </MenuItem>
                    {props.hires?.map((hired, index) => (
                        <MenuItem key={index} value={hired?.id}>
                            <div className="menu-item-service">
                                {hired?.name}
                                {( hired?.status === 'ACTIVE') && (
                                    <div className="menu-item-service__icons">
                                        <div>
                                            <img height={'16px'}
                                                width={'16px'}
                                                src={PenImg}
                                                className={'pen-img'}
                                                alt={t('hiredInput.edit')}
                                                onClick={() => handleEdit(hired)} />
                                        </div>
                                        <div>
                                            <img 
                                                src={CloseImg}
                                                // className={'close-img'}
                                                alt={t('hiredInput.delete')}
                                                onClick={() => handleInactive(hired)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <BasicModal
                modalClassName="hired-input__modal"
                modalTitle={hired?.id != null ?
                    t('contractRegister.body.generalDate.editHired')
                    : t('contractRegister.body.generalDate.addNewHired')}
                secondaryButtonTitle={t('management.buttons.goBack')}
                secondaryButtonAction={() => {setIsModalOpen(false); props.setSelectedHired({...props.currentHired})}}
                primaryButtonTitle={t('management.buttons.save')}
                inputs={renderCreateInput()}
                onClose={() => {
                    setIsModalOpen(false);
                    setHired({ name: '', cnpj: '', address: addressDefault, status: EntityStatus.ACTIVE });
                }}
                primaryButtonAction={() => {
                    save();
                    setIsModalOpen(false);
                    setHired({ name: '', cnpj: '', address: addressDefault, status: EntityStatus.ACTIVE });
                }}
                showModal={isModalOpen}
                toggleModal={() => {}}
                hasTwoButtons
                centralized
            />
            
        </>
    );
}

export default HiredInput;
