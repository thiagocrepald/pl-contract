import { makeStyles } from '@material-ui/core';
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import DownloadImg from '../../../assets/img/svg/download2.svg';
import NotificationImg from '../../../assets/img/svg/notificaçao.svg';
import ArrowImg from '../../../assets/img/svg/down-arrow.svg';
import CloseImg from '../../../assets/img/svg/fechar-gray.svg';
import Footer from '../../../components/footer/footer';
import MenuPage from '../../../components/menu-page/menu-page';
import AdminReportMain from './tabs/admin-report-main';
import AdminReportList from './tabs/admin-report-list';
import IconButton from '../../../components/icon-button/icon-button';
import SelectInfinity from '../../../components/select-infinity';
import NotificationModal from '../../../components/notification-modal/notification-modal';
import SaveModal from './modals/save-modal';
import AdminReportService from '../../../services/admin-report.service';
// import { IAdminReport } from '../../../model/admin-report';
import { ModalType, ColumnType } from '../../../model/enums/admin-report';
import { Predicate } from '../../../model/predicate';
import { Pageable } from '../../../model/pageable';
import '../../../components/main.scss';
import './styles.scss';

export enum Tab {
    ADMIN_REPORT,
    MANAGE_REPORTS
};

const AdminReport = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<Tab>(0);
    const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
    const [showDotsModal, setShowDotsModal] = useState<boolean>(false);
    const [showSelectDropdown, setShowSelectDropdown] = useState<boolean>(false);
    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const [reportsList, setReportsList] = useState<any[]>([]);
    const [reportData, setReportData] = useState<any[]>([]);
    const [selectedReport, setSelectedReport] = useState<any>({});
    const anchorDrop = useRef(null);
    const dropdownPageRef = useRef(null);
    const [filter, setFilter] = useState<any>({});
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
    const [orderByFields, setOrderByFields] = useState<string[]>([ColumnType.onCallDate]);
    const [orderType, setOrderType] = useState<string>("DESC");
    const [isOnCallsWithDoctor, setIsOnCallsWithDoctor] = useState<boolean>(false);
    const [hiddenData, setHiddenData] = useState<any>({
        'doctorsId': [],
        'onCallsId': [],
        'schedulesId': [],
        'contractsId': []
    });
    const [predicate, setPredicate] = useState<Predicate>({
        'selectFields': '',
        'groupByFields': '',
        'doctorsId': '',
        'onCallsId': '',
        'schedulesId': '',
        'contractsId': ''
    });

    const [pageable, setPageable] = useState<Pageable>({
        page: 0,
        size: 10,
        totalPages: 0
    });

    const tabs = [
        { name: t('report.admin.tab.report'), code: Tab.ADMIN_REPORT },
        { name: t('report.admin.tab.list'), code: Tab.MANAGE_REPORTS }
    ];

    const mockReportData: any[] = [
        {
            idContract: 1,
            idDoctor: 3,
            idSchedule: 1,
            idOnCall: 1,
            nameDoctor: 'Agatha Marinho Rebouças', 
            nameSchedule: 'UPA PIRAQUARA - DEZEMBRO/2020', 
            unitServiceType: 'Pediatria Emergência',
            onCallSector: 'EMERGÊNCIA', 
            onCallDate: "2021-04-13T00:00:00Z",
            onCallStartTime:  "2021-04-13T11:00:00Z",
            onCallEndTime:  "2021-04-13T22:00:00Z",
            totalAmountOnCallExpected: 1200
        },
        {
            idContract: 2,
            idDoctor: 4,
            idSchedule: 1,
            idOnCall: 1,
            nameDoctor: 'Agatha Marinho Rebouças', 
            nameSchedule: 'UPA PIRAQUARA - DEZEMBRO/2020', 
            unitServiceType: 'Pediatria Emergência',
            onCallSector: 'EMERGÊNCIA', 
            onCallDate: "2021-04-13T00:00:00Z",
            onCallStartTime:  "2021-04-13T11:00:00Z",
            onCallEndTime:  "2021-04-13T22:00:00Z",
            totalAmountOnCallExpected: 1200
        },
        {
            idContract: 3,
            idDoctor: 5,
            idSchedule: 1,
            idOnCall: 1,
            nameDoctor: 'Agatha Marinho Rebouças', 
            nameSchedule: 'UPA PIRAQUARA - DEZEMBRO/2020', 
            unitServiceType: 'Pediatria Emergência',
            onCallSector: 'EMERGÊNCIA', 
            onCallDate: "2021-04-13T00:00:00Z",
            onCallStartTime:  "2021-04-13T11:00:00Z",
            onCallEndTime:  "2021-04-13T22:00:00Z",
            totalAmountOnCallExpected: 1200
        }
    ];

    const mockReportsList = [
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Fevereiro/2020",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - FEVEREIRO/2020"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Março/2020",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - MARÇO/2020"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Abril/2020",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - ABRIL/2020"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Maio/2020",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - MAIO/2020"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Junho/2020",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - JUNHO/2020"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Julho/2020",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - JULHO/2020"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Agosto/2020",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - AGOSTO/2020"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Setembro/2020",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - SETEMBRO/2020"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Outubro/2020",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - OUTUBRO/2020"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Novembro/2020",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - NOVEMBRO/2020"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Dezembro/2020",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - DEZEMBRO/2020"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Janeiro/2021",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - JANEIRO/2021"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Fevereiro/2021",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - FEVEREIRO/2021"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Março/2021",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - MARÇO/2021"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Abril/2021",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - ABRIL/2021"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Maio/2021",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - MAIO/2021"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Junho/2021",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - JUNHO/2021"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Julho/2021",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - JULHO/2021"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Agosto/2021",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - AGOSTO/2021"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Setembro/2021",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - SETEMBRO/2021"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Outubro/2021",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - OUTUBRO/2021"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Novembro/2021",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - NOVEMBRO/2021"}]
        },
        {
            fileName: "UPA Piraquara - Lista de Relatórios - Dezembro/2021",
            createdAt: "2021-04-10T11:00:00Z",
            editedAt:  "2021-04-13T15:30:00Z",
            content: [...mockReportData, {...mockReportData[0], nameSchedule: "UPA PIRAQUARA - DEZEMBRO/2021"}]
        }
    ];

    // CHANGE COLOR FOR THIS PAGE ONLY AND CLEAN-UP WHEN LEAVING THE PAGE
    useLayoutEffect(() => {
        window.document.body.style.background = 'white';
        
        return () => {
            window.document.body.style.background = '';
        };
    });

    useEffect(() => {
        getReportsList(mockReportsList);
    }, []);

    useEffect (() => {
        setFilter({
            ...filter,
            doctorsId: hiddenData.doctorsId.join(','),
            onCallsId: hiddenData.onCallsId.join(','),
            schedulesId: hiddenData.schedulesId.join(','),
            contractsId: hiddenData.contractsId.join(',')
        });

    }, [hiddenData]);

    useEffect(() => {
        if (!isFirstRender) {
            getReportData();
        };
    }, [pageable]);

    useEffect(() => {
        let fields: string = '';
        let groups: string = '';
        
        if (filter.selectFields) {
            Object.keys(filter.selectFields).map((key, index) => {
                if (filter.selectFields[key]) {
                    fields += `${key},`;
                };
            });
            fields = fields.slice(0,-1);
        };
        if (filter.groupByFields) {
            Object.keys(filter.groupByFields).map((key, index) => {
                if (filter.groupByFields[key]) {
                    groups += `${key},`;
                };
            });
            groups = groups.slice(0,-1);
        };
        
        setPredicate({
            selectFields: fields,
            groupByFields: groups,
            doctorsId:
            filter.doctorsId,
            onCallsId: filter.onCallsId,
            schedulesId: filter.schedulesId,
            contractsId: filter.contractsId
        });
        setPageable({...pageable, page: pageable.page});
    }, [filter, orderByFields, isOnCallsWithDoctor]);

    useEffect(() => {
        // when integrated to API
        // if (selectedReport) {
        //     setReportData(selectedReport);
        // } else {
        //     getReportData();
        // };

        // using mock data
        if (selectedReport && selectedReport.fileName) {
            const current = mockReportsList.filter((item) => item.fileName === selectedReport.fileName);
            if (!isEmpty(current)) {
                setReportData(current[0].content);
            };
        } else {
            getReportData();
        };
    }, [selectedReport]);

    const getReportData = () => {
        AdminReportService.getAllAdminReportData(predicate, pageable, isOnCallsWithDoctor, orderByFields, orderType)
            .then((result) => {
                setReportData(result.content);
                if (isFirstRender) {
                    setIsFirstRender(false);
                    setPageable({...pageable, totalPages: result.totalPages});
                };

                pageable.totalPages = result.totalPages;
            });
    };

    const getReportsList = (reports: any[]) => {
        // must change to apiService
        setReportsList(reports.slice(0,10));
    };

    const handleShowModal = (type: ModalType) => {
        setShowSaveModal(false);
        setShowDotsModal(false);

        switch(type){
            case ModalType.SAVE:
                setShowSaveModal(true);
                break;
            case ModalType.DOTS:
                setShowDotsModal(true);
                break;
        };
    };

    const formatSortString = (sortString: string) => {
        const separateOrderingString = sortString.split(",");
        setOrderByFields([ColumnType[separateOrderingString[0]]]);
        setOrderType(separateOrderingString[1].toUpperCase());
    };

    return (
        <>
            <div className='report__container'>
                <div className='report__container--header'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className='back-button'>
                            <div className='arrow-white' />
                        </div>
                        <div className='contract-detail__container--header-title'>{t('report.admin.title')}</div>
                        <div className='select-infinity__container--buttons-dropdown'>
                            <IconButton ref={anchorDrop} color='gray' fontSize='14px' isAlignCenter width={'370px'} height={'40px'} filled clickButton={() => setShowSelectDropdown(!showSelectDropdown)}>
                                {!isEmpty(selectedReport) ? (
                                    <span>
                                        {/* when integrated to API, change it to report fileName */}
                                        {/* {selectedReport.fileName} */}
                                        { selectedReport.fileName ?? `${Object.values(selectedReport)[0]} - ${Object.values(selectedReport)[1]}`}
                                        <img className='close-img' src={CloseImg} style={{height: '15px', marginTop: '-5px', marginRight: '-2px'}} onClick={() => setSelectedReport({})}/>
                                    </span>
                                ) : (
                                    <span style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                                        {t('report.admin.buttonReport')}
                                        <img style={{ marginRight: '4px' }} src={ArrowImg} />
                                    </span>
                                )}
                            </IconButton>
                            {showSelectDropdown && <div className='select-infinity__container--gap'/>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '70px' }}>
                            {activeTab === Tab.ADMIN_REPORT && (
                                <IconButton color='green' isAlignCenter width={'134px'} height={'32px'} filled clickButton={() => handleShowModal(ModalType.SAVE)}>
                                    {t('global.button.save')}
                                </IconButton>
                            )}
                        </div>
                        <img className='download-img' src={DownloadImg} />
                        <img className='notification-img' src={NotificationImg} onClick={() => setShowNotifications(!showNotifications)}/>
                    </div>
                </div>
                {showNotifications && <NotificationModal/>}
                <div className='report__container--header-second' >
                    <MenuPage tabs={tabs} activeTab={activeTab} onChange={(code: any) => setActiveTab(code)} />
                </div>
                <div className='report__container--header-rule'/>
                <div className="control-modal__container--body">
                    <div style={{ position: "relative" }}>
                        {activeTab === Tab.ADMIN_REPORT && (
                            <AdminReportMain 
                                reportData={reportData}
                                filter={filter}
                                setFilter={setFilter}
                                predicate={predicate}
                                setPredicate={setPredicate}
                                pageable={pageable}
                                setPageable={setPageable}
                                hiddenData={hiddenData}
                                setHiddenData={setHiddenData}
                                sortString={formatSortString}
                                setIsOnCallsWithDoctor={setIsOnCallsWithDoctor} 
                                isOnCallsWithDoctor={isOnCallsWithDoctor}
                            />
                        )}
                        {activeTab === Tab.MANAGE_REPORTS && <AdminReportList reportsList={reportsList} handleShowModal={handleShowModal} showDotsModal={showDotsModal} setShowDotsModal={setShowDotsModal} setActiveTab={setActiveTab} setSelectedOption={setSelectedReport}/>}
                    </div>
                </div>
                <Footer />

                {/* ***** MODALS ***** */}
                <SaveModal showModal={showSaveModal} setShowModal={setShowSaveModal} report={selectedReport}/>
                <SelectInfinity showModal={showSelectDropdown} onCloseModal={() => setShowSelectDropdown(false)} anchorEl={anchorDrop} pageRef={dropdownPageRef} selectedOption={selectedReport} setSelectedOption={setSelectedReport}/>
            </div>
        </>
    );
};
export default AdminReport;
