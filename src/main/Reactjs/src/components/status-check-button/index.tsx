import React from 'react';
import { useTranslation } from 'react-i18next';
import ImgChecked from '../../assets/img/svg/blue-checkbox2.svg';
import ImgEmptyChecked from '../../assets/img/svg/empty-checkbox.svg';
import './status-check-button.scss';

interface Props {
    tagColor: string;
    isActive?: boolean;
    onClick: (tagColor: string) => void;
}

const StatusCheckButton = ({ isActive, tagColor, onClick }: Props) => {
    const { t } = useTranslation();
    return (
        <div className={`checkbox-button check--${isActive ? "active" : "disable"} tag__color--${tagColor}`} onClick={() => onClick(tagColor)}>
            <img src={isActive ? ImgChecked : ImgEmptyChecked} alt=" " />
            {t(`global.status.${tagColor}`)}
        </div>
    );
};

export default StatusCheckButton;
