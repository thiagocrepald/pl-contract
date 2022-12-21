import React, { useState, useEffect } from 'react';
import IconButton from '../../../../components/icon-button/icon-button';
import { useTranslation } from 'react-i18next';
import '../../contract-detail.scss';
import '../contract-cost.scss';
import '../../../../components/main.scss';
import SearchTextField from '../../../../components/search-text-field/search-text-field';
import SimpleOrderTable, { ColumnSort } from '../../../../components/simple-ordered-table/simple-ordered-table';
import CustomDateField from '../../../../components/custom-date-field/custom-date-field';
import CustomTextField from '../../../../components/custom-text-field/custom-text-field';
import { Menu, MenuItem } from '@material-ui/core';
import BasicModal from '../../../../components/BasicModal/basic-modal';
import { Pageable } from '../../../../model/pageable';
import { Contract } from '../../../../model/contract';
import { DifferentiatedValueType } from '../../../../model/contract-costs-type';
import ContractService from '../../../../services/contract-costs-service';
import { maskAmount, formatterCurrency, removeCurrencyMask } from '../../../../util/mask-utils';
import DateUtils from '../../../../util/date-utils';
import AutocompleteDoctorSearch from '../../../../components/autocomplete-doctor-search/autocomplete-doctor-search';
import { defaultValue, ErrorAndMessage } from '../../../../model/validation';

enum FieldType {
    DOCTOR,
    START_DATE,
    START_DATE_UPDATE,
    END_DATE,
    END_DATE_CHECK_IF_EXISTS,
    AMOUNT,
    AMOUNT_UPDATE
}

enum ModalType {
    DOTS,
    CREATE_DIFFERENTIATED_VALUE,
    EDIT_DIFFERENTIATED_VALUE,
    UPDATE_DIFFERENTIATED_VALUE
}

interface IDifferentiatedValueTable {
    contractId: number;
    contract?: Contract;
}

