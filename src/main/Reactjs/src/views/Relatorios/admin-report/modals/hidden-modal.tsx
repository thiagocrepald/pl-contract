import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { APP_LOCAL_DATE_FORMAT, APP_TIME_FORMAT, APP_LOCAL_DATETIME_FORMAT_SECONDS_Z } from '../../../../config/constants';
import CloseImg from '../../../../assets/img/svg/fechar-gray.svg';
import EyeOffImg from '../../../../assets/img/svg/eye-off.svg';
import GreenEyeImg from '../../../../assets/img/svg/green-eye.svg';
import IconButton from '../../../../components/icon-button/icon-button';
import SimpleOrderTable from '../../../../components/simple-ordered-table/simple-ordered-table';
import { Pageable } from '../../../../model/pageable';
import '../styles.scss';

interface IProps {
    showModal: boolean;
    setShowModal: React.Dispatch<any>;
    hiddenData: any[];
};

const HiddenModal = ({ showModal, setShowModal, hiddenData }: IProps) => {
    const { t } = useTranslation();
    const [page, setPage] = useState<Pageable>({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0,
        sort: 'onCall.date,desc'
    });

    const tableHeaders = [
        { name: t('report.admin.table.contract'), sortCode: 'nameContractor'},
        { name: t('report.admin.table.nameDoctor'), sortCode: 'nameDoctor'},
        { name: t('report.admin.table.nameSchedule'), sortCode: 'nameSchedule'},
        { name: t('report.admin.table.unitName'), sortCode: 'unitName'},
        { name: t('report.admin.table.unitObject'), sortCode: 'unitObject'},
        { name: t('report.admin.table.onCallSector'), sortCode: 'onCallSector'},
        { name: t('report.admin.table.onCallDate'), sortCode: 'onCallDate'},
        { name: t('report.admin.table.onCallTime'), sortCode: 'onCallTime'},
        { name: '', icon: <img src={GreenEyeImg} alt='eye' /> }
    ];

    const formatUnknownTime = (startTime?: Date | string | Moment, endTime?: Date | string | Moment) => {
        const nullTime = '___:___';
        if (startTime && endTime) {
            return `${moment(startTime).utc().format(APP_TIME_FORMAT)} - ${moment(endTime).utc().format(APP_TIME_FORMAT)}`;
        } else if (startTime) {
            return `${moment(startTime).utc().format(APP_TIME_FORMAT)} - ${nullTime}`;
        } else if (endTime) {
            return `${nullTime} - ${moment(endTime).utc().format(APP_TIME_FORMAT)}`;
        };
        return null;
    };

    const formatContractData = (contractor?: string, contractNumber?: string) => {
        if (contractor && contractNumber) {
            return `${contractor.toUpperCase()} - nº ${contractNumber}`;
        } else if (contractor) {
            return `${contractor.toUpperCase()}`;
        } else {
            return `nº ${contractNumber}`;
        };
    };

    const handleTransformToTableContent = (content?: any[]) => {
        if (content == null || content.length === 0) return [];

        return content.map((item, index) => [
            item?.contractor || item?.contractNumber ? formatContractData(item.contractor, item.contractNumber) : '',
            item?.nameDoctor?.toUpperCase() ?? '',
            item?.nameSchedule?.toUpperCase() ?? '',
            item?.unitName ?? '',
            item?.unitObject ?? '',
            item?.onCallSector?.toUpperCase() ?? '',
            item?.onCallDate ? moment(item.onCallDate).format(APP_LOCAL_DATE_FORMAT) : '',
            item?.onCallStartTime || item?.onCallEndTime ? formatUnknownTime(item.onCallStartTime, item.onCallEndTime) : '',
            <div className='report__container--icon-eye' key={index}>
                <img src={EyeOffImg} alt='eye' onClick={() => {}}/>
            </div>
        ]);
    };

    const rows = handleTransformToTableContent(hiddenData);
    
    return (
        <Modal isOpen={showModal} className='report__modal-second' ariaHideApp={false}>
            <img className='close-img' src={CloseImg} onClick={() => setShowModal(false)}/>
            <div className='contract-request__modal--title'>{t('report.admin.modal.title')}</div>
            <div style={{ overflow: 'auto', maxHeight: '217px' }}>
                <SimpleOrderTable
                    // {...this.props}
                    rows={rows}
                    page={{page: 0, size: 10, totalPages: 0, totalElements: 0}}
                    columnNameKeys={tableHeaders}
                    onChangePage={()=>{}}
                    onSort={() => {}}
                    // onChangePage={this.handleChangePage}
                    // onSort={(code: string) => this.handleSort(code)}
                />
            </div>
            <hr />
            <div className='contract-request__modal--buttons'>
                <div style={{ marginRight: '12px' }}>
                    <IconButton color='white' isAlignCenter width={'150px'} height={'44px'} fontSize='15px' filled clickButton={() => setShowModal(false)}>
                        <div className='icon-arrow-filled' />
                        Voltar
                    </IconButton>
                </div>
                <div style={{ marginLeft: '12px' }}>
                    <IconButton color='green' isAlignCenter width={'150px'} height={'44px'} fontSize='15px' filled clickButton={() => {}}>
                        Salvar
                    </IconButton>
                </div>
            </div>
        </Modal>
    );
};

export default HiddenModal;