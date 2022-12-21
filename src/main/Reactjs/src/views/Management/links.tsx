import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SimpleOrderTable, { ColumnSort } from '../../components/simple-ordered-table/simple-ordered-table';
import { FormControl, FormHelperText, InputLabel, makeStyles, Menu, Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import BasicModal from '../../components/BasicModal/basic-modal';
import { Tab } from '../../model/enums/tabs';
import CustomTextField from '../../components/custom-text-field/custom-text-field';
import MenuPage from '../../components/menu-page/menu-page';
import SearchTextField from '../../components/search-text-field/search-text-field';
import IconButton from '../../components/icon-button/icon-button';
import NotificationModal from '../../components/notification-modal/notification-modal';
import { Payment } from '../../model/payment';
import { Pageable } from '../../model/pageable';
import { ICreateLink, ILink } from '../../model/link';
import PaymentService from '../../services/payment-service';
import LinkService from '../../services/link.service';
import './management.scss';
import { defaultValue, ErrorAndMessage } from '../../model/validation';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
        width: 375
    }
}));

const Links = () => {
    const [t] = useTranslation();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [activeTab, setActiveTab] = useState(Tab.LINKS);
    const [linksList, setLinksList] = useState<ILink[]>([]);
    const [paymentList, setPaymentList] = useState<Payment[]>([]);
    const [modalItem, setModalItem] = useState<ILink | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [filter, setFilter] = useState<any>({});
    const [searchField, setSearchField] = useState<string>('');
    const [sort, setSort] = useState('status,asc');
    const [pageable, setPageable] = useState<Pageable>({ size: 10, page: 0, totalPages: 0 });

    const [showDotsModal, setShowDotsModal] = useState<boolean>(false);
    const [showCreateLinkModal, setShowCreateLinkModal] = useState<boolean>(false);
    const [showEditLinkModal, setShowEditLinkModal] = useState<boolean>(false);
    const [showNotifications, setShowNotifications] = useState<boolean>(false);

    const [nameError, setNameError] = useState<ErrorAndMessage>(defaultValue);
    const [paymentTypeError, setPaymentTypeError] = useState<ErrorAndMessage>(defaultValue);

    const history = useHistory();

    const errorMessage: ErrorAndMessage = { message: t('management.fieldError.required'), value: true };

    useLayoutEffect(() => {
        window.document.body.style.background = 'white';
        return () => {
            window.document.body.style.background = '';
        };
    });

    useEffect(() => {
        getLinks();
        getPayments();
    }, [pageable, searchField, filter, sort]);

    const getLinks = () => {
        const predicate = {
            search: searchField,
            sort: sort
        };

        LinkService.getAllLinks(pageable, predicate).then((result) => {
            setLinksList(result.content);
            setTotalPages(result.totalPages);
        });
    };

    const getPayments = () => {
        const predicate = {
            // status: Status.ACTIVE
        };

        PaymentService.getAllPayments(pageable, predicate).then((result) => {
            setPaymentList(result.content);
        });
    };

    enum FieldType {
        NAME,
        PAYMENT_TYPE
    }

    const validateField = (field: FieldType) => {
        switch (field) {
            case FieldType.NAME:
                if (modalItem?.name != null && modalItem?.name?.length > 0) {
                    setNameError(defaultValue);
                    return false;
                }
                setNameError(errorMessage);
                return true;
            case FieldType.PAYMENT_TYPE:
                if (modalItem?.paymentNature != null) {
                    setPaymentTypeError(defaultValue);
                    return false;
                }
                setPaymentTypeError(errorMessage);
                return true;
        }
    };

    enum ModalType {
        DOTS,
        CREATE_LINK,
        EDIT_LINK
    }

    const handleOpenModal = (type: ModalType) => {
        setShowDotsModal(false);
        setShowCreateLinkModal(false);
        setShowEditLinkModal(false);

        switch (type) {
            case ModalType.DOTS:
                setShowDotsModal(true);
                break;
            case ModalType.CREATE_LINK:
                setShowCreateLinkModal(true);
                break;
            case ModalType.EDIT_LINK:
                setShowEditLinkModal(true);
                break;
        }
    };

    const onEditLink = async () => {
        validateField(FieldType.NAME);
        validateField(FieldType.PAYMENT_TYPE);

        if (modalItem?.name && modalItem?.paymentNature) {
            await LinkService.updateLink(modalItem);
            getLinks();
            handleClose();
        }
    };

    const onCreateLink = async (item: ICreateLink | null) => {
        validateField(FieldType.NAME);
        validateField(FieldType.PAYMENT_TYPE);

        if (item?.name && item?.paymentNature && !paymentTypeError?.value) {
            await LinkService.createLink(item);
            getLinks();
            handleClose();
        } else if (!item?.paymentNature) {
            setPaymentTypeError(errorMessage);
        }
    };

    // const handleClick = (event) => {
    //   setAnchorEl(event.currentTarget);
    // };

    const handleClose = () => {
        setShowEditLinkModal(false);
        setShowCreateLinkModal(false);
        setModalItem(null);
        setNameError(defaultValue);
        setPaymentTypeError(defaultValue);
    };

    const onChange = (e) => {
        setModalItem({ ...modalItem, paymentNature: { id: Number(e.target.value) } });

        if (e.target.value === '') {
            setPaymentTypeError(errorMessage);
        } else {
            setPaymentTypeError(defaultValue);
        }
    };

    const onActivateLink = async () => {
        let link = modalItem?.id!;

        await LinkService.activateLink(link);
        getLinks();
        setShowDotsModal(false);
        setAnchorEl(null);
    };

    const updatePage = (page: number) => {
        setPageable({ page: page, size: 10 });
    };

    const onSort = (sort: string) => {
        setSort(sort);
    };

    const tabs = [
        { name: t('management.tabs.companyData'), code: Tab.COMPANYDATA },
        { name: t('management.tabs.payments'), code: Tab.PAYMENTS },
        { name: t('management.tabs.links'), code: Tab.LINKS }
    ];

    const tableHeaders: ColumnSort[] = [
        { name: t('management.tableHeaders.linkName'), sortCode: 'name' },
        { name: t('management.tableHeaders.paymentType'), sortCode: 'paymentNature.paymentType' },
        { name: t('management.tableHeaders.prepaymentType'), sortCode: 'paymentNature.prepaymentType' },
        { name: t('management.tableHeaders.status'), sortCode: 'status' },
        { sortDisabled: true }
    ];

    const handleTransformToTableContent = (content?: ILink[]): (string | JSX.Element)[][] => {
        if (content == null || content.length === 0) return [];

        return content.map((item, index) => [
            item.name ?? '',
            item.paymentNature?.paymentType ?? '',
            item.paymentNature?.prepaymentType ?? '',
            item.status ? item.status === 'ACTIVE' ? <div className='active-tag'>{t('management.status.active')}</div> : <div className='inactive-tag'>{t('management.status.inactive')}</div> : '',
            <div>
                <div
                    className='icon-dots'
                    aria-controls='simple-menu'
                    aria-haspopup='true'
                    onClick={({ currentTarget }) => {
                        setModalItem(item);
                        setAnchorEl(currentTarget);
                        handleOpenModal(ModalType.DOTS);
                    }}
                />
            </div>
        ]);
    };

    const tableContent = handleTransformToTableContent(linksList);

    const renderCreateLinksInputs = () => {
        return (
            <div className='modal-body__fields'>
                <CustomTextField
                    id='field1'
                    placeholder={t('management.textField.linkName')}
                    style={{ width: '290px' }}
                    value={modalItem?.name}
                    onChange={(text) => setModalItem({ ...modalItem, name: text })}
                    error={nameError?.value}
                    errorText={nameError?.message}
                    onBlur={() => validateField(FieldType.NAME)}
                />
                <FormControl variant='filled' className={classes.formControl} style={{ paddingBottom: '15px' }}>
                    {modalItem?.paymentNature == null && <InputLabel htmlFor='filled-age-native-simple'>{t('management.textField.paymentType')}</InputLabel>}
                    <Select native defaultValue={t('management.textField.paymentType')} onChange={(e) => onChange(e)} error={paymentTypeError?.value}>
                        <option aria-label='None' value=''></option>
                        {paymentList?.map(
                            (payment, index) =>
                                payment.status === 'ACTIVE' && (
                                    <option key={index} value={payment?.id}>
                                        {payment.paymentType}
                                    </option>
                                )
                        )}
                    </Select>
                    {paymentTypeError?.value && <FormHelperText style={{ position: 'absolute', top: '50px' }}>{t('management.fieldError.required')}</FormHelperText>}
                </FormControl>
            </div>
        );
    };

    const renderUpdateLinksInputs = () => {
        return (
            <div className='modal-body__fields'>
                <CustomTextField
                    id='field1'
                    placeholder={t('management.textField.linkName')}
                    style={{ width: '290px' }}
                    value={modalItem?.name}
                    onChange={(text) => setModalItem({ ...modalItem, name: text })}
                    error={nameError?.value}
                    errorText={nameError?.message}
                    onBlur={() => validateField(FieldType.NAME)}
                />
                <FormControl variant='filled' className={classes.formControl} style={{ paddingBottom: '15px' }}>
                    <Select native defaultValue={modalItem?.paymentNature?.id} onChange={(e) => setModalItem({ ...modalItem, paymentNature: { id: Number(e.target.value) } })}>
                        {paymentList?.map((payment) => payment.status === 'ACTIVE' && <option value={payment?.id}>{payment.paymentType}</option>)}
                    </Select>
                </FormControl>
            </div>
        );
    };

    return (
        <div className='management__container'>
            <div className='management__container--header'>
                <span>{t('management.title.management')}</span>
                <IconButton clickButton={() => setShowNotifications(!showNotifications)}>
                    <div className='notification-img' />
                </IconButton>
            </div>
            {showNotifications && <NotificationModal/>}
            <div className='management__container--body'>
                <div className='management__container--body-menu'>
                    <MenuPage tabs={tabs} activeTab={activeTab} onChange={(activeTab) => setActiveTab(activeTab)} />
                </div>
                <div className='management__container--body-action'>
                    <div style={{ maxWidth: '222px' }}>
                        <SearchTextField id={'search-field'} style={{ marginRight: '10px' }} placeholder='Buscar por' onChange={setSearchField} value={searchField} />
                    </div>
                    <div style={{ marginLeft: '24px' }}>
                        <IconButton color='green' isAlignCenter width={'170px'} height={'40px'} filled clickButton={() => handleOpenModal(ModalType.CREATE_LINK)}>
                            <div className='icon-plus'></div>
                            {t('management.buttons.links')}
                        </IconButton>
                    </div>
                </div>
            </div>
            <div style={{ padding: '0 26px' }}>
                {activeTab === Tab.COMPANYDATA && history.replace('/admin/management/company-data')}
                {activeTab === Tab.PAYMENTS && history.replace('/admin/management/payments')}
            </div>
            <div className='padding-page'>
                <SimpleOrderTable rows={tableContent} page={pageable} totalPages={totalPages} columnNameKeys={tableHeaders} onChangePage={updatePage} onSort={(sortCode) => onSort(sortCode)} />
                <Menu className='tooltip-style' anchorEl={anchorEl} keepMounted open={showDotsModal} onClose={() => setShowDotsModal(false)}>
                    <MenuItem onClick={() => handleOpenModal(ModalType.EDIT_LINK)}>{t('management.buttons.edit')}</MenuItem>
                    <MenuItem onClick={onActivateLink}>{t(`management.buttons.${modalItem?.status === 'ACTIVE' ? 'deactivate' : 'activate'}`)}</MenuItem>
                </Menu>
                <BasicModal
                    onClose={handleClose}
                    showModal={showEditLinkModal}
                    modalTitle={t('management.title.modal.links')}
                    toggleModal={handleClose}
                    hasTwoButtons
                    primaryButtonTitle={t('management.buttons.save')}
                    secondaryButtonTitle={t('management.buttons.goBack')}
                    primaryButtonAction={() => onEditLink()}
                    secondaryButtonAction={handleClose}
                    centralized
                    inputs={renderUpdateLinksInputs()}
                />
                <BasicModal
                    onClose={handleClose}
                    showModal={showCreateLinkModal}
                    modalTitle={t('management.buttons.links')}
                    toggleModal={handleClose}
                    hasTwoButtons
                    primaryButtonTitle={t('management.buttons.save')}
                    secondaryButtonTitle={t('management.buttons.goBack')}
                    primaryButtonAction={() => onCreateLink(modalItem)}
                    secondaryButtonAction={handleClose}
                    centralized
                    inputs={renderCreateLinksInputs()}
                />
            </div>
        </div>
    );
};

export default Links;
