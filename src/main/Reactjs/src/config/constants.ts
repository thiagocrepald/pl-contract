const config = {
  VERSION: process.env.VERSION
};

export default config;

export const SERVER_API_URL = process.env.SERVER_API_URL;

export const AUTHORITIES = {
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN',
  CUSTOMER: 'ROLE_CUSTOMER'
};

export const messages = {
  DATA_ERROR_ALERT: 'Internal Error'
};

export const APP_TIME_FORMAT = 'HH:mm';
export const APP_IMAGE_SIZE_LIMIT = 15555555;
export const APP_WHOLE_NUMBER_FORMAT = '0,0';
export const APP_DATE_FORMAT = 'DD/MM/YY HH:mm';
export const APP_MONTH_YEAR_FORMAT = 'MMMM YYYY';
export const APP_LOCAL_DATE_FORMAT = 'DD/MM/YYYY';
export const APP_LOCAL_DATE_FORMAT_US = 'YYYY-MM-DD';
export const APP_DATE_COMPLETE_FORMAT = 'dddd DD/MM';
export const APP_WEEK_DAY_FORMAT = 'dddd';
export const APP_TIMESTAMP_FORMAT = 'DD/MM/YY HH:mm:ss';
export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const APP_LOCAL_DATETIME_FORMAT_Z = 'YYYY-MM-DDTHH:mm Z';
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';
export const APP_LOCAL_DATETIME_FORMAT_SECONDS_Z = 'YYYY-MM-DDTHH:mm:ssZ';
export const APP_TIME_WEEK_DAY_FORMAT = 'HH:mm - dddd, DD/MM';
