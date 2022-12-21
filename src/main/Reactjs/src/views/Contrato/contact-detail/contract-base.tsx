import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { FormControl, makeStyles, Select } from '@material-ui/core';
import SimpleOrderTable, { ColumnSort } from '../../../components/simple-ordered-table/simple-ordered-table';
// import TooltipYellow from "../../../components/tooltip-yellow/tooltip";
import FilterColumn from '../../../components/filter-column';
import CustomDateField from '../../../components/custom-date-field/custom-date-field';
import FilterDateColumn from '../../../components/filter-date-column';
import { ComparisonOperator, LogicalOperator, PredicateOperators, } from '../../../model/predicate-operators';
import { convertFilterToOperators } from '../../../util/predicate-operators-utils';
import { Pageable } from '../../../model/pageable';
import { Company } from '../../../model/company'
import { IBase, IBaseUpdate } from '../../../model/contract-base';
import { Payment } from '../../../model/payment';
import ContractBaseService from '../../../services/contract-base.service'
import CompanyService from '../../../services/company-service';
import PaymentService from '../../../services/payment-service';
import '../contract-detail.scss';
import '../../../components/main.scss';
import '../contact-detail/contract-base.scss'
import { Contract } from '../../../model/contract';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

interface Props {
    contractId: number;
    contract?: Contract;
}

