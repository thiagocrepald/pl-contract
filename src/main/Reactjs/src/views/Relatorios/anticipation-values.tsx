import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DeleteImg from '../../assets/img/svg/trash-bin.svg';
import CustomTextField from '../../components/custom-text-field/custom-text-field';
import Footer from '../../components/footer/footer';
import IconButton from '../../components/icon-button/icon-button';
import SearchTextField from '../../components/search-text-field/search-text-field';
import SimpleOrderTable, { ColumnSort } from '../../components/simple-ordered-table/simple-ordered-table';
import NotificationModal from '../../components/notification-modal/notification-modal';
import Tags from '../../components/tag/tag';
import './admin-report/styles.scss';
import './import-report.scss';
import { AnticipationValueType } from '../../model/anticipation-value-type';
import { Importation } from '../../model/importation-type';
import AnticipationValueService from '../../services/anticipation-value-service';
import { Pageable } from '../../model/pageable';
import { ReactComponent as CheckboxGreenUnchecked } from '../../assets/img/checkbox-green-round/unchecked-circle.svg';
import { ReactComponent as CheckboxGreenChecked } from '../../assets/img/checkbox-green-round/checked-circle.svg';
import DateUtils from '../../util/date-utils';
import { formatterCurrency, maskAmount, removeCurrencyMask } from '../../util/mask-utils';
import { defaultValue, ErrorAndMessage } from '../../model/validation';
import { Menu, MenuItem } from '@material-ui/core';
import AutocompleteDoctor from './anticipation-values/autocomplete-doctor-search/autocompleteDoctor';

enum FieldType {
    DOCTOR,
    GROSS_VALUE
}

enum ModalType {
    DOTS
}

