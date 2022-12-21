import React, { useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem } from '@material-ui/core';
import SimpleOrderTable, { ColumnSort } from '../../../../components/simple-ordered-table/simple-ordered-table';
import { Tab } from '../';
// import { IAdminReport } from '../../../../model/admin-report';
import { ModalType } from '../../../../model/enums/admin-report';
import { APP_LOCAL_DATE_FORMAT } from '../../../../config/constants';
import EditModal from '../modals/edit-modal';
import '../../../../components/main.scss';
import '../styles.scss';

interface IProps {
    reportsList?: any[];
    handleShowModal: (type: ModalType) => void;
    showDotsModal: boolean;
    setShowDotsModal: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
    setSelectedOption: React.Dispatch<any>;
};

const AdminReportList = ({ reportsList, handleShowModal, showDotsModal, setShowDotsModal, setActiveTab, setSelectedOption }: IProps) => {
    const { t } = useTranslation();
    const [anchorDots, setAnchorDots] = useState<any>(null);
    const [currentReport, setCurrentReport] = useState<any>({});
    const [showEditModal, setShowEditModal] = useState<boolean>(false);

    const handleOnClickRow = (index: number) => {
        setSelectedOption(reportsList?.[index]);
        setActiveTab(Tab.ADMIN_REPORT);
    };

    const onEditReport = () => {
        console.log("editar", currentReport);
        setShowDotsModal(false);
        setShowEditModal(true);
    };

    const onDeleteReport = () => {
        console.log("deletar", currentReport);
        setShowDotsModal(false);
    };

    const handleTransformToTableContent = (content?: any[]) => {
        if (content == null || content.length === 0) return [];

        return content.map((item, index) => [
            item.fileName?.toUpperCase() ??  '',
            item.createdAt ? moment(item.createdAt).format(APP_LOCAL_DATE_FORMAT) : '',
            item.editedAt ? moment(item.editedAt).format(APP_LOCAL_DATE_FORMAT) : '',
            <div key={index}>
                <div
                    aria-haspopup="true"
                    className="icon-dots"
                    aria-controls="simple-menu"
                    onClick={({ currentTarget }) => {
                        setAnchorDots(currentTarget);
                        setCurrentReport(item);
                        handleShowModal(ModalType.DOTS);
                    }} />
            </div>
        ]);
    };

    const tableHeaders: ColumnSort[] = [
        { name: t('report.admin.table.reportName'), sortCode: 'fileName' },
        { name: t('report.admin.table.creationDate'), sortCode: 'createdAt' },
        { name: t('report.admin.table.modifiedDate'), sortCode: 'editedAt' },
        { sortDisabled: true }
    ];

    const rows = handleTransformToTableContent(reportsList);

    return (
        <>
            <div className='report__container--title'>
                {/* <span>Fundação de Saúde do Município de Americana - FUSAME</span> */}
            </div>
            {/* ***** LISTA DE RELATÓRIO - PAG 2 ***** */}
            <div>
                <div className="report__container--subtitle"> {t("report.admin.subtitleSecond")}</div>
                <div className="report__container--table scroll-table padding-page" style={{padding: '0px'}}>
                    <SimpleOrderTable
                        // {...this.props}
                        rows={rows}
                        page={{page: 0, size: 10, totalPages: 0, totalElements: 0}}
                        columnNameKeys={tableHeaders}
                        onChangePage={()=>{}}
                        onSort={() => {}}
                        onClickRow={(index: number) => handleOnClickRow(index)}
                        // onChangePage={this.handleChangePage}
                        // onSort={(code: string) => this.handleSort(code)}
                    />
                </div>
                {/* ****** MODALS ***** */}
                <Menu className='tooltip-style' anchorEl={anchorDots} keepMounted open={showDotsModal} onClose={() => setShowDotsModal(false)}>
                    <MenuItem onClick={onEditReport}>{t('global.button.edit')}</MenuItem>
                    <MenuItem onClick={onDeleteReport}>{t('global.button.delete')}</MenuItem>
                </Menu>
                <EditModal showModal={showEditModal} setShowModal={setShowEditModal} report={currentReport}/>
            </div>
        </>
    )
};

export default AdminReportList;