const ContractBase = ({ contractId, contract }: Props) => {
	const { t } = useTranslation();
	const classes = useStyles();

	const [anchorColumn, setAnchorColumn] = useState<any>(null);
	const anchorCnesInclusion = React.useRef(null);
	const anchorCnesExclusion = React.useRef(null);
	const [anchorDate, setAnchorDate] = useState<any>(null);

	const [baseList, setBaseList] = useState<IBase[]>([]);
	const [companyList, setCompanyList] = useState<Company[]>([]);
	const [paymentList, setPaymentList] = useState<Payment[]>([]);
	const [base, setBase] = useState<IBaseUpdate>();
	
	const [showTabsModal, setShowTabsModal] = useState<boolean>(false);
	const [showDateModal, setShowDateModal] = useState<boolean>(false);
	const [showTooltip, setShowTooltip] = useState<boolean>(true);
	
	const [totalPages, setTotalPages] = useState<number>(0);
	const [name, setName] = useState<string>('');
	const [filterCode, setFilterCode] = useState('');
	const [filter, setFilter] = useState<PredicateOperators>({});
	const [predicateOperators, setPredicateOperators] = useState<PredicateOperators[]>([]);
	const [operators, setOperators] = useState<(ComparisonOperator | LogicalOperator)[]>([]);
	const [searchField, setSearchField] = useState<string>('');
	const [sort, setSort] = useState<string>('id,asc');
	const [pageable, setPageable] = useState<Pageable>({ size: 10, page: 0, totalPages: 0});
	

	// TO LIST ALL COMPANIES AND BONDS AT SELECT INPUT, SIZE MUST BE CHANGED
	const [pageableCompanies] = useState<Pageable>({ size: 100, page: 0, totalPages: 0 });
	const [pageablePayments] = useState<Pageable>({ size: 100, page: 0, totalPages: 0 });

	// CHANGE COLOR FOR THIS PAGE ONLY AND CLEAN-UP WHEN LEAVING THE PAGE
	useLayoutEffect(() => {
		window.document.body.style.background = "white";
		return () => {
			window.document.body.style.background = "";
		};
	});

	useEffect(() => {
		if (!isEmpty(companyList) && !isEmpty(paymentList)){
			getContractBases();
		}
	}, [companyList, paymentList, pageable, searchField, filter, sort]);

	useEffect(() => {
		getCompanies();
		setTimeout(() => setShowTooltip(false), 5000);
	}, []);

	useEffect(() => {
		updateContractBase();
	}, [base]);

	const getContractBases = () => {
		const predicate = {
			search: searchField,
			sort: sort,
		};
		ContractBaseService.getAllBases(contractId, predicate, pageable, predicateOperators).then(result => {
			setBaseList(result.content);
			setTotalPages(result.totalPages);
		});
	};

	const updateContractBase = () => {
		if (base) {
			ContractBaseService.updateBase(base).then(result => {
				getContractBases();
			});
		};
	};

	const getCompanies = () => {
		const predicate = {search: "", sort: ""};
	
		CompanyService.getAllCompanies(pageableCompanies, predicate).then(result => {
		  	setCompanyList(result.content);
			getPayments();
		});
	};

	const getPayments = () => {
		const predicate = {search: '', sort: 'status,asc'};

		PaymentService.getAllPayments(pageablePayments, predicate).then(result => {
			setPaymentList(result.content);
		});
	};

	const updatePage =  (newPage: number) => {
		setPageable({ ...pageable, page: newPage });
	};

	const handleFilter = async (newFilter: PredicateOperators) => {
		setFilter(newFilter);
		setPredicateOperators(convertFilterToOperators(newFilter));
	};

	enum ModalType {
		TABS,
		DATE
	}

	const handleOpenModal = (type: ModalType) => {
		setShowTabsModal(false);
		setShowDateModal(false);
	
		switch(type){
		  	case ModalType.TABS:
				setShowTabsModal(true);
				break;
			case ModalType.DATE:
				setShowDateModal(true);
				break;
		}
	};

	const handleUpdateBase = async (field, value, item) => {
		// set current state
		let data: IBaseUpdate = {};
		data.id = item.id;
		if (item.companyData && item.companyData?.id !== "") {data.companyData = {id: item.companyData.id}};
		if (item.paymentNature && item.paymentNature?.id !== "") {data.paymentNature = {id: item.paymentNature.id}};
		if (item.cnesInclusion) {data.cnesInclusion = item.cnesInclusion};
		if (item.cnesExclusion) {data.cnesExclusion = item.cnesExclusion};

		// add new state
		if (field === "companyData") {
			if (value !== "") {
				data.companyData = {id: parseInt(value)};
			} else {
				delete data['companyData'];
			};
		};
		if (field === "payment") {
			if (value !== "") {
				data.paymentNature = {id: parseInt(value)};
			} else {
				delete data['paymentNature'];
			};
		};
		if (field === "cnesInclusion" && value !== "") {
			data.cnesInclusion = value;
		};
		if (field === "cnesExclusion" && value !== "") {
			data.cnesExclusion = value;
		};

		setBase(data);
	}

	const tableHeaders: ColumnSort[] = [
		{ name: t("contractDetail.base.table.crm"), sortCode: "doctor.crmNumber", translate: 'crm', operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS] },
		{ name: t("contractDetail.base.table.name"), sortCode: "doctor.name", translate: 'name', operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS] },
		{ name: t("contractDetail.base.table.cpf"), sortCode: "doctor.identificationNumber", translate: 'cpf', operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS] },
		{ name: t("contractDetail.base.table.cnpj"), sortCode: "doctor.legalEntityIdentificationNumber", translate: 'cnpj', operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS] },
		{ name: t("contractDetail.base.table.pj"), sortCode: "doctor.accountOwnerName", translate: 'pj', operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS] },
		{ name: t("contractDetail.base.table.payer"), sortCode: "companyData.company", translate: 'payer', operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS] },
		{ name: t("contractDetail.base.table.code"), sortCode: "companyData.code", translate: 'code', operators: [LogicalOperator.OR, ComparisonOperator.EQ] },
		{ name: t("contractDetail.base.table.payment"), sortCode: "paymentNature.paymentType", translate: 'bond.paymentNature.paymentType', operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS] },
		{ name: t("contractDetail.base.table.earlyPayment"), sortCode: "paymentNature.prepaymentType", translate: 'bond.paymentNature.prepaymentType', operators: [ComparisonOperator.CI, ComparisonOperator.CONTAINS] },
		{ name: t("contractDetail.base.table.inclusionCnes"), icon: (
			<div
				ref={anchorCnesInclusion}
				className="icon-filter"
				onClick={() => {handleOpenModal(ModalType.DATE); setFilterCode("cnesInclusion"); setAnchorDate(anchorCnesInclusion);}}
				style={{ display: "inline-block", marginLeft: "8px", cursor: "pointer" }}
			/>
		)},
		{ name: t("contractDetail.base.table.exclusionCnes"), icon: (
			<div
				ref={anchorCnesExclusion}
				className="icon-filter"
				onClick={() => {handleOpenModal(ModalType.DATE); setFilterCode("cnesExclusion"); setAnchorDate(anchorCnesExclusion);}}
				style={{ display: "inline-block", marginLeft: "8px", cursor: "pointer" }}
			/>
		)},
	];

	const handleTransformToTableContent = ( content?: any[] ) => {
		if (content == null || content.length === 0) return [];

		return content.map((item, index) => [
			item?.doctor?.crmNumber ?? "",
			item?.doctor?.name?.toUpperCase() ?? "",
			item?.doctor?.paymentsData?.[0]?.cpf ?? "",
			item?.doctor?.paymentsData?.[1]?.cnpj ?? "",
			item?.doctor?.paymentsData?.[1]?.accountOwnerName ?? "",
			<div key={`payer-${index}`} className="base-selectfield__payer">
				{contract?.isCurrentUserResponsible ? (
					<FormControl variant="filled" className={classes.formControl}>
						{!isEmpty(companyList) && <Select
							className="companyData"
							native
							value={item?.companyData?.id ?? ""}
							onChange={(e) => handleUpdateBase("companyData", e.target.value, item)}
						>
							<option aria-label="None" value="" />
							{companyList?.map((companyData, index) => (companyData.status === 'ACTIVE' && <option key={index} value={companyData?.id}>{companyData?.company}</option>))}
						</Select>}
					</FormControl>
				) : (
					<div style={{padding: '6px'}}>{item?.companyData?.company ?? ''}</div>
				)}
			</div>,
			item?.companyData?.code ?? "",
			<div key={`payment-${index}`} className="base-selectfield__payment">
				{contract?.isCurrentUserResponsible ? (
					<FormControl variant="filled" className={classes.formControl}>
						{!isEmpty(paymentList) && <Select
							native
							value={item?.paymentNature?.id ?? ""}
							onChange={(e) => handleUpdateBase("payment", e.target.value, item)}
						>
							<option aria-label="None" value=""/>
							{paymentList?.map((payment, index) => (payment.status === 'ACTIVE' && <option key={index} value={payment?.id}>{payment?.paymentType}</option>))}
						</Select>}
					</FormControl>
				) : (
					<div style={{padding: '6px'}}>{item?.paymentNature?.paymentType ?? ''}</div>
				)}
			</div>,
			item?.paymentNature?.prepaymentType ?? "",
			<div key={`cnesInclusion-${index}`} className="base-selectfield__cnes">
				{contract?.isCurrentUserResponsible ? (
					<CustomDateField
						id={`cnesInclusion${item.id}`}
						disableErrorAndValidStyle
						value={item?.cnesInclusion}
						onChange={date => handleUpdateBase("cnesInclusion", date, item)}
					/>
				) : (
					<div style={{padding: '6px'}}>{item?.cnesInclusion ?  moment(item?.cnesInclusion, "YYYY-MM-DD").format("DD/MM/YYYY") : ""}</div>
				)}
			</div>,
			<div key={`cnesExclusion-${index}`} className="base-selectfield__cnes">
				{contract?.isCurrentUserResponsible ? (
					<CustomDateField
						id={`cnesExclusion${item.id}`}
						disableErrorAndValidStyle
						value={item?.cnesExclusion}
						onChange={date => handleUpdateBase("cnesExclusion", date, item)}
					/>
				) : (
					<div style={{padding: '6px'}}>{item?.cnesExclusion ?  moment(item?.cnesExclusion, "YYYY-MM-DD").format("DD/MM/YYYY") : ""}</div>
				)}
			</div>
		]);
	};

	const rows = handleTransformToTableContent(baseList);

	return (
		<Fragment>
			<div className="contract-detail__container--body-group">
				<div className="contract-detail__container--body-title">{contract?.contractingParty?.name ?? ''}</div>
			</div>
			<div className="contract-detail__container--body-subtitle">{" "}{t("contractDetail.base.base")}</div>
			{/* <TooltipYellow show={showTooltip} setShow={setShowTooltip}/> */}
			<div className="scroll-table">
				<SimpleOrderTable
					rows={rows}
					onClickRow={()=>{}}
					page={pageable}
					totalPages={totalPages}
					columnNameKeys={tableHeaders}
					onChangePage={updatePage}
					canFilter
					onFilter={({ currentTarget }, filterCodeString, translate, filterOperators) => {
						setAnchorColumn(currentTarget);
						handleOpenModal(ModalType.TABS);
						setOperators(filterOperators ?? []);
						setFilterCode(filterCodeString ?? '');
						setName(translate ?? filterCodeString ?? '');
					}}
				/>
			</div>
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
			<FilterDateColumn
				setFilter={handleFilter} 
				changeShow={setShowDateModal} 
				show={showDateModal} 
				filter={filter}
				anchorEl={anchorDate?.current}
				filterCode={filterCode}
			/>
		</Fragment>
	);
};
export default ContractBase;
