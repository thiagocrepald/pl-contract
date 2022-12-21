import React, { useState, useEffect } from 'react';
import IconButton from '../../../../components/icon-button/icon-button';
import { useTranslation } from 'react-i18next';
import '../../contract-detail.scss';
import '../contract-cost.scss';
import '../../../../components/main.scss';
import SearchTextField from '../../../../components/search-text-field/search-text-field';
import { TextareaAutosize, Menu, MenuItem } from '@material-ui/core';
import SimpleOrderTable, { ColumnSort } from '../../../../components/simple-ordered-table/simple-ordered-table';
import CustomTextField from '../../../../components/custom-text-field/custom-text-field';
import BasicModal from '../../../../components/BasicModal/basic-modal';
import { Pageable } from '../../../../model/pageable';
import { ExtraordinaryExpenseType } from '../../../../model/contract-costs-type';
import ContractService from '../../../../services/contract-costs-service';
import { maskAmount, formatterCurrency, removeCurrencyMask } from '../../../../util/mask-utils';
import DateUtils from '../../../../util/date-utils';
import AutocompleteDoctorSearch from '../../../../components/autocomplete-doctor-search/autocomplete-doctor-search';
import { defaultValue, ErrorAndMessage } from '../../../../model/validation';

enum FieldType {
    DOCTOR,
    DESCRIPTION,
    AMOUNT
}

enum ModalType {
    DOTS,
    CREATE_EXTRAORDINARY_EXPENSES,
    EDIT_EXTRAORDINARY_EXPENSES
}

