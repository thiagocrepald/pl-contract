import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import BasicModal from '../../components/BasicModal/basic-modal';
import CustomTextField from '../../components/custom-text-field/custom-text-field';
import MenuPage from '../../components/menu-page/menu-page';
import SearchTextField from '../../components/search-text-field/search-text-field';
import SimpleOrderedTable, { ColumnSort } from '../../components/simple-ordered-table/simple-ordered-table';
import { Tab } from '../../model/enums/tabs';
import { Result } from '../../model/result';

const Results = () => {
    const [t] = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeTab, setActiveTab] = useState(Tab.RESULTS);
    const [resultsList, setResultsList] = useState<Result[]>([]);
    const [modalItem, setModalItem] = useState<Result | null>(null);

    /* eslint-disable  @typescript-eslint/no-unused-vars */
    const [_newResult, setNewResult] = useState<Result>({});
    /* eslint-enable  @typescript-eslint/no-unused-vars */

    const history = useHistory();

    useLayoutEffect(() => {
        window.document.body.style.background = 'white';
        return () => {
            window.document.body.style.background = '';
        };
    });

    useEffect(() => {
        setResultsList([
            {
                sankhyaCode: '102365',
                acronym: 'AAB',
                description: 'AAB - ARAUCARIA - UPA',
                contract: '201',
                year: '2018',
                company: 'ABRADES',
                active: true
            },
            {
                sankhyaCode: '102365',
                acronym: 'AAB',
                description: 'AAB - ARAUCARIA - UPA',
                contract: '201',
                year: '2018',
                company: 'ABRADES',
                active: false
            }
        ]);
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onEditResult = (item: Result) => {
        setModalItem(item);
        setAnchorEl(null);
    };

    const onChange = () => {
        return '';
    };

    const tabs = [
        { name: t('management.tabs.companyData'), code: Tab.COMPANYDATA },
        { name: t('management.tabs.payments'), code: Tab.PAYMENTS },
        { name: t('management.tabs.links'), code: Tab.LINKS },
        { name: t('management.tabs.results'), code: Tab.RESULTS }
    ];

    const tableHeaders: ColumnSort[] = [
        { name: t('management.tableHeaders.sankhyaCode'), sortCode: 'sankhyaCode' },
        { name: t('management.tableHeaders.acronym'), sortCode: 'acronym' },
        { name: t('management.tableHeaders.description'), sortCode: 'description' },
        { name: t('management.tableHeaders.contract'), sortCode: 'contract' },
        { name: t('management.tableHeaders.year'), sortCode: 'year' },
        { name: t('management.tableHeaders.company'), sortCode: 'company' },
        { name: t('management.tableHeaders.status'), sortCode: 'status' },
        { sortDisabled: true }
    ];

    const handleTransformToTableContent = (content?: Result[]): (string | JSX.Element)[][] => {
        if (content == null || content.length === 0) return [];

        return content.map((item, index) => [
            item.sankhyaCode ?? '',
            item.acronym ?? '',
            item.description ?? '',
            item.contract ?? '',
            item.year ?? '',
            item.company ?? '',
            item.active ? <div className='active-tag'>{t('management.status.active')}</div> : <div className='inactive-tag'>{t('management.status.inactive')}</div>,
            <div>
                <div className='icon-dots' aria-controls='simple-menu' aria-haspopup='true' onClick={handleClick} />
                <Menu className='tooltip-style' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem onClick={() => onEditResult(item)}>{t('management.buttons.edit')}</MenuItem>
                    <MenuItem onClick={handleClose}>{t('management.buttons.activate')}</MenuItem>
                </Menu>
            </div>
        ]);
    };

    const renderUpdateResultsInputs = () => {
        return (
            <div>
                <CustomTextField id='company' style={{ marginBottom: '20px' }} value={modalItem?.company} onChange={(text) => setNewResult({ ...modalItem, company: text })} />
                <div style={{ display: 'flex' }}>
                    <CustomTextField id='sankhyaCode' style={{ marginRight: '24px ' }} value={modalItem?.sankhyaCode} onChange={(text) => setNewResult({ ...modalItem, sankhyaCode: text })} />
                    <CustomTextField id='acronym' value={modalItem?.acronym} onChange={(text) => setNewResult({ ...modalItem, acronym: text })} />
                </div>
            </div>
        );
    };

    const tableContent = handleTransformToTableContent(resultsList);

    return (
        <div className='management__container'>
            <div className='management__container--header'>
                <span>{t('management.title.management')}</span>
                <div className='notification-img' />
            </div>
            <div className='management__container--body'>
                <div className='management__container--body-menu'>
                    <MenuPage tabs={tabs} activeTab={activeTab} onChange={(activeTab) => setActiveTab(activeTab)} />
                </div>
                <div className='management__container--body-action'>
                    <div style={{ maxWidth: '222px' }}>
                        <SearchTextField id={'search-field'} style={{ marginRight: '10px' }} placeholder='Buscar por' onChange={onChange} />
                    </div>
                </div>
            </div>
            <div style={{ padding: '0 26px' }}>
                {/* <div style={{ border: '1px solid red', overflow: 'hidden', borderRadius: 50 }}> */}
                {activeTab === Tab.COMPANYDATA && history.replace('/admin/management/company-data')}
                {activeTab === Tab.PAYMENTS && history.replace('/admin/management/payments')}
                {activeTab === Tab.LINKS && history.replace('/admin/management/links')}
            </div>
            <div className='padding-page'>
                <SimpleOrderedTable
                    rows={tableContent}
                    page={{}}
                    columnNameKeys={tableHeaders}
                    onChangePage={() => {}}
                    // onSort={(code: string) => this.handleSort(code)}
                    onSort={() => {}}
                />
                <BasicModal
                    showModal={modalItem != null}
                    modalTitle={t('management.title.modal.results')}
                    toggleModal={() => {}}
                    hasTwoButtons
                    primaryButtonTitle={t('management.buttons.save')}
                    secondaryButtonTitle={t('management.buttons.goBack')}
                    primaryButtonAction={() => setModalItem(null)}
                    secondaryButtonAction={() => setModalItem(null)}
                    centralized
                    inputs={renderUpdateResultsInputs()}
                />
            </div>
        </div>
    );
};

export default Results;
