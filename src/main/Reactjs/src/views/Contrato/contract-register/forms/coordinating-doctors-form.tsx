import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import CloseImg from '../../../../assets/img/svg/fechar-modal.svg';
import AutocompleteDoctorSearch from '../../../../components/autocomplete-doctor-search/autocomplete-doctor-search';
import CustomTextField from '../../../../components/custom-text-field/custom-text-field';
import '../../../../components/main.scss';
import { Contract } from '../../../../model/contract';
import { Doctor } from '../../../../model/doctor';
import DoctorService from '../../../../services/doctor-service';
import { formatterCurrency, maskAmount } from '../../../../util/mask-utils';
import '../contract-register.scss';

interface Props {
    classes: any;
    contract: Contract;
    setContract: (contract: Contract) => void;
}

export const CoordinatingDoctorsForm = (props: Props) => {
    const { setContract, contract, classes } = props;
    const { t } = useTranslation();
    const [doctors, setDoctors] = useState<Doctor[]>([{}]);
    const i18nDefaultPath = 'contractRegister.body.doctorCoordinator';

    useEffect(() => {
        getDoctors();
    }, []);

    const getDoctors = () => {
        const predicate = {
            search: ''
        };

        DoctorService.getAllDoctorsNew(predicate).then(result => setDoctors(result));
    };

    const newField = () => {
        const newField = [...contract?.coordinatingDoctors!];
        newField.push({});
        setContract({ ...contract, coordinatingDoctors: newField });
    };

    const removeField = (removedKey: number) => {
        const newList = [...contract?.coordinatingDoctors!].filter((coordinatingDoctor, key) => removedKey !== key);
        setContract({ ...contract, coordinatingDoctors: newList });
    };

    return (
        <>
            <div className="contract-register__container--body-title">{t(`${i18nDefaultPath}.title`)}</div>
            {contract?.coordinatingDoctors?.map((coordinatingDoctor, key) => (
                <>
                    <br />
                        <div className="contract-register__container--body-margin">
                            <img className='close-img-item' alt={'close'} src={CloseImg} onClick={() => removeField(key)} />
                            <Row>
                                <Col md="5">
                                    <AutocompleteDoctorSearch
                                        id={'coordinatingDoctor'}
                                        label={t(`${i18nDefaultPath}.textField.name`)}
                                        defaultDoctor={coordinatingDoctor.doctor}
                                        onChange={(event, doctor) => {
                                            const newList = [...contract?.coordinatingDoctors!];
                                            newList[key] = { ...coordinatingDoctor, doctor };
                                            setContract({ ...contract, coordinatingDoctors: newList });
                                        }}
                                    />
                                </Col>
                                <Col>
                                    <CustomTextField
                                        id={t(`${i18nDefaultPath}.textField.hours`)}
                                        className={'custom-text-field-reference'}
                                        label={t(`${i18nDefaultPath}.textField.hours`)}
                                        placeholder={t(`${i18nDefaultPath}.textField.hours`)}
                                        value={coordinatingDoctor.minimumHours?.toString()}
                                        onChange={e => {
                                            const newList = [...contract?.coordinatingDoctors!];
                                            newList[key] = { ...coordinatingDoctor, minimumHours: Number(e) };
                                            setContract({ ...contract, coordinatingDoctors: newList });
                                        }}
                                    />
                                </Col>
                                <Col md="2">
                                    <CustomTextField
                                        id={t(`${i18nDefaultPath}.textField.value`)}
                                        className={'custom-text-field-reference'}
                                        label={t(`${i18nDefaultPath}.textField.value`)}
                                        placeholder={t(`${i18nDefaultPath}.textField.value`)}
                                        value={maskAmount(coordinatingDoctor.hourValueAmount)}
                                        onChange={e => {
                                            const newList = [...contract?.coordinatingDoctors!];
                                            newList[key] = { ...coordinatingDoctor, hourValueAmount: formatterCurrency(e) };
                                            setContract({ ...contract, coordinatingDoctors: newList });
                                        }}
                                    />
                                </Col>
                                <Col md="2">
                                    <CustomTextField
                                        id={t(`${i18nDefaultPath}.textField.valueFixed`)}
                                        className={'custom-text-field-reference'}
                                        label={t(`${i18nDefaultPath}.textField.valueFixed`)}
                                        placeholder={t(`${i18nDefaultPath}.textField.valueFixed`)}
                                        value={coordinatingDoctor.fixedValueAmount != null ? formatterCurrency(coordinatingDoctor.fixedValueAmount) : ''}
                                        onChange={e => {
                                            const newList = [...contract?.coordinatingDoctors!];
                                            newList[key] = { ...coordinatingDoctor, fixedValueAmount: e };
                                            setContract({ ...contract, coordinatingDoctors: newList });
                                        }}
                                    />
                                </Col>
                            </Row>
                        </div>
                </>
            ))}

                    <div className="contract-register--button" onClick={() => newField()}>
                        <i className="icon-mais" />
                        <span>{t(`${i18nDefaultPath}.textField.button`)}</span>
                    </div>
                </>
            );
};
