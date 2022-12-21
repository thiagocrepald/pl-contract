import React, { useState } from 'react';
import FilterModal from '../filter-modal';
import CustomDateField from '../custom-date-field/custom-date-field';
import { useTranslation } from 'react-i18next/';
import moment from 'moment';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { APP_LOCAL_DATE_FORMAT_US } from '../../config/constants';

const DateFilter = ({ setFilter, changeShow, show, filter }) => {
    const [t] = useTranslation();
    const [search, setSearch] = useState<any>(filter);

    const handleResetFilters = () => {
        changeShow(false)
        setSearch({});
        setFilter({
            ...filter,
            dates: null
        });
    };

    const handleCancel = () => {
        changeShow(false)
        setSearch(filter);
    };

    const handleApplyFilter = () => {
        changeShow(false)
        setFilter(search);
    };

    const handleDateChange = (date: MaterialUiPickersDate | null, dateType: string) => {
        if (date?.isValid()) {
            setSearch({
                ...search,
                dates: {
                    ...search.dates,
                    [dateType]: moment(date).format(APP_LOCAL_DATE_FORMAT_US)
                }
            });
        }
    };

    return (
        <FilterModal
            useButton
            showModal={show}
            onCancel={handleCancel}
            onApplyFilter={handleApplyFilter}
            onResetFilters={handleResetFilters}
            handleToggle={() => changeShow(!show)}
        >
            <CustomDateField
                disableErrorAndValidStyle
                maxDate={search.dates?.end}
                value={search.dates?.start}
                onChange={date => handleDateChange(date, "start")}
                placeholder={t("contractRegister.body.generalDate.textField.dateStart")}
            />
            <CustomDateField
                disableErrorAndValidStyle
                value={search.dates?.end}
                minDate={search.dates?.start}
                onChange={date => handleDateChange(date, "end")}
                placeholder={t("contractRegister.body.generalDate.textField.dateEnd")}
            />
        </FilterModal>
    );
};

export default DateFilter;
