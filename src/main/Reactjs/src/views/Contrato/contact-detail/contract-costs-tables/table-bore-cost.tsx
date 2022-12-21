import React, { useState, useEffect } from 'react';
import IconButton from '../../../../components/icon-button/icon-button';
import { useTranslation } from 'react-i18next';
import '../../contract-detail.scss';
import '../contract-cost.scss';
import '../../../../components/main.scss';
import SearchTextField from '../../../../components/search-text-field/search-text-field';
import { FormControl, InputLabel, makeStyles, Select, FormHelperText, Menu, MenuItem } from '@material-ui/core';
import SimpleOrderTable, { ColumnSort } from '../../../../components/simple-ordered-table/simple-ordered-table';
import CustomTextField from '../../../../components/custom-text-field/custom-text-field';
import BasicModal from '../../../../components/BasicModal/basic-modal';
import { Pageable } from '../../../../model/pageable';
import { BoreCostType } from '../../../../model/contract-costs-type';
import { Schedule } from '../../../../model/schedule';
import { OnCall } from '../../../../model/on-call';
import ContractService from '../../../../services/contract-costs-service';
import { maskAmount, formatterCurrency, removeCurrencyMask } from '../../../../util/mask-utils';
import DateUtils from '../../../../util/date-utils';
import AutocompleteDoctorSearch from '../../../../components/autocomplete-doctor-search/autocomplete-doctor-search';
import { defaultValue, ErrorAndMessage } from '../../../../model/validation';
import moment from 'moment';
import { APP_TIME_FORMAT } from '../../../../config/constants';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    }
}));

enum ModalType {
    DOTS,
    CREATE_BORE_COST,
    EDIT_BORE_COST
}

enum FieldType {
    DOCTOR,
    SCALE,
    ONCALL,
    AMOUNT
}

