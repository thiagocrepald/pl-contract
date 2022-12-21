import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import CloseImg from '../../../../assets/img/svg/fechar-modal.svg';
import '../../../../components/main.scss';
import { Contract } from '../../../../model/contract';
import { Doctor } from '../../../../model/doctor';
import ContractService from '../../../../services/contract-service';
import '../contract-register.scss';
import AutocompleteDoctorSearch from '../../../../components/autocomplete-doctor-search/autocomplete-doctor-search';

interface Props {
    classes: any;
    contract: Contract;
    setContract: (contract: Contract) => void;
}

export const AuthorizedDoctorForm = (props: Props) => {
    const { setContract, contract, classes } = props;
    const { t } = useTranslation();
    const [doctors, setDoctors] = useState<Doctor[]>([{}]);
    const i18nDefaultPath = 'contractRegister.body.doctorAuthorized';

    useEffect(() => {
        getDoctors();
    }, []);

    const getDoctors = () => {
        ContractService.getDoctors().then(result => setDoctors(result));
    };

    const removeDoctor = (id: number) => {
        setContract({ ...contract, contractDoctorLocks: [...contract?.contractDoctorLocks!]?.filter(it => it.doctor?.id !== id) });
    };

    return (
        <>
            <div className="contract-register__container--body-title">{t(`${i18nDefaultPath}.title`)}</div>
            <div className="contract-register__container--body-margin">
                <Row>
                    <Col md="8">
                        <AutocompleteDoctorSearch
                            id={'authorizedDoctor'}
                            label={t(`${i18nDefaultPath}.textField.name`)}
                            isSelfCleanInput={true}
                            onChange={(event, doctor) => {
                                if (doctor?.id) {
                                    const doctorId = doctor.id;
                                    let newList = [...contract?.contractDoctorLocks!];
                                    if (newList.findIndex(it => it.doctor?.id === doctorId) > -1) {
                                        newList = newList.filter(it => it.doctor?.id !== doctorId);
                                    } else {
                                        newList.push({ doctor: { id: doctor?.id, name: doctor?.name } });
                                    }
                                    setContract({ ...contract, contractDoctorLocks: newList });
                                }
                            }}
                        />
                        <div>
                            {_.sortBy(contract?.contractDoctorLocks ?? [], 'doctor.name').map((doctor, index) => (
                                <span key={index} className={'doctor-span'}>
                                    {doctor?.doctor?.name}
                                    <img className={'close-img-tag'} alt={'close'} src={CloseImg} onClick={() => removeDoctor(doctor.doctor!.id!)} />
                                </span>
                            ))}
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};
