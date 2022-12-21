import React from 'react';
import './dropdown-waiting-doctor.scss';

interface Props {
    title?: string;
    onClickFirstButton?: (isHold: any) => void;
    onClickSecondButton?: (isHold: any) => void;
    arrowRight?: boolean;
    disableArrow?: boolean;
}

const DropdownWaitingDoctor = ({ onClickFirstButton, onClickSecondButton, title, arrowRight, disableArrow }: Props) => {
    return (
        <div className="report-import__dropdown">
            {!disableArrow &&
                <div className={`report-import__dropdown--arrow${arrowRight ? 'Second' : ''}`} />
            }
            <div className="report-import__dropdown--title">{title}</div>
            <div className="report-import__dropdown--buttons">
                <button className="report-import__dropdown--buttons-no" onClick={onClickFirstButton}>
                    Não
                </button>
                <button className="report-import__dropdown--buttons-yes" onClick={onClickSecondButton}>
                    Sim
                </button>
            </div>
        </div>
    );
};

export default DropdownWaitingDoctor;
