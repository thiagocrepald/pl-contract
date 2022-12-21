import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { FormControl, makeStyles, Select, MenuItem, Popover } from '@material-ui/core';
import { Col, Row } from 'react-bootstrap';
import CifraImg from '../../assets/img/svg/cifra.svg';
import DoctorImg from '../../assets/img/svg/doctor.svg';
import DownloadImg from '../../assets/img/svg/download2.svg';
import DropImg from '../../assets/img/svg/drop.svg';
import NotificationImg from '../../assets/img/svg/notificaçao.svg';
import EyeOffImg from '../../assets/img/svg/eye-off.svg';
import Footer from '../../components/footer/footer';
import IconButton from '../../components/icon-button/icon-button';
import SearchTextField from '../../components/search-text-field/search-text-field';
import NotificationModal from '../../components/notification-modal/notification-modal';
import './admin-report/styles.scss';
import './import-report.scss';
import { ImportationType, Importation, DataSearchImportationType } from '../../model/importation-type';
import { Contract } from '../../model/contract';
import { User } from '../../model/user';
import ImportationService from '../../services/importation-service';
import CustomDateField from '../../components/custom-date-field/custom-date-field';
import { Pageable } from '../../model/pageable';
import DateUtils from '../../util/date-utils';
import AuthUtils from '../../util/auth-utils';
import { maskAmount, removeCurrencyMask } from '../../util/mask-utils';
import { ReactComponent as EyeOnGreenImg } from '../../assets/img/svg/eye-on-green.svg';
import DropdownWaitingDoctor from './import-report/dropdownImportReport/dropdownWaitingDoctor';
import SimpleOrderTable from '../../components/simple-ordered-table/simple-ordered-table';
import ModalDoctorsWhoAreWating from './import-report/modalDoctosWhoAreWaiting/modalDoctorsWhoAreWating';
import TableCollapisble, { ColumnSort } from './import-report/tableCollapsible/tableCollapsible';
import AutocompleteCodeSearch from './import-report/autocompleteCodeSearch/autocompleteCodeSearch';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    paper: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        padding: theme.spacing(3),
        marginLeft: '-15px'
    },
    paperLeft: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        padding: theme.spacing(3)
    }
}));

enum ModalType {
    REMOVE_DOCTOR_CLOSED,
    REMOVE_DOCTOR_CLOSED_POPOVER,
    ALERT_SAVE
}

