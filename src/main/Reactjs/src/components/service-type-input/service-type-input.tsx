import { FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceType } from '../../model/service-type';
import ContractService from '../../services/contract-service';
import BasicModal from '../BasicModal/basic-modal';
import swal from 'sweetalert';
import CustomTextField from '../custom-text-field/custom-text-field';
import CloseImg from '../../assets/img/svg/fechar-modal.svg';
import PenImg from '../../assets/vendor/@fortawesome/fontawesome-free/svgs/solid/pen.svg';
import './service-type-input.scss';
import { EntityStatus } from '../../model/company';

interface Props {
    serviceTypes?: ServiceType[];
    selectedServiceType?: ServiceType;
    inputLabel?: string;
    onChange: (...args: any) => void;
    getAllServiceTypes: (predicate?: string) => void;
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

export const ServiceTypeInput = (props: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [serviceType, setServiceType] = useState<ServiceType>({ description: '', status: EntityStatus.ACTIVE });
    const { t } = useTranslation();
    const classes = useStyles();

    const saveServiceType = async () => {
        if (serviceType.id != null) {
            await ContractService.updateServiceType(serviceType)
                .then(() => props.getAllServiceTypes());
        } else {
            await ContractService.createServiceType(serviceType)
                .then((serviceType: ServiceType) => {
                    props.getAllServiceTypes();
                    props.onChange({ target: { value: serviceType.id } });
                });
        }
    };

    const renderCreateServiceInputs = () => {
        return (
            <div>
                <CustomTextField
                    id={'newService'}
                    value={serviceType.description}
                    label={'Nome'}
                    placeholder={'Nome'}
                    onChange={(e) => setServiceType({ ...serviceType, description: e })}
                />
            </div>
        );
    };

    const inactiveServiceType = (serviceType: ServiceType) => {
        props.onChange({ target: { value: { id: 0 } } })
        swal({
            title: t('serviceTypeInput.confirmDeleteTittle'),
            text: t('serviceTypeInput.confirmDeleteMessage'),
            icon: "warning",
            buttons: [true, true],
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                await ContractService.inactiveServicesType(serviceType.id ?? 0)
                    .then(() => {
                        props.getAllServiceTypes();
                    });
            }
        });
    }

    const handleEdit = (serviceType: ServiceType) => {
        setServiceType(serviceType);
        setIsModalOpen(true)
    }

    return (
        <>
            <FormControl variant={'filled'} className={classes.formControl}>
                <InputLabel htmlFor={'filled-age-native-simple'}>{props.inputLabel}</InputLabel>
                <Select
                    value={props.selectedServiceType?.id ?? 0}
                    onChange={(e) => props.onChange(e)}>
                    <MenuItem value='' color={'#149372'} onClick={() => setIsModalOpen(true)}>
                        {t('serviceTypeInput.add')}
                    </MenuItem>
                    {props.serviceTypes?.map((serviceType, i) => (
                        <MenuItem key={i} value={serviceType?.id}>
                            <div className={'menu-item-service'}>
                                {serviceType?.description}
                                {(props.selectedServiceType?.id !== serviceType?.id && serviceType?.status === 'ACTIVE') && (
                                    <div className={'menu-item-service__icons'}>
                                        <div>
                                            <img height={'18px'}
                                                width={'18px'}
                                                src={PenImg}
                                                className={'pen-img'}
                                                alt={t('serviceTypeInput.edit')}
                                                onClick={() => handleEdit(serviceType)} />
                                        </div>
                                        <div>
                                            <img src={CloseImg}
                                                alt={t('serviceTypeInput.delete')}
                                                onClick={() => inactiveServiceType(serviceType)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <BasicModal
                modalTitle={serviceType?.id != null ?
                    t('contractRegister.body.placeOperation.textField.editService')
                    : t('contractRegister.body.placeOperation.textField.newService')}
                secondaryButtonTitle={t('management.buttons.goBack')}
                secondaryButtonAction={() => setIsModalOpen(false)}
                primaryButtonTitle={t('management.buttons.save')}
                inputs={renderCreateServiceInputs()}
                onClose={() => {
                    setIsModalOpen(false);
                    setServiceType({ description: '', status: EntityStatus.ACTIVE });
                }}
                primaryButtonAction={() => {
                    saveServiceType();
                    setIsModalOpen(false);
                    setServiceType({ description: '', status: EntityStatus.ACTIVE });
                }}
                showModal={isModalOpen}
                toggleModal={() => { }}
                hasTwoButtons
                centralized
            />
        </>
    );
}

export default ServiceTypeInput;
