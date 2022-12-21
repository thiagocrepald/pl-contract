import { createMuiTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, makeStyles, Popover } from '@material-ui/core';
import { ptPT } from '@material-ui/core/locale';
import { Pagination, PaginationItem } from '@material-ui/lab';
import React, { Fragment, useState } from 'react';
import { Pageable } from '../../../../model/pageable';
import ClickableIcon from '../../../../components/clickable-icon/clickable-icon';
import { Importation } from '../../../../model/importation-type';
import { ReactComponent as EyeOnImg } from '../../../../assets/img/svg/eye-on.svg';
import { ReactComponent as CheckboxGreenUnchecked } from '../../../../assets/img/checkbox-green-round/unchecked-circle.svg';
import { ReactComponent as CheckboxGreenChecked } from '../../../../assets/img/checkbox-green-round/checked-circle.svg';
import { ReactComponent as Arrow } from '../../../../assets/img/svg/arrow-black-right.svg';
import CustomTextField from '../../../../components/custom-text-field/custom-text-field';
import { removeCurrencyMask, maskAmount, formatterCurrency } from '../../../../util/mask-utils';
import DropdownWaitingDoctor from '../dropdownImportReport/dropdownWaitingDoctor';
import ProgressSpinner from '../../../../components/progress-spinner/ProgressSpinner';
import { useTranslation } from 'react-i18next';
import './table-collapsible.scss';

interface Props {
    page: Pageable;
    columnNameKeys: ColumnSort[];
    onSort?: (code: string) => void;
    rows?: Importation[];                      
    onChangePage: (newPage: number) => void;
    totalPages?: number;
    onUpdateImportation?: (listImportation: Importation[]) => void;
    isLoading?: boolean;
    updateImportations: () => void;
    putOrRemoveDoctorWaiting: ({ importationKey }: Importation) => void;
}

export interface ColumnSort {
    name?: string | JSX.Element;
    sortCode?: string;
    translate?: string;
    type?: 'asc' | 'desc';
    sortDisabled?: boolean;
    sortActivated?: boolean;
}

enum ModalType {
    POPOVER
}

const useStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        padding: theme.spacing(3),
        marginLeft: '-15px'
    }
}));

