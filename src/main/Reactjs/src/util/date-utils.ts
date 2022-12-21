import { isEmpty } from 'lodash';
import moment, { Moment } from 'moment';
import { APP_LOCAL_DATETIME_FORMAT_SECONDS_Z, APP_TIME_FORMAT, APP_TIME_WEEK_DAY_FORMAT } from '../config/constants';

class DateUtils {
    // tslint:disable-next-line: variable-name
    checkIfDateIsBeforeToday(date: Date | string): boolean {
        return moment(date).isBefore(moment());
    }

    subtractHourOfTwoDates(startDate?: Date | string | Moment, endDate?: Date | string | Moment, onlyNumbers?: boolean): string {
        if (startDate == null && endDate == null) return '';

        const endDateMoment = moment(endDate);
        const startDateMoment = moment(startDate);
        const momentMinutes = moment.duration(endDateMoment.diff(startDateMoment)).asMinutes();

        const addZero = (event: number) => event < 10 ? '0' : '';

        const min = Math.floor(momentMinutes % 60);
        const hour = Math.floor(momentMinutes / 60);

        const posHours = !onlyNumbers ? hour === 1 ? 'hr' : 'hrs' : '';
        const posMinutes = !onlyNumbers ? min === 1 ? 'min' : 'mins' : '';

        if (min === 0) return `${addZero(hour)}${hour}${posHours}:00`;
        if (hour === 0) return `0:${addZero(min)}${min}${posMinutes}`;
        if (!onlyNumbers) return `${addZero(hour)}${hour}${posHours} e ${addZero(min)}${min}${posMinutes}`;
        return `${addZero(hour)}${hour}${posHours}:${addZero(min)}${min}${posMinutes}`;
    }

    subtractHoursOfTwoDatesToMinutes(startDate?: Date | string | Moment, endDate?: Date | string | Moment): number {
        if (startDate == null && endDate == null) return 0;
        const endDateMoment = moment(endDate);
        const startDateMoment = moment(startDate);
        return moment.duration(endDateMoment.diff(startDateMoment)).asMinutes();
    }

    formatDatePtBr = (date?: string | Date | Moment): string => {
        if(date == null || date === ''){
            return '';
        }
    
        return moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY');
    }

    getHourAndMinuteOfDate = (date?: string | Date | Moment): string => {
        if(date == null || date === ''){
            return '';
        }
    
        return moment(date, 'YYYY/MM/DD HH:mm').format('HH:mm');
    }

    getOnlyDate = (date?: string | Date | Moment): string => {
        if(date == null || date === ''){
            return '';
        }
    
        return moment(date, 'YYYY/MM/DD HH:mm').format('YYYY-MM-DD');
    }

    addOneDayToDate = (date?: string | Date | Moment) => {
        if(date == null || date === ''){
            return '';
        }
    
        return moment(date).add(1, 'day');
    }

    getMonthAndYear = (date?: string | Date | Moment): string => {
        if(date == null || date === ''){
            return '';
        }
    
        return moment(date, 'YYYY/MM/DD').format('M/YYYY');
    }
    
    formatDate = (date: Moment | string | undefined) => {
        if (!isEmpty(date)) {
            return moment(date!).format(APP_TIME_WEEK_DAY_FORMAT).replace("-feira", "").toLowerCase();
        }

        return "";
    }
    
    formatTime = (startTime: Date | string | Moment, endTime?: Date | string | Moment, fixTimeZone?: boolean) => {
        if (endTime && moment(endTime, APP_LOCAL_DATETIME_FORMAT_SECONDS_Z, true).isValid() && moment(startTime, APP_LOCAL_DATETIME_FORMAT_SECONDS_Z, true).isValid()) {
            if (fixTimeZone) {
                return `${moment.utc(startTime).local().format(APP_TIME_FORMAT)} - ${moment.utc(endTime).local().format(APP_TIME_FORMAT)}`;
            };
            return `${moment(startTime).utc().format(APP_TIME_FORMAT)} - ${moment(endTime).utc().format(APP_TIME_FORMAT)}`;
        } else if (startTime && moment(startTime, APP_LOCAL_DATETIME_FORMAT_SECONDS_Z, true)) {
            if (fixTimeZone) {
                return `${moment.utc(startTime).local().format(APP_TIME_FORMAT)}`;
            };
            return `${moment(startTime).utc().format(APP_TIME_FORMAT)}`;
        }
        return '';
    };
}

export default new DateUtils();
