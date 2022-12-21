
import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import moment from 'moment';
import SimpleOrderTable from '../../../../components/simple-ordered-table/simple-ordered-table';
import FilterStatus from '../../../../components/filter-status';
import FilterColumn from '../../../../components/filter-column';
import DateFilter from '../../../../components/date-filter';
import SolicitationModal from '../../../../components/solicitation-modal';
import Tags from '../../../../components/tag/tag';
import { Menu, MenuItem } from '@material-ui/core';
import { ComparisonOperator, LogicalOperator, PredicateOperators } from '../../../../model/predicate-operators';
import { AccessControl } from '../../../../model/access-control';
import { Contract } from '../../../../model/contract';
import { Predicate } from '../../../../model/predicate';
import { Pageable } from '../../../../model/pageable';
import { IRequest } from '../../../../model/request';
import { ModalType, Tag, UserType } from '../../../../model/enums/contract-request';
import AccessControlService from '../../../../services/access-control-service';
import RequestService from '../../../../services/request.service';
import RequestStatusService from '../../../../services/request-status.service';
import { convertFilterToOperators } from '../../../../util/predicate-operators-utils';
import { APP_DATE_COMPLETE_FORMAT } from '../../../../config/constants';
import DateUtils from '../../../../util/date-utils';
import '../../contract-detail.scss';
import '../../../../components/main.scss';

interface IContractModalControlProps {
	doctorId: number;
	contractId?: number;
	contract?: Contract;
};

const ContractModalControl = ({ doctorId, contractId, contract }: IContractModalControlProps) => {
	const { t } = useTranslation();
	const anchorRef = React.useRef(null);
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
		totalElements: 0,
  	});
  
	const [showTabsModal, setShowTabsModal] = useState(false);
	const [showDotsModal, setShowDotsModal] = useState(false);
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [showStatusModal, setShowStatusModal] = useState(false);
	const [showSolicitationModal, setShowSolicitationModal] = useState<boolean>(false);
	const [modalType, setModalType] = useState<any>(null);

	const [name, setName] = useState('');
	const [filterCode, setFilterCode] = useState('');
	const [filter, setFilter] = useState<PredicateOperators>({});
	const [predicateOperators, setPredicateOperators] = useState<PredicateOperators[]>([]);
	const [operators, setOperators] = useState<(ComparisonOperator | LogicalOperator)[]>([]);
	const [predicate] = useState<Predicate>({
		'onCall.doctor.id': doctorId,
		'onCall.schedule.contract.id': contractId,
	});

	const [accessControlsList, setAccessControlsList] = useState<AccessControl[]>([]);
	const [accessControl, setAccessControl] = useState<AccessControl>();
	const [status, setStatus] = useState<string>('');
	const [request, setRequest] = useState<IRequest>();

	useEffect(() =>  {
		getDoctor();
	}, []);

	useEffect(() => {
		getAccessControls();
	}, []);

	useEffect(() => {
		getAccessControls(true);
	}, [predicateOperators]);

	useEffect(() => {
		if (forceNewPage) getAccessControls(false);
	}, [page]);

	const getDoctor = () => {
		// DoctorService.getDoctor(doctorId).then(result =>
		//     setSelectedDoctor(result));
	};

	const getAccessControls = (shouldResetPageAction?: boolean) => {
		if (shouldResetPageAction) return resetPage();
		AccessControlService.getAllAccessControls(predicate, page, predicateOperators)
			.then(result => {
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
		const requestPredicate: Predicate = ({'accessControl.id': accessControlId});
		RequestService.getAllRequests(requestPredicate, requestsPage).then((result) => {
		setRequest(result.content[0]);
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
		setShowTabsModal(false);
		setShowDotsModal(false);
		setShowFilterModal(false);
		setShowStatusModal(false);
		setShowSolicitationModal(false);

		switch(type){
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
		{ name: t("contractDetail.control.table.scale"), sortCode: "onCall.schedule.scheduleName", translate: 'scale', operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS] },
		{ name: t("contractDetail.control.modal.table.specialty"), sortCode: "onCall.specialities.description", translate:  "specialty", operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS]},
		{ name: t("contractDetail.control.modal.table.sector"), sortCode: "onCall.sectors.description", translate:  "sector", operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS]},
		{ name: t("contractDetail.control.modal.table.date"), sortCode:  "date", sortDisabled: true},
		{ name: t("contractDetail.control.modal.table.estimatedTime"), sortCode:  "estimatedTime", sortDisabled: true},
		{ name: t("contractDetail.control.modal.table.finalTime"), sortCode:  "finalTime", sortDisabled: true},
		{ name: t("contractDetail.control.modal.table.hours"), sortCode:  "hours", sortDisabled: true},
		{ name: t("contractDetail.control.modal.table.status"), icon: (
			<div
				ref={anchorRef}
				style={{ display: "inline-block", marginLeft: "8px", cursor: "pointer" }}
				className="icon-filter"
				onClick={() => handleOpenModal(ModalType.STATUS)}
			/>
		) },
		{ sortDisabled: true },
	];

	const handleTransformToTableContent = (content?: any[]) => {
		if (content == null || content.length === 0) return [];
		return content.map((item, index) => [
			item.onCall?.schedule?.scheduleName ?? '',
			!isEmpty(item.onCall?.specialities) ? item.onCall!.specialities![0].description! : '',
			!isEmpty(item.onCall?.sectors) ? item.onCall!.sectors![0].description! : '',
			item.onCall?.date ? moment(item.onCall.date).format(APP_DATE_COMPLETE_FORMAT) : '',
			item.onCall?.startTime && item.onCall.endTime ? DateUtils.formatTime(item.onCall.startTime, item.onCall.endTime, true) : '',
			((item?.requestStartTime || item?.startTime) && (item?.requestFinalTime || item?.endTime)) ? DateUtils.formatTime(item.requestStartTime ?? item.startTime, item.requestFinalTime ?? item.endTime, true) : '',
            item?.accomplishedWorkload ? <span style={{ fontWeight: 600 }}>{item.accomplishedWorkload}</span> : (item?.startTime && item?.endTime ? <span style={{ fontWeight: 600 }}>{DateUtils.subtractHourOfTwoDates(item.startTime, item.endTime, true)}</span> : ''),
			<Tags key={index} color="white" className={`tag__color--${item?.status}`}>
				{t(`global.status.${item?.status}`)}
			</Tags>,
			<>{(contract?.isCurrentUserResponsible && item.status !== 'ADJUSTED' && item.status !== 'CORRECTION' && item.status !== 'PROGRAMMED' && item.status !== 'ATTENDANCE' && item.status !== 'OK' && item.status !== 'CANCELED') ? (
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
			<div className="contract-detail__modal-control--filter-date">
				<DateFilter setFilter={handleFilter} changeShow={() => handleOpenModal(ModalType.FILTER)} show={showFilterModal} filter={filter} />
			</div>
			<div className="contract-detail__modal-control--table">
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
			<FilterStatus
				filter={filter}
				onFilter={handleFilter}
				showModal={showStatusModal}
				anchorEl={anchorRef.current}
				onCloseModal={() => setShowStatusModal(false)}
			/>
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
			<SolicitationModal show={showSolicitationModal} type={modalType} status={status} accessControl={accessControl} getAccessControls={getAccessControls} request={request} />
		</Fragment>
	);
};

export default ContractModalControl;
