import { useTranslation } from 'react-i18next';
import { PaymentType } from '../../model/enums/payment-type';
import RadioSelection from '../radio-selection/radio-selection';
import React from 'react';
import { find, isEmpty } from 'lodash';
import { PaymentData } from '../../model/payment-data';

interface IDoctorPaymentsProps {
    doctorId?: number;
    payments: PaymentData[];
    onClick: (event: PaymentType) => void;
    onChange: (event: PaymentData[], eventChanged: PaymentType, isNew: boolean) => void;
}

const DoctorPayments = (props: IDoctorPaymentsProps) => {
    const [t] = useTranslation();

    const paymentOptions: any[] = [
        {
            value: PaymentType.LEGAL_ENTITY,
            label: t('doctorPayments.legal')
        },
        {
            value: PaymentType.PRIVATE_INDIVIDUAL,
            label: t('doctorPayments.juridical')
        },
        {
            value: PaymentType.ANOTHER_MODALITY,
            label: t('doctorPayments.another')
        }
    ];

    const onChange = (event: PaymentType[], eventChanged: PaymentType, isRemoved: boolean) => {
        const paymentsToReturn: PaymentData[] = [];

        event.forEach(item => {
            const itemToAdd = find(props.payments, { type: item });
            if (!isEmpty(itemToAdd)) return paymentsToReturn.push(itemToAdd!);
            if (!isRemoved) paymentsToReturn.push({ type: eventChanged, medic: { id: props.doctorId } });
        });

        props.onChange(paymentsToReturn, eventChanged, !isRemoved);
    };

    return (
        <RadioSelection<PaymentType>
            isColumn
            useSelectedProps
            onChange={onChange}
            onClick={props.onClick}
            options={paymentOptions}
            selectedOptions={props.payments?.map(item => item.type!)}
        />
    );
};

export default DoctorPayments;
