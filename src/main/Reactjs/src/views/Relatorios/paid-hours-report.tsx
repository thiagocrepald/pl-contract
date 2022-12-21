import { FormControl, InputLabel, makeStyles, Select } from '@material-ui/core';
import React, { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DownloadImg from '../../assets/img/svg/download2.svg';
import NotificationImg from '../../assets/img/svg/notificaçao.svg';
import Footer from '../../components/footer/footer';
import IconButton from '../../components/icon-button/icon-button';
import SimpleOrderTable from '../../components/simple-ordered-table/simple-ordered-table';
import './admin-report/styles.scss';
import NotificationModal from '../../components/notification-modal/notification-modal';
// import './admin-report.scss';
import './import-report.scss';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    }
}));

const PaidHoursReport = () => {
    const { t, i18n } = useTranslation();

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const tabs = [
        { name: t('contractDetail.control.modal.control'), code: 0 },
        { name: t('contractDetail.control.modal.calendar'), code: 1 },
        { name: t('contractDetail.control.modal.requests'), code: 2 }
    ];

    // CHANGE COLOR FOR THIS PAGE ONLY AND CLEAN-UP WHEN LEAVING THE PAGE
    useLayoutEffect(() => {
        window.document.body.style.background = 'white';

        return () => {
            window.document.body.style.background = '';
        };
    });

    const [showNotifications, setShowNotifications] = useState(false);
    const [page, setPage] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const classes = useStyles();
    const [state, setState] = React.useState({
        age: '',
        name: 'hai'
    });

    const handleChange = event => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value
        });
    };

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [checked, setChecked] = React.useState(true);
    const anchorRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const [filter, setFilter] = React.useState('left');

    const handleFilter = (event, newFilter) => {
        setFilter(newFilter);
    };

    /* eslint-enable @typescript-eslint/no-unused-vars */
    return (
        <>
            <div className="report__container">
                <div className="report__container--header">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="back-button">
                            <div className="arrow-white" />
                        </div>
                        <div className="contract-detail__container--header-title">{t('report.paidHours.title')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img className="download-img" src={DownloadImg} />
                        <img className='notification-img' src={NotificationImg} onClick={() => setShowNotifications(!showNotifications)}/>
                    </div>
                </div>
            {showNotifications && <NotificationModal/>} 
                <div style={{ marginBottom: '47px', marginTop: '16px', alignItems: 'baseline' }} className="import-report__container">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '50px' }} className="import-report__container--field">
                            <div className="import-report__container--field-title">{t('report.import.code')}</div>
                            <div style={{ width: '100px' }}>
                                <FormControl variant="filled" className={classes.formControl}>
                                    <InputLabel htmlFor="filled-age-native-simple">AMF</InputLabel>
                                    <Select
                                        native
                                        fullWidth
                                        value={state.age}
                                        onChange={handleChange}
                                        inputProps={{
                                            name: 'filter'
                                        }}
                                    />
                                </FormControl>
                            </div>
                        </div>
                        <div style={{ marginRight: '22px' }} className="import-report__container--field">
                            <div className="import-report__container--field-title">{t('report.import.reference')}</div>
                            <div style={{ width: '144px' }}>
                                <FormControl variant="filled" className={classes.formControl}>
                                    <InputLabel htmlFor="filled-age-native-simple">00/0000</InputLabel>
                                    <Select
                                        native
                                        fullWidth
                                        value={state.age}
                                        onChange={handleChange}
                                        inputProps={{
                                            name: 'filter'
                                        }}
                                    />
                                </FormControl>
                            </div>
                        </div>
                        <div className="import-report__container--field">
                            <div className="import-report__container--field-title">{t('report.import.date')}</div>
                            <div style={{ width: '144px' }}>
                                <FormControl variant="filled" className={classes.formControl}>
                                    <InputLabel htmlFor="filled-age-native-simple">00/00/0000</InputLabel>
                                    <Select
                                        native
                                        fullWidth
                                        value={state.age}
                                        onChange={handleChange}
                                        inputProps={{
                                            name: 'filter'
                                        }}
                                    />
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: '0', margin: '0' }} className="report__container--buttons">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton color="green" fontSize="14px" isAlignCenter width={'158px'} height={'40px'} filled clickButton={() => {}}>
                                {t('report.import.buttonThird')}
                            </IconButton>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="scroll-table padding-page import-report--page">
                        <SimpleOrderTable
                            // {...this.props}
                            rows={[
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                            ]}
                            // page={this.state.page}
                            page={{
                                page,
                                totalPages: 10
                            }}
                            columnNameKeys={[
                                { name: t('report.paidHours.table.description') },
                                { name: t('report.paidHours.table.estimatedHours') },
                                { name: t('report.paidHours.table.performetdHours') },
                                { name: t('report.paidHours.table.unit') },
                                { name: t('report.paidHours.table.cost') },
                                { name: t('report.paidHours.table.totalSheet') },
                                { name: t('report.paidHours.table.unitary') },
                                { name: t('report.paidHours.table.hours') },
                                { name: t('report.paidHours.table.totalBilled') },
                                { name: t('report.paidHours.table.comment') },
                                { name: t('report.paidHours.table.date') },
                                { name: t('report.paidHours.table.total') },
                                { name: t('report.paidHours.table.emergency') }
                            ]}
                            // onChangePage={this.handleChangePage}
                            onChangePage={index => {
                                setPage(index);
                            }}
                            // onSort={(code: string) => this.handleSort(code)}
                            onSort={() => {}}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};
export default PaidHoursReport;