const BoreCostTable = ({ contractId, contract }): JSX.Element => {
    const { t } = useTranslation();
    const [pageable, setPageable] = useState<Pageable>({
        size: 6,
        page: 0,
        totalPages: 0
    });
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [searchField, setSearchField] = useState<string>('');
    const [sort, setSort] = useState<string>('id,desc');
    const [totalPages, setTotalPages] = useState<number>(0);

    const [isCreateBoreCostModal, setIsCreateBoreCostModal] = useState<boolean>(false);
    const [isEditBoreCostModal, setIsEditBoreCostModal] = useState<boolean>(false);
    const [isDotsModal, setIsDotsModal] = useState<boolean>(false);

    const [modalItem, setModalItem] = useState<BoreCostType | null>(null);
    const [boreCostList, setBoreCostList] = useState<BoreCostType[]>([]);
    const [schedulesList, setSchedulesList] = useState<Schedule[] | null>(null);
    const [onCallsList, setOnCallsList] = useState<OnCall[] | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

    const [doctorError, setDoctorError] = useState<ErrorAndMessage>(defaultValue);
    const [scaleError, setScaleError] = useState<ErrorAndMessage>(defaultValue);
    const [onCallError, setOnCallError] = useState<ErrorAndMessage>(defaultValue);
    const [amountError, setAmountError] = useState<ErrorAndMessage>(defaultValue);
    const errorMessageDefault: ErrorAndMessage = {
        message: t('management.fieldError.required'),
        value: true
    };

    useEffect(() => {
        getBoreCosts();
        getSchedules();
        getOnCalls();
    }, [pageable, searchField, sort, selectedSchedule]);

    useEffect(() => {
        if (modalItem?.onCall?.schedule != null) {
            setSelectedSchedule(modalItem.onCall.schedule!);
        }
    }, [modalItem]);

    const classes = useStyles();

    const validateField = (field: FieldType) => {
        switch (field) {
            case FieldType.DOCTOR:
                if (modalItem?.doctor?.id) {
                    setDoctorError(defaultValue);
                    return {};
                }

                setDoctorError(errorMessageDefault);
                break;
            case FieldType.SCALE:
                if (selectedSchedule?.id) {
                    setScaleError(defaultValue);
                    return {};
                }

                setScaleError(errorMessageDefault);
                break;
            case FieldType.ONCALL:
                if (modalItem?.onCall?.id) {
                    setOnCallError(defaultValue);
                    return {};
                }

                setOnCallError(errorMessageDefault);
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
        setIsCreateBoreCostModal(false);
        setIsEditBoreCostModal(false);

        switch (type) {
            case ModalType.DOTS:
                setIsDotsModal(true);
                break;
            case ModalType.CREATE_BORE_COST:
                setIsCreateBoreCostModal(true);
                break;
            case ModalType.EDIT_BORE_COST:
                setIsEditBoreCostModal(true);
                break;
        }
    };

    const handleClose = () => {
        setIsCreateBoreCostModal(false);
        setIsEditBoreCostModal(false);
        setIsDotsModal(false);
        setModalItem(null);
        setSelectedSchedule(null);
        setOnCallsList(null);
        setDoctorError(defaultValue);
        setScaleError(defaultValue);
        setOnCallError(defaultValue);
        setAmountError(defaultValue);
    };

    const getBoreCosts = async () => {
        const predicate = {
            search: searchField,
            sort
        };

        await ContractService.getAllBoreCost(pageable, predicate, contractId).then(result => {
            setBoreCostList(result.content);
            setTotalPages(result.totalPages);
        });
    };

    const getSchedules = async () => {
        await ContractService.getSchedules(contractId).then(result => {
            setSchedulesList(result.content);
        });
    };

    const getOnCalls = async () => {
        if (selectedSchedule) {
            await ContractService.getOnCalls(selectedSchedule.id).then(result => {
                setOnCallsList(result.content);
            });
        }
    };

    const onCreateBoreCost = async (item: BoreCostType | null) => {
        validateField(FieldType.DOCTOR);
        validateField(FieldType.SCALE);
        validateField(FieldType.ONCALL);
        validateField(FieldType.AMOUNT);

        if (item?.doctor?.id && item?.onCall?.id && item?.amount != null) {
            item.contract = { id: contractId };
            item.amount = removeCurrencyMask(item.amount);
            await ContractService.createBoreCost(item);
            getBoreCosts();
            handleClose();
        }
    };

    const onEditBoreCost = async () => {
        if (modalItem) {
            modalItem.contract = { id: contractId };
            modalItem.amount = removeCurrencyMask(modalItem.amount);
            await ContractService.updateBoreCost(modalItem);
            getBoreCosts();
            handleClose();
        }
    };

    const onDeleteBoreCost = async () => {
        const boreCostId = modalItem?.id!;
        await ContractService.deleteBoreCost(boreCostId);
        getBoreCosts();
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
            name: t('contractDetail.cost.table.scale'),
            sortCode: 'onCall.schedule.scheduleName'
        },
        {
            name: t('contractDetail.cost.table.sector'),
            sortCode: 'onCall.sectors.description'
        },
        { name: t('contractDetail.cost.table.day'), sortCode: 'onCall.day' },
        { name: t('contractDetail.cost.table.date'), sortCode: 'onCall.date' },
        { name: t('contractDetail.cost.table.time'), sortCode: 'onCall.startTime' },
        { name: t('contractDetail.cost.table.value'), sortCode: 'amount' },
        { sortDisabled: true }
    ];

    const handleTransformToTableContent = (content: BoreCostType[]): (string | JSX.Element)[][] => {
        if (content == null || content.length === 0) return [];

        return content.map((item, index) => {
            return [
                item.doctor?.crmNumber ?? '',
                item.doctor?.name ?? '',
                item.onCall?.schedule?.scheduleName ?? '',
                item.onCall?.sectors?.map(sector => sector.description)?.[0] ?? '',
                item.onCall?.day ?? '',
                DateUtils.formatDatePtBr(item?.onCall?.date),
                moment.utc(item.onCall?.startTime).local().format(APP_TIME_FORMAT),
                maskAmount(item?.amount),
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
            ];
        });
    };

    const tableContent = handleTransformToTableContent(boreCostList);

    const renderCreateCostInputs = (): JSX.Element => {
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
                <div style={{ marginTop: '25px' }}>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="select-scale-filled-label">{t('contractDetail.cost.modal.selectScale')}</InputLabel>
                        <Select
                            labelId="select-scale-filled-label"
                            onChange={e => {
                                setSelectedSchedule({ id: Number(e.target.value) });
                            }}
                            value={selectedSchedule?.id}
                            onBlur={() => validateField(FieldType.SCALE)}
                        >
                            {schedulesList?.map((scale, index) => (
                                <MenuItem key={index} value={scale?.id}>
                                    {scale?.scheduleName}
                                </MenuItem>
                            ))}
                        </Select>
                        {scaleError?.value && <FormHelperText id="scale-helper-text">{scaleError?.message}</FormHelperText>}
                    </FormControl>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="select-oncall-filled-label">{t('contractDetail.cost.modal.selectDuty')}</InputLabel>
                        <Select
                            labelId="select-oncall-filled-label"
                            onChange={e => {
                                setModalItem({
                                    ...modalItem,
                                    onCall: { id: Number(e.target.value) }
                                });
                            }}
                            value={modalItem?.onCall?.id}
                            onBlur={() => validateField(FieldType.ONCALL)}
                        >
                            {onCallsList?.map((onDuty, index) => (
                                <MenuItem key={index} value={onDuty?.id}>
                                    {`
                                        ${DateUtils.formatDatePtBr(onDuty?.date)} 
                                        - ${moment.utc(onDuty?.startTime).local().format(APP_TIME_FORMAT)} 
                                        - ${onDuty?.day} 
                                        - ${onDuty?.shift}
                                        - ${onDuty?.doctor?.name}
                                    `}
                                </MenuItem>
                            ))}
                        </Select>
                        {onCallError?.value && <FormHelperText id="scale-helper-text">{onCallError?.message}</FormHelperText>}
                    </FormControl>
                </div>
                <div style={{ width: '50%', marginTop: '20px' }}>
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

    const renderEditCostInputs = (): JSX.Element => {
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
                <div style={{ marginTop: '20px' }}>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="edit-scale-filled-label">{t('contractDetail.cost.modal.selectScale')}</InputLabel>
                        <Select
                            labelId="edit-scale-filled-label"
                            defaultValue={modalItem?.onCall?.schedule?.id}
                            onChange={e => {
                                setSelectedSchedule({ id: Number(e.target.value) });
                            }}
                        >
                            {schedulesList?.map((scale, index) => (
                                <MenuItem key={index} value={scale?.id}>
                                    {scale?.scheduleName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="edit-oncall-filled-label">{t('contractDetail.cost.modal.selectDuty')}</InputLabel>
                        <Select
                            labelId="edit-oncall-filled-label"
                            defaultValue={modalItem?.onCall?.id ?? ''}
                            onChange={e => {
                                setModalItem({
                                    ...modalItem,
                                    onCall: { id: Number(e.target.value) }
                                });
                            }}
                        >
                            {onCallsList?.map((onDuty, index) => (
                                <MenuItem key={index} value={onDuty?.id}>
                                    {`
                                        ${DateUtils.formatDatePtBr(onDuty?.date)} 
                                        - ${moment.utc(onDuty?.startTime).local().format(APP_TIME_FORMAT)} 
                                        - ${onDuty?.day} 
                                        - ${onDuty?.shift}
                                    `}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div style={{ width: '50%', marginTop: '20px' }}>
                    <CustomTextField
                        id="editValueHour"
                        className={'custom-text-field-reference'}
                        label={t('contractDetail.cost.modal.insertValueHour')}
                        placeholder={t('contractDetail.cost.modal.insertValueHour')}
                        value={maskAmount(modalItem?.amount)}
                        onChange={value => setModalItem({ ...modalItem, amount: formatterCurrency(value) })}
                    />
                </div>
            </>
        );
    };

    return (
        <>
            <div style={{ marginBottom: '12px' }} className="contract-detail__container--body-group">
                <div className="contract-detail__container--body-subtitle"> {t('contractDetail.cost.title')}</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ maxWidth: '222px' }}>
                        <SearchTextField onChange={setSearchField} id={'search-field-cost'} placeholder="Buscar por" value={searchField} />
                    </div>
                    {contract.isCurrentUserResponsible && 
                        <div className="base-selectfield" style={{ minWidth: '150px', marginLeft: '12px' }}>
                            <IconButton isAlignCenter width={'170px'} height={'33px'} filled clickButton={() => setIsCreateBoreCostModal(true)}>
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
                    <MenuItem onClick={() => handleOpenModal(ModalType.EDIT_BORE_COST)}>{t('contractDetail.cost.buttons.edit')}</MenuItem>
                    <MenuItem onClick={onDeleteBoreCost}>{t('contractDetail.cost.buttons.delete')}</MenuItem>
                </Menu>
                <BasicModal
                    onClose={handleClose}
                    showModal={isCreateBoreCostModal}
                    modalTitle={t('contractDetail.cost.modal.title')}
                    toggleModal={handleClose}
                    hasTwoButtons
                    primaryButtonTitle={t('contractDetail.cost.buttons.save')}
                    secondaryButtonTitle={t('contractDetail.cost.buttons.goBack')}
                    primaryButtonAction={() => onCreateBoreCost(modalItem)}
                    secondaryButtonAction={handleClose}
                    centralized
                    inputs={renderCreateCostInputs()}
                />
                <BasicModal
                    onClose={handleClose}
                    showModal={isEditBoreCostModal}
                    modalTitle={t('contractDetail.cost.modal.titleFifth')}
                    toggleModal={handleClose}
                    hasTwoButtons
                    primaryButtonTitle={t('contractDetail.cost.buttons.save')}
                    secondaryButtonTitle={t('contractDetail.cost.buttons.goBack')}
                    primaryButtonAction={() => onEditBoreCost()}
                    secondaryButtonAction={handleClose}
                    centralized
                    inputs={renderEditCostInputs()}
                />
            </div>
        </>
    );
};

export default BoreCostTable;
