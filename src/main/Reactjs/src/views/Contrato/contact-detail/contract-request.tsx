import { makeStyles, Menu, MenuItem } from '@material-ui/core';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { isEmpty } from 'lodash';
import DateFilter from '../../../components/date-filter';
import FilterColumn from '../../../components/filter-column';
import FilterStatus from '../../../components/filter-status';
import SolicitationModal from '../../../components/solicitation-modal';
import SimpleOrderTable from '../../../components/simple-ordered-table/simple-ordered-table';
import Tags from '../../../components/tag/tag';
import { ComparisonOperator, LogicalOperator, PredicateOperators } from '../../../model/predicate-operators';
import { ModalType, Tag, UserType } from '../../../model/enums/contract-request';
import { AccessControl } from '../../../model/access-control';
import { Predicate } from '../../../model/predicate';
import { Contract } from '../../../model/contract';
import { Pageable } from '../../../model/pageable';
import { IRequest } from '../../../model/request';
import RequestService from '../../../services/request.service';
import RequestStatusService from '../../../services/request-status.service';
import AccessControlService from '../../../services/access-control-service';
import { APP_LOCAL_DATE_FORMAT, APP_WEEK_DAY_FORMAT } from '../../../config/constants';
import DateUtils from '../../../util/date-utils';
import { convertFilterToOperators } from '../../../util/predicate-operators-utils';
import '../../../components/main.scss';
import '../contract-detail.scss';
import './contract-request.scss';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    }
}));

interface IContractRequest {
    contractId: number;
    contract?: Contract;
}

