import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SimpleOrderTable, { ColumnSort } from '../../components/simple-ordered-table/simple-ordered-table';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BasicModal from '../../components/BasicModal/basic-modal';
import { Tab } from '../../model/enums/tabs';
import CustomTextField from '../../components/custom-text-field/custom-text-field';
import MenuPage from '../../components/menu-page/menu-page';
import SearchTextField from '../../components/search-text-field/search-text-field';
import IconButton from '../../components/icon-button/icon-button';
import NotificationModal from '../../components/notification-modal/notification-modal';
import { Payment } from '../../model/payment';
import PaymentService from '../../services/payment-service';
import { Pageable } from '../../model/pageable';
import './management.scss';
import { defaultValue, ErrorAndMessage } from '../../model/validation';


const Payments = () => {

	const [t] = useTranslation();
	const [anchorEl, setAnchorEl] = useState<any>(null);
	const [activeTab, setActiveTab] = useState(Tab.PAYMENTS);
	const [paymentList, setPaymentList] = useState<Payment[]>([]);
	const [modalItem, setModalItem] = useState<Payment | null>(null);
	const [totalPages, setTotalPages] = useState<number>(0);
	/* eslint-disable @typescript-eslint/no-unused-vars */
	const [filter, setFilter] = useState<any>({});
	/* eslint-enable @typescript-eslint/no-unused-vars */
	const [searchField, setSearchField] = useState('');
	const [sort, setSort] = useState('status,asc');
	const [pageable, setPageable] = useState<Pageable>({ size: 10, page: 0, totalPages: 0 });

	const [showDotsModal, setShowDotsModal] = useState<boolean>(false);
	const [showCreatePaymentModal, setShowCreatePaymentModal] = useState<boolean>(false);
	const [showEditPaymentModal, setShowEditPaymentModal] = useState<boolean>(false);
    const [showNotifications, setShowNotifications] = useState<boolean>(false);

	const [paymentTypeError, setPaymentTypeError] = useState<ErrorAndMessage>(defaultValue);
	const [prepaymentTypeError, setPrepaymentTypeError] = useState<ErrorAndMessage>(defaultValue);
	const [codeError, setCodeError] = useState<ErrorAndMessage>(defaultValue);

	const history = useHistory();

	const errorMessage: ErrorAndMessage = { message: t('management.fieldError.required'), value: true };

	useLayoutEffect(() => {
		window.document.body.style.background = 'white';
		return () => {
			window.document.body.style.background = '';
		};
	});

	useEffect(() => {
		getPayments();
	}, [pageable, searchField, filter, sort]);

	const getPayments = () => {
		const predicate = {
			search: searchField,
			sort: sort
		};

		PaymentService.getAllPayments(pageable, predicate).then(result => {
			setPaymentList(result.content);
			setTotalPages(result.totalPages);
		});
	}

	enum FieldType {
		PAYMENT_TYPE,
		PREPAYMENT_TYPE,
		CODE
  	}

  	const validateField = (field: FieldType) => {
		switch(field){
			case FieldType.PAYMENT_TYPE:
				if (modalItem?.paymentType != null && modalItem?.paymentType?.length > 0) {
					setPaymentTypeError(defaultValue);
					return {};
				};
				setPaymentTypeError(errorMessage);
				break;
			case FieldType.PREPAYMENT_TYPE:
				if (modalItem?.prepaymentType != null && modalItem?.prepaymentType?.length > 0) {
					setPrepaymentTypeError(defaultValue);
					return {};
				};
				setPrepaymentTypeError(errorMessage);
				break;
			case FieldType.CODE:
				if (modalItem?.code != null && modalItem?.code?.toString().length > 0) {
					setCodeError(defaultValue);
					return {};
				}; 
				setCodeError(errorMessage);
				break;
		}
  	};
 
	enum ModalType {
		DOTS,
		CREATE_PAYMENT,
		EDIT_PAYMENT
	};
    
	const handleOpenModal = (type: ModalType) => {
		setShowDotsModal(false);
		setShowCreatePaymentModal(false);
		setShowEditPaymentModal(false);

		switch(type){
			case ModalType.DOTS:
				setShowDotsModal(true);
				break;
			case ModalType.CREATE_PAYMENT:
				setShowCreatePaymentModal(true);
				break;
			case ModalType.EDIT_PAYMENT:
				setShowEditPaymentModal(true);
				break;
		}
	};

	const onEditPayment = async () => {
		validateField(FieldType.PAYMENT_TYPE);
		validateField(FieldType.PREPAYMENT_TYPE);
		validateField(FieldType.CODE);

		if (modalItem?.paymentType && modalItem?.prepaymentType && modalItem?.code) {
			modalItem.code = parseInt(modalItem?.code?.toString());
			if (modalItem?.prepaymentCode) {
				modalItem.prepaymentCode = parseInt(modalItem.prepaymentCode.toString());
			};
			await PaymentService.updatePayment(modalItem);
			getPayments();
			handleClose();
		};
	};

	const onCreatePayment = async (item: Payment | null) => {
		validateField(FieldType.PAYMENT_TYPE);
		validateField(FieldType.PREPAYMENT_TYPE);
		validateField(FieldType.CODE);

		if (item?.paymentType && item?.prepaymentType && item?.code) {
			item.code = parseInt(item?.code?.toString());
			if (item?.prepaymentCode) {
				item.prepaymentCode = parseInt(item.prepaymentCode.toString());
			};
			await PaymentService.createPayment(item);
			getPayments();
			handleClose();
		};
	};
    
	const handleClose = () => {
		setShowEditPaymentModal(false);
		setShowCreatePaymentModal(false);
		setModalItem(null);
		setPaymentTypeError(defaultValue);
		setPrepaymentTypeError(defaultValue);
		setCodeError(defaultValue);
	};

	// const handleClick = (event) => {
	//     setAnchorEl(event.currentTarget);
	// };
	
	// const onChange = () => {
	//     return ''
	// };

	const onActivatePayment = async () => {
		let payment = modalItem?.id!

		await PaymentService.activatePayment(payment);
		getPayments();
		setShowDotsModal(false);
		setAnchorEl(null);
	};

	const updatePage =  (page: number) => {
		setPageable({page: page, size: 10});
	}
	
	const onSort =  (sort: string) => {
		setSort(sort);
	}
    
	const tabs = [
		{ name: t('management.tabs.companyData'), code: Tab.COMPANYDATA },
		{ name: t('management.tabs.payments'), code: Tab.PAYMENTS }
	];

	const tableHeaders: ColumnSort[] = [
		{ name: t('management.tableHeaders.code'), sortCode: 'code' },
		{ name: t('management.tableHeaders.prepaymentCode'), sortCode: 'prepaymentCode' },
		{ name: t('management.tableHeaders.paymentType'), sortCode: 'paymentType' },
		{ name: t('management.tableHeaders.prepaymentType'), sortCode: 'prepaymentType' },
		{ name: t('management.tableHeaders.status'), sortCode: 'status' },
		{ sortDisabled: true }
	];

	const handleTransformToTableContent = (content?: Payment[]): (string | number | JSX.Element)[][] => {
		if (content == null || content.length === 0) return [];

		return content.map((item, index) => [
			item.code ?? "",
			item.prepaymentCode ?? "",
			item.paymentType ?? "",
			item.prepaymentType ?? "",
			item.status ? (
				item.status === 'ACTIVE' ? (
					<div className="active-tag">{t("management.status.active")}</div>
				) : (
					<div className="inactive-tag">{t("management.status.inactive")}</div>
				)) : (''),
			<div key={index}>
				<div 
					className="icon-dots" 
					aria-controls="simple-menu" 
					aria-haspopup="true" 
					onClick={({ currentTarget }) => {
						setModalItem(item);
						setAnchorEl(currentTarget);
						handleOpenModal(ModalType.DOTS);
					}} />
			</div>
		]);
	};

	const tableContent = handleTransformToTableContent(paymentList);

	const renderCreatePaymentsInputs = () => {
		return (
			<div className="modal-body__fields">
				<CustomTextField
					id="field1"
					placeholder={t("management.textField.paymentType")}
					value={modalItem?.paymentType}
					onChange={(text) => setModalItem({ ...modalItem, paymentType: text })}
					error={paymentTypeError?.value}
          			errorText={paymentTypeError?.message}
          			onBlur={() => validateField(FieldType.PAYMENT_TYPE)}
				/>
				<CustomTextField
					id="field2"
					placeholder={t("management.textField.prepaymentType")}
					style={{ paddingBottom: '25px'}}
					value={modalItem?.prepaymentType}
					onChange={(text) => setModalItem({ ...modalItem, prepaymentType: text })}
					error={prepaymentTypeError?.value}
					errorText={prepaymentTypeError?.message}
					onBlur={() => validateField(FieldType.PREPAYMENT_TYPE)}
				/>
				<div className="modal-body__fields--small" >
					<CustomTextField
						id="field3"
						placeholder={t("management.textField.code")} 
						style={{ marginRight: '24px' }}
						value={modalItem?.code?.toString()}
						onChange={(text) => setModalItem({ ...modalItem, code: text })}
						error={codeError?.value}
						errorText={codeError?.message}
						isOnlyNumbers={true}
						onBlur={() => validateField(FieldType.CODE)}
					/>
					<CustomTextField
						id="field4"
						placeholder={t("management.textField.prepaymentCode")} 
						value={modalItem?.prepaymentCode?.toString()}
						onChange={(text) => setModalItem({ ...modalItem, prepaymentCode: text })}
						isOnlyNumbers={true}
					/>
				</div>
			</div>
		)
	};

	const renderUpdatePaymentsInputs = () => {
		return (
			<div className="modal-body__fields">
				<CustomTextField
					id="field1"
					placeholder={t("management.textField.paymentType")}
					value={modalItem?.paymentType}
					onChange={(text) => setModalItem({ ...modalItem, paymentType: text })}
					error={paymentTypeError?.value}
					errorText={paymentTypeError?.message}
					onBlur={() => validateField(FieldType.PAYMENT_TYPE)}
				/>
				<CustomTextField
					id="field2"
					placeholder={t("management.textField.prepaymentType")}
					style={{ paddingBottom: '25px'}}
					value={modalItem?.prepaymentType}
					onChange={(text) => setModalItem({ ...modalItem, prepaymentType: text })}
					error={prepaymentTypeError?.value}
					errorText={prepaymentTypeError?.message}
					onBlur={() => validateField(FieldType.PREPAYMENT_TYPE)}
				/>
				<div className="modal-body__fields--small" >
					<CustomTextField
						id="field3"
						placeholder={t("management.textField.code")} 
						style={{ marginRight: '24px ' }}
						value={modalItem?.code?.toString()}
						onChange={(text) => setModalItem({ ...modalItem, code: text })}
						error={codeError?.value}
						errorText={codeError?.message}
						isOnlyNumbers={true}
						onBlur={() => validateField(FieldType.CODE)}
					/>
					<CustomTextField
						id="field4"
						placeholder={t("management.textField.prepaymentCode")} 
						value={modalItem?.prepaymentCode?.toString()}
						onChange={(text) => setModalItem({ ...modalItem, prepaymentCode: text })}
						isOnlyNumbers={true}
					/>
				</div>
			</div>
		)
	};

	return (
		<div className="management__container">
			<div className="management__container--header">
				<span>{t('management.title.management')}</span>
                <div className='notification-img' onClick={() => setShowNotifications(!showNotifications)}/>
            </div>
            {showNotifications && <NotificationModal/>}
			<div className="management__container--body">
				<div className="management__container--body-menu">
					<MenuPage tabs={tabs} activeTab={activeTab} onChange={(activeTab) => setActiveTab(activeTab)} />
				</div>
				<div className="management__container--body-action">
					<div style={{ maxWidth: "222px" }}>
						<SearchTextField id={"search-field"} style={{ marginRight: "10px" }} placeholder="Buscar por" onChange={setSearchField} value={searchField} />
					</div>
					<div style={{ marginLeft: "24px" }}>
						<IconButton color="green" isAlignCenter width={"170px"} height={"40px"} filled clickButton={() => handleOpenModal(ModalType.CREATE_PAYMENT)}>
							<div className="icon-plus"/>
							{t('management.buttons.payments')}
						</IconButton>
					</div>
				</div>
			</div>
			<div style={{ padding: "0 26px" }}>
				{activeTab === Tab.COMPANYDATA && history.replace('/admin/management/company-data')}
				{activeTab === Tab.LINKS && history.replace('/admin/management/links')}
			</div>
			<div className="padding-page">
				<SimpleOrderTable
					rows={tableContent}
					page={pageable}
					totalPages={totalPages}
					columnNameKeys={tableHeaders}
					onChangePage={updatePage}
					onSort={(sortCode) => onSort(sortCode)}
				/>
				<Menu className="tooltip-style" anchorEl={anchorEl} keepMounted open={showDotsModal} onClose={() => setShowDotsModal(false)}>
					<MenuItem onClick={() => handleOpenModal(ModalType.EDIT_PAYMENT)}>{t("management.buttons.edit")}</MenuItem>
					<MenuItem onClick={onActivatePayment}>
						{t(`management.buttons.${modalItem?.status === "ACTIVE" ? "deactivate" : "activate"}`)}
					</MenuItem>
				</Menu>
				<BasicModal
					onClose={handleClose}
					showModal={showEditPaymentModal}
					modalTitle={t('management.title.modal.payments')}
					toggleModal={handleClose}
					hasTwoButtons
					primaryButtonTitle={t('management.buttons.save')}
					secondaryButtonTitle={t('management.buttons.goBack')}
					primaryButtonAction={() => onEditPayment()}
					secondaryButtonAction={handleClose}
					centralized
					inputs={renderUpdatePaymentsInputs()}
				/>
				<BasicModal
					onClose={handleClose}
					showModal={showCreatePaymentModal}
					modalTitle={t('management.buttons.payments')}
					toggleModal={handleClose}
					hasTwoButtons
					primaryButtonTitle={t('management.buttons.save')}
					secondaryButtonTitle={t('management.buttons.goBack')}
					primaryButtonAction={() => onCreatePayment(modalItem)}
					secondaryButtonAction={handleClose}
					centralized
					inputs={renderCreatePaymentsInputs()}
				/>
			</div>
		</div>
	)
};

export default Payments;
