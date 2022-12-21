import React from 'react';
import { useTranslation } from 'react-i18next';
import ImgChecked from '../../../assets/img/svg/blue-checkbox2.svg';
import ImgEmptyChecked from '../../../assets/img/svg/empty-checkbox.svg';
import './styles.scss';

interface Props {
    label: string;
    value: string;
    isActive?: boolean;
    onClick: (label: string) => void;
}

const GroupCheckButton = ({ isActive, label, value, onClick }: Props) => {
    const { t } = useTranslation();
    return (
        <div className={`checkbox-button check--${isActive ? "active" : "disable"} tag__color--${value}`} onClick={() => onClick(value)}>
            <img src={isActive ? ImgChecked : ImgEmptyChecked} alt=" " />
            {t(`${label}`)}
        </div>
    );
};

export default GroupCheckButton;