const TableCollapisble = (props: Props) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [columnNameKeys, setColumnNameKeys] = useState<ColumnSort[]>(props.columnNameKeys);
    const [importationItems, setImportationItems] = useState<Importation[]>([]);

    const [doctorWaiting, setDoctorWaiting] = useState<Importation | null>(null);

    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [isShowPopover, setIsShowPopover] = useState(false);
    const [showIndex, setShowIndex] = useState<number | null>(null);

    const updateImportationItems = (item: Importation) => {
        const indexItem = importationItems.indexOf(item);

        if (!item.isDoctorWaiting) {
            item.netValue = calcNetValue(item);
            item.prolaboreNetValue = calcNetValueProLabor(item);

            if (indexItem !== -1) {
                importationItems.splice(indexItem, 1);
                setImportationItems([...importationItems, item]);
                handleClose();
                return {};
            }

            setImportationItems([...importationItems, item]);
            handleClose();
        }
    };

    const calcNetValue = (item: Importation) => {
        const membershipFee = Number(removeCurrencyMask(maskAmount(item?.membershipFee))) ?? 0;
        const otherDiscounts = Number(removeCurrencyMask(maskAmount(item?.otherDiscounts))) ?? 0;
        const anticipatedValue = Number(removeCurrencyMask(maskAmount(item?.anticipatedValue))) ?? 0;

        const netValue = Number(item.grossValue) - (membershipFee + otherDiscounts + anticipatedValue);

        return maskAmount(netValue);
    };

    const calcNetValueProLabor = (item: Importation) => {
        const prolaboreGrossValue = Number(removeCurrencyMask(item?.prolaboreGrossValue)) ?? 0;
        const prolaboreDiscount = Number(removeCurrencyMask(item?.prolaboreDiscount)) ?? 0;

        const prolaboreNetValue = prolaboreGrossValue - prolaboreDiscount;
        return maskAmount(prolaboreNetValue);
    };

    if (props.onUpdateImportation && importationItems.length !== 0) {
        props.onUpdateImportation(importationItems);
    }

    const onSort = (column: ColumnSort) => {
        const columns = [...columnNameKeys];
        const type = column.sortActivated ? (column.type === 'asc' ? 'desc' : 'asc') : 'asc';
        const code = `${column.sortCode ?? ''},${type}`;

        columns
            .filter(it => !it.sortDisabled)
            .forEach(it => {
                if (column.name === it.name) {
                    it.sortActivated = true;
                    it.type = type;
                } else if (column.name !== it.name && it.sortActivated) {
                    it.sortActivated = false;
                }
            });

        if (props.onSort) {
            props.onSort(code);
        }
    };

    const renderSortHeader = (column: ColumnSort): JSX.Element => {
        const iconSortActivated =
            column.type === 'desc' ? require('../../../../assets/img/svg/flecha-cima.svg') : require('../../../../assets/img/svg/flecha-baixo.svg');
        return (
            <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }} onClick={() => (!column.sortDisabled ? onSort(column) : null)}>
                {column.name ?? ''}
                {!column.sortDisabled && column.sortActivated ? (
                    <span style={{ margin: 'auto 0' }}>
                        <ClickableIcon iconPath={iconSortActivated} onClick={() => null} />
                    </span>
                ) : (
                    <span style={{ margin: 'auto 0' }}>
                        <ClickableIcon iconPath={require('../../../../assets/img/svg/flechas.svg')} onClick={() => null} />
                    </span>
                )}
            </div>
        );
    };

    const renderEmptyContentMessage = () => {
        return (
            <TableRow>
                <TableCell colSpan={2} className="row-empty">
                    Nenhum resultado encontrado
                </TableCell>
            </TableRow>
        );
    };

    const tableLoading = () => {
        return (
            <Table aria-label="collapsible table loading" stickyHeader={true} className="collapsible-table__container--field">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">{t('report.import.spinner.header')}</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    <TableRow key="row-loading" className="collapsible-table__container--field">
                        <TableCell align="center">
                            <ProgressSpinner />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    };

    const renderPagination = () => {
        return (
            <div className={'pagination-wrapper'}>
                <Pagination
                    shape="rounded"
                    defaultPage={1}
                    boundaryCount={1}
                    variant="outlined"
                    page={(props.page.page ?? 0) + 1}
                    count={props.totalPages || 0}
                    onChange={(event, page) => {
                        if (importationItems.length > 0) {
                            props.updateImportations();
                        }
                        props.onChangePage(page - 1);
                    }}
                    renderItem={itemArgs => {
                        if (itemArgs.type === 'previous' || itemArgs.type === 'next') {
                            return <PaginationItem {...itemArgs} />;
                        } else if (itemArgs.page === 1) {
                            return (
                                <Fragment>
                                    <span className={'text-style'}>{'Página '}</span>
                                    <input
                                        className={'input-style'}
                                        value={(props.page.page ?? 0) + 1}
                                        onChange={evt => props.onChangePage(Math.max(0, Math.min(props.totalPages || 0, +evt.target.value) - 1))}
                                    />
                                    <span className={'text-style'}>{' de '}</span>
                                    <span className={'text-style'}>{props.totalPages || 0}</span>
                                </Fragment>
                            );
                        }
                        return null;
                    }}
                />
            </div>
        );
    };

    const handleOpenModal = (type: ModalType) => {
        setIsShowPopover(false);

        switch (type) {
            case ModalType.POPOVER:
                setIsShowPopover(true);
                break;
        }
    };

    const handleClose = () => {
        setIsShowPopover(false);
    };

    return (
        <ThemeProvider theme={createMuiTheme(ptPT)}>
            <div
                style={{
                    borderRadius: '5px',
                    border: '1px solid #E1E2E6 ',
                    overflowY: 'auto',
                    overflowX: 'auto'
                }}
            >
                <TableContainer className={'table-container'}>
                    {!props.isLoading ? (
                        <Table aria-label="simple table collapsible" className={'table'} stickyHeader={true}>
                            <TableHead>
                                <TableRow className={'header-container'}>
                                    {columnNameKeys.map((column: ColumnSort, index: number) => {
                                        if (index === columnNameKeys.length - 1) return null;
                                        return (
                                            <TableCell key={`column-header-${index}`}>
                                                {column.sortDisabled ? column.name ?? '' : renderSortHeader(column)}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.rows != null && props.rows.length !== 0
                                    ? props.rows.map((item, index) => (
                                        <React.Fragment key={`table-container-${index}`}>
                                            <TableRow
                                                key={`row-${index}`}
                                                className={`collapsible-table__container--field${item.isDoctorWaiting ? '-disabled' : ''}`}
                                            >
                                                <TableCell style={{ display: 'table-cell' }}>
                                                    <div
                                                        className="collapsible-table__container--field-doctor-waiting"
                                                        onClick={({ currentTarget }) => {
                                                            setAnchorEl(currentTarget);
                                                            handleOpenModal(ModalType.POPOVER);
                                                            setDoctorWaiting({ importationKey: item?.importationKey });
                                                        }}
                                                    >
                                                        <EyeOnImg />
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        <div
                                                            onClick={() => {
                                                                if (showIndex === index) {
                                                                    setShowIndex(null);
                                                                } else {
                                                                    setShowIndex(index);
                                                                }
                                                            }}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {item.prolaboreGrossValue != null && item.prolaboreGrossValue.length > 0 ? (
                                                                <CheckboxGreenChecked />
                                                            ) : showIndex === index ? (
                                                                <CheckboxGreenChecked />
                                                            ) : (
                                                                <CheckboxGreenUnchecked />
                                                            )}
                                                        </div>
                                                    }
                                                </TableCell>
                                                <TableCell align="center">{item.payingCompanyCode ?? ''}</TableCell>
                                                <TableCell align="center">{item.nameCompanyCode ?? ''}</TableCell>
                                                <TableCell>{item.cpfCnpj ?? ''}</TableCell>
                                                <TableCell style={{ textAlign: 'left' }}>{item.doctorName ?? ''}</TableCell>
                                                <TableCell align="left">{item.typePayment ?? ''}</TableCell>
                                                <TableCell align="left">{maskAmount(item.grossValue)}</TableCell>
                                                <TableCell align="center">
                                                    <CustomTextField
                                                        id={`other-discounts-${index}`}
                                                        className="custom-text-field-table-import-report"
                                                        label={t('report.import.textField.value')}
                                                        value={maskAmount(item.otherDiscounts)}
                                                        onChange={value => {
                                                            item.otherDiscounts = formatterCurrency(value);
                                                            updateImportationItems(item);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <CustomTextField
                                                        id={`partner-date-${index}`}
                                                        className={'custom-text-field-table-import-report'}
                                                        label={t('report.import.textField.value')}
                                                        value={maskAmount(item?.membershipFee)}
                                                        onChange={value => {
                                                            item.membershipFee = formatterCurrency(value);
                                                            updateImportationItems(item);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{maskAmount(item.anticipatedValue)}</TableCell>
                                                <TableCell align="left">{maskAmount(item.netValue)}</TableCell>
                                                <TableCell align="center">{item.companyReceiver ?? ''}</TableCell>
                                                <TableCell align="left" style={{ display: 'table-cell' }}>
                                                    <CustomTextField
                                                        id={`note-${index}`}
                                                        className="custom-text-field-table-import-report"
                                                        label={t('report.import.textField.note')}
                                                        value={item?.observation}
                                                        onChange={value => {
                                                            item.observation = value;
                                                            updateImportationItems(item);
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>

                                            {showIndex === index && (
                                                <TableRow className="collapsible-table__container--field-collapsible">
                                                    <TableCell style={{ display: 'table-cell' }}>&nbsp;</TableCell>
                                                    <TableCell align="center">
                                                        <Arrow />
                                                    </TableCell>
                                                    <TableCell colSpan={2} style={{ textAlign: 'left' }}>
                                                        <span className="pro-labor-collapsible">{t('report.import.table.proLabore')}</span>
                                                    </TableCell>
                                                    <TableCell>&nbsp;</TableCell>
                                                    <TableCell style={{ textAlign: 'right' }}>{t('report.import.table.grossValue')}</TableCell>
                                                    <TableCell>
                                                        <CustomTextField
                                                            id={`gross-amount-${index}`}
                                                            className="custom-text-field-table-import-report"
                                                            label={t('report.import.textField.value')}
                                                            value={maskAmount(item.prolaboreGrossValue)}
                                                            onChange={value => {
                                                                item.prolaboreGrossValue = formatterCurrency(value);
                                                                updateImportationItems(item);
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>&nbsp;</TableCell>
                                                    <TableCell colSpan={3}>
                                                        <div className="collapsible-table__container--field-collapsible-pro-labor">
                                                            <span>{t('report.import.textField.proLabor')}</span>
                                                            <CustomTextField
                                                                id={`discounts-pro-labor-${index}`}
                                                                style={{ maxWidth: '150px' }}
                                                                className="custom-text-field-table-import-report"
                                                                label={t('report.import.textField.value')}
                                                                value={maskAmount(item.prolaboreDiscount)}
                                                                onChange={value => {
                                                                    if (item.prolaboreGrossValue !== '') {
                                                                        item.prolaboreDiscount = formatterCurrency(value);
                                                                        updateImportationItems(item);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell style={{ textAlign: 'right' }}>{t('report.import.table.netValue')}</TableCell>
                                                    <TableCell style={{ textAlign: 'left' }}>{maskAmount(item.prolaboreNetValue)}</TableCell>
                                                    <TableCell style={{ display: 'table-cell' }}>&nbsp;</TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    )) : renderEmptyContentMessage()}
                            </TableBody>
                        </Table>
                    ) : (
                        tableLoading()
                    )}
                </TableContainer>
                <Popover
                    open={isShowPopover}
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
                            setDoctorWaiting(null);
                            handleClose();
                        }}
                        onClickSecondButton={() => {
                            props.putOrRemoveDoctorWaiting({ importationKey: doctorWaiting?.importationKey });
                            handleClose();
                        }}
                        title={t('report.import.dropdown.title')}
                    />
                </Popover>
            </div>
            {renderPagination()}
        </ThemeProvider>
    );
};

export default TableCollapisble;