const ExtraordinaryExpensesTable = ({ contractId, contract }): JSX.Element => {
    const { t } = useTranslation();
    const [pageable, setPageable] = useState<Pageable>({
        size: 6,
        page: 0,
        totalPages: 0
    });
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [searchField, setSearchField] = useState<string>('');
    const [sort, setSort] = useState('incUserDate,desc');
    const [totalPages, setTotalPages] = useState<number>(0);

    const [isCreateExtraordinaryExpenseModal, setIsCreateExtraordinaryExpenseModal] = useState<boolean>(false);
    const [isEditExtraordinaryExpenseModal, setIsEditExtraordinaryExpenseModal] = useState<boolean>(false);
    const [isDotsModal, setIsDotsModal] = useState<boolean>(false);

    const [modalItem, setModalItem] = useState<ExtraordinaryExpenseType | null>(null);
    const [extraordinaryExpensesList, setExtraordinaryExpensesList] = useState<ExtraordinaryExpenseType[]>([]);

    const [doctorError, setDoctorError] = useState<ErrorAndMessage>(defaultValue);
    const [amountError, setAmountError] = useState<ErrorAndMessage>(defaultValue);
    const [descriptionError, setDescriptionError] = useState<ErrorAndMessage>(defaultValue);
    const errorMessageDefault: ErrorAndMessage = {
        message: t('management.fieldError.required'),
        value: true
    };

    useEffect(() => {
        getExtraordinaryExpenses();
    }, [pageable, searchField, sort]);

    const validateField = (field: FieldType) => {
        switch (field) {
            case FieldType.DOCTOR:
                if (modalItem?.doctor?.id) {
                    setDoctorError(defaultValue);
                    return {};
                }

                setDoctorError(errorMessageDefault);
                break;

            case FieldType.DESCRIPTION:
                if (modalItem?.description) {
                    setDescriptionError(defaultValue);
                    return {};
                }

                setDescriptionError(errorMessageDefault);
                break;
            case FieldType.AMOUNT:
                if (modalItem?.amount != null) {
                    const amountWithoutMask = removeCurrencyMask(modalItem?.amount);
                    if (amountWithoutMask !== '') {
                        setAmountError(defaultValue);
                        return {};
                    }
                }

                setAmountError(errorMessageDefault);
                break;
        }
    };

    const handleOpenModal = (type: ModalType) => {
        setIsDotsModal(false);
        setIsCreateExtraordinaryExpenseModal(false);
        setIsEditExtraordinaryExpenseModal(false);

        switch (type) {
            case ModalType.DOTS:
                setIsDotsModal(true);
                break;
            case ModalType.CREATE_EXTRAORDINARY_EXPENSES:
                setIsCreateExtraordinaryExpenseModal(true);
                break;
            case ModalType.EDIT_EXTRAORDINARY_EXPENSES:
                setIsEditExtraordinaryExpenseModal(true);
                break;
        }
    };

    const handleClose = () => {
        setIsCreateExtraordinaryExpenseModal(false);
        setIsEditExtraordinaryExpenseModal(false);
        setIsDotsModal(false);
        setModalItem(null);
        setDoctorError(defaultValue);
        setDescriptionError(defaultValue);
        setAmountError(defaultValue);
    };

    const getExtraordinaryExpenses = () => {
        const predicate = {
            search: searchField,
            sort
        };

        ContractService.getAllExtraordinaryExpenses(pageable, predicate, contractId).then(result => {
            setExtraordinaryExpensesList(result.content);
            setTotalPages(result.totalPages);
        });
    };

    const onCreateExtraordinaryExpense = async (item: ExtraordinaryExpenseType | null) => {
        validateField(FieldType.DOCTOR);
        validateField(FieldType.DESCRIPTION);
        validateField(FieldType.AMOUNT);

        if (item?.doctor?.id && item?.amount != null && item?.description) {
            item.contract = { id: contractId };
            item.amount = removeCurrencyMask(item.amount);
            await ContractService.createExtraordinaryExpense(item);
            getExtraordinaryExpenses();
            handleClose();
        }
    };

    const onEditExtraordinaryExpense = async () => {
        if (modalItem?.description !== '' && modalItem?.amount != null) {
            modalItem.contract = { id: contractId };
            modalItem.amount = removeCurrencyMask(modalItem.amount);
            await ContractService.updateExtraordinaryExpense(modalItem);
            getExtraordinaryExpenses();
            handleClose();
        }
    };

    const onDeleteExtraordinaryExpense = async () => {
        const extraordinaryExpenseId = modalItem?.id!;
        await ContractService.deleteExtraordinaryExpense(extraordinaryExpenseId);
        getExtraordinaryExpenses();
        handleClose();
        setAnchorEl(null);
    };

    const updatePage = (page: number) => {
        setPageable({ page, size: 6 });
    };

    const onSort = (sorted: string) => {
        setSort(sorted);
    };

    const tableHeaders: ColumnSort[] = [
        { name: t('contractDetail.cost.table.crm'), sortCode: 'doctor.crmNumber' },
        {
            name: t('contractDetail.cost.table.doctorName'),
            sortCode: 'doctor.name'
        },
        {
            name: t('contractDetail.cost.table.description'),
            sortCode: 'description'
        },
        { name: t('contractDetail.cost.table.value'), sortCode: 'amount' },
        {
            name: t('contractDetail.cost.table.inclusionDate'),
            sortCode: 'incUserDate'
        },
        { sortDisabled: true }
    ];

    const handleTransformToTableContent = (content?: ExtraordinaryExpenseType[]): (string | JSX.Element)[][] => {
        if (content == null || content.length === 0) return [];

        return content.map((item, index) => [
            item.doctor?.crmNumber ?? '',
            item.doctor?.name ?? '',
            item.description ?? '',
            maskAmount(item?.amount),
            DateUtils.formatDatePtBr(item?.incUserDate),
            <>
                {contract.isCurrentUserResponsible && 
                    <div
                        key={index}
                        className="icon-dots"
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={({ currentTarget }) => {
                            setModalItem(item);
                            setAnchorEl(currentTarget);
                            handleOpenModal(ModalType.DOTS);
                        }}
                    />
                }
            </>
        ]);
    };

    const tableContent = handleTransformToTableContent(extraordinaryExpensesList);

    const renderCreateExtraordinaryExpensesInputs = (): JSX.Element => {
        return (
            <>
                <div>
                    <AutocompleteDoctorSearch
                        id={'DoctorSearch'}
                        label={t('contractDetail.cost.modal.searchDoctor')}
                        onChange={(event, doctor) => {
                            setModalItem({ ...modalItem, doctor: { id: doctor?.id } });
                        }}
                        error={doctorError?.value}
                        helperText={doctorError?.message}
                        onBlur={() => validateField(FieldType.DOCTOR)}
                    />
                    <span className="contract-cost__modal--caption">{t('contractDetail.cost.modal.insertCrm')}</span>
                </div>
                <div className="container-text-area">
                    <TextareaAutosize
                        className="text-area"
                        rowsMin={4}
                        rowsMax={4}
                        placeholder={t('contractDetail.cost.modal.describeCost')}
                        onChange={text => setModalItem({ ...modalItem, description: text.target.value })}
                        onBlur={() => validateField(FieldType.DESCRIPTION)}
                    />
                    {descriptionError?.value && (
                        <p
                            className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error helper-text-description-modal"
                            id="insertValueHour-helper-text"
                        >
                            {t('management.fieldError.required')}
                        </p>
                    )}
                </div>
                <div style={{ width: '50%' }}>
                    <CustomTextField
                        id="insertValue"
                        className={'custom-text-field-reference'}
                        label={t('contractDetail.cost.modal.insertValueExpense')}
                        placeholder={t('contractDetail.cost.modal.insertValueExpense')}
                        value={modalItem?.amount}
                        onChange={value => setModalItem({ ...modalItem, amount: formatterCurrency(value) })}
                        error={amountError?.value}
                        errorText={amountError?.message}
                        onBlur={() => validateField(FieldType.AMOUNT)}
                    />
                </div>
            </>
        );
    };

    const renderEditExtraordinaryExpensesInputs = (): JSX.Element => {
        return (
            <>
                <div>
                    <CustomTextField
                        id="doctorName"
                        label={t('contractDetail.cost.modal.doctor')}
                        value={`${modalItem?.doctor?.name} - ${modalItem?.doctor?.crmNumber}`}
                        isDisabled={true}
                        placeholder={t('contractDetail.cost.modal.doctor')}
                        onChange={() => {
                            /* empty */
                        }}
                    />
                </div>
                <div className="container-text-area">
                    <TextareaAutosize
                        className="text-area"
                        rowsMin={4}
                        rowsMax={4}
                        placeholder={t('contractDetail.cost.modal.describeCost')}
                        value={modalItem?.description}
                        onChange={text => setModalItem({ ...modalItem, description: text.target.value })}
                        onBlur={() => validateField(FieldType.DESCRIPTION)}
                    />
                    {descriptionError?.value && (
                        <p
                            className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error helper-text-description-modal"
                            id="insertValueHour-helper-text"
                        >
                            {t('management.fieldError.required')}
                        </p>
                    )}
                </div>
                <div style={{ width: '50%' }}>
                    <CustomTextField
                        id="insertValue"
                        className={'custom-text-field-reference'}
                        label={t('contractDetail.cost.modal.insertValueExpense')}
                        placeholder={t('contractDetail.cost.modal.insertValueExpense')}
                        value={maskAmount(modalItem?.amount)}
                        onChange={value => setModalItem({ ...modalItem, amount: formatterCurrency(value) })}
                        error={amountError?.value}
                        errorText={amountError?.message}
                        onBlur={() => validateField(FieldType.AMOUNT)}
                    />
                </div>
            </>
        );
    };

    return (
        <>
            <div style={{ marginBottom: '12px' }} className="contract-detail__container--body-group">
                <div className="contract-detail__container--body-subtitle"> {t('contractDetail.cost.titleThird')}</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ maxWidth: '222px' }}>
                        <SearchTextField onChange={setSearchField} id={'search-field-extraordinary-expenses'} placeholder="Buscar por" value={searchField} />
                    </div>
                    {contract.isCurrentUserResponsible &&
                        <div className="base-selectfield" style={{ minWidth: '150px', marginLeft: '12px' }}>
                            <IconButton isAlignCenter width={'170px'} height={'33px'} filled clickButton={() => setIsCreateExtraordinaryExpenseModal(true)}>
                                <div className="icon-plus" />
                                {t('global.button.new')}
                            </IconButton>
                        </div>
                    }
                </div>
            </div>
            <div className="contact-cost__container--tables">
                <SimpleOrderTable
                    rows={tableContent}
                    page={pageable}
                    totalPages={totalPages}
                    columnNameKeys={tableHeaders}
                    onChangePage={updatePage}
                    onSort={sortCode => onSort(sortCode)}
                />
                <Menu className="tooltip-style" anchorEl={anchorEl} keepMounted open={isDotsModal} onClose={() => handleClose()}>
                    <MenuItem onClick={() => handleOpenModal(ModalType.EDIT_EXTRAORDINARY_EXPENSES)}>{t('contractDetail.cost.buttons.edit')}</MenuItem>
                    <MenuItem onClick={onDeleteExtraordinaryExpense}>{t('contractDetail.cost.buttons.delete')}</MenuItem>
                </Menu>
                <BasicModal
                    onClose={handleClose}
                    showModal={isCreateExtraordinaryExpenseModal}
                    modalTitle={t('contractDetail.cost.modal.titleThird')}
                    toggleModal={handleClose}
                    hasTwoButtons
                    primaryButtonTitle={t('contractDetail.cost.buttons.save')}
                    secondaryButtonTitle={t('contractDetail.cost.buttons.goBack')}
                    primaryButtonAction={() => onCreateExtraordinaryExpense(modalItem)}
                    secondaryButtonAction={handleClose}
                    centralized
                    inputs={renderCreateExtraordinaryExpensesInputs()}
                />
                <BasicModal
                    onClose={handleClose}
                    showModal={isEditExtraordinaryExpenseModal}
                    modalTitle={t('contractDetail.cost.modal.titleSeventh')}
                    toggleModal={handleClose}
                    hasTwoButtons
                    primaryButtonTitle={t('contractDetail.cost.buttons.save')}
                    secondaryButtonTitle={t('contractDetail.cost.buttons.goBack')}
                    primaryButtonAction={() => onEditExtraordinaryExpense()}
                    secondaryButtonAction={handleClose}
                    centralized
                    inputs={renderEditExtraordinaryExpensesInputs()}
                />
            </div>
        </>
    );
};

export default ExtraordinaryExpensesTable;
