import { Switch, withStyles } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import CustomTextField from '../../../../components/custom-text-field/custom-text-field';
import '../../../../components/main.scss';
import { Contract } from '../../../../model/contract';
import '../contract-register.scss';

interface Props {
    contract: Contract;
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

export const DelayParametersForm = (props: Props) => {
    const { setContract, contract } = props;
    const { t } = useTranslation();
    const i18nDefaultPath = 'contractRegister.body.delayParameters';
    
    return (
        <>
            <div className='contract-register__container--body-title'>{t(`${i18nDefaultPath}.title`)}</div>
            <Row>
                <Col>
                    <CustomTextField
                        mask={'99:99'}
                        id={t(`${i18nDefaultPath}.textField.delayTolerance`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.delayTolerance`)}
                        placeholder={t(`${i18nDefaultPath}.textField.delayTolerance`)}
                        value={contract?.entryDelayTolerance}
                        onChange={(e) => {
                            setContract({ ...contract, entryDelayTolerance: e });
                        }}
                    />
                </Col>
                <Col>
                    <CustomTextField
                        mask={'99:99'}
                        id={t(`${i18nDefaultPath}.textField.exitDelayTolerance`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.exitDelayTolerance`)}
                        placeholder={t(`${i18nDefaultPath}.textField.exitDelayTolerance`)}
                        value={contract?.exitDelayTolerance}
                        onChange={(e) => {
                            setContract({ ...contract, exitDelayTolerance: e });
                        }}
                    />
                </Col>
                <Col>
                    <CustomTextField
                        mask={'99:99'}
                        id={t(`${i18nDefaultPath}.textField.integralDelayTolerance`)}
                        className={'custom-text-field-reference'}
                        label={t(`${i18nDefaultPath}.textField.integralDelayTolerance`)}
                        placeholder={t(`${i18nDefaultPath}.textField.integralDelayTolerance`)}
                        value={contract?.integralDelayTolerance}
                        onChange={(e) => {
                            setContract({ ...contract, integralDelayTolerance: e });
                        }}
                    />
                </Col>
                <Col>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className='text-subtitle'>{t(`${i18nDefaultPath}.textField.accumulateDelayTolerance`)}</div>
                        <StatusSwitch
                            onClick={(e) => {
                                setContract({ ...contract, accumulateDelayTolerance: !contract?.accumulateDelayTolerance ?? false });
                            }}
                            checked={contract?.accumulateDelayTolerance ?? false}
                            color="default"
                        />
                    </div>
                </Col>
            </Row>

        </>
    );
};
