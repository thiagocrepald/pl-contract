/* tslint:disable */
import React from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import CustomTextField from '../../../../components/custom-text-field/custom-text-field';
import { FilesForm } from './additive-file-form';
import { Contract } from '../../../../model/contract';
import CloseImg from '../../../../assets/img/svg/fechar-modal.svg';
import '../../../../components/main.scss';
import '../contract-register.scss';

interface Props {
    contract: Contract;
    setContract: (contract: Contract) => void;
}

export const AdditiveForm = (props: Props) => {
    const { setContract, contract } = props;
    const { t } = useTranslation();
    const i18nDefaultPath = 'contractRegister.body.additive';

    const newAdditive = () => {
        const newField = [...contract?.additives!];
        newField.push({});
        setContract({ ...contract, additives: newField });
    };

    const removeAdditive = (removedKey: number) => {
        const newList = [...contract?.additives!].filter((additive, key) => removedKey !== key);
        setContract({ ...contract, additives: newList });
    };

    return (
        <>
            {contract?.additives?.map((additive, key) => (
                <div key={key} className='contract-register__additive-form'>
                    <div className='contract-register__container--body-title'>{t(`${i18nDefaultPath}.title`)}</div>
                    <div className='contract-register__container--body-margin-active'>
                        <img className='close-img' alt={'close'} src={CloseImg} onClick={() => removeAdditive(key)} />
                        <div style={{ marginTop: '20px' }} />
                        <Row>
                            <Col>
                                <CustomTextField
                                    id={t(`${i18nDefaultPath}.textField.additiveContract`)}
                                    className={'custom-text-field-reference'}
                                    label={t(`${i18nDefaultPath}.textField.additiveContract`)}
                                    placeholder={t(`${i18nDefaultPath}.textField.additiveContract`)}
                                    value={additive.contractAdditive}
                                    onChange={(e) => {
                                        let newList = [...contract?.additives!];
                                        newList[key] = { ...additive, contractAdditive: e };
                                        setContract({ ...contract, additives: newList });
                                    }}
                                />
                            </Col>
                            <Col>
                                <CustomTextField
                                    id={t(`${i18nDefaultPath}.textField.period`)}
                                    className={'custom-text-field-reference'}
                                    label={t(`${i18nDefaultPath}.textField.period`)}
                                    placeholder={t(`${i18nDefaultPath}.textField.period`)}
                                    isOnlyNumbers={true}
                                    value={additive.additiveTerm}
                                    onChange={(e) => {
                                        let newList = [...contract?.additives!];
                                        newList[key] = { ...additive, additiveTerm: e };
                                        setContract({ ...contract, additives: newList });
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md='3'>
                                <CustomTextField
                                    isDate
                                    id={t(`${i18nDefaultPath}.textField.date`)}
                                    className={'custom-text-field-reference'}
                                    label={t(`${i18nDefaultPath}.textField.date`)}
                                    placeholder={t(`${i18nDefaultPath}.textField.date`)}
                                    value={additive.startDate}
                                    onChange={(e) => {
                                        let newList = [...contract?.additives!];
                                        newList[key] = { ...additive, startDate: e };
                                        setContract({ ...contract, additives: newList });
                                    }}
                                />
                            </Col>
                            <Col md='3'>
                                <CustomTextField
                                    isDisabled
                                    id={t(`${i18nDefaultPath}.textField.endDate`)}
                                    className={'custom-text-field-reference'}
                                    placeholder={t(`${i18nDefaultPath}.textField.endDate`)}
                                    value={additive.startDate != null ? 
                                        moment(additive?.startDate, "YYYY/MM/DD").add(additive?.additiveTerm ?? 0, 'day').format("DD/MM/YYYY") : undefined}
                                    onChange={(e) => null}
                                />
                            </Col>
                        </Row>
                        <Row style={{ margin: '0px 0px 9px 0px'}}>
                            <FilesForm additive={additive} contract={contract} setContract={setContract} index={key} type='TAG' label={t("contractRegister.body.files.textField.attachDocument")}/>
                        </Row>
                    </div>
                </div>
            ))}

            <div className='contract-register--button' onClick={() => newAdditive()}>
                <i className='icon-mais' />
                <span>{t(`${i18nDefaultPath}.textField.button`)}</span>
            </div>
        </>
    );
};
