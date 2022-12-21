import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { APP_LOCAL_DATE_FORMAT, APP_TIME_FORMAT } from '../../../../config/constants';
import FilterReportGroup from '../../../../components/filter-report-group';
import FilterReportColumn from '../../../../components/filter-report-column';
import FilterReportData from '../../../../components/filter-report-data';
import IconButton from '../../../../components/icon-button/icon-button';
import SimpleOrderTable, { ColumnSort } from '../../../../components/simple-ordered-table/simple-ordered-table';
import { DropdownType, ReportParameterType, ReportFieldType } from '../../../../model/enums/admin-report';
import AgruparImg from '../../../../assets/img/svg/agrupar.svg';
import ColunasImg from '../../../../assets/img/svg/colunas.svg';
import ArrowImg from '../../../../assets/img/svg/down-arrow.svg';
import { ReactComponent as DoctorImg} from '../../../../assets/img/svg/clipboard-doctor-icon-green.svg';
import { maskCpf, maskCnpj, maskPrice } from '../../../../util/mask-utils';
// import { IAdminReport } from '../../../../model/admin-report';
import { Predicate } from '../../../../model/predicate';
import { Pageable } from '../../../../model/pageable';
import '../../../../components/main.scss';
import '../styles.scss';

interface IProps {
    reportData?: any[];
    filter: any;
    setFilter: React.Dispatch<any>;
    predicate: Predicate;
    setPredicate: React.Dispatch<React.SetStateAction<Predicate>>;
    pageable: Pageable;
    setPageable: (value: React.SetStateAction<Pageable>) => void;
    hiddenData: any;
    setHiddenData: React.Dispatch<React.SetStateAction<any>>;
    sortString: (sortString: string) => void;
    setIsOnCallsWithDoctor: (isOnCallsWithDoctor: boolean) => void;
    isOnCallsWithDoctor: boolean;
};