const ContractRequest = (props: IContractRequest) => {
    // FIXME CHANGE COLOR FOR THIS PAGE ONLY AND CLEAN-UP WHEN LEAVING THE PAGE
    useLayoutEffect(() => {
        window.document.body.style.background = 'white';
        
        return () => {
            window.document.body.style.background = '';
        };
    });
    
    const { t } = useTranslation();
    const anchorRef = React.useRef(null);
    const [anchorColumn, setAnchorColumn] = useState<any>(null);
    const [anchorDots, setAnchorDots] = useState<any>(null);

    const [forceNewPage, setForceNewPage] = useState<boolean>(false);
    const [page, setPage] = useState<Pageable>({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
    });
    const [requestsPage] = useState<Pageable>({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0,
    });
    const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [showTabsModal, setShowTabsModal] = useState<boolean>(false);
    const [showDotsModal, setShowDotsModal] = useState<boolean>(false);
    const [showSolicitationModal, setShowSolicitationModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<any>(null);

    const [name, setName] = useState('');
    const [filterCode, setFilterCode] = useState('');
    const [filter, setFilter] = useState<PredicateOperators>({});
    const defaultPredicateOperators: PredicateOperators[] = [
        { 'status': { 'value': 'REJECTED', 'operators': [LogicalOperator.OR, ComparisonOperator.EQ]}},
        { 'status': { 'value': 'PENDING', 'operators': [LogicalOperator.OR, ComparisonOperator.EQ]}},
        { 'status': { 'value': 'ADJUSTED', 'operators': [LogicalOperator.OR, ComparisonOperator.EQ]}},
        { 'status': { 'value': 'CONTESTED', 'operators': [LogicalOperator.OR, ComparisonOperator.EQ]}},
        { 'status': { 'value': 'CORRECTION', 'operators': [LogicalOperator.OR, ComparisonOperator.EQ]}},
        { 'status': { 'value': 'ADJUSTED_ADMIN', 'operators': [LogicalOperator.OR, ComparisonOperator.EQ]}},
        { 'status': { 'value': 'ADJUSTED_DOCTOR', 'operators': [LogicalOperator.OR, ComparisonOperator.EQ]}},
        { 'status': { 'value': 'NOT_REGISTERED', 'operators': [LogicalOperator.OR, ComparisonOperator.EQ]}},
    ];
    const [predicateOperators, setPredicateOperators] = useState<PredicateOperators[]>(defaultPredicateOperators);
    const [operators, setOperators] = useState<(ComparisonOperator | LogicalOperator)[]>([]);
    const [predicate] = useState<Predicate>({
        'onCall.schedule.contract.id': props.contractId,
    });

    const [accessControlsList, setAccessControlsList] = useState<AccessControl[]>([]);
    const [accessControl, setAccessControl] = useState<AccessControl>();
    const [status, setStatus] = useState<string>('');
    const [request, setRequest] = useState<IRequest>();

    useEffect(() => {
        getAccessControls();
    }, []);

    useEffect(() => {
        getAccessControls(true);
    }, [predicateOperators]);

    useEffect(() => {
        if (forceNewPage) getAccessControls(false);
    }, [page]);

    const getAccessControls = (shouldResetPageAction?: boolean) => {
        if (shouldResetPageAction) return resetPage();
        AccessControlService.getAllAccessControls(predicate, page, predicateOperators).then((result) => {
            setForceNewPage(false);
            setAccessControlsList(result.content);
            setPage({
                ...page,
                size: result.size,
                page: result.number,
                totalPages: result.totalPages,
                totalElements: result.totalElements
            });
        });
    };

    const getRequest = (accessControlId: number) => {
        const requestPredicate: Predicate = ({'accessControl.id': accessControlId});
        RequestService.getAllRequests(requestPredicate, requestsPage).then((result) => {
            console.log({accessControlId, result, content: result.content[result.content?.length - 1]})
            setRequest(result.content[result.content?.length - 1]);
            handleOpenModal(ModalType.DOTS);
        });
    };

    const handleOnChangeStatus = async (currentStatus: Tag, newStatus: Tag) => {
        if (!isEmpty(accessControl) && currentStatus === Tag.PENDING) {
            await RequestStatusService.changePendingStatus(accessControl!.id!, newStatus)
            .then(() => {
              getAccessControls(true);
              setShowDotsModal(false);
            });
        };

        if (!isEmpty(request) && currentStatus === Tag.REJECTED) {
            await RequestStatusService.changeStatus(request!.id!, newStatus)
            .then(() => {
            getAccessControls(true);
            setShowDotsModal(false);
            });
        };
    };

    const handleFilter = async (newFilter: PredicateOperators) => {
        setFilter(newFilter);
    
        if (isEmpty(newFilter['status'])) {
            setPredicateOperators(defaultPredicateOperators.concat(convertFilterToOperators(newFilter)));
        } else {
            setPredicateOperators(convertFilterToOperators(newFilter));
        };
    };

    const handleChangePage = (newPage: number) => {
        setForceNewPage(true);
        setPage({ ...page, page: newPage });
    };

    const resetPage = () => {
        setForceNewPage(true);
        setPage({
            page: 0,
            size: 10,
            totalPages: 0,
            totalElements: 0,
            sort: 'onCall.date,desc'
        });
    };

    const handleOpenModal = (type: ModalType) => {
        setShowTabsModal(false);
        setShowFilterModal(false);
        setShowDotsModal(false);
        setShowStatusModal(false);
        setShowSolicitationModal(false);

        switch (type) {
            case ModalType.STATUS:
                setShowStatusModal(true);
                break;
            case ModalType.FILTER:
                setShowFilterModal(!showFilterModal);
                break;
            case ModalType.TABS:
                setShowTabsModal(true);
                break;
            case ModalType.DOTS:
                setShowDotsModal(true);
                break;
            default:
                setShowSolicitationModal(true);
                setModalType(type);
        }
    };

    const tableHeaders = [
        { name: t('contractDetail.request.table.crm'), sortCode: 'onCall.doctor.crmNumber', translate: 'crm', operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS] },
        { name: t('contractDetail.request.table.doctorName'), sortCode: 'onCall.doctor.name', translate: 'name', operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS] },
        { name: t('contractDetail.request.table.scale'), sortCode: 'onCall.schedule.scheduleName', translate: 'scale', operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS] },
        { name: t('contractDetail.request.table.sector'), sortCode: 'onCall.sectors.description', translate: 'sector', operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS] },
        { name: t('contractDetail.request.table.day'), sortCode: 'onCall.day', translate: 'day', operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS] },
        { name: t('contractDetail.request.table.date'), sortCode: 'date', sortDisabled: true },
        { name: t('contractDetail.request.table.estimatedTime'), sortCode: 'estimatedTime', sortDisabled: true },
        { name: t('contractDetail.request.table.expectedWorkload'), sortCode: 'expectedWorkload', sortDisabled: true },
        { name: t('contractDetail.request.table.time'), sortCode: 'time', sortDisabled: true },
        { name: t('contractDetail.request.table.accomplishedWorkload'), sortCode: 'accomplishedWorkload', sortDisabled: true },
        { name: t("contractDetail.control.modal.table.status"), icon: (
            <div
                ref={anchorRef}
                style={{ display: "inline-block", marginLeft: "8px", cursor: "pointer" }}
                className="icon-filter"
                onClick={() => handleOpenModal(ModalType.STATUS)}
            />
        ) },
        { sortDisabled: true }
    ];

    const handleTransformToTableContent = (content?: any[]) => {
        if (content == null || content.length === 0) return [];

        return content.map((item) => [
            item?.onCall?.doctor?.crmNumber ?? '',
            item?.onCall?.doctor?.name ?? '',
            item?.onCall?.schedule?.scheduleName ?? '',
            !isEmpty(item.onCall?.sectors) ? item.onCall!.sectors![0].description! : '',
            item?.onCall?.date ? moment(item.onCall.date).format(APP_WEEK_DAY_FORMAT).toUpperCase() : '',
            item?.onCall?.date ? moment(item.onCall.date).format(APP_LOCAL_DATE_FORMAT) : '',
            item?.onCall?.startTime && item?.onCall?.endTime ? DateUtils.formatTime(item.onCall.startTime, item.onCall.endTime, true) : '',
            item?.onCallWorkload ? <span style={{ fontWeight: 600 }}>{item.onCallWorkload}</span> : (item?.onCall?.startTime && item?.onCall?.endTime ? <span style={{ fontWeight: 600 }}>{DateUtils.subtractHourOfTwoDates(item.onCall.startTime, item.onCall.endTime, true)}</span> : ''),
            ((item?.requestStartTime || item?.startTime) && (item?.requestFinalTime || item?.endTime)) ? DateUtils.formatTime(item.requestStartTime ?? item.startTime, item.requestFinalTime ?? item.endTime, true) : '',
            item?.accomplishedWorkload ? <span style={{ fontWeight: 600 }}>{item.accomplishedWorkload}</span> : (item?.startTime && item?.endTime ? <span style={{ fontWeight: 600 }}>{DateUtils.subtractHourOfTwoDates(item.startTime, item.endTime, true)}</span> : ''),
            <Tags key={item?.onCall?.id} color='white' className={`tag__color--${item?.status}`}>
                {t(`global.status.${item?.status}`)}
            </Tags>,
            <>{(props?.contract?.isCurrentUserResponsible && item?.status !== 'ADJUSTED' && item?.status !== 'CORRECTION' && item?.status !== 'PROGRAMMED' && item?.status !== 'ATTENDANCE' && item?.status !== 'OK' && item?.status !== 'CANCELED') ? (
                <div
                    aria-haspopup="true"
                    className="icon-dots"
                    key={item?.id ?? '1'}
                    aria-controls="simple-menu"
                    onClick={({ currentTarget }) => {
                        getRequest(item?.id);
                        setAnchorDots(currentTarget);
                        setStatus(item?.status ?? '');
                        setAccessControl(item);
                    }} />
            ) : ""}
            </>
        ]);
    };

    const rows = handleTransformToTableContent(accessControlsList);

    return (
        <>
            <div className='contract-detail__container--body-group'>
                <div className='contract-detail__container--body-title'>{props.contract?.contractingParty?.name ?? ''}</div>
                <div className="contract-detail__container--body-filter-date">
                    <DateFilter setFilter={handleFilter} changeShow={() => handleOpenModal(ModalType.FILTER)} show={showFilterModal} filter={filter} />
                </div>
            </div>
            <div className='contract-detail__container--body-subtitle'> {t('contractDetail.request.title')}</div>
            <div className='contract-request__container'>
                <SimpleOrderTable
                    canFilter
                    rows={rows}
                    page={page}
                    totalPages={page.totalPages}
                    columnNameKeys={tableHeaders}
                    onChangePage={handleChangePage}
                    onFilter={({ currentTarget }, filterCodeString, translate, filterOperators) => {
                        setAnchorColumn(currentTarget);
                        handleOpenModal(ModalType.TABS);
                        setOperators(filterOperators ?? []);
                        setFilterCode(filterCodeString ?? '');
                        setName(translate ?? filterCodeString ?? '');
                    }}
                />
                <FilterColumn name={name} filter={filter} operators={operators} filterCode={filterCode} onFilter={handleFilter} anchorEl={anchorColumn} showModal={showTabsModal} onCloseModal={() => setShowTabsModal(false)} />
                <div className="contract-detail__container--body-filter-status">
                    <FilterStatus filter={filter} onFilter={handleFilter} showModal={showStatusModal} anchorEl={anchorRef.current} onCloseModal={() => setShowStatusModal(false)} />
                </div>
                <Menu className='tooltip-style' anchorEl={anchorDots} keepMounted open={showDotsModal} onClose={() => setShowDotsModal(false)}>
                    {status === Tag.PENDING && (
                        <>
                            <MenuItem onClick={() => handleOpenModal(ModalType.SOLICITATION)}>{t('contractDetail.request.tooltip.solicitation')}</MenuItem>
                            <MenuItem onClick={() => handleOnChangeStatus(status, Tag.OK)}>{t('contractDetail.request.tooltip.concludeAccess')}</MenuItem>
                            <MenuItem onClick={() => handleOnChangeStatus(status, Tag.CANCELED)}>{t('contractDetail.request.tooltip.cancelAccess')}</MenuItem>
                        </>
                    )}
                    {status === Tag.ADJUSTED_ADMIN && <MenuItem onClick={() => handleOpenModal(ModalType.SOLICITATION)}>{t('contractDetail.request.tooltip.editSolicitation')}</MenuItem>}
                    {status === Tag.REJECTED && (
                        <>
                            <MenuItem onClick={() => handleOpenModal(ModalType.SOLICITATION)}>{t('contractDetail.request.tooltip.solicitation')}</MenuItem>
                            <MenuItem onClick={() => handleOnChangeStatus(status, Tag.CANCELED)}>{t('contractDetail.request.tooltip.cancelAccess')}</MenuItem>
                        </>
                    )}
                    {(status === Tag.ADJUSTED_DOCTOR && request?.originator === UserType.DOCTOR && !request?.managerJustification) && <MenuItem onClick={() => handleOpenModal(ModalType.RESOLVE_SOLICITATION)}>{t('contractDetail.request.tooltip.resolveSolicitation')}</MenuItem>}
                    {(status === Tag.CONTESTED && request?.originator === UserType.ADMIN) && <MenuItem onClick={() => handleOpenModal(ModalType.RESOLVE_CONTESTED)}>{t('contractDetail.request.tooltip.resolveContested')}</MenuItem>}
                    {(status === Tag.CONTESTED && request?.originator === UserType.DOCTOR) && <MenuItem onClick={() => handleOpenModal(ModalType.RESOLVE_CORRECTION)}>{t('contractDetail.request.tooltip.resolveContested')}</MenuItem>}
                    {(status === Tag.ADJUSTED_DOCTOR && request?.originator === UserType.DOCTOR && request?.managerJustification) && <MenuItem onClick={() => handleOpenModal(ModalType.RESOLVE_CORRECTION)}>{t('contractDetail.request.tooltip.resolveSolicitation')}</MenuItem>}
                    {status === Tag.NOT_REGISTERED && <MenuItem onClick={() => handleOpenModal(ModalType.RESOLVE_NOT_REGISTERED)}>{t('contractDetail.request.tooltip.resolveNotRegistered')}</MenuItem>}
                </Menu>
            </div>
            <SolicitationModal show={showSolicitationModal} type={modalType} status={status} accessControl={accessControl} getAccessControls={getAccessControls} request={request} />
        </>
    );
};
export default ContractRequest;