const AnticipationValues = () => {
    const match = useRouteMatch('/admin/anticipation-values/:contractId/:timeCourse/:isClosingOfficerUser');
    const contractId = match?.params?.[`contractId`];
    const timeCourse = DateUtils.getMonthAndYear(match?.params?.[`timeCourse`]);
    const isClosingOfficerUser = match?.params?.[`isClosingOfficerUser`];
    const history = useHistory();
    const { t } = useTranslation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [sort, setSort] = useState<string>('id,desc');
    const [pageable, setPageable] = useState<Pageable>({
        size: 10,
        page: 0,
        totalPages: 0
    });
    const [totalPages, setTotalPages] = useState<number>(0);

    const [searchField, setSearchField] = useState<string>("");
    const [searchDoctor, setSearchDoctor] = useState("");

    const [doctors, setDoctors] = useState<Importation[]>([]);
    const [anticipationValues, setAnticipationValues] = useState<AnticipationValueType[] | null>(null);
    const [newAnticipationValueItem, setNewAnticipationValueItem] = useState<AnticipationValueType | null>(null);
    const [modalItem, setModalItem] = useState<AnticipationValueType | null>(null);
    const [generateIdItems, setGenerateIdItems] = useState<number[]>([]);
    const [doctorSelected, setDoctorSelected] = useState<Importation | null>(null);

    const [isProLabor, setIsProLabor] = useState(false);
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [isDotsModal, setIsDotsModal] = useState<boolean>(false);

    const [keyToClearInputDoctor, setKeyToClearInputDoctor] = useState(1);

    const [doctorError, setDoctorError] = useState<ErrorAndMessage>(defaultValue);
    const [grossValueError, setGrossValueError] = useState<ErrorAndMessage>(defaultValue);
    const errorMessageDefault: ErrorAndMessage = {
        message: t('management.fieldError.required'),
        value: true
    };
    const errorGrossValueHigherThanAllowed: ErrorAndMessage = {
        message: t('management.fieldError.valueHigherThanAllowed'),
        value: true
    };

    useEffect(() => {
        console.log(doctorSelected);
    }, [doctorSelected]);

    useEffect(() => {
        getDoctors();
    }, [searchDoctor]);

    useEffect(() => {
        getAnticipationValues();
    }, [searchField, sort, pageable]);

    useEffect(() => {
        if (newAnticipationValueItem?.grossValue != null) {
            calcNetValue();
        }
    }, [
        newAnticipationValueItem?.grossValue,
        newAnticipationValueItem?.otherDiscounts,
        newAnticipationValueItem?.discountMember,
        newAnticipationValueItem?.prolaboreDiscount
    ]);

    const validateField = (field: FieldType) => {
        switch (field) {
            case FieldType.DOCTOR:
                if (doctorSelected?.id != null) {
                    setDoctorError(defaultValue);
                    return {};
                }

                setDoctorError(errorMessageDefault);
                break;

            case FieldType.GROSS_VALUE:
                const grossValueWithoutMask = removeCurrencyMask(newAnticipationValueItem?.grossValue);

                if (grossValueWithoutMask === '') {
                    setGrossValueError(errorMessageDefault);
                    return {};
                }

                if (Number(grossValueWithoutMask) > Number(doctorSelected?.grossValue!)) {
                    setGrossValueError(errorGrossValueHigherThanAllowed);
                    return {};
                }

                setGrossValueError(defaultValue);
                break;
        }
    };

    const getAnticipationValues = async () => {
        const predicate = {
            search: searchField,
            sort
        };

        await AnticipationValueService.getAnticipationValue(pageable, predicate).then(result => {
            if (result.status === 200) {
                setAnticipationValues(result.data.content);
                setTotalPages(result.data.totalPages);
            }
        });
    };

    const getDoctors = async () => {
        const predicate = {
            search: searchDoctor
        };

        await AnticipationValueService.getDoctors(contractId, timeCourse, predicate).then(result => setDoctors(result.content));
    };

    const createOrUpdateAnticipationValue = async () => {
        validateField(FieldType.GROSS_VALUE);
        validateField(FieldType.DOCTOR);

        if (doctorSelected?.importationKey?.doctor?.id != null && newAnticipationValueItem?.grossValue != null) {
            const grossValue = removeCurrencyMask(maskAmount(newAnticipationValueItem?.grossValue));
            const discountMember = removeCurrencyMask(maskAmount(newAnticipationValueItem?.discountMember));
            const otherDiscounts = removeCurrencyMask(maskAmount(newAnticipationValueItem?.otherDiscounts));
            const prolaboreDiscount = removeCurrencyMask(maskAmount(newAnticipationValueItem?.prolaboreDiscount));
            let isProLabore = false;

            if (newAnticipationValueItem.prolaboreDiscount != null) {
                isProLabore = true
            };

            if (newAnticipationValueItem.id != null) {
                await AnticipationValueService.updateAnticipationValues({
                    id: newAnticipationValueItem.id,
                    importation: {
                        importationKey: doctorSelected.importationKey
                    },
                    grossValue,
                    discountMember,
                    otherDiscounts,
                    prolaboreDiscount,
                    isProLabore
                });

                setNewAnticipationValueItem(null);
                setDoctorSelected(null);
                handleClose();
                getAnticipationValues();
                return;
            }

            await AnticipationValueService.createAnticipationValue({
                importation: {
                    importationKey: doctorSelected.importationKey
                },
                grossValue,
                discountMember,
                otherDiscounts,
                prolaboreDiscount,
                isProLabore
            });

            setNewAnticipationValueItem(null);
            setDoctorSelected(null);
            handleClose();
            getAnticipationValues();
        }
    };

    const onUpdateGenerated = async () => {
        if (generateIdItems.length > 0) {
            await AnticipationValueService.updateGenerate(generateIdItems);
            handleClose();
            getAnticipationValues();
        }
    };

    const onDeleteAnticipationValue = async () => {
        await AnticipationValueService.deleteAnticipationValue(modalItem?.id!);
        getAnticipationValues();
        handleClose();
        setAnchorEl(null);
    };

    const generate = async (id: number) => {
        const indexItem = generateIdItems.indexOf(id);

        if (indexItem !== -1) {
            generateIdItems.splice(indexItem, 1);
            setGenerateIdItems([...generateIdItems]);
            return {};
        }

        setGenerateIdItems([...generateIdItems, id]);
    };

    const calcNetValue = () => {
        if (newAnticipationValueItem?.grossValue != null) {
            const grossAmount = Number(removeCurrencyMask(maskAmount(newAnticipationValueItem?.grossValue)));
            const partnerDate = Number(removeCurrencyMask(maskAmount(newAnticipationValueItem?.discountMember)));
            const otherDiscounts = Number(removeCurrencyMask(maskAmount(newAnticipationValueItem?.otherDiscounts)));
            const proLaborDiscounts = isProLabor ? Number(removeCurrencyMask(maskAmount(newAnticipationValueItem?.prolaboreDiscount))) : 0;

            const totalNetValue = grossAmount - (partnerDate + otherDiscounts + proLaborDiscounts);
            setNewAnticipationValueItem({ ...newAnticipationValueItem, netValue: maskAmount(totalNetValue) });
        }
    };

    const updatePage = (page: number) => {
        setPageable({ page, size: 10 });
    };

    const onSort = (sorted: string) => {
        setSort(sorted);
    };

    const handleOpenModal = (type: ModalType) => {
        setIsDotsModal(false);

        switch (type) {
            case ModalType.DOTS:
                setIsDotsModal(true);
                break;
        }
    };

    const handleClose = () => {
        const assignOneToKey = keyToClearInputDoctor + 1;
        setKeyToClearInputDoctor(assignOneToKey);
        setModalItem(null);
        setIsDotsModal(false);
        setGenerateIdItems([]);
        setDoctorError(defaultValue);
        setGrossValueError(defaultValue);
    };

    const tableHeaders: ColumnSort[] = [
        { name: t('report.import.table.select'), sortDisabled: true },
        { name: t('report.import.table.date'), sortCode: 'updatedDate' },
        { name: t('report.import.table.status'), sortCode: 'isGenerated' },
        { name: t('report.import.table.doctorName'), sortCode: 'importation' },
        { name: t('report.import.table.grossValue'), sortCode: 'grossValue' },
        { name: t('report.import.table.partners'), sortCode: 'discountMember' },
        { name: t('report.import.table.otherDiscounts'), sortCode: 'otherDiscounts' },
        { name: t('report.import.table.proLaborDiscounts'), sortCode: 'prolaboreDiscount' },
        { sortDisabled: true }
    ];

    const handleTransformToTableContent = (content: AnticipationValueType[] | null): (string | JSX.Element)[][] => {
        if (content == null || content.length === 0) {
            return [];
        }

        return content.map((item, index) => {
            return [
                <div key={`checkbox-pro-labor-${index}`} onClick={() => generate(item.id!)}>
                    {generateIdItems.indexOf(item.id!) !== -1 ? <CheckboxGreenChecked /> : <CheckboxGreenUnchecked />}
                </div>,
                DateUtils.formatDatePtBr(item.updatedDate),
                <div key={`status-${index}`}>
                    {item.isGenerated ? (
                        <Tags color="white" background="#91A739">
                            {t('global.tag.generated')}
                        </Tags>
                    ) : (
                        <Tags color="white" background="#DFA944">
                            {t('global.tag.pendency')}
                        </Tags>
                    )}
                </div>,
                item.importation?.doctorName ?? '',
                maskAmount(item.grossValue),
                maskAmount(item.discountMember),
                maskAmount(item.otherDiscounts),
                maskAmount(item.prolaboreDiscount),
                <div
                    key={`icon-dots-${index}`}
                    className="icon-dots"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={({ currentTarget }) => {
                        setModalItem(item);
                        setAnchorEl(currentTarget);
                        handleOpenModal(ModalType.DOTS);
                    }}
                />
            ];
        });
    };

    const footer = () => {
        return (
            <div className="report-import__modal--fields">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <AutocompleteDoctor
                        doctorsList={doctors}
                        onChange={(event, value) => setDoctorSelected(value)}
                        onInputChange={(event, inputValue) => setSearchDoctor(inputValue)}
                        defaultDoctor={doctorSelected}
                        onBlur={() => validateField(FieldType.DOCTOR)}
                        error={doctorError?.value}
                        helperText={doctorError?.message}
                        keyToClearInput={keyToClearInputDoctor}
                    />
                    <div style={{ marginRight: '12px' }} />
                    <CustomTextField
                        style={{ maxWidth: '135px' }}
                        id="gross-value"
                        className={'custom-text-field-reference'}
                        placeholder={t('report.import.textField.grossValue')}
                        label={t('report.import.textField.grossValue')}
                        value={maskAmount(newAnticipationValueItem?.grossValue)}
                        onChange={value => {
                            if (doctorSelected != null) {
                                setNewAnticipationValueItem({ ...newAnticipationValueItem, grossValue: formatterCurrency(value) });
                            }
                        }}
                        onBlur={() => validateField(FieldType.GROSS_VALUE)}
                        error={grossValueError?.value}
                        errorText={grossValueError?.message}
                    />
                    <div style={{ marginRight: '12px' }} />
                    <CustomTextField
                        id="discounts"
                        className={'custom-text-field-reference'}
                        placeholder={t('report.import.textField.discounts')}
                        label={t('report.import.textField.discounts')}
                        value={maskAmount(newAnticipationValueItem?.discountMember)}
                        onChange={value => setNewAnticipationValueItem({ ...newAnticipationValueItem, discountMember: formatterCurrency(value) })}
                    />
                    <div style={{ marginRight: '12px' }} />
                    <CustomTextField
                        id="other-discounts"
                        className={'custom-text-field-reference'}
                        placeholder={t('report.import.textField.valueDiscounts')}
                        label={t('report.import.textField.valueDiscounts')}
                        value={maskAmount(newAnticipationValueItem?.otherDiscounts)}
                        onChange={value => setNewAnticipationValueItem({ ...newAnticipationValueItem, otherDiscounts: formatterCurrency(value) })}
                    />
                    <div style={{ marginRight: '12px' }} />
                    {isProLabor && (
                        <CustomTextField
                            style={{ marginRight: '12px' }}
                            id="pro-labor"
                            className={'custom-text-field-reference'}
                            placeholder={t('report.import.textField.proLabor')}
                            label={t('report.import.textField.proLabor')}
                            value={maskAmount(newAnticipationValueItem?.prolaboreDiscount)}
                            onChange={value => setNewAnticipationValueItem({ ...newAnticipationValueItem, prolaboreDiscount: formatterCurrency(value) })}
                        />
                    )}
                    <CustomTextField
                        id="net-value"
                        className={'custom-text-field-reference'}
                        placeholder={t('report.import.textField.netValue')}
                        value={maskAmount(newAnticipationValueItem?.netValue)}
                        onChange={() => { /* empty */ }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', flex: '0 0 30%', justifyContent: 'flex-end' }}>
                    <div className="radio-button" onClick={() => setIsProLabor(!isProLabor)}>
                        {isProLabor ? <CheckboxGreenChecked /> : <CheckboxGreenUnchecked />}
                        <div style={{ marginLeft: '5px' }}>{t('report.import.table.proLabore')}</div>
                    </div>
                    <img
                        className="radio-button"
                        src={DeleteImg}
                        onClick={() => {
                            handleClose();
                            setNewAnticipationValueItem(null);
                            setDoctorSelected(null);
                        }}
                    />
                    {
                        <IconButton
                            color="green"
                            fontSize="14px"
                            isAlignCenter
                            width={'133px'}
                            height={'40px'}
                            filled
                            clickButton={() => createOrUpdateAnticipationValue()}
                        >
                            {t('global.button.save')}
                        </IconButton>
                    }
                </div>
            </div>
        );
    };

    const rows = handleTransformToTableContent(anticipationValues);

    return (
        <div className="report__container">
            <div className="report-import__modal--header">
                <div className="back-button" onClick={() => history.push('/admin/import-report')}>
                    <div className="arrow-white" />
                </div>
                <div className="contract-detail__container--header-title">Antecipação de Valores</div>
            </div>
            {showNotifications && <NotificationModal />}
            <div className="report-import__modal--buttons">
                <div style={{ maxWidth: '222px', marginRight: '24px' }}>
                    <SearchTextField onChange={setSearchField} id={'search-field'} placeholder="Buscar por" value={searchField} />
                </div>
                {isClosingOfficerUser && (
                    <IconButton color="green" fontSize="14px" isAlignCenter width={'165px'} height={'34px'} filled clickButton={() => onUpdateGenerated()}>
                        {t('report.import.modal.button')}
                    </IconButton>
                )}
            </div>
            <div className="scroll-table padding-page">
                <SimpleOrderTable
                    rows={rows}
                    page={pageable}
                    totalPages={totalPages}
                    columnNameKeys={tableHeaders}
                    onChangePage={updatePage}
                    onSort={sortCode => onSort(sortCode)}
                    footer={footer()}
                />
                <Menu className="tooltip-style" anchorEl={anchorEl} keepMounted open={isDotsModal} onClose={() => handleClose()}>
                    <MenuItem
                        onClick={() => {
                            getDoctors();
                            setNewAnticipationValueItem(modalItem);
                            setDoctorSelected(modalItem?.importation ?? null);
                            if (modalItem?.prolaboreDiscount != null) {
                                setIsProLabor(true);
                            }
                            handleClose();
                        }}
                    >
                        {t('global.button.edit')}
                    </MenuItem>
                    <MenuItem onClick={onDeleteAnticipationValue}>{t('global.button.delete')}</MenuItem>
                </Menu>
            </div>

            <Footer />
        </div>
    );
};

export default AnticipationValues;
