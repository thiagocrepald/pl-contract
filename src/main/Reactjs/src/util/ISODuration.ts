import moment from 'moment';
import { isEmpty } from 'lodash';

export const writeToISODuration = (entry: string | undefined) => {
    if (!isEmpty(entry)) {
        return moment(entry, 'HH:mm').format('[PT]H[H]m[M]');
    }

    return "";
};

export const readDurationFromISODuration = (entry): string => {
    if (entry != null) {
        return moment(entry, '[PT]H[H]m[M]').format('HH:mm');
    }
    return entry;
};