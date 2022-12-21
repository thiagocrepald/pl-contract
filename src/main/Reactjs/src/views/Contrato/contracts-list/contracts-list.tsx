import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import ContractTable from '../../../components/contract-table/contract-table';
import IconButton from '../../../components/icon-button/icon-button';
import SearchTextField from '../../../components/search-text-field/search-text-field';
import { ColumnSort } from '../../../components/simple-ordered-table/simple-ordered-table';
import NotificationModal from '../../../components/notification-modal/notification-modal';
import { Contract } from '../../../model/contract';
import ContractStatus from '../../../model/enums/contract-status';
import { ContractState } from '../../../model/enums/contract-state';
import { Pageable } from '../../../model/pageable';
import ContractService from '../../../services/contract-service';
import AuthUtils from '../../../util/auth-utils';
import './contracts-list.scss';

const ContractsList = () => {
    const [t] = useTranslation();
    const [pageable, setPageable] = useState<Pageable>({ size: 10, page: 0, totalPages: 0 });
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchField, setSearchField] = useState('');
    const [sort, setSort] = useState('contractEndTerm,asc');

    const [showNotifications, setShowNotifications] = useState(false);

    const history = useHistory();

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [filter, setFilter] = useState<any>({});
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [selectedContract, setSelectedContract] = useState<Contract>({});
    const [contracts, setContracts] = useState<Contract[]>([{}]);
    const [totalPages, setTotalPages] = useState<Contract[]>([{}]);
    const [inactiveContracts, setInactiveContracts] = useState<boolean[]>([])

    useEffect(() => {
        getContracts();
    }, [pageable, searchField, filter, sort]);

    const getContracts = () => {
        const predicate = {
            search: searchField,
            'sort': sort
        };

        ContractService.getAllContracts(pageable, predicate).then((result) => {
            setContracts(result.content);
            setTotalPages(result.totalPages);
            getInactiveContracts(result.content);
        });
    };

    const getInactiveContracts = (contracts: Contract[]) => {
        const inactiveList = contracts.map(it => it.status === ContractState.INACTIVE);
        setInactiveContracts(inactiveList);
    };

    const handleClick = (event, index: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedContract(contracts[index]);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onEditContract = () => {
        setAnchorEl(null);

        history.push(`/admin/contract-register/${selectedContract.id}`);
    };

    const onActivateContract = async () => {
        let contract = selectedContract?.id!;

        await ContractService.activateContract(contract);

        getContracts();
        setAnchorEl(null);
    };

    const updatePage = (page: number) => {
        setPageable({ page: page, size: 10 });
    };

    const onSort = (sort: string) => {
        setSort(sort);
    };

    const tableHeaders: ColumnSort[] = [
        { sortDisabled: true },
        { name: t('contracts.tableHeaders.CR'), sortCode: 'resultsCenter' },
        { name: t('contracts.tableHeaders.contractNumber'), sortCode: 'contractNumber' },
        { name: t('contracts.tableHeaders.contractor'), sortCode: 'contractingParty.name' },
        { name: t('contracts.tableHeaders.adm'), sortCode: 'responsibleAccessUser.name' },
        { name: t('contracts.tableHeaders.city'), sortCode: 'contractingPartyAddress.city.name' },
        { name: t('contracts.tableHeaders.state'), sortCode: 'contractingPartyAddress.city.state.acronym' },
        { name: t('contracts.tableHeaders.serviceType'), sortCode: 'serviceTypeMacro.description' },
        { name: t('contracts.tableHeaders.endDate'), sortCode: 'endDate' },
        { name: t('contracts.tableHeaders.status'), sortDisabled: true },
        { sortDisabled: true }
    ];

    const handleTransformToTableContent = (content?: Contract[]): (string | JSX.Element)[][] => {
        if (content == null || content.length === 0) return [];

        return content.map((item, index) => [
            ContractStatus.getContractStatusByDate(item),
            item.resultsCenter ?? '',
            item.contractNumber ?? '',
            item.contractingParty?.name ?? '',
            item.responsibleAccessUser?.name ?? '',
            item.contractingParty?.address?.city?.name ?? '',
            item.contractingParty?.address?.city?.state?.acronym ?? '',
            item.serviceTypeMacro?.description ?? '',
            item.contractEndTerm ? moment(item?.contractEndTerm, 'YYYY/MM/DD').format('DD/MM/YYYY') : '',
            item.status === ContractState.ACTIVE ? <div className='active-tag'>{t('contracts.tableContent.status.active')}</div> : <div className='inactive-tag'>{t('contracts.tableContent.status.inactive')}</div>,
            <Fragment key={index}>
                {AuthUtils.userHasPermission(1) && (
                    <div>
                        <div className='icon-dots' aria-controls='simple-menu' aria-haspopup='true' onClick={(e) => handleClick(e, index)} />
                    </div>
                )}
            </Fragment>
        ]);
    };

    const tableContent = handleTransformToTableContent(contracts);

    const handleClickRow = (index: number) => {
        history.push(`/admin/contract-detail/${contracts[index].id}`);
    };

    return (
        <div className='contract__container'>
            <div className='contract__container--header'>
                <span> {t('contracts.title')} </span>
                <div className='notification-img' onClick={() => setShowNotifications(!showNotifications)}/>
            </div>
            {showNotifications && <NotificationModal/>}
            <div className='contract__container--body'>
                <div style={{ maxWidth: '222px' }}>
                    <SearchTextField onChange={setSearchField} id={'search-field'} placeholder='Buscar por' value={searchField} />
                </div>
                <Link style={{ marginLeft: '24px' }} to='/admin/contract-register/'>
                    {AuthUtils.userHasPermission(1) && (
                        <IconButton isAlignCenter width={'170px'} height={'40px'} filled clickButton={() => {}}>
                            <div className='icon-plus' />
                            {t('contracts.button.add')}
                        </IconButton>
                    )}
                </Link>
            </div>
            <div className={'contract-list'} style={{ padding: '0 26px', overflow: 'auto' }}>
                <ContractTable
                    rows={tableContent}
                    disabledRows={inactiveContracts}
                    page={pageable}
                    firstCustom={true}
                    totalPages={totalPages as any}
                    columnNameKeys={tableHeaders}
                    onChangePage={updatePage}
                    onSort={(sortCode) => onSort(sortCode)}
                    onClickRow={handleClickRow}
                    items={contracts}
                    utilProp='contractStatus'
                />
                <Menu className='tooltip-style' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                    {selectedContract?.status === ContractState.ACTIVE && <MenuItem onClick={onEditContract}>{t('management.buttons.edit')}</MenuItem>}
                    <MenuItem onClick={onActivateContract}>{t(`management.buttons.${selectedContract?.status === ContractState.ACTIVE ? 'deactivate' : 'activate'}`)}</MenuItem>
                </Menu>
            </div>
            <div className='contract__container--caption'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ background: '#FF0101' }} className='contract__container--caption-color' />
                    <span>{t('contracts.one-month')} </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className='contract__container--caption-color' />
                    <span>{t('contracts.two-month')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ background: '#979797' }} className='contract__container--caption-color' />
                    <span>{t('contracts.archived-contract')} </span>
                </div>
            </div>
        </div>
    );
};

export default ContractsList;