const DifferentiatedValueTable = ({ contractId, contract }: IDifferentiatedValueTable): JSX.Element => {
    const { t } = useTranslation();
    const [pageable, setPageable] = useState<Pageable>({
        size: 6,
        page: 0,
        totalPages: 0
    });
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [searchField, setSearchField] = useState<string>('');
    const [sort, setSort] = useState<string>('incUserDate,desc');
    const [totalPages, setTotalPages] = useState<number>(0);

    const [isCreateDifferentiatedValueModal, setIsCreateDifferentiatedValueModal] = useState<boolean>(false);
    const [isEditDifferentiatedValueModal, setIsEditDifferentiatedValueModal] = useState<boolean>(false);
    const [isUpdateDifferentiatedValueModal, setIsUpdateDifferentiatedValueModal] = useState<boolean>(false);
    const [isDotsModal, setIsDotsModal] = useState<boolean>(false);

    const [modalItem, setModalItem] = useState<DifferentiatedValueType | null>(null);
    const [modalUpdateItem, setModalUpdateItem] = useState<DifferentiatedValueType | null>(null);
    const [differentiatedValueList, setDifferentiatedValueList] = useState<DifferentiatedValueType[]>([]);
    const [isDoctorAlreadyInTable, setIsDoctorAlreadyInTable] = useState<boolean>(false);
    const [startDateAlreadyExists, setStartDateAlreadyExists] = useState<DifferentiatedValueType | string>('');
    const [endDateAlreadyExists, setEndDateAlreadyExists] = useState<DifferentiatedValueType | string>('');

    const [doctorError, setDoctorError] = useState<ErrorAndMessage>(defaultValue);
    const [startDateError, setStartDateError] = useState<ErrorAndMessage>(defaultValue);
    const [startDateUpdateError, setStartDateUpdateError] = useState<ErrorAndMessage>(defaultValue);
    const [endDateError, setEndDateError] = useState<ErrorAndMessage>(defaultValue);
    const [amountError, setAmountError] = useState<ErrorAndMessage>(defaultValue);
    const [amountUpdateError, setAmountUpdateError] = useState<ErrorAndMessage>(defaultValue);
    const errorMessageDefault: ErrorAndMessage = {
        message: t('management.fieldError.required'),
        value: true
    };
    const errorMessageTheDoctorAlreadyExists: ErrorAndMessage = {
        message: t('management.fieldError.theDoctorAlreadyExists'),
        value: true
    };
    const errorMessageDateAlreadyExists: ErrorAndMessage = {
        message: t('management.fieldError.theDateAlreadyExists'),
        value: true
    };

    useEffect(() => {
        getDifferentiatedValue();
    }, [pageable, searchField, sort]);

    useEffect(() => {
        if (startDateAlreadyExists) {
            validateField(FieldType.START_DATE);
        }

        if (endDateAlreadyExists) {
            validateField(FieldType.END_DATE_CHECK_IF_EXISTS);
        }
    }, [startDateAlreadyExists, endDateAlreadyExists]);

    const validateField = (field: FieldType) => {
        switch (field) {
            case FieldType.DOCTOR:
                if (!modalItem?.doctor?.id) {
                    setDoctorError(errorMessageDefault);
                    return {};
                }

                (async () => {
                    const already = await checkIfTheDoctorAlreadyInTable();
                    setIsDoctorAlreadyInTable(already);
                    if (already) {
                        setDoctorError(errorMessageTheDoctorAlreadyExists);
                    }
                })();

                if (doctorError !== errorMessageDefault && doctorError !== errorMessageTheDoctorAlreadyExists) {
                    setDoctorError(defaultValue);
                }
                break;
            case FieldType.START_DATE:
                if (!modalItem?.startDate) {
                    setStartDateError(errorMessageDefault);
                    return {};
                }

                if (startDateAlreadyExists) {
                    setStartDateError(errorMessageDateAlreadyExists);
                    setStartDateAlreadyExists('');
                    return {};
                }

                setStartDateError(defaultValue);
                break;
            case FieldType.START_DATE_UPDATE:
                if (modalUpdateItem?.startDate) {
                    setStartDateUpdateError(defaultValue);
                    return {};
                }

                setStartDateUpdateError(errorMessageDefault);
                break;
            case FieldType.END_DATE:
                if (modalItem?.endDate) {
                    setEndDateError(defaultValue);
                    return {};
                }

                setEndDateError(errorMessageDefault);
                break;
            case FieldType.END_DATE_CHECK_IF_EXISTS:
                if (endDateAlreadyExists) {
                    setEndDateError(errorMessageDateAlreadyExists);
                    setEndDateAlreadyExists('');
                    return {};
                }

                setEndDateError(defaultValue);
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
            case FieldType.AMOUNT_UPDATE:
                if (modalUpdateItem?.amount != null) {
                    const amountWithoutMask = removeCurrencyMask(modalUpdateItem?.amount);
                    if (amountWithoutMask !== '') {
                        setAmountUpdateError(defaultValue);
                        return {};
                    }
                }

                setAmountUpdateError(errorMessageDefault);
                break;
        }
    };

    const handleOpenModal = (type: ModalType) => {
        setIsDotsModal(false);
        setIsCreateDifferentiatedValueModal(false);
        setIsEditDifferentiatedValueModal(false);
        setIsUpdateDifferentiatedValueModal(false);

        switch (type) {
            case ModalType.DOTS:
                setIsDotsModal(true);
                break;
            case ModalType.CREATE_DIFFERENTIATED_VALUE:
                setIsCreateDifferentiatedValueModal(true);
                break;
            case ModalType.EDIT_DIFFERENTIATED_VALUE:
                setIsEditDifferentiatedValueModal(true);
                break;
            case ModalType.UPDATE_DIFFERENTIATED_VALUE:
                setIsUpdateDifferentiatedValueModal(true);
                break;
        }
    };

    const handleClose = () => {
        setIsCreateDifferentiatedValueModal(false);
        setIsEditDifferentiatedValueModal(false);
        setIsUpdateDifferentiatedValueModal(false);
        setIsDoctorAlreadyInTable(false);
        setStartDateAlreadyExists('');
        setEndDateAlreadyExists('');
        setIsDotsModal(false);
        setModalItem(null);
        setModalUpdateItem(null);
        setDoctorError(defaultValue);
        setStartDateError(defaultValue);
        setEndDateError(defaultValue);
        setStartDateUpdateError(defaultValue);
        setAmountError(defaultValue);
        setAmountUpdateError(defaultValue);
    };

    const getDifferentiatedValue = async () => {
        const predicate = {
            search: searchField,
            sort
        };

        await ContractService.getAllDifferentiatedValue(pageable, predicate, contractId).then(result => {
            setDifferentiatedValueList(result.content);
            setTotalPages(result.totalPages);
        });
    };

    const checkIfTheDoctorAlreadyInTable = async () => {
        const isDoctorAlready = await ContractService.checkIfTheDoctorExistsInDifferentValue(contractId, Number(modalItem?.doctor?.id));
        return isDoctorAlready;
    };

    const onCreateDifferentiatedValue = async (item: DifferentiatedValueType | null) => {
        validateField(FieldType.DOCTOR);
        validateField(FieldType.START_DATE);
        validateField(FieldType.AMOUNT);

        if (item?.doctor?.id != null && item?.startDate && item?.amount != null && !isDoctorAlreadyInTable) {
            item.contract = { id: contractId };
            item.amount = removeCurrencyMask(item.amount);
            item.startDate = DateUtils.getOnlyDate(item.startDate);
            item.endDate = DateUtils.getOnlyDate(item?.endDate);
            await ContractService.createDifferentiatedValue(item);
            getDifferentiatedValue();
            handleClose();
        }
    };

    const onEditDifferentiatedValue = async () => {
        validateField(FieldType.START_DATE);
        validateField(FieldType.AMOUNT);

        if (modalItem?.startDate) {
            modalItem.amount = removeCurrencyMask(modalItem.amount);

            if (modalItem.amount != null) {
                modalItem.contract = { id: contractId };
                modalItem.startDate = DateUtils.getOnlyDate(modalItem.startDate);
                modalItem.endDate = DateUtils.getOnlyDate(modalItem?.endDate);

                const getReturnUpdateDifferentiatedValue = await ContractService.updateDifferentiatedValue(modalItem);

                if (getReturnUpdateDifferentiatedValue === 'error.start.date.invalid') {
                    setStartDateAlreadyExists(getReturnUpdateDifferentiatedValue);
                    return;
                }

                if (getReturnUpdateDifferentiatedValue === 'error.end.date.invalid') {
                    setEndDateAlreadyExists(getReturnUpdateDifferentiatedValue);
                    return;
                }

                getDifferentiatedValue();
                handleClose();
            }
        }
    };

    const onUpdateDifferentiatedValue = async () => {
        validateField(FieldType.END_DATE);
        validateField(FieldType.START_DATE_UPDATE);
        validateField(FieldType.AMOUNT_UPDATE);

        if (modalItem?.startDate && modalItem?.endDate) {
            modalItem.contract = { id: contractId };
            modalItem.startDate = DateUtils.getOnlyDate(modalItem?.startDate);
            modalItem.endDate = DateUtils.getOnlyDate(modalItem?.endDate);
            await ContractService.updateDifferentiatedValue(modalItem);
        }

        if (modalUpdateItem?.startDate && modalUpdateItem?.amount != null) {
            modalUpdateItem.amount = removeCurrencyMask(modalUpdateItem.amount);
            if (modalUpdateItem.amount !== null) {
                modalUpdateItem.contract = { id: contractId };
                modalUpdateItem.doctor = { id: modalItem?.doctor?.id };
                modalUpdateItem.startDate = DateUtils.getOnlyDate(modalUpdateItem.startDate);
                modalUpdateItem.endDate = DateUtils.getOnlyDate(modalUpdateItem?.endDate);
                await ContractService.createDifferentiatedValue(modalUpdateItem);
                getDifferentiatedValue();
                handleClose();
            }
        }
    };

    const onDeleteDifferentiatedValue = async () => {
        const differentiatedValueId = modalItem?.id!;
        await ContractService.deleteDifferentiatedValue(differentiatedValueId);
        getDifferentiatedValue();
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
        { name: t('contractDetail.cost.table.initialDate'), sortCode: 'startDate' },
        { name: t('contractDetail.cost.table.finalDate'), sortCode: 'endDate' },
        { name: t('contractDetail.cost.table.value'), sortCode: 'amount' },
        {
            name: t('contractDetail.cost.table.inclusionDate'),
            sortCode: 'incUserDate'
        },
        {
            name: t('contractDetail.cost.table.changeDate'),
            sortCode: 'updateUserDate'
        },
        { sortDisabled: true }
    ];

    const handleTransformToTableContent = (content?: DifferentiatedValueType[]): (string | JSX.Element)[][] => {
        if (content == null || content.length === 0) return [];

        return content.map((item, index) => [
            item.doctor?.crmNumber ?? '',
            item.doctor?.name ?? '',
            DateUtils.formatDatePtBr(item?.startDate),
            DateUtils.formatDatePtBr(item?.endDate),
            maskAmount(item?.amount),
            DateUtils.formatDatePtBr(item?.incUserDate),
            DateUtils.formatDatePtBr(item?.updateUserDate),
            <>
                {contract?.isCurrentUserResponsible &&
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

    const tableContent = handleTransformToTableContent(differentiatedValueList);

    const renderCreateDifferentiatedValuesInputs = (): JSX.Element => {
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
                <div
                    style={{
                        display: 'flex',
                        marginTop: '25px',
                        justifyContent: 'space-between'
                    }}
                >
                    <div style={{ width: '48%' }}>
                        <CustomDateField
                            className="data-field"
                            disableErrorAndValidStyle
                            disableToolbar={true}
                            // isDialog={true}
                            // clearable={true}
                            label={modalItem?.startDate ? t('contractDetail.cost.modal.initialDate') : ''}
                            placeholder={t('contractDetail.cost.modal.initialDate')}
                            onChange={date => {
                                setModalItem({ ...modalItem, startDate: date?.format() });
                            }}
                            value={modalItem?.startDate}
                            error={startDateError?.value}
                            errorText={startDateError?.message}
                            onBlur={() => validateField(FieldType.START_DATE)}
                        />
                    </div>
                    <div style={{ width: '48%' }}>
                        <CustomDateField
                            className="data-field"
                            disableErrorAndValidStyle
                            label={modalItem?.endDate ? t('contractDetail.cost.modal.finalDate') : ''}
                            placeholder={t('contractDetail.cost.modal.finalDate')}
                            disableToolbar={true}
                            // isDialog={true}
                            // clearable={true}
                            minDate={modalItem?.startDate}
                            value={modalItem?.endDate}
                            onChange={date => {
                                if (modalItem?.startDate) {
                                    setModalItem({ ...modalItem, endDate: date?.format() });
                                }
                            }}
                        />
                        <div className="contract-cost__modal--caption-second">{t('contractDetail.cost.modal.blankDate')}</div>
                    </div>
                </div>
                <div style={{ width: '48%', marginTop: '20px' }}>
                    <CustomTextField
                        id="insertValueHour"
                        className={'custom-text-field-reference'}
                        label={t('contractDetail.cost.modal.insertValueHour')}
                        placeholder={t('contractDetail.cost.modal.insertValueHour')}
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

    const renderEditDifferentiatedValuesInputs = (): JSX.Element => {
        return (
            <>
                <div>
                    <CustomTextField
                        id="doctorName"
                        className={'custom-text-field-reference'}
                        label={t('contractDetail.cost.modal.doctor')}
                        placeholder={t('contractDetail.cost.modal.doctor')}
                        value={`${modalItem?.doctor?.name} - ${modalItem?.doctor?.crmNumber}`}
                        isDisabled={true}
                        onChange={() => {
                            /* empty */
                        }}
                    />
                </div>
                <div className="container-date-field">
                    <div style={{ width: '48%' }}>
                        <CustomDateField
                            className="data-field"
                            disableErrorAndValidStyle
                            disableToolbar={true}
                            // isDialog={true}
                            // clearable={true}
                            label={t('contractDetail.cost.modal.initialDate')}
                            onChange={date => {
                                setModalItem({ ...modalItem, startDate: date?.format() });
                            }}
                            value={modalItem?.startDate}
                            error={startDateError?.value}
                            errorText={startDateError?.message}
                            onBlur={() => validateField(FieldType.START_DATE)}
                        />
                    </div>
                    <div style={{ width: '48%' }}>
                        <CustomDateField
                            className="data-field"
                            disableErrorAndValidStyle
                            disableToolbar={true}
                            label={modalItem?.endDate ? t('contractDetail.cost.modal.finalDate') : ''}
                            placeholder={t('contractDetail.cost.modal.finalDate')}
                            onChange={date => {
                                if (modalItem?.startDate) {
                                    setModalItem({ ...modalItem, endDate: date?.format() });
                                }
                            }}
                            // isDialog={true}
                            // clearable={true}
                            minDate={modalItem?.startDate}
                            value={modalItem?.endDate}
                            error={endDateError?.value}
                            errorText={endDateError?.message}
                            onBlur={() => validateField(FieldType.END_DATE_CHECK_IF_EXISTS)}
                        />
                        <div className="contract-cost__modal--caption-second">{t('contractDetail.cost.modal.blankDate')}</div>
                    </div>
                </div>
                <div style={{ width: '48%', marginTop: '20px' }}>
                    <CustomTextField
                        id="insertValueHour"
                        className={'custom-text-field-reference'}
                        label={t('contractDetail.cost.modal.insertValueHour')}
                        placeholder={t('contractDetail.cost.modal.insertValueHour')}
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

    const renderUpdateDifferentiatedValuesInputs = (): JSX.Element => {
        return (
            <>
                <div style={{ marginTop: '10px' }}>
                    <CustomTextField
                        id="doctorName"
                        className={'custom-text-field-reference'}
                        label={t('contractDetail.cost.modal.doctor')}
                        placeholder={t('contractDetail.cost.modal.doctor')}
                        value={`${modalItem?.doctor?.name} - ${modalItem?.doctor?.crmNumber}`}
                        isDisabled={true}
                        onChange={() => {
                            /* empty */
                        }}
                    />
                </div>
                <div className="contract-cost__modal--subtitle">{t('contractDetail.cost.modal.subtitle')}</div>
                <div className="contract-cost__modal--border">
                    <div style={{ width: '50%', marginRight: '10px' }}>
                        <CustomDateField
                            className="data-field"
                            disableErrorAndValidStyle
                            disableToolbar={true}
                            // isDialog={true}
                            // clearable={true}
                            label={t('contractDetail.cost.modal.initialDate')}
                            onChange={date => {
                                setModalItem({ ...modalItem, startDate: date?.format() });
                            }}
                            value={modalItem?.startDate}
                        />
                    </div>
                    <div style={{ width: '50%', marginLeft: '10px' }}>
                        <CustomDateField
                            className="data-field"
                            disableErrorAndValidStyle
                            label={modalItem?.endDate ? t('contractDetail.cost.modal.finalDate') : ''}
                            placeholder={t('contractDetail.cost.modal.finalDate')}
                            disableToolbar={true}
                            // isDialog={true}
                            // clearable={true}
                            minDate={modalItem?.startDate}
                            value={modalItem?.endDate}
                            onChange={date => {
                                if (modalItem?.startDate) {
                                    setModalItem({ ...modalItem, endDate: date?.format() });
                                }
                            }}
                            error={endDateError?.value}
                            errorText={endDateError?.message}
                            onBlur={() => validateField(FieldType.END_DATE)}
                        />
                    </div>
                </div>
                <div className="contract-cost__modal--subtitle">{t('contractDetail.cost.modal.subtitleSecond')}</div>
                <div className="contract-cost__modal--border-second">
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '50%', marginRight: '10px' }}>
                            <CustomDateField
                                className="data-field"
                                disableErrorAndValidStyle
                                disableToolbar={true}
                                // isDialog={true}
                                // clearable={true}
                                minDate={DateUtils.addOneDayToDate(modalItem?.endDate)}
                                label={modalUpdateItem?.startDate ? t('contractDetail.cost.modal.initialDate') : ''}
                                placeholder={t('contractDetail.cost.modal.initialDate')}
                                onChange={date => {
                                    if (modalItem?.endDate) {
                                        setModalUpdateItem({
                                            ...modalUpdateItem,
                                            startDate: date?.format()
                                        });
                                    }
                                }}
                                value={modalUpdateItem?.startDate}
                                error={startDateUpdateError?.value}
                                errorText={startDateUpdateError?.message}
                                onBlur={() => {
                                    if (!modalItem?.endDate) {
                                        validateField(FieldType.END_DATE);
                                        return {};
                                    }

                                    validateField(FieldType.START_DATE_UPDATE);
                                }}
                            />
                        </div>
                        <div style={{ width: '50%', marginLeft: '10px' }}>
                            <CustomDateField
                                className="data-field"
                                disableErrorAndValidStyle
                                label={modalUpdateItem?.endDate ? t('contractDetail.cost.modal.finalDate') : ''}
                                placeholder={t('contractDetail.cost.modal.finalDate')}
                                disableToolbar={true}
                                // isDialog={true}
                                // clearable={true}
                                minDate={modalUpdateItem?.startDate}
                                value={modalUpdateItem?.endDate}
                                onChange={date => {
                                    if (modalUpdateItem?.startDate) {
                                        setModalUpdateItem({
                                            ...modalUpdateItem,
                                            endDate: date?.format()
                                        });
                                    }
                                }}
                            />
                            <div className="contract-cost__modal--caption-second">{t('contractDetail.cost.modal.blankDate')}</div>
                        </div>
                    </div>
                    <div>
                        <div style={{ width: '48%', marginTop: '20px' }}>
                            <CustomTextField
                                id="insertValueHour"
                                className={'custom-text-field-reference'}
                                label={t('contractDetail.cost.modal.insertValueHour')}
                                placeholder={t('contractDetail.cost.modal.insertValueHour')}
                                value={modalUpdateItem?.amount}
                                onChange={value => setModalUpdateItem({ ...modalUpdateItem, amount: formatterCurrency(value) })}
                                error={amountUpdateError?.value}
                                errorText={amountUpdateError?.message}
                                onBlur={() => validateField(FieldType.AMOUNT_UPDATE)}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <div style={{ marginBottom: '12px' }} className="contract-detail__container--body-group">
                <div className="contract-detail__container--body-subtitle"> {t('contractDetail.cost.titleSecond')}</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ maxWidth: '222px' }}>
                        <SearchTextField onChange={setSearchField} id={'search-field-differentiated-value'} placeholder="Buscar por" value={searchField} />
                    </div>
                    {contract?.isCurrentUserResponsible &&
                        <div className="base-selectfield" style={{ minWidth: '150px', marginLeft: '12px' }}>
                            <IconButton isAlignCenter width={'170px'} height={'33px'} filled clickButton={() => setIsCreateDifferentiatedValueModal(true)}>
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
                    <MenuItem onClick={() => handleOpenModal(ModalType.EDIT_DIFFERENTIATED_VALUE)}>{t('contractDetail.cost.buttons.edit')}</MenuItem>
                    {modalItem?.isLast && (
                        <MenuItem onClick={() => handleOpenModal(ModalType.UPDATE_DIFFERENTIATED_VALUE)}>{t('contractDetail.cost.buttons.update')}</MenuItem>
                    )}
                    <MenuItem onClick={onDeleteDifferentiatedValue}>{t('contractDetail.cost.buttons.delete')}</MenuItem>
                </Menu>
                <BasicModal
                    onClose={handleClose}
                    showModal={isCreateDifferentiatedValueModal}
                    modalTitle={t('contractDetail.cost.modal.titleSecond')}
                    toggleModal={handleClose}
                    hasTwoButtons
                    primaryButtonTitle={t('contractDetail.cost.buttons.save')}
                    secondaryButtonTitle={t('contractDetail.cost.buttons.goBack')}
                    primaryButtonAction={() => onCreateDifferentiatedValue(modalItem)}
                    secondaryButtonAction={handleClose}
                    centralized
                    inputs={renderCreateDifferentiatedValuesInputs()}
                />
                <BasicModal
                    onClose={handleClose}
                    showModal={isEditDifferentiatedValueModal}
                    modalTitle={t('contractDetail.cost.modal.titleSixth')}
                    toggleModal={handleClose}
                    hasTwoButtons
                    primaryButtonTitle={t('contractDetail.cost.buttons.save')}
                    secondaryButtonTitle={t('contractDetail.cost.buttons.goBack')}
                    primaryButtonAction={() => onEditDifferentiatedValue()}
                    secondaryButtonAction={handleClose}
                    centralized
                    inputs={renderEditDifferentiatedValuesInputs()}
                />
                <BasicModal
                    onClose={handleClose}
                    showModal={isUpdateDifferentiatedValueModal}
                    modalTitle={t('contractDetail.cost.modal.titleFourth')}
                    toggleModal={handleClose}
                    hasTwoButtons
                    primaryButtonTitle={t('contractDetail.cost.buttons.save')}
                    secondaryButtonTitle={t('contractDetail.cost.buttons.goBack')}
                    primaryButtonAction={() => onUpdateDifferentiatedValue()}
                    secondaryButtonAction={handleClose}
                    centralized
                    inputs={renderUpdateDifferentiatedValuesInputs()}
                />
            </div>
        </>
    );
};

export default DifferentiatedValueTable;
