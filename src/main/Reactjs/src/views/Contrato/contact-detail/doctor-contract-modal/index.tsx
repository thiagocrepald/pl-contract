import React, { useLayoutEffect, useState } from 'react';
import Modal from 'react-modal';
import MenuPage from '../../../../components/menu-page/menu-page';
import Footer from '../../../../components/footer/footer';
import ContractModalControl from './contract-modal-control';
import ContractModalCalendar from './contract-modal-calendar';
import ContractModalRequests from './contract-modal-requests';
import { Doctor } from '../../../../model/doctor';
import { Contract } from '../../../../model/contract';
import { useTranslation } from 'react-i18next';
import './doctor-contract-modal.scss';

interface Props {
    showModal: boolean;
    contract?: Contract;
    contractId?: number;
    selectedDoctor: Doctor;
    buttonClose?: () => void;
}

enum Tab {
    CONTROL,
    CALENDAR,
    REQUESTS
}

const DoctorContractModal = ({ showModal, buttonClose, selectedDoctor, contract, contractId }: Props) => {
    const { t } = useTranslation();

    useLayoutEffect(() => {
        window.document.body.style.overflow = showModal ? "hidden" : "auto";
    }, [showModal]);

    const tabs = [
        { name: t("contractDetail.control.modal.control"), code: Tab.CONTROL },
        { name: t("contractDetail.control.modal.calendar"), code: Tab.CALENDAR },
        { name: t("contractDetail.control.modal.requests"), code: Tab.REQUESTS },
    ];

    const [activeTab, setActiveTab] = useState<Tab>(0);

    return (
        <Modal isOpen={showModal} className="full-screen-modal" contentLabel="Example Modal">
            <div className="control-modal__container">
                <div className="control-modal__container--header">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div className="back-button" onClick={buttonClose}>
                            <div className="arrow-white" />
                        </div>
                        <div className="control-modal__container--header-title">{selectedDoctor?.name}</div>
                    </div>
                </div>
                <div className="control-modal__container--body">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "34px" }}>
                        <MenuPage tabs={tabs} activeTab={activeTab} onChange={(code: any) => setActiveTab(code)} />
                    </div>
                    <div style={{ marginTop: "38px", position: "relative" }}>
                        {activeTab === Tab.CONTROL && <ContractModalControl doctorId={selectedDoctor.id!} contractId={contractId} contract={contract}/>}
                        {activeTab === Tab.CALENDAR && <ContractModalCalendar doctorId={selectedDoctor.id!} contractId={contractId}/>}
                        {activeTab === Tab.REQUESTS && <ContractModalRequests doctorId={selectedDoctor.id} contractId={contractId} contract={contract}/>}
                    </div>
                </div>
                <Footer />
            </div>
        </Modal>
    );
};

export default DoctorContractModal;
