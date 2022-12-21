import { Switch, withStyles } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import CloseImg from '../../../../assets/img/svg/fechar-modal.svg';
import CustomTextField from '../../../../components/custom-text-field/custom-text-field';
import '../../../../components/main.scss';
import ServiceTypeInput from '../../../../components/service-type-input/service-type-input';
import { Contract } from '../../../../model/contract';
import { ServiceType } from '../../../../model/service-type';
import { WorkplaceItem } from '../../../../model/workplace-item';
import { formatterCurrency, maskAmount } from '../../../../util/mask-utils';
import '../contract-register.scss';

interface Props {
    classes: any;
    contract: Contract;
    serviceTypes: ServiceType[];
    getAllServiceTypes: (...args) => void;
    setContract: (contract: Contract) => void;
}

const StatusSwitch = withStyles({
    switchBase: {
        '&$checked + $track': {
            backgroundColor: '#28f0b7',
        },
    },
    checked: {},
    track: {
        backgroundColor: '#ff0057'
    },
})(Switch);


export const WorkplaceForm = (props: Props) => {
    const { setContract, contract, serviceTypes, getAllServiceTypes } = props;
    const i18nDefaultPath = 'contractRegister.body.placeOperation';
    const { t } = useTranslation();

    const newWorkPlace = () => {
        const newField = [...contract?.workplaces!];
        newField.push({ timeControlOnApp: true, workplaceItems: [{}] });
        setContract({ ...contract, workplaces: newField });
    };

    const newWorkPlaceItem = (workplaceIndex: number) => {
        const newListWorkplaces = [...contract?.workplaces!];
        const newListWorkplaceItems = [...newListWorkplaces[workplaceIndex].workplaceItems!];
        newListWorkplaceItems.push({});
        newListWorkplaces[workplaceIndex] = { ...newListWorkplaces[workplaceIndex], workplaceItems: newListWorkplaceItems }
        setContract({ ...contract, workplaces: newListWorkplaces });
    };

    const removeWorkPlace = (removedKey: number) => {
        const newList = [...contract?.workplaces!].filter((workplace, key) => removedKey !== key);
        setContract({ ...contract, workplaces: newList });
    };

    const removeWorkPlaceItem = (removedKey: number, workplaceIndex: number) => {
        const newListWorkplaces = [...contract?.workplaces!];
        const newListWorkplaceItems = [...newListWorkplaces[workplaceIndex].workplaceItems!]
            .filter((workplaceItem, key) => removedKey !== key);
        newListWorkplaces[workplaceIndex] = { ...newListWorkplaces[workplaceIndex], workplaceItems: newListWorkplaceItems }
        setContract({ ...contract, workplaces: newListWorkplaces });
    };

    const renderItem = (item: WorkplaceItem, itemIndex: number, workplaceIndex: number) => {
        return (
            <>
                <div className='contract-register__container--body-title'>{t(`${i18nDefaultPath}.titleItem`)} </div>
                <div className='contract-register__container--body-margin'>
                    <img className='close-img-item' alt={'close'} src={CloseImg} onClick={() => removeWorkPlaceItem(itemIndex, workplaceIndex)} />
                    <Row>
                        <Col md='2'>
                            <CustomTextField
                                id={t(`${i18nDefaultPath}.textField.item`)}
                                className={'custom-text-field-reference'}
                                label={t(`${i18nDefaultPath}.textField.item`)}
                                placeholder={t(`${i18nDefaultPath}.textField.item`)}
                                value={item.item?.toString()}
                                onChange={(e) => {
                                    const newListWorkplaces = [...contract?.workplaces!];
                                    const newListWorkplacesItems = [...newListWorkplaces[workplaceIndex].workplaceItems!];
                                    newListWorkplacesItems[itemIndex] = { ...item, item: Number(e) };
                                    newListWorkplaces[workplaceIndex] = { ...newListWorkplaces[workplaceIndex], workplaceItems: newListWorkplacesItems }
                                    setContract({ ...contract, workplaces: newListWorkplaces });
                                }}
                            />
                        </Col>
                        <Col md='4'>
                            <CustomTextField
                                id={t(`${i18nDefaultPath}.textField.object`)}
                                className={'custom-text-field-reference'}
                                label={t(`${i18nDefaultPath}.textField.object`)}
                                placeholder={t(`${i18nDefaultPath}.textField.object`)}
                                value={item.object}
                                onChange={(e) => {
                                    const newListWorkplaces = [...contract?.workplaces!];
                                    const newListWorkplacesItems = [...newListWorkplaces[workplaceIndex].workplaceItems!];
                                    newListWorkplacesItems[itemIndex] = { ...item, object: e };
                                    newListWorkplaces[workplaceIndex] = { ...newListWorkplaces[workplaceIndex], workplaceItems: newListWorkplacesItems }
                                    setContract({ ...contract, workplaces: newListWorkplaces });
                                }}
                            />
                        </Col>
                        <Col md='2'>
                            <CustomTextField
                                id={t(`${i18nDefaultPath}.textField.amount`)}
                                className={'custom-text-field-reference'}
                                label={t(`${i18nDefaultPath}.textField.amount`)}
                                placeholder={t(`${i18nDefaultPath}.textField.amount`)}
                                value={item.quantity?.toString()}
                                onChange={(e) => {
                                    const newListWorkplaces = [...contract?.workplaces!];
                                    const newListWorkplacesItems = [...newListWorkplaces[workplaceIndex].workplaceItems!];
                                    newListWorkplacesItems[itemIndex] = { ...item, quantity: Number(e) };
                                    newListWorkplaces[workplaceIndex] = { ...newListWorkplaces[workplaceIndex], workplaceItems: newListWorkplacesItems }
                                    setContract({ ...contract, workplaces: newListWorkplaces });
                                }}
                            />
                        </Col>
                        <Col md='4'>
                            <CustomTextField
                                id={t(`${i18nDefaultPath}.textField.amountReceivable`)}
                                className={'custom-text-field-reference'}
                                label={t(`${i18nDefaultPath}.textField.amountReceivable`)}
                                placeholder={t(`${i18nDefaultPath}.textField.amountReceivable`)}
                                value={maskAmount(item.receivableAmount)}
                                onChange={(e) => {
                                    const newListWorkplaces = [...contract?.workplaces!];
                                    const newListWorkplacesItems = [...newListWorkplaces[workplaceIndex].workplaceItems!];
                                    newListWorkplacesItems[itemIndex] = { ...item, receivableAmount: formatterCurrency(e) };
                                    newListWorkplaces[workplaceIndex] = { ...newListWorkplaces[workplaceIndex], workplaceItems: newListWorkplacesItems }
                                    setContract({ ...contract, workplaces: newListWorkplaces });
                                }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <CustomTextField
                                id={t(`${i18nDefaultPath}.textField.amountPayable`)}
                                className={'custom-text-field-reference'}
                                label={t(`${i18nDefaultPath}.textField.amountPayable`)}
                                placeholder={t(`${i18nDefaultPath}.textField.amountPayable`)}
                                value={maskAmount(item.payablePartnerAmount)}
                                onChange={(e) => {
                                    const newListWorkplaces = [...contract?.workplaces!];
                                    const newListWorkplacesItems = [...newListWorkplaces[workplaceIndex].workplaceItems!];
                                    newListWorkplacesItems[itemIndex] = { ...item, payablePartnerAmount: formatterCurrency(e) };
                                    newListWorkplaces[workplaceIndex] = { ...newListWorkplaces[workplaceIndex], workplaceItems: newListWorkplacesItems }
                                    setContract({ ...contract, workplaces: newListWorkplaces });
                                }}
                            />
                        </Col>
                        <Col md={4}>
                            <CustomTextField
                                id={t(`${i18nDefaultPath}.textField.rpaPayableAmount`)}
                                className={'custom-text-field-reference'}
                                label={t(`${i18nDefaultPath}.textField.rpaPayableAmount`)}
                                placeholder={t(`${i18nDefaultPath}.textField.rpaPayableAmount`)}
                                value={maskAmount(item.paymentRpaAmount)}
                                onChange={(e) => {
                                    const newListWorkplaces = [...contract?.workplaces!];
                                    const newListWorkplacesItems = [...newListWorkplaces[workplaceIndex].workplaceItems!];
                                    newListWorkplacesItems[itemIndex] = { ...item, paymentRpaAmount: formatterCurrency(e) };
                                    newListWorkplaces[workplaceIndex] = { ...newListWorkplaces[workplaceIndex], workplaceItems: newListWorkplacesItems }
                                    setContract({ ...contract, workplaces: newListWorkplaces });
                                }}
                            />
                        </Col>
                        <Col md={4}>
                            <CustomTextField
                                id={t(`${i18nDefaultPath}.textField.pjPayableAmount`)}
                                className={'custom-text-field-reference'}
                                label={t(`${i18nDefaultPath}.textField.pjPayableAmount`)}
                                placeholder={t(`${i18nDefaultPath}.textField.pjPayableAmount`)}
                                value={maskAmount(item.paymentPjAmount)}
                                onChange={(e) => {
                                    const newListWorkplaces = [...contract?.workplaces!];
                                    const newListWorkplacesItems = [...newListWorkplaces[workplaceIndex].workplaceItems!];
                                    newListWorkplacesItems[itemIndex] = { ...item, paymentPjAmount: formatterCurrency(e) };
                                    newListWorkplaces[workplaceIndex] = { ...newListWorkplaces[workplaceIndex], workplaceItems: newListWorkplacesItems }
                                    setContract({ ...contract, workplaces: newListWorkplaces });
                                }}
                            />
                        </Col>
                    </Row>
                </div>
            </>
        )
    }

    return (
        <>
            {contract?.workplaces?.map((workplace, key) => (
                <>
                    <div className='contract-register__container--body-title'>{t(`${i18nDefaultPath}.title`)} </div>
                    <div className='contract-register__container--body-margin'>
                        <img className='close-img' alt={'close'} src={CloseImg} onClick={() => removeWorkPlace(key)} />
                        <Row>
                            <Col md='6'>
                                <CustomTextField
                                    id={t(`${i18nDefaultPath}.textField.name`)}
                                    className={'custom-text-field-reference'}
                                    label={t(`${i18nDefaultPath}.textField.name`)}
                                    placeholder={t(`${i18nDefaultPath}.textField.name`)}
                                    value={workplace.unitName}
                                    onChange={(e) => {
                                        const newList = [...contract?.workplaces!];
                                        newList[key] = { ...workplace, unitName: e };
                                        setContract({ ...contract, workplaces: newList });
                                    }}
                                />
                            </Col>
                            <Col>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className='text-subtitle'>{t('contractRegister.header.titleSecond')}</div>
                                    <StatusSwitch
                                        onClick={(e) => {
                                            const newList = [...contract?.workplaces!];
                                            newList[key] = { ...workplace, timeControlOnApp: !workplace?.timeControlOnApp };

                                            setContract({ ...contract, workplaces: newList });
                                        }}
                                        checked={workplace.timeControlOnApp}
                                        color='default'
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='6'>
                                <CustomTextField
                                    id={t(`${i18nDefaultPath}.textField.address`)}
                                    className={'custom-text-field-reference'}
                                    label={t(`${i18nDefaultPath}.textField.address`)}
                                    placeholder={t(`${i18nDefaultPath}.textField.address`)}
                                    value={workplace?.address?.street}
                                    onChange={(e) => {
                                        const address = { ...workplace?.address, street: e };
                                        const workplaces = [...contract?.workplaces!];
                                        workplaces[key].address = address;
                                        setContract({ ...contract, workplaces });
                                    }}
                                />
                            </Col>
                            <Col md='3'>
                                <CustomTextField
                                    id={t(`${i18nDefaultPath}.textField.number`)}
                                    className={'custom-text-field-reference'}
                                    label={t(`${i18nDefaultPath}.textField.number`)}
                                    placeholder={t(`${i18nDefaultPath}.textField.number`)}
                                    value={workplace?.address?.number}
                                    onChange={(e) => {
                                        const address = { ...workplace?.address, number: e };
                                        const workplaces = [...contract?.workplaces!];
                                        workplaces[key].address = address;
                                        setContract({ ...contract, workplaces });
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
                                    value={workplace?.address?.zipcode}
                                    onChange={(e) => {
                                        const address = { ...workplace?.address, zipcode: e };
                                        const workplaces = [...contract?.workplaces!];
                                        workplaces[key].address = address;
                                        setContract({ ...contract, workplaces });
                                    }}
                                />
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md='4'>
                                <ServiceTypeInput
                                    inputLabel={t(`${i18nDefaultPath}.textField.service`)}
                                    selectedServiceType={workplace?.serviceType}
                                    getAllServiceTypes={getAllServiceTypes}
                                    serviceTypes={serviceTypes}
                                    onChange={(e) => {
                                        const serviceType = { ...workplace?.serviceType, id: Number(e.target.value) };
                                        const workplaces = [...contract?.workplaces!];
                                        workplaces[key].serviceType = serviceType;
                                        setContract({ ...contract, workplaces });
                                    }}
                                />
                            </Col>
                            <Col md='4'>
                                <CustomTextField
                                    id={t(`${i18nDefaultPath}.textField.discount`)}
                                    className={'custom-text-field-reference'}
                                    label={t(`${i18nDefaultPath}.textField.discount`)}
                                    placeholder={t(`${i18nDefaultPath}.textField.discount`)}
                                    value={maskAmount(workplace.discountAmount)}
                                    onChange={(e) => {
                                        const newList = [...contract?.workplaces!];
                                        newList[key] = { ...workplace, discountAmount: formatterCurrency(e) };
                                        setContract({ ...contract, workplaces: newList });
                                    }}
                                />
                            </Col>
                        </Row>
                        {workplace?.workplaceItems?.map((item, indexItem) =>
                            renderItem(item, indexItem, key)
                        )}
                        <div className='contract-register--button' onClick={() => newWorkPlaceItem(key)}>
                            <i className='icon-mais' />
                            <span>{t(`${i18nDefaultPath}.textField.buttonItem`)}</span>
                        </div>
                    </div>
                </>
            ))}
            <div className='contract-register--button' onClick={newWorkPlace}>
                <i className='icon-mais' />
                <span>{t(`${i18nDefaultPath}.textField.button`)}</span>
            </div>
            <hr style={{ marginBottom: '0' }} />
        </>
    );
};