const AdminReportMain = ({ 
    reportData,
    filter, 
    setFilter, 
    predicate, 
    setPredicate, 
    pageable, 
    setPageable, 
    hiddenData, 
    setHiddenData, 
    sortString, 
    setIsOnCallsWithDoctor, 
    isOnCallsWithDoctor
}: IProps) => {
    const { t } = useTranslation();
    const [showFilterGroupDropdown, setShowFilterGroupDropdown] = useState<boolean>(false);
    const [showFilterColumnDropdown, setShowFilterColumnDropdown] = useState<boolean>(false);
    const [showDoctorDropdown, setShowDoctorDropdown] = useState<boolean>(false);
    const [showOnCallDropdown, setShowOnCallDropdown] = useState<boolean>(false);
    const [showScheduleDropdown, setShowScheduleDropdown] = useState<boolean>(false);
    const [showContractDropdown, setShowContractDropdown] = useState<boolean>(false);
    const [tableHeaders, setTableHeaders] = useState<any[]>([]);
    const [tableRows, setTableRows] = useState<any[]>([]);
    // const [forceRender, setForceRender] = useState<string>(moment().toISOString());
    const anchorRef = useRef(null);
    const columnRef = useRef(null);
    const dropdownPageRef = useRef(null);
    const anchorDrop = useRef(null);

    
    useEffect(() => {
        // tableHeader is setted by request predicate.selectFields
        // if predicate.selectFields is empty, it means reportData is filled by default data
        if (!isEmpty(predicate.selectFields)) {
            getTableHeaders();
            handleTransformToTableContent(reportData!);
        } else if (isEmpty(predicate.selectFields) && !isEmpty(reportData)) {
            setTableHeaders(defaultTableHeaders);
            handleTransformToTableContent(reportData!);
        } else {
            setTableHeaders(defaultTableHeaders);
            setTableRows([]);
        };
    }, [reportData]);

    // useEffect(() => {
    //     setForceRender(moment().toISOString());
    // }, [tableHeaders]);

    const updatePage =  (newPage: number) => {
		setPageable({ ...pageable, page: newPage });
	};

    const formatData = (field: string, data?: any) => {
        switch(field){
            case ReportParameterType.DOCTOR_NAME: 
                return data?.toUpperCase() ?? '';
            case ReportParameterType.CRM_NUMBER: 
                return data ?? '';
            case ReportParameterType.CPF:
                return data ? maskCpf(data) : '';
            case ReportParameterType.CNPJ:
                return data ? maskCnpj(data) : '';
            case ReportParameterType.DOCTOR_CITY:
                return data ?? '';
            case ReportParameterType.DOCTOR_STATE:
                return data ?? '';
            case ReportParameterType.CRM_STATE:
                return data ?? '';

            case ReportParameterType.CONTRACT_NUMBER:
                return data ?? '';
            case ReportParameterType.SANKHYA_CODE:
                return data ?? '';
            case ReportParameterType.RESULTS_CENTER:
                return data?.toUpperCase() ?? '';
            case ReportParameterType.SERVICE_TYPE_CONTRACT_MACRO:
                return data?.toUpperCase() ?? '';
            
            case ReportParameterType.CONTRACTOR_NAME: 
                return data?.toUpperCase() ?? '';
            case ReportParameterType.CONTRACTOR_CITY: 
                return data ?? '';
            case ReportParameterType.CONTRACTOR_STATE: 
                return data ?? '';

            case ReportParameterType.HIRED_NAME:
                return data?.toUpperCase() ?? '';
            case ReportParameterType.HIRED_CITY: 
                return data ?? '';
            case ReportParameterType.HIRED_STATE:
                return data ?? '';

            case ReportParameterType.ACCESS_RESPONSIBLE: 
                return data?.toUpperCase() ?? '';
            case ReportParameterType.CLOSURE_RESPONSIBLE: 
                return data?.toUpperCase() ?? '';

            case ReportParameterType.NAME_SCHEDULE:
                return data?.toUpperCase() ?? '';
            case ReportParameterType.SCHEDULE_START_DATE: 
                return data ? moment(data).format(APP_LOCAL_DATE_FORMAT) : '';
            case ReportParameterType.SCHEDULE_END_DATE: 
                return data ? moment(data).format(APP_LOCAL_DATE_FORMAT) : '';
            case ReportParameterType.UNIT_NAME: 
                return data?.toUpperCase() ?? '';
            case ReportParameterType.UNIT_OBJECT: 
                return data ?? '';
            case ReportParameterType.UNIT_SERVICE_TYPE: 
                return data?.toUpperCase() ?? '';

            case ReportParameterType.ON_CALL_DATE:
                return data ? moment(data).format(APP_LOCAL_DATE_FORMAT) : '';
            case ReportParameterType.ON_CALL_START_TIME:
                return data ?? '';
            case ReportParameterType.ON_CALL_END_TIME: 
                return data ?? '';
            case ReportParameterType.ON_CALL_SHIFT:
                return data ?? '';
            case ReportParameterType.ON_CALL_DAY:
                return data ?? '';
            case ReportParameterType.ON_CALL_SECTOR: 
                return data?.toUpperCase() ?? '';
            case ReportParameterType.ON_CALL_SPECIALITY:
                return data ?? '';
            case ReportParameterType.ON_CALL_DATE_MONTH:
                return data ?? '';
            case ReportParameterType.ON_CALL_DATE_YEAR:
                return data ?? '';

            case ReportParameterType.BOND:
                return data ?? '';
            case ReportParameterType.PAYMENT_TYPE:
                return data ?? '';
            case ReportParameterType.PREPAYMENT_TYPE:
                return data ?? '';

            case ReportParameterType.TOTAL_AMOUNT_ON_CALL_EXPECTED: 
                return data ? maskPrice(data) : '';
            case ReportParameterType.TOTAL_HOURS_ON_CALL_EXPECTED: 
                return data ?? '';
            case ReportParameterType.HOUR_VALUE_ON_CALL_EXPECTED: 
                return data ? maskPrice(data) : '';
            case ReportParameterType.HOUR_VALUE_EXPECTED_TO_RECEIVE: 
                return data ? maskPrice(data) : '';
            case ReportParameterType.TOTAL_AMOUNT_EXPECTED_TO_RECEIVE: 
                return data ? maskPrice(data) : '';
            case ReportParameterType.HOUR_VALUE_DIFFERENT_COST_DOCTOR: 
                return data ? maskPrice(data) : '';
            case ReportParameterType.HOUR_VALUE_EXPECTED_DOCTOR: 
                return data ? maskPrice(data) : '';
            case ReportParameterType.TOTAL_AMOUNT_EXPECTED_DOCTOR:
                return data ? maskPrice(data) : '';

            case ReportParameterType.FINAL_TIME_DOCTOR_ON_CALL: 
                return data ? moment.utc(data).format(APP_TIME_FORMAT) : '';
            case ReportParameterType.INITIAL_TIME_DOCTOR_ON_CALL: 
                return data ? moment.utc(data).format(APP_TIME_FORMAT) : '';
            case ReportParameterType.TOTAL_HOURS_DOCTOR_ACCOMPLISHED: 
                return data ?? '';
            case ReportParameterType.FINAL_TIME_DOCTOR_ON_CALL_ADJUSTED:
                return data ? moment.utc(data).format(APP_TIME_FORMAT) : '';
            case ReportParameterType.START_TIME_DOCTOR_ON_CALL_ADJUSTED: 
                return data ? moment.utc(data).format(APP_TIME_FORMAT) : '';
            case ReportParameterType.TOTAL_HOURS_DOCTOR_ACCOMPLISHED_ADJUSTED: 
                return data ?? '';
            case ReportParameterType.STATUS_ACCESS_DOCTOR: 
                return data ?? '';
            case ReportParameterType.HOUR_VALUE_PAID_DOCTOR: 
                return data ? maskPrice(data) : '';
            case ReportParameterType.TOTAL_AMOUNT_PAID_DOCTOR: 
                return data ? maskPrice(data) : '';
            case ReportParameterType.NAME_DOCTOR_BORE: 
                return data?.toUpperCase() ?? '';
            case ReportParameterType.HOUR_VALUE_DOCTOR_BORE: 
                return data ? maskPrice(data) : '';
            case ReportParameterType.AMOUNT_PAID_DOCTOR_BORE:
                return data ? maskPrice(data) : '';

            case ReportParameterType.EXTRAORDINARY_EXPENSE_AMOUNT: 
                return data ? maskPrice(data) : '';
            case ReportParameterType.EXTRAORDINARY_EXPENSE_DESCRIPTION:
                return data ?? '';

            case ReportParameterType.COORDINATOR_NAME: 
                return data?.toUpperCase() ?? '';
            case ReportParameterType.COORDINATOR_FIXED_VALUE: 
                return data ? maskPrice(data) : '';
            case ReportParameterType.COORDINATOR_HOUR_VALUE: 
                return data ? maskPrice(data) : '';
            case ReportParameterType.COORDINATOR_MINIMUM_HOURS:
                return data ?? '';
        };
    };

    const handleOpenDropdown = (type: DropdownType) => {
        setShowFilterGroupDropdown(false);
        setShowFilterColumnDropdown(false);
        setShowDoctorDropdown(false);
        setShowOnCallDropdown(false);
        setShowScheduleDropdown(false);
        setShowContractDropdown(false);

        switch (type) {
            case DropdownType.GROUP:
                setShowFilterGroupDropdown(true);
                break;
            case DropdownType.COLUMN:
                setShowFilterColumnDropdown(true);
                break;
            case DropdownType.DOCTOR:
                setShowDoctorDropdown(true);
                break;
            case DropdownType.SCHEDULE:
                setShowScheduleDropdown(true);
                break;
            case DropdownType.ON_CALL:
                setShowOnCallDropdown(true);
                break;
            case DropdownType.CONTRACT:
                setShowContractDropdown(true);
                break;
        };
    };

    const handleTransformToTableContent = (content: any[]) => {
        // table content is setted by predicate.selectFields
        // otherwise, table will be filled only with content of the row used as base to set columns names
        let fields: any[] = [];
        if (isEmpty(predicate.selectFields)) {
            defaultTableHeaders.map((item) => fields.push(item.sortCode));
            fields = fields.filter((item) => item !== ReportParameterType.UUID && item !== ReportParameterType.ID_DOCTOR && item !== ReportParameterType.ID_CONTRACT && item !== ReportParameterType.ID_SCHEDULE && item !== ReportParameterType.ID_ON_CALL);
        };
        if (!isEmpty(predicate.selectFields)) {
            const localFields = predicate.selectFields!.split(',');
            localFields.filter((item) => item !== ReportFieldType.UUID &&  item !== ReportFieldType.ID_DOCTOR && item !== ReportFieldType.ID_CONTRACT && item !== ReportFieldType.ID_SCHEDULE && item !== ReportFieldType.ID_ON_CALL).map((item) => fields.push(`${[ReportParameterType[item]]}`));
        };

        const tableContent: any[] = [];
        let rowContent: any[] = [];
        for (let i = 0; i < content.length; i++) {
            rowContent = [];
            for (let j = 0; j < fields.length; j++) {
                rowContent.push(formatData(fields[j], content[i][`${fields[j]}`]));
            };
            tableContent.push(rowContent);
        };

        return setTableRows([...tableContent]);
    };

    const defaultTableHeaders: ColumnSort[]  = [
        { name: t('report.admin.table.nameDoctor'), sortCode: 'nameDoctor'},
        { name: t('report.admin.table.nameSchedule'), sortCode: 'nameSchedule'},
        { name: t('report.admin.table.unitServiceType'), sortCode: 'unitServiceType'},
        { name: t('report.admin.table.onCallDate'), sortCode: 'onCallDate'},
        { name: t('report.admin.table.onCallStartTime'), sortCode: 'onCallStartTime'},
        { name: t('report.admin.table.onCallEndTime'), sortCode: 'onCallEndTime'},
        { name: t('report.admin.table.onCallSector'), sortCode: 'onCallSector'},
        { name: t('report.admin.table.totalAmountOnCallExpected'), sortCode: 'totalAmountOnCallExpected'}
    ];

    const getTableHeaders = () => {
        const fields = predicate?.selectFields?.split(',') ?? [];
        const headers: any[] = [];

        fields.filter((item) => item !== ReportFieldType.UUID &&  item !== ReportFieldType.ID_DOCTOR && item !== ReportFieldType.ID_CONTRACT && item !== ReportFieldType.ID_SCHEDULE && item !== ReportFieldType.ID_ON_CALL).map((item) => headers.push({ name: t(`report.admin.table.${ReportParameterType[item]}`), sortCode: `${ReportParameterType[item]}`}));
        return setTableHeaders([...headers]);
    };

    return (
        <>
            <div className='report__container--buttons'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className='report__container--buttons-dropdown'>
                        <IconButton ref={anchorDrop} color='gray' fontSize='14px' isAlignCenter width={'100px'} height={'40px'} filled clickButton={() => handleOpenDropdown(DropdownType.CONTRACT)}>
                            {t('report.admin.buttonContract')}
                            <img style={{ marginLeft: '4px' }} src={ArrowImg} />
                        </IconButton>
                        {showContractDropdown && <div className='filter-report-data__container--contract-gap'/>}
                    </div>
                    <div className='report__container--buttons-dropdown'>
                        <IconButton ref={anchorDrop} color='gray' fontSize='14px' isAlignCenter width={'100px'} height={'40px'} filled clickButton={() => handleOpenDropdown(DropdownType.SCHEDULE)}>
                            {t('report.admin.buttonSchedule')}
                            <img style={{ marginLeft: '4px' }} src={ArrowImg} />
                        </IconButton>
                        {showScheduleDropdown && <div className='filter-report-data__container--schedule-gap'/>}
                    </div>
                    <div className='report__container--buttons-dropdown'>
                        <IconButton ref={anchorDrop} color='gray' fontSize='14px' isAlignCenter width={'100px'} height={'40px'} filled clickButton={() => handleOpenDropdown(DropdownType.ON_CALL)}>
                            {t('report.admin.buttonOnCall')}
                            <img style={{ marginLeft: '4px' }} src={ArrowImg} />
                        </IconButton>
                        {showOnCallDropdown && <div className='filter-report-data__container--on-call-gap'/>}
                    </div>
                    <div className='report__container--buttons-dropdown'>
                        <IconButton ref={anchorDrop} color='gray' fontSize='14px' isAlignCenter width={'100px'} height={'40px'} filled clickButton={() => handleOpenDropdown(DropdownType.DOCTOR)}>
                            {t('report.admin.buttonDoctor')}
                            <img style={{ marginLeft: '4px' }} src={ArrowImg} />
                        </IconButton>
                        {showDoctorDropdown && <div className='filter-report-data__container--doctor-gap'/>}
                    </div>
                    <div style={{ marginRight: '8px' }}>
                        <IconButton ref={anchorRef} color='gray' fontSize='14px' isAlignCenter width={'142px'} height={'40px'} filled clickButton={() => handleOpenDropdown(DropdownType.GROUP)}>
                            <img style={{ marginRight: '4px' }} src={AgruparImg} />
                            {t('report.admin.button')}
                        </IconButton>
                    </div>
                    <div style={{ marginRight: '8px' }}>
                        <IconButton ref={columnRef} color='gray' fontSize='14px' isAlignCenter width={'142px'} height={'40px'} filled clickButton={() => handleOpenDropdown(DropdownType.COLUMN)}>
                            <img style={{ marginRight: '4px' }} src={ColunasImg} />
                            {t('report.admin.buttonThird')}
                        </IconButton>
                    </div>
                    <IconButton
                        ref={columnRef}
                        color='gray'
                        fontSize='14px' 
                        isAlignCenter 
                        width={'152px'} 
                        height={'40px'} 
                        filled 
                        clickButton={() => setIsOnCallsWithDoctor(!isOnCallsWithDoctor)}
                        lineHeight='1.3'
                    >
                        {/* <img style={{ marginRight: '4px' }} src={DoctorImg} /> */}
                        <DoctorImg style={{height: "40px"}}/>
                        {t('report.admin.buttonFourth')}
                    </IconButton>
                </div>
            </div>

            {/* ***** RELATÓRIO ADMIN - PAG 1 ***** */}
            <div>
                <div className='report__container--subtitle'> {t('report.admin.subtitle')}</div>
                <div className='report__container--table scroll-table padding-page' style={{padding: '0px'}}>
                    {!isEmpty(tableHeaders) && (
                        <SimpleOrderTable
                            // key={forceRender}
                            rows={tableRows}
                            page={pageable}
                            totalPages={pageable.totalPages}
                            columnNameKeys={tableHeaders}
                            onChangePage={updatePage}
                            onSort={stringCode => sortString(stringCode)}
                        />
                    )}
                </div>

                {/* ***** DROPDOWNS ***** */}
                <FilterReportGroup filter={filter} onFilter={(newFilter) => setFilter(newFilter)} showModal={showFilterGroupDropdown} onCloseModal={() => setShowFilterGroupDropdown(false)} anchorEl={anchorRef.current}/>
                <FilterReportColumn filter={filter} onFilter={(newFilter) => setFilter(newFilter)} showModal={showFilterColumnDropdown} onCloseModal={() => setShowFilterColumnDropdown(false)} anchorEl={columnRef.current} reportData={reportData}/>
                <FilterReportData type={DropdownType.DOCTOR} showModal={showDoctorDropdown} onCloseModal={() => setShowDoctorDropdown(false)} anchorEl={anchorDrop} hiddenData={hiddenData} setHiddenData={setHiddenData} pageRef={dropdownPageRef}/>
                <FilterReportData type={DropdownType.ON_CALL} showModal={showOnCallDropdown} onCloseModal={() => setShowOnCallDropdown(false)} anchorEl={anchorDrop} hiddenData={hiddenData} setHiddenData={setHiddenData} pageRef={dropdownPageRef}/>
                <FilterReportData type={DropdownType.SCHEDULE} showModal={showScheduleDropdown} onCloseModal={() => setShowScheduleDropdown(false)} anchorEl={anchorDrop} hiddenData={hiddenData} setHiddenData={setHiddenData} pageRef={dropdownPageRef}/>
                <FilterReportData type={DropdownType.CONTRACT} showModal={showContractDropdown} onCloseModal={() => setShowContractDropdown(false)} anchorEl={anchorDrop} hiddenData={hiddenData} setHiddenData={setHiddenData} pageRef={dropdownPageRef}/>
            </div>
        </>
    );
};

export default AdminReportMain;