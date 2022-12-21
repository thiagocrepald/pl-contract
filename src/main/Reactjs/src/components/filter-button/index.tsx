import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import './filter-button.scss';

interface Props {
    ref?: ((instance: HTMLButtonElement | null) => void) | React.RefObject<HTMLButtonElement>;
    showModal?: boolean;
    onClick?: (e: any) => void;
}

const FilterButton = ({ ref, showModal, onClick }: Props) => {
    const [t] = useTranslation()

    return (
        <Button ref={ref} aria-controls={showModal ? "menu-list-grow" : undefined} aria-haspopup="true" onClick={onClick}>
            {t("contractDetail.control.filter")}
            <div className="downarrow-icon" />
        </Button>
    );
};

export default FilterButton;
