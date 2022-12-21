import React, { Fragment, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import moment from 'moment';
import SimpleOrderTable, { ColumnSort } from '../../../components/simple-ordered-table/simple-ordered-table';
import DateFilter from '../../../components/date-filter';
import FilterColumn from '../../../components/filter-column';
import FilterStatus from '../../../components/filter-status';
import SolicitationModal from '../../../components/solicitation-modal';
import DoctorContractModal from './doctor-contract-modal';
import Tags from '../../../components/tag/tag';
import { Menu, MenuItem } from '@material-ui/core';
import { ComparisonOperator, LogicalOperator, PredicateOperators } from '../../../model/predicate-operators';
import { AccessControl as AccessControlModel } from '../../../model/access-control';
import { ModalType, Tag, UserType } from '../../../model/enums/contract-request';
import { Contract } from '../../../model/contract';
import { Doctor } from '../../../model/doctor';
import { Pageable } from '../../../model/pageable';
import { Predicate } from '../../../model/predicate';
import { IRequest } from '../../../model/request';
import AccessControlService from '../../../services/access-control-service';
import RequestService from '../../../services/request.service';
import RequestStatusService from '../../../services/request-status.service';
import { convertFilterToOperators } from '../../../util/predicate-operators-utils';
import BasicModal from '../../../components/BasicModal/basic-modal';
import DateUtils from '../../../util/date-utils';
import '../../../components/main.scss';
import '../contract-detail.scss';

interface IAccessControlProps extends RouteComponentProps<{ id: string }> {
    contractId: number;
    contract?: Contract;
}

const AccessControl = (props: IAccessControlProps) => {
    const { t } = useTranslation();
    const anchorStatus = React.useRef(null);
    const [anchorColumn, setAnchorColumn] = useState<any>(null);
    const [anchorDots, setAnchorDots] = useState<any>(null);

    const [forceNewPage, setForceNewPage] = useState<boolean>(false);
    const [page, setPage] = useState<Pageable>({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0,
        sort: 'onCall.date,desc'
    });
    const [requestsPage] = useState<Pageable>({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
    });

    const [showTabsModal, setShowTabsModal] = useState(false);
    const [showDotsModal, setShowDotsModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showSolicitationModal, setShowSolicitationModal] = useState<boolean>(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<any>(null);

    const [name, setName] = useState('');
    const [filterCode, setFilterCode] = useState('');
    const [filter, setFilter] = useState<PredicateOperators>({});
    const [predicateOperators, setPredicateOperators] = useState<PredicateOperators[]>([]);
    const [operators, setOperators] = useState<(ComparisonOperator | LogicalOperator)[]>([]);
    const [predicate] = useState<Predicate>({
        'onCall.schedule.contract.id': props.contractId
    });
    const [confirmationModalTitle, setConfirmationModalTitle] = useState<string>("");
    const [confirmationStatusTag, setConfirmationStatusTag] = useState<Tag | null>(null);

    const [accessControlsList, setAccessControlsList] = useState<AccessControlModel[]>([]);
    const [accessControl, setAccessControl] = useState<AccessControlModel>();
    const [status, setStatus] = useState<string>('');
    const [request, setRequest] = useState<IRequest>();
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>(undefined);

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
        AccessControlService.getAllAccessControls(predicate, page, predicateOperators).then(result => {
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

    const getRequest = (accessControlId: number | string) => {
        const requestPredicate: Predicate = { 'accessControl.id': accessControlId };
        RequestService.getAllRequests(requestPredicate, requestsPage).then(result => {
            setRequest(result.content[0]);
            handleOpenModal(ModalType.DOTS);
        });
    };

    const handleOnChangeStatus = async (currentStatus: Tag, newStatus: Tag) => {
        if (!isEmpty(accessControl) && currentStatus === Tag.PENDING) {
            if (newStatus === Tag.COMPLETED) {
                await RequestStatusService.changeToCompletedStatus(accessControl!.id!).then(() => {
                    getAccessControls(true);
                    setShowDotsModal(false);
                });
                return;
            }
            await RequestStatusService.changePendingStatus(accessControl!.id!, newStatus).then(() => {
                getAccessControls(true);
                setShowDotsModal(false);
            });
        }

        if (!isEmpty(request) && currentStatus === Tag.REJECTED) {
            await RequestStatusService.changeStatus(request!.id!, newStatus).then(() => {
                getAccessControls(true);
                setShowDotsModal(false);
            });
        }
    };

    const handleFilter = async (newFilter: PredicateOperators) => {
        setFilter(newFilter);
        setPredicateOperators(convertFilterToOperators(newFilter));
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
        handleClose();

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
            case ModalType.CONCLUDE_ACCESS:
                setConfirmationModalTitle(`${t('contractDetail.request.tooltip.concludeAccess')}?`);
                setConfirmationStatusTag(Tag.OK);
                setShowConfirmationModal(true);
                break;
            case ModalType.COMPLETE_ACCESS:
                setConfirmationModalTitle(`${t('contractDetail.request.tooltip.completeAccess')}?`);
                setConfirmationStatusTag(Tag.COMPLETED);
                setShowConfirmationModal(true);
                break;
            case ModalType.CANCELED:
                setConfirmationModalTitle(`${t('contractDetail.request.tooltip.cancelAccess')}?`);
                setConfirmationStatusTag(Tag.CANCELED);
                setShowConfirmationModal(true);
                break;
            default:
                setShowSolicitationModal(true);
                setModalType(type);
        }
    };

    const handleClose = () => {
        setShowTabsModal(false);
        setShowDotsModal(false);
        setShowFilterModal(false);
        setShowStatusModal(false);
        setShowSolicitationModal(false);
        setShowConfirmationModal(false);
        setConfirmationModalTitle("");
        setConfirmationStatusTag(null);
    };

    const renderConfirmModal = () => {
        return (
            <h5>
                {`${accessControl?.onCall?.schedule?.scheduleName + " - "}`}
                {`${accessControl?.onCall?.schedule?.workplace?.unitName + " - "}`}
                {`${DateUtils.formatDatePtBr(accessControl?.onCall?.date) + " - "}`}
                {`${accessControl?.onCall?.doctor?.name  + " "}`}
                {`${accessControl?.onCall?.doctor?.crmNumber}`}
            </h5>
        );
    };

    const defaultOperators = [LogicalOperator.OR, ComparisonOperator.CI, ComparisonOperator.CONTAINS];

    const tableHeaders: ColumnSort[] = [
        { name: t('contractDetail.control.table.crm'), sortCode: 'onCall.doctor.crmNumber', translate: 'crm', operators: defaultOperators },
        { name: t('contractDetail.control.table.scale'), sortCode: 'onCall.schedule.scheduleName', translate: 'scale', operators: defaultOperators },
        { name: t('contractDetail.control.table.name'), sortCode: 'onCall.doctor.name', translate: 'name', operators: defaultOperators },
        { name: t('contractDetail.control.table.local'), sortCode: 'onCall.schedule.workplace.unitName', translate: 'local', operators: defaultOperators },
        { name: t('contractDetail.control.table.day'), sortCode: 'day', sortDisabled: true },
        { name: t('contractDetail.control.table.month'), sortCode: 'month', sortDisabled: true },
        { name: t('contractDetail.control.table.year'), sortCode: 'year', sortDisabled: true },
        {
            name: t('contractDetail.control.table.status'),
            icon: (
                <div
                    ref={anchorStatus}
                    className="icon-filter"
                    onClick={() => handleOpenModal(ModalType.STATUS)}
                    style={{ display: 'inline-block', marginLeft: '8px', cursor: 'pointer' }}
                />
            )
        },
        { sortDisabled: true }
    ];

    const handleTransformToTableContent = (content?: AccessControlModel[]) => {
        if (content == null || content.length === 0) return [];
        return content.map(item => [
            item.onCall?.doctor?.crmNumber ?? '',
            item.onCall?.schedule?.scheduleName ?? '',
            item.onCall?.doctor?.name ?? '',
            item.onCall?.schedule?.workplace?.unitName ?? '',
            item.onCall?.date ? moment(item.onCall.date).format('DD') : '',
            item.onCall?.date ? moment(item.onCall.date).format('MMM') : '',
            item.onCall?.date ? moment(item.onCall.date).format('YYYY') : '',
            <Tags key={item.onCall?.id} color="white" className={`tag__color--${item?.status}`} styles={{ justifyContent: 'center' }}>
                {t(`global.status.${item?.status}`)}
            </Tags>,
            <>{(props?.contract?.isCurrentUserResponsible && item.status !== 'CORRECTION' && item.status !== 'PROGRAMMED' && item.status !== 'ATTENDANCE') ? (
                <div
                    aria-haspopup="true"
                    className="icon-dots"
                    aria-controls="simple-menu"
                    onClick={({ currentTarget }) => {
                        getRequest(item?.id ?? '');
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
        <Fragment>
            <div className="contract-detail__container--body-group">
                <div className="contract-detail__container--body-title">{props.contract?.contractingParty?.name ?? ''}</div>
                <div className="contract-detail__container--body-filter-date">
                    <DateFilter setFilter={handleFilter} changeShow={() => handleOpenModal(ModalType.FILTER)} show={showFilterModal} filter={filter} />
                </div>
            </div>
            <div className="contract-detail__container--body-subtitle"> {t('contractDetail.control.control')}</div>
            <div className="contract-detail__container--body-table contract-control__container">
                <SimpleOrderTable
                    canFilter
                    rows={rows}
                    page={page}
                    totalPages={page.totalPages}
                    columnNameKeys={tableHeaders}
                    onChangePage={handleChangePage}
                    stickyHeader={isEmpty(selectedDoctor) || selectedDoctor == null}
                    onClickRow={(index: number) => setSelectedDoctor(accessControlsList[index].onCall!.doctor)}
                    onFilter={({ currentTarget }, filterCodeString, translate, filterOperators) => {
                        setAnchorColumn(currentTarget);
                        handleOpenModal(ModalType.TABS);
                        setOperators(filterOperators ?? []);
                        setFilterCode(filterCodeString ?? '');
                        setName(translate ?? filterCodeString ?? '');
                    }}
                />
                <FilterColumn
                    name={name}
                    filter={filter}
                    operators={operators}
                    filterCode={filterCode}
                    onFilter={handleFilter}
                    anchorEl={anchorColumn}
                    showModal={showTabsModal}
                    onCloseModal={() => setShowTabsModal(false)}
                />
            </div>
            <div className="contract-detail__container--body-filter-status">
                <FilterStatus
                    filter={filter}
                    onFilter={handleFilter}
                    showModal={showStatusModal}
                    anchorEl={anchorStatus.current}
                    onCloseModal={() => setShowStatusModal(false)}
                />
            </div>
            <Menu className="tooltip-style" anchorEl={anchorDots} keepMounted open={showDotsModal} onClose={() => setShowDotsModal(false)}>
                {status === Tag.PENDING && (
                    <>
                        <MenuItem onClick={() => handleOpenModal(ModalType.SOLICITATION)}>{t('contractDetail.request.tooltip.solicitation')}</MenuItem>
                        <MenuItem onClick={() => handleOpenModal(ModalType.CONCLUDE_ACCESS)}>{t('contractDetail.request.tooltip.concludeAccess')}</MenuItem>
                        <MenuItem onClick={() => handleOpenModal(ModalType.COMPLETE_ACCESS)}>{t('contractDetail.request.tooltip.completeAccess')}</MenuItem>
                        <MenuItem onClick={() => handleOpenModal(ModalType.CANCELED)}>{t('contractDetail.request.tooltip.cancelAccess')}</MenuItem>
                    </>
                )}
                {status === Tag.ADJUSTED_ADMIN && (
                    <MenuItem onClick={() => handleOpenModal(ModalType.SOLICITATION)}>{t('contractDetail.request.tooltip.editSolicitation')}</MenuItem>
                )}
                {status === Tag.REJECTED && (
                    <>
                        <MenuItem onClick={() => handleOpenModal(ModalType.SOLICITATION)}>{t('contractDetail.request.tooltip.solicitation')}</MenuItem>
                        <MenuItem onClick={() => handleOnChangeStatus(status, Tag.CANCELED)}>{t('contractDetail.request.tooltip.cancelAccess')}</MenuItem>
                    </>
                )}
                {status === Tag.ADJUSTED_DOCTOR && request?.originator === UserType.DOCTOR && !request?.managerJustification && (
                    <MenuItem onClick={() => handleOpenModal(ModalType.RESOLVE_SOLICITATION)}>
                        {t('contractDetail.request.tooltip.resolveSolicitation')}
                    </MenuItem>
                )}
                {status === Tag.ADJUSTED_DOCTOR && request?.originator === UserType.DOCTOR && !request?.managerJustification && (
                    <MenuItem onClick={() => handleOpenModal(ModalType.RESOLVE_SOLICITATION)}>
                        {t('contractDetail.request.tooltip.resolveSolicitation')}
                    </MenuItem>
                )}
                {status === Tag.CONTESTED && request?.originator === UserType.DOCTOR && (
                    <MenuItem onClick={() => handleOpenModal(ModalType.RESOLVE_CORRECTION)}>{t('contractDetail.request.tooltip.resolveContested')}</MenuItem>
                )}
                {status === Tag.ADJUSTED_DOCTOR && request?.originator === UserType.DOCTOR && request?.managerJustification && (
                    <MenuItem onClick={() => handleOpenModal(ModalType.RESOLVE_CORRECTION)}>{t('contractDetail.request.tooltip.resolveSolicitation')}</MenuItem>
                )}
                {status === Tag.NOT_REGISTERED && (
                    <MenuItem onClick={() => handleOpenModal(ModalType.RESOLVE_NOT_REGISTERED)}>
                        {t('contractDetail.request.tooltip.resolveNotRegistered')}
                    </MenuItem>
                )}
                {(status === Tag.OK || status === Tag.CANCELED || status === Tag.ADJUSTED) && (
                    <MenuItem onClick={() => {
                        setRequest(undefined);
                        handleOpenModal(ModalType.SOLICITATION)
                    }}>
                        {t('contractDetail.request.tooltip.solicitation')}
                    </MenuItem>
                )}
            </Menu>
            <SolicitationModal
                show={showSolicitationModal}
                type={modalType}
                status={status}
                accessControl={accessControl}
                getAccessControls={getAccessControls}
                request={request}
            />
            <BasicModal
                onClose={handleClose}
                showModal={showConfirmationModal}
                modalTitle={confirmationModalTitle}
                toggleModal={handleClose}
                hasTwoButtons
                primaryButtonTitle={t("global.button.confirm")}
                secondaryButtonTitle={t("global.button.return")}
                primaryButtonAction={() => {
                    if (confirmationStatusTag != null) {
                        handleOnChangeStatus(Tag.PENDING, confirmationStatusTag);
                        handleClose();
                    }
                }}
                secondaryButtonAction={handleClose}
                centralized
                inputs={renderConfirmModal()}
            />
            {!isEmpty(selectedDoctor) && selectedDoctor != null && (
                <DoctorContractModal
                    showModal
                    contract={props.contract}
                    contractId={props.contractId}
                    selectedDoctor={selectedDoctor}
                    buttonClose={() => setSelectedDoctor(undefined)}
                />
            )}
        </Fragment>
    );
};

export default withRouter(AccessControl);
