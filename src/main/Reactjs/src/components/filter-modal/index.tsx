import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grow, Paper, Popper } from '@material-ui/core';
import FilterButton from '../filter-button';
import './filter-modal.scss';

interface Props {
    showModal: boolean;
    children: JSX.Element | JSX.Element[];
    onResetFilters: () => void;
    onCancel: () => void;
    onApplyFilter: () => void;
    useButton?: boolean;
    handleToggle?: () => void;
    anchor?: any;
}

const FilterModal = ({ showModal, children, onResetFilters, onCancel, onApplyFilter, useButton, handleToggle, anchor }: Props) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(!useButton ? anchor : null);

    React.useEffect(() => {
        if (!useButton) {
            setAnchorEl(anchor);
        }
    }, [anchor, useButton]);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
        handleToggle && handleToggle();
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div className="base-selectfield" style={{ marginLeft: "12px", marginBottom: 0 }}>
                {showModal && <div aria-hidden="true" style={{ zIndex: 1, position: "fixed", inset: "0px", backgroundColor: "transparent" }} onClick={onCancel} />}
                {useButton && <FilterButton showModal={showModal} onClick={handleClick} />}
                <Popper className="paper-filter" style={{ zIndex: 10 }} open={showModal} anchorEl={anchorEl} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow {...TransitionProps} style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}>
                            <Paper style={{ zIndex: 10 }}>
                                <div className="filter-body__container">
                                    {children}
                                    <hr style={{ margin: "20px 0 16px 0" }} />
                                    <div className="filter-body__container-buttons">
                                        <div onClick={onResetFilters}>{t("contractDetail.control.dropdown.title.clean")}</div>
                                        <div style={{ display: "flex" }}>
                                            <div style={{ color: "#979797" }} onClick={onCancel} >
                                                {t("contractDetail.control.dropdown.title.cancel")}
                                            </div>
                                            <div style={{ marginLeft: "18px" }} onClick={onApplyFilter} >
                                                {t("contractDetail.control.dropdown.title.apply")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div>
    );
};

export default FilterModal;
