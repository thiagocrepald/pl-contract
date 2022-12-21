import React, { useState } from 'react';
import { useTranslation } from 'react-i18next/';
import moment from 'moment';
import FilterModal from '../filter-modal';
import CustomDateField from '../custom-date-field/custom-date-field';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { APP_LOCAL_DATE_FORMAT_US } from '../../config/constants';
import { ComparisonOperator, LogicalOperator } from '../../model/predicate-operators';
import '../filter-status/filter-status.scss';

const FilterDateColumn = ({ setFilter, changeShow, show, filter, anchorEl, filterCode }) => {
    const [t] = useTranslation();
    const [search, setSearch] = useState<any>(filter);

    const handleResetFilters = () => {
        changeShow(false);
        setSearch({});
        setFilter({
            ...filter,
            [filterCode]: null
        });
    };

    const handleCancel = () => {
        changeShow(false);
        setSearch(filter);
    };

    const handleApplyFilter = () => {
        changeShow(false);
        setFilter(search);
    };

    const handleDateChange = (date: MaterialUiPickersDate | null, filterCode: string) => {
        if (date?.isValid()) {
            setSearch({
                ...search,
                [filterCode]: {
                    'value': moment(date).format(APP_LOCAL_DATE_FORMAT_US),
                    'operators': [LogicalOperator.OR, ComparisonOperator.EQ]
                }
                
            });
        }
    };
    
    return (
        <FilterModal
            anchor={anchorEl}
            showModal={show}
            onCancel={handleCancel}
            onApplyFilter={handleApplyFilter}
            onResetFilters={handleResetFilters}
            handleToggle={() => changeShow(!show)}
        >
            <div className="filter-body--title">{t(`contractDetail.control.dropdown.filter.${filterCode}`)}</div>
            <div className="checkbox-button__container">
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "260px", marginBottom:'11px'  }}>
                    <CustomDateField
                        disableErrorAndValidStyle
                        value={search[filterCode]?.value}
                        onChange={date => handleDateChange(date, filterCode)}
                        placeholder={t(`contractDetail.control.dropdown.${filterCode}`)}
                    />
                </div>
            </div>
        </FilterModal>
    );
};

export default FilterDateColumn;
