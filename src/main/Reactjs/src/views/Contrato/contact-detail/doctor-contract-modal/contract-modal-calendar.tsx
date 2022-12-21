import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './contract-modal-calendar.scss';
import '../../../../components/main.scss';
import { Calendar, Event, momentLocalizer, Views } from 'react-big-calendar';
import moment, { Moment } from 'moment';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { AccessControl } from '../../../../model/access-control';
import Shift from '../../../../model/enums/shift';
import {
    APP_LOCAL_DATE_FORMAT_US,
    APP_LOCAL_DATETIME_FORMAT,
    APP_MONTH_YEAR_FORMAT,
    APP_TIME_FORMAT
} from '../../../../config/constants';
import { Predicate } from '../../../../model/predicate';
import { Pageable } from '../../../../model/pageable';
import AccessControlService from '../../../../services/access-control-service';
import { PredicateOperators } from '../../../../model/predicate-operators';
import StringUtils from '../../../../util/string-utils';
import { convertFilterToOperators } from '../../../../util/predicate-operators-utils';

const localizer = momentLocalizer(moment);

interface IContractModalControlProps {
    doctorId: number;
    contractId?: number;
}

const ContractModalCalendar = ({ doctorId, contractId }: IContractModalControlProps) => {
    const { t } = useTranslation();
    const [date, setDate] = useState(moment().toDate());
    const [accessControls, setAccessControls] = useState<AccessControl[]>([]);
    const [page] = useState<Pageable>({
        page: 0,
        size: 100,
        totalPages: 0,
        totalElements: 0,
        sort: 'onCall.date,desc'
    });
    const [predicate, setPredicate] = useState<Predicate>({
        'onCall.doctor.id': doctorId ?? 0,
        'onCall.schedule.contract.id': contractId ?? 0,
    });

    const setFullMonthFilter = (returnValue?: boolean) => {
        const fullMonthFilter = {
            ['dates']: {
                'end': moment(date).clone().endOf('month').toISOString(),
                'start': moment(date).clone().startOf('month').toISOString()
            }
        };
        if (returnValue) return fullMonthFilter as any;
        setPredicateOperators(convertFilterToOperators(fullMonthFilter as any));
    };

    const [predicateOperators, setPredicateOperators] = useState<PredicateOperators[]>(convertFilterToOperators(setFullMonthFilter(true)));

    useLayoutEffect(() => {
        window.document.body.style.background = 'white';
        return () => {
            window.document.body.style.background = '';
        };
    });

    useEffect(() => {
        getAccessControls()
    }, []);

    useEffect(() => {
        getAccessControls()
    }, [predicate, predicateOperators]);

    useEffect(() => {
        setAccessControls([]);
        setFullMonthFilter();
    }, [date]);

    const getAccessControls = () => {
        AccessControlService.getAllAccessControls(predicate, page, predicateOperators)
            .then(result => {
                setAccessControls(result.content);
                // setPage({
                //     ...page,
                //     size: result.size,
                //     page: result.number,
                //     totalPages: result.totalPages,
                //     totalElements: result.totalElements
                // });
            });
    };

    const updateShowContractId = (event?: number) => {
        setPredicate({
            ...predicate,
            'onCall.schedule.contract.id': event
        });
    };

    const updateShowContractIdByBoolean = (event: boolean) => {
        const checked = event ? undefined : contractId;
        setPredicate({
            ...predicate,
            'onCall.schedule.contract.id': checked
        });
    };

    // @ts-ignore
    let allViews = Object.keys(Views).map((k) => Views[k]);

    const ColoredDateCellWrapper = ({ children }) =>
        React.cloneElement(React.Children.only(children), {
            style: {
                backgroundColor: 'lightblue'
            }
        });

    const getCalendarShift = (accessControl: AccessControl) => {
        switch (accessControl.onCall?.shift) {
            case Shift.MORNING:
                return (
                    <div className='calendar-modal--dayline'>
                        <div className='icon-dia' />
                        {moment(accessControl.onCall?.startTime).utc().format(APP_TIME_FORMAT)}
                        {' - '}
                        {StringUtils.capitalizeFirstLetter(accessControl.onCall?.sectors?.[0].description)}
                    </div>
                );

            case Shift.AFTERNOON:
                return (
                    <div className='calendar-modal--dayline'>
                        <div className='icon-tarde' />
                        {moment(accessControl.onCall?.startTime).utc().format(APP_TIME_FORMAT)}
                        {' - '}
                        {StringUtils.capitalizeFirstLetter(accessControl.onCall?.sectors?.[0].description)}
                    </div>
                );

            case Shift.EVENING:
                return (
                    <div className='calendar-modal--dayline'>
                        <div className='icon-cinderela' />
                        {moment(accessControl.onCall?.startTime).utc().format(APP_TIME_FORMAT)}
                        {' - '}
                        {StringUtils.capitalizeFirstLetter(accessControl.onCall?.sectors?.[0].description)}
                    </div>
                );

            case Shift.NIGHT:
                return (
                    <div className='calendar-modal--dayline'>
                        <div className='icon-noite' />
                        {moment(accessControl.onCall?.startTime).utc().format(APP_TIME_FORMAT)}
                        {' - '}
                        {StringUtils.capitalizeFirstLetter(accessControl.onCall?.sectors?.[0].description)}
                    </div>
                );

            default:
                return <div />
        }
    };

    const getCalendarEvent = (accessControl: AccessControl): Event => {
        return ({
            allDay: false,
            title: getCalendarShift(accessControl) as any,
            end: getAccessControlDate(accessControl.onCall?.date, accessControl.onCall?.endTime),
            start: getAccessControlDate(accessControl.onCall?.date, accessControl.onCall?.startTime),
        });
    };

    const getAccessControlDate = (dateAc?: Date | string | Moment, timeAc?: Date | string | Moment) => {
        const momentTime = moment(timeAc).format(APP_TIME_FORMAT);
        const momentDate = moment(dateAc).format(APP_LOCAL_DATE_FORMAT_US);
        return moment(`${momentDate} ${momentTime}`, APP_LOCAL_DATETIME_FORMAT).toDate();
    };

    return (
        <div className='calendar-modal__container'>
            <div className='filter__container'>
                <div style={{ display:'flex', alignItems:'center'}}>
                    <div className='calendar-modal--title'>{t('contractDetail.control.modal.show')}</div>
                    <ToggleButtonGroup
                        exclusive
                        value={predicate['onCall.schedule.contract.id']}
                        onChange={(event, value) => updateShowContractId(value)}
                    >
                        <ToggleButton value={contractId ?? 0}>
                            <span>{t('contractDetail.control.modal.contract')}</span>
                        </ToggleButton>
                        <ToggleButton value={null}>
                            <span>{t('contractDetail.control.modal.all')}</span>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
            <div className='calendar-modal__container--items'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button className='calendar-modal__container--today-button' onClick={() => setDate(moment().toDate())}>
                        {t('contractDetail.control.modal.today')}
                    </button>
                    <button
                        className='calendar-modal__container--back-button'
                        onClick={() => setDate(moment(date).subtract(1, 'month').toDate())}
                    >
                        <div className='seta-esquerda--img' />
                    </button>
                    <div className='calendar-modal__container--date'>{moment(date).format(APP_MONTH_YEAR_FORMAT)}</div>
                    <button
                        className='calendar-modal__container--next-button'
                        onClick={() => setDate(moment(date).add(1, 'month').toDate())}
                    >
                        <div className='seta-esquerda--img' />
                    </button>
                </div>
            </div>
            <div style={{ height: 'calc(100vh - 310px)' }}>
                <Calendar
                    step={60}
                    date={date}
                    showAllEvents
                    views={allViews}
                    showMultiDayTimes
                    localizer={localizer}
                    defaultDate={moment().toDate()}
                    components={{ timeSlotWrapper: ColoredDateCellWrapper as any }}
                    events={accessControls
                        .sort((a, b) => moment(a.onCall?.startTime).isBefore(b.onCall?.startTime) ? 1 : -1)
                        .map(getCalendarEvent)}
                    formats={{ weekdayFormat: (dateFormat, culture, localizerFormat) =>
                            localizerFormat!.format(dateFormat, 'dddd', culture!) }}
                />
            </div>
            <div className='calendar-modal__container--caption'>
                <div className='calendar-modal--dayline'>
                    <div className='icon-dia' />
                    {t('contractDetail.control.modal.table.morning')}
                </div>
                <div className='calendar-modal--dayline'>
                    <div className='icon-tarde' />
                    {t('contractDetail.control.modal.table.afternoon')}
                </div>
                <div className='calendar-modal--dayline'>
                    <div className='icon-noite' />
                    {t('contractDetail.control.modal.table.night')}
                </div>
                <div className='calendar-modal--dayline'>
                    <div className='icon-cinderela' />
                    {t('contractDetail.control.modal.table.cinderella')}
                </div>
            </div>
        </div>
    );
};

export default ContractModalCalendar;