const ReportImport = () => {
    const userLogged: User | null = AuthUtils.getLoggedUser();
    const [isClosingOfficerUser, setIsClosingOfficerUser] = useState(false);
    const history = useHistory();
    const { t } = useTranslation();
    const classes = useStyles();
    const [showNotifications, setShowNotifications] = useState(false);
    const [sort, setSort] = useState<string>("isDoctorWaiting,asc&sort=doctorName,asc");
    const [pageable, setPageable] = useState<Pageable>({
        size: 10,
        page: 0,
        totalPages: 0
    });
    const [pageableDoctorsWhoAreWaiting, setPageableDoctorsWhoAreWaiting] = useState<Pageable>({
        size: 10,
        page: 0,
        totalPages: 0
    });
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalPagesDoctorsWhoAreWaiting, setTotalPagesDoctorsWhoAreWaiting] = useState<number>(0);

    const [searchField, setSearchField] = useState<string>('');
    const [dataSearchImportations, setDataSearchImportations] = useState<DataSearchImportationType | null>(null);
    const [isShowImportDetails, setIsShowImportDetails] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [isShowDoctorsWhoAreWaintingModal, setIsShowDoctorsWhoAreWaintingModal] = useState(false);
    const [isShowDoctorsWhoAreWaintingPopover, setIsShowDoctorsWhoAreWaintingPopover] = useState(false);
    const [isShowAlertSavePopover, setIsShowAlertSavePopover] = useState(false);

    const [contracts, setContracts] = useState<Contract[]>([]);
    const [doctorsWhoAreWating, setDoctorsWhoAreWating] = useState<ImportationType | null>(null);
    const [doctorWaiting, setDoctorWaiting] = useState<Importation | null>(null);
    const [listImportation, setListImportation] = useState<ImportationType | null>(null);
    const [importationItems, setImportationItems] = useState<Importation[]>([]);

    useEffect(() => {
        getContracts();
    }, []);

    useEffect(() => {
        updateContractDueDate();
    }, [dataSearchImportations?.dueDate]);

    useEffect(() => {
        if (dataSearchImportations?.contractId != null && dataSearchImportations?.timeCourse != null) {
            setIsLoading(true);
            getImportations();
        }
    }, [dataSearchImportations]);

    useEffect(() => {
        getImportations();
    }, [searchField, pageable, sort]);

    useEffect(() => {
        getDoctorsWhoAreWaiting();
    }, [pageableDoctorsWhoAreWaiting]);

    const getContracts = async () => {
        await ImportationService.getContracts().then(result => setContracts(result.content));
    };

    const getImportations = async () => {
        const date = DateUtils.getMonthAndYear(dataSearchImportations?.timeCourse);
        
        const predicate = {
            search: searchField,
            sort
        };

        if (dataSearchImportations?.contractId != null && date !== "") {
            await ImportationService.saerchImportations(pageable, predicate, dataSearchImportations.contractId, date).then(
                result => {
                    if (result.status === 200) {
                        setIsLoading(false);
                        setListImportation(result.data);
                        setDoctorsWhoAreWating(result.data);
                        setTotalPages(result.data.importations.totalPages);
                    }
                }
            );

            if (listImportation?.contract?.closingOfficerUser?.id === userLogged.id) {
                setIsClosingOfficerUser(true);
            }
        }
    };

    const getDoctorsWhoAreWaiting = async () => {
        const date = DateUtils.getMonthAndYear(dataSearchImportations?.timeCourse);
        
        const predicate = {
            search: "",
            sort: "doctorName,desc"
        };

        if (dataSearchImportations?.contractId != null && date !== "") {
            await ImportationService.saerchImportations(pageableDoctorsWhoAreWaiting, predicate, dataSearchImportations.contractId, date).then(
                result => {
                    if (result.status === 200) {
                        setDoctorsWhoAreWating(result.data);
                        setTotalPagesDoctorsWhoAreWaiting(result.data.importations.totalPages);
                    }
                }
            );
        }
    };

    const putOrRemoveDoctorWaiting = async ({ importationKey }: Importation ) => {
        if (importationKey != null) {
            await ImportationService.updateDoctorClosed({ importationKey });
            handleCloseRemovePopover();
            getImportations();
        }
    };

    const updateContractDueDate = async () => {
        if (listImportation?.contract?.id != null && dataSearchImportations?.dueDate !== "") {
            const timeCourse = DateUtils.getMonthAndYear(dataSearchImportations?.dueDate);
            const dueDate = DateUtils.getOnlyDate(dataSearchImportations?.dueDate);
            
            await ImportationService.updateDueDateImportation({
                contractId: listImportation.contract.id,
                timeCourse,
                dueDate
            });
        }
    };

    const updateImportations = () => {
        if (importationItems.length !== 0) {
            importationItems.map(async item => {
                item.otherDiscounts = removeCurrencyMask(maskAmount(item.otherDiscounts));
                item.membershipFee = removeCurrencyMask(maskAmount(item.membershipFee));
                item.prolaboreGrossValue = removeCurrencyMask(maskAmount(item.prolaboreGrossValue));
                item.prolaboreDiscount = removeCurrencyMask(maskAmount(item.prolaboreDiscount));

                await ImportationService.updateImportation({
                   otherDiscounts: item.otherDiscounts,
                   membershipFee: item.membershipFee,
                   prolaboreGrossValue: item.prolaboreGrossValue,
                   prolaboreDiscount: item.prolaboreDiscount,
                   observation: item.observation,
                   importationKey: item.importationKey
                });
            });
        }
    };

    const updatePage = (page: number) => {
        setPageable({ page, size: 10 });
    };

    const updatePageDoctorsWhoAreClosed = (page: number) => {
        setPageableDoctorsWhoAreWaiting({ page, size: 10 });
    };

    const onSort = (sorted: string) => {
        setSort(sorted);
    };

    const handleOpenModal = (type: ModalType) => {
        setIsShowAlertSavePopover(false);
        setIsShowDoctorsWhoAreWaintingPopover(false);

        switch (type) {
            case ModalType.REMOVE_DOCTOR_CLOSED:
                setIsShowDoctorsWhoAreWaintingModal(true);
                break;

            case ModalType.ALERT_SAVE:
                setIsShowAlertSavePopover(true);
                break;

            case ModalType.REMOVE_DOCTOR_CLOSED_POPOVER:
                setIsShowDoctorsWhoAreWaintingPopover(true);
        }
    };

    const handleClose = () => {
        setIsShowDoctorsWhoAreWaintingModal(false);
        setIsShowAlertSavePopover(false);
        setIsShowDoctorsWhoAreWaintingPopover(false);
        setDoctorWaiting(null);
    };

    const handleCloseRemovePopover = () => {
        setIsShowDoctorsWhoAreWaintingPopover(false);
    };

    const renderRemoveClosedDoctorsInputs = () => {
        return (
            <div style={{ overflow: 'auto', maxHeight: '217px' }}>
                <SimpleOrderTable
                    rows={rows}
                    page={pageableDoctorsWhoAreWaiting}
                    totalPages={totalPagesDoctorsWhoAreWaiting}
                    onChangePage={updatePageDoctorsWhoAreClosed}
                    columnNameKeys={[
                        { name: t('report.admin.table.crmNumber'), sortDisabled: true },
                        { name: t('report.admin.table.nameDoctor'), sortDisabled: true },
                        { name: t('report.admin.table.onCallDateMonth'), sortDisabled: true },
                        { name: '', sortDisabled: true }
                    ]}
                />
            </div>
        );
    };

    const handleTransformToTableContent = (content: Importation[] | null | undefined): (string | JSX.Element)[][] => {
        if (content == null || undefined || content.length === 0) {
            return [];
        }
        
        return content.map((item, index) => {
            if (item?.isDoctorWaiting) {
                return [
                    item.importationKey?.doctor?.crmNumber ?? "",
                    item.doctorName ?? "",
                    item.importationKey?.timeCourse ?? "",
                    <div
                        key={`checkbox-pro-labor-${index}`}
                        onClick={({ currentTarget }) => {
                            setAnchorEl(currentTarget);
                            handleOpenModal(ModalType.REMOVE_DOCTOR_CLOSED_POPOVER);
                            setDoctorWaiting(item);
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        <img src={EyeOffImg} />
                    </div>
                ];
            }

            return [];
        });
    };

    const rows = handleTransformToTableContent(doctorsWhoAreWating?.importations?.content);

    const tableCollapisibleHeader: ColumnSort[] = [
        { name: <EyeOnGreenImg />, sortDisabled: true },
        { name: t('report.import.table.proLabore'), sortDisabled: true },
        { name: t('report.import.table.code'), sortCode: 'payingCompanyCode' },
        { name: t('report.import.table.payingCompany'), sortCode: 'nameCompanyCode' },
        { name: t('report.import.table.cnpj'), sortCode: 'cpfCnpj' },
        { name: t('report.import.table.provider'), sortCode: 'doctorName' },
        { name: t('report.import.table.payment'), sortCode: 'typePayment' },
        { name: t('report.import.table.grossValue'), sortCode: 'grossValue' },
        { name: t('report.import.table.discounts'), sortCode: 'otherDiscounts' },
        { name: t('report.import.table.partner'), sortCode: 'membershipFee' },
        { name: t('report.import.table.anticipatedValue'), sortDisabled: true },
        { name: t('report.import.table.netValue'), sortDisabled: true },
        { name: t('report.import.table.company'), sortCode: 'companyReceiver' },
        { name: t('report.import.table.note'), sortCode: 'observation' },
        { sortDisabled: true }
    ];

    return (
        <React.Fragment>
            <div className="report__container--header">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                        className="back-button"
                        onClick={({ currentTarget }) => {
                            if (importationItems.length === 0) {
                                history.push('/admin/indicadores');
                            }

                            setAnchorEl(currentTarget);
                            handleOpenModal(ModalType.ALERT_SAVE);
                        }}
                    >
                        <div className="arrow-white" />
                    </div>
                    <div className="contract-detail__container--header-title">{t('report.import.title')}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img className="download-img" src={DownloadImg} alt="download" />
                    <img className="notification-img" src={NotificationImg} onClick={() => setShowNotifications(!showNotifications)} alt="notification" />
                </div>
            </div>
            {showNotifications && <NotificationModal />}
            <div className="import-report__container">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="import-report__container--field">
                        <div className="import-report__container--field-title">{t('report.import.code')}</div>
                        <div style={{ width: "130px", height: "32px" }}>
                            <AutocompleteCodeSearch
                                onChange={(event, code) => {
                                    setDataSearchImportations({ ...dataSearchImportations, contractId: Number(code?.id) });
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ marginRight: '22px' }} className="import-report__container--field">
                        <div className="import-report__container--field-title">{t('report.import.reference')}</div>
                        <div style={{ width: '144px' }}>
                            <CustomDateField
                                className="data-field"
                                disableErrorAndValidStyle
                                disableToolbar={true}
                                onChange={date => {
                                    setDataSearchImportations({ ...dataSearchImportations, timeCourse: date?.format() });
                                }}
                                value={dataSearchImportations?.timeCourse}
                                format="MM/YYYY"
                                views={['year', 'month']}
                            />
                        </div>
                    </div>
                    <div className="import-report__container--field">
                        <div className="import-report__container--field-title">{t('report.import.date')}</div>
                        <div style={{ width: '144px' }}>
                            <CustomDateField
                                className="data-field"
                                disableErrorAndValidStyle
                                disableToolbar={true}
                                onChange={date => {
                                    if (listImportation?.contract != null && dataSearchImportations?.timeCourse != null) {
                                        setDataSearchImportations({...dataSearchImportations, dueDate: date!.format() });
                                    }
                                }}
                                value={dataSearchImportations?.dueDate ?? ""}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ padding: '0' }} className="report__container--buttons">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {dataSearchImportations?.contractId != null && dataSearchImportations?.timeCourse != null &&
                            <IconButton
                                color="gray"
                                fontSize="14px"
                                isAlignCenter
                                width={'174px'}
                                height={'40px'}
                                filled
                                clickButton={() => handleOpenModal(ModalType.REMOVE_DOCTOR_CLOSED)}
                            >
                                <img style={{ marginRight: '4px' }} src={DoctorImg} />
                                {t('report.import.button')}
                            </IconButton>
                        }
                        <div style={{ marginLeft: '8px', marginRight: '8px' }}>
                            <IconButton
                                color="gray"
                                fontSize="14px"
                                isAlignCenter
                                width={"195px"}
                                height={"40px"}
                                filled
                                clickButton={() => {
                                    if(dataSearchImportations?.contractId != null && dataSearchImportations.timeCourse != null)
                                    history.push(
                                        `/admin/anticipation-values/${dataSearchImportations.contractId}/${DateUtils.getOnlyDate(dataSearchImportations.timeCourse)}/${isClosingOfficerUser}`
                                    );
                                }}
                            >
                                <img style={{ marginRight: '4px' }} src={CifraImg} />
                                {t('report.import.buttonSecond')}
                            </IconButton>
                        </div>
                        {isClosingOfficerUser && 
                            <IconButton 
                                color="green"
                                fontSize="14px"
                                isAlignCenter
                                width={"158px"}
                                height={"40px"} 
                                filled 
                                clickButton={async () => { await ImportationService.updateGenerate()}}
                            >
                                {t('report.import.buttonThird')}
                            </IconButton>
                        }
                    </div>
                </div>
            </div>

            <>
                <div className="import-report__collapse-fields">
                    <Row style={{ width: "100%" }}>
                        <Col md="8">
                            <div className="import-report__collapse-fields-title">
                                <div>{listImportation?.contract?.contractingParty?.name ?? ""}</div>
                                {listImportation?.contract != null && <img src={DropImg} className={`${!isShowImportDetails ? "icon-rotate" : ""}`} onClick={() => setIsShowImportDetails(!isShowImportDetails)} />}
                            </div>
                            {isShowImportDetails && listImportation?.contract != null && (
                                <div>
                                    <div className="import-report__collapse-fields-text">
                                        <div className="text-field--flex">
                                            <div className="text-field--title">{t('report.import.textField.responsible')}</div>
                                            <div className="text-field--answer">{listImportation.contract.closingOfficerUser?.name ?? ""}</div>
                                        </div>
                                        <div className="text-field--flex">
                                            <div className="text-field--title">{t('report.import.textField.company')}</div>
                                            <div className="text-field--answer">{listImportation?.contract?.contractingParty?.name ?? ""}</div>
                                        </div>
                                        <div className="text-field--flex">
                                            <div className="text-field--title">{t('report.import.textField.reference')}</div>
                                            <div className="text-field--answer">{DateUtils.getMonthAndYear(dataSearchImportations?.timeCourse)}</div>
                                        </div>
                                        <div className="text-field--flex">
                                            <div className="text-field--title">{t('report.import.textField.code')}</div>
                                            <div className="text-field--answer">{listImportation?.contract?.sankhyaCode ?? ""}</div>
                                        </div>
                                    </div>
                                    <div className="import-report__collapse-fields-text">
                                        <div className="text-field--flex">
                                            <div className="text-field--title">{t('report.import.textField.contract')}</div>
                                            <div className="text-field--answer">{DateUtils.getMonthAndYear(listImportation?.contract?.contractEndTerm)}</div>
                                        </div>
                                        <div className="text-field--flex">
                                            <div className="text-field--title">{t('report.import.textField.results')}</div>
                                            <div className="text-field--answer">{listImportation?.contract?.resultsCenter ?? ""}</div>
                                        </div>
                                        <div className="text-field--flex">
                                            <div className="text-field--title">{t('report.import.textField.document')}</div>
                                            <div className="text-field--answer">{listImportation?.contract?.contractNumber ?? ""}</div>
                                        </div>
                                        <div className="text-field--flex">
                                            <div className="text-field--title">{t('report.import.textField.dueDate')}</div>
                                            <div className="text-field--answer">{DateUtils.formatDatePtBr(listImportation?.contract?.endDate)}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Col>
                        <Col style={{ display: 'flex', paddingRight: '0' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-end', marginLeft: 'auto' }}>
                                <SearchTextField
                                    onChange={setSearchField}
                                    id={'search-field'}
                                    placeholder="Buscar por"
                                    value={searchField}
                                    style={{ marginRight: '10px' }}
                                />

                                {isClosingOfficerUser && 
                                    <IconButton
                                        color="green"
                                        fontSize="14px"
                                        isAlignCenter
                                        width={'165px'}
                                        height={'34px'}
                                        filled
                                        clickButton={() => updateImportations()}
                                    >
                                        {t('global.button.save')}
                                    </IconButton>
                                }
                            </div>
                        </Col>
                    </Row>
                </div>

                <div className="padding-page">
                    {dataSearchImportations?.contractId != null && dataSearchImportations?.timeCourse != null && (
                        <TableCollapisble
                            page={pageable}
                            columnNameKeys={tableCollapisibleHeader}
                            onChangePage={updatePage}
                            rows={listImportation?.importations?.content}
                            onSort={sortCode => onSort(sortCode)}
                            onUpdateImportation={list => setImportationItems(list)}
                            isLoading={isLoading}
                            totalPages={totalPages}
                            updateImportations={() => updateImportations()}
                            putOrRemoveDoctorWaiting={(importationKey) => putOrRemoveDoctorWaiting(importationKey)}
                        />
                    )}
                </div>
            </>

            <Popover
                open={isShowAlertSavePopover}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left'
                }}
                classes={{
                    paper: classes.paper
                }}
            >
                <DropdownWaitingDoctor
                    onClickFirstButton={() => {
                        handleClose();
                        history.push('/admin/indicadores');
                    }}
                    onClickSecondButton={() => {
                        updateImportations();
                    }}
                    title={t('report.import.dropdown.titleTree')}
                    disableArrow={true}
                />
            </Popover>
            <ModalDoctorsWhoAreWating
                onClose={handleClose}
                showModal={isShowDoctorsWhoAreWaintingModal}
                className="report__modal-second"
                modalTitle={t('report.import.modal.titleSecond')}
                toggleModal={handleClose}
                centralized
                inputs={renderRemoveClosedDoctorsInputs()}
            />
            <Popover
                open={isShowDoctorsWhoAreWaintingPopover}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left'
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'right'
                }}
                classes={{
                    paper: classes.paperLeft
                }}
            >
                <DropdownWaitingDoctor
                    onClickFirstButton={() => {
                        setDoctorWaiting(null);
                        handleCloseRemovePopover();
                    }}
                    onClickSecondButton={() => {
                        putOrRemoveDoctorWaiting({ importationKey: doctorWaiting?.importationKey });
                    }}
                    title={t('report.import.dropdown.titleSecond')}
                    arrowRight={true}
                />
            </Popover>
            <Footer />
        </React.Fragment>
    );
};

export default ReportImport;
