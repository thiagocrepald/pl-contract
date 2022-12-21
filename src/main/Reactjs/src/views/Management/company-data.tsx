import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import BasicModal from '../../components/BasicModal/basic-modal';
import CustomTextField from '../../components/custom-text-field/custom-text-field';
import IconButton from '../../components/icon-button/icon-button';
import MenuPage from '../../components/menu-page/menu-page';
import SearchTextField from '../../components/search-text-field/search-text-field';
import SimpleOrderTable, { ColumnSort } from '../../components/simple-ordered-table/simple-ordered-table';
import NotificationModal from '../../components/notification-modal/notification-modal';
import { Company } from '../../model/company';
import { Tab } from '../../model/enums/tabs';
import { Pageable } from '../../model/pageable';
import { defaultValue, ErrorAndMessage } from '../../model/validation';
import CompanyService from '../../services/company-service';
import './management.scss';

const CompanyData = () => {
    const [t] = useTranslation();
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [activeTab, setActiveTab] = useState(Tab.COMPANYDATA);
    const [companyList, setCompanyList] = useState<Company[]>([]);
    const [modalItem, setModalItem] = useState<Company | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [filter, setFilter] = useState<any>({});
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [searchField, setSearchField] = useState<string>('');
    const [sort, setSort] = useState<string>('status,asc');
    const [pageable, setPageable] = useState<Pageable>({ size: 10, page: 0, totalPages: 0 });

    const [showDotsModal, setShowDotsModal] = useState<boolean>(false);
    const [showCreateCompanyModal, setShowCreateCompanyModal] = useState<boolean>(false);
    const [showEditCompanyModal, setShowEditCompanyModal] = useState<boolean>(false);
    const [showNotifications, setShowNotifications] = useState<boolean>(false);


    const [companyNameError, setCompanyNameError] = useState<ErrorAndMessage>(defaultValue);
    const [companyError, setCompanyError] = useState<ErrorAndMessage>(defaultValue);
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
        getCompanies();
    }, [pageable, searchField, filter, sort]);

    const getCompanies = () => {
        const predicate = {
            search: searchField,
            sort: sort
        };

        CompanyService.getAllCompanies(pageable, predicate).then((result) => {
            setCompanyList(result.content);
            setTotalPages(result.totalPages);
        });
    };

    enum FieldType {
        COMPANY_NAME,
        COMPANY,
        CODE
    }

    const validateField = (field: FieldType) => {
        switch (field) {
            case FieldType.COMPANY_NAME:
                if (modalItem?.companyName != null && modalItem.companyName?.length > 0) {
                    setCompanyNameError(defaultValue);
                    return {};
                }
                setCompanyNameError(errorMessage);
                break;
            case FieldType.COMPANY:
                if (modalItem?.company != null && modalItem?.company?.length > 0) {
                    setCompanyError(defaultValue);
                    return {};
                }
                setCompanyError(errorMessage);
                break;
            case FieldType.CODE:
                if (modalItem?.code != null && modalItem?.code?.toString().length > 0) {
                    setCodeError(defaultValue);
                    return {};
                }
                setCodeError(errorMessage);
                break;
        }
    };

    enum ModalType {
        DOTS,
        CREATE_COMPANY,
        EDIT_COMPANY
    }

    const handleOpenModal = (type: ModalType) => {
        setShowDotsModal(false);
        setShowCreateCompanyModal(false);
        setShowEditCompanyModal(false);

        switch (type) {
            case ModalType.DOTS:
                setShowDotsModal(true);
                break;
            case ModalType.CREATE_COMPANY:
                setShowCreateCompanyModal(true);
                break;
            case ModalType.EDIT_COMPANY:
                setShowEditCompanyModal(true);
                break;
        }
    };

    const onEditCompany = async () => {
        validateField(FieldType.COMPANY_NAME);
        validateField(FieldType.COMPANY);
        validateField(FieldType.CODE);

        if (modalItem?.companyName && modalItem?.company && modalItem?.code) {
            modalItem.code = parseInt(modalItem?.code?.toString());
            await CompanyService.updateCompany(modalItem);
            getCompanies();
            handleClose();
        }
    };

    const onCreateCompany = async (item: Company | null) => {
        validateField(FieldType.COMPANY_NAME);
        validateField(FieldType.COMPANY);
        validateField(FieldType.CODE);

        if (item?.companyName && item?.company && item?.code) {
            item.code = parseInt(item?.code?.toString());
            await CompanyService.createCompany(item);
            getCompanies();
            handleClose();
        }
    };

    const handleClose = () => {
        setShowEditCompanyModal(false);
        setShowCreateCompanyModal(false);
        setModalItem(null);
        setCompanyNameError(defaultValue);
        setCompanyError(defaultValue);
        setCodeError(defaultValue);
    };

    // const handleClick = (event) => {
    //   setAnchorEl(event.currentTarget);
    // };

    // const onChange = () => {
    //   return "";
    // };

    const onActivateCompany = async () => {
        let company = modalItem?.id!;

        await CompanyService.activateCompany(company);
        getCompanies();
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
    ];

    const tableHeaders: ColumnSort[] = [
        { name: t('management.tableHeaders.code'), sortCode: 'code' },
        { name: t('management.tableHeaders.company'), sortCode: 'company' },
        { name: t('management.tableHeaders.companyName'), sortCode: 'companyName' },
        { name: t('management.tableHeaders.status'), sortCode: 'status' },
        { sortDisabled: true }
    ];

    const handleTransformToTableContent = (content?: Company[]): (string | number | JSX.Element)[][] => {
        if (content == null || content.length === 0) return [];

        return content.map((item, index) => [
            item.code ?? '',
            item.company?.toUpperCase() ?? '',
            item.companyName?.toUpperCase() ?? '',
            item.status ? item.status === 'ACTIVE' ? <div className='active-tag'>{t('management.status.active')}</div> : <div className='inactive-tag'>{t('management.status.inactive')}</div> : '',
            <div key={index}>
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

    const tableContent = handleTransformToTableContent(companyList);

    const renderCreateCompanyInputs = () => {
        return (
            <div className='modal-body__fields'>
                <CustomTextField
                    id='field1'
                    placeholder={t('management.textField.companyName')}
                    value={modalItem?.companyName}
                    onChange={(text) => setModalItem({ ...modalItem, companyName: text })}
                    error={companyNameError?.value}
                    errorText={companyNameError?.message}
                    onBlur={() => validateField(FieldType.COMPANY_NAME)}
                />
                <div className='modal-body__fields--small'>
                    <CustomTextField
                        id='field2'
                        placeholder={t('management.textField.company')}
                        style={{ marginRight: '24px ' }}
                        value={modalItem?.company}
                        onChange={(text) => setModalItem({ ...modalItem, company: text })}
                        error={companyError?.value}
                        errorText={companyError?.message}
                        onBlur={() => validateField(FieldType.COMPANY)}
                    />
                    <CustomTextField
                        id='field3'
                        placeholder={t('management.textField.code')}
                        value={modalItem?.code?.toString()}
                        onChange={(text) => setModalItem({ ...modalItem, code: text })}
                        error={codeError?.value}
                        errorText={codeError?.message}
                        isOnlyNumbers={true}
                        onBlur={() => validateField(FieldType.CODE)}
                    />
                </div>
            </div>
        );
    };

    const renderUpdateCompanyInputs = () => {
        return (
            <div className='modal-body__fields'>
                <CustomTextField
                    id='field1'
                    placeholder={t('management.textField.companyName')}
                    value={modalItem?.companyName}
                    onChange={(text) => setModalItem({ ...modalItem, companyName: text })}
                    error={companyNameError?.value}
                    errorText={companyNameError?.message}
                    onBlur={() => validateField(FieldType.COMPANY_NAME)}
                />
                <div className='modal-body__fields--small'>
                    <CustomTextField
                        id='field3'
                        placeholder={t('management.textField.company')}
                        style={{ marginRight: '24px ' }}
                        value={modalItem?.company}
                        onChange={(text) => setModalItem({ ...modalItem, company: text })}
                        error={companyError?.value}
                        errorText={companyError?.message}
                        onBlur={() => validateField(FieldType.COMPANY)}
                    />
                    <CustomTextField
                        id='field4'
                        placeholder={t('management.textField.code')}
                        value={modalItem?.code?.toString()}
                        onChange={(text) => setModalItem({ ...modalItem, code: text })}
                        error={codeError?.value}
                        errorText={codeError?.message}
                        isOnlyNumbers={true}
                        onBlur={() => validateField(FieldType.CODE)}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className='management__container'>
            <div className='management__container--header'>
                <span>{t('management.title.management')}</span>
                <div className='notification-img' onClick={() => setShowNotifications(!showNotifications)}/>
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
                        <IconButton color='green' isAlignCenter width={'170px'} height={'40px'} filled clickButton={() => handleOpenModal(ModalType.CREATE_COMPANY)}>
                            <div className='icon-plus'/>
                            {t('management.buttons.companyData')}
                        </IconButton>
                    </div>
                </div>
            </div>
            <div style={{ padding: '0 26px' }}>
                {activeTab === Tab.PAYMENTS && history.replace('/admin/management/payments')}
                {activeTab === Tab.LINKS && history.replace('/admin/management/links')}
            </div>
            <div className='padding-page'>
                <SimpleOrderTable rows={tableContent} page={pageable} totalPages={totalPages} columnNameKeys={tableHeaders} onChangePage={updatePage} onSort={(sortCode) => onSort(sortCode)} />
                <Menu className='tooltip-style' anchorEl={anchorEl} keepMounted open={showDotsModal} onClose={() => setShowDotsModal(false)}>
                    <MenuItem onClick={() => handleOpenModal(ModalType.EDIT_COMPANY)}>{t('management.buttons.edit')}</MenuItem>
                    <MenuItem onClick={onActivateCompany}>{t(`management.buttons.${modalItem?.status === 'ACTIVE' ? 'deactivate' : 'activate'}`)}</MenuItem>
                </Menu>
                <BasicModal
                    onClose={handleClose}
                    showModal={showEditCompanyModal}
                    modalTitle={t('management.title.modal.companyData')}
                    toggleModal={handleClose}
                    hasTwoButtons
                    primaryButtonTitle={t('management.buttons.save')}
                    secondaryButtonTitle={t('management.buttons.goBack')}
                    primaryButtonAction={() => onEditCompany()}
                    secondaryButtonAction={handleClose}
                    centralized
                    inputs={renderUpdateCompanyInputs()}
                />
                <BasicModal
                    onClose={handleClose}
                    showModal={showCreateCompanyModal}
                    modalTitle={t('management.buttons.companyData')}
                    toggleModal={handleClose}
                    hasTwoButtons
                    primaryButtonTitle={t('management.buttons.save')}
                    secondaryButtonTitle={t('management.buttons.goBack')}
                    primaryButtonAction={() => onCreateCompany(modalItem)}
                    secondaryButtonAction={handleClose}
                    centralized
                    inputs={renderCreateCompanyInputs()}
                />
            </div>
        </div>
    );
};

export default CompanyData;
