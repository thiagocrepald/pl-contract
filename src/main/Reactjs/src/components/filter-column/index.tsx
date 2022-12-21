import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterModal from '../filter-modal';
import FilterTextField from '../filter-text-field';
import { ComparisonOperator, LogicalOperator, PredicateOperators } from '../../model/predicate-operators';

interface FilterColumnProps {
    filter: any;
    name: string;
    anchorEl: any;
    filterCode?: string;
    showModal: boolean;
    onCloseModal: () => void;
    onFilter: (event: any) => void;
    operators?: (ComparisonOperator | LogicalOperator)[];
}

const FilterColumn = (props: FilterColumnProps) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState<PredicateOperators>({});

    const handleApplyFilter = () => {
        props.onCloseModal();
        props.onFilter(search);
    };

    const handleCancel = () => {
        props.onCloseModal();
        setSearch(props.filter);
    };

    const handleResetFilters = () => {
        props.onCloseModal();
        setSearch({
            ...props.filter,
            [useFilterCodeOrName]: {}
        });
        props.onFilter({
            ...props.filter,
            [useFilterCodeOrName]: {}
        });
    };

    const handleChange = (value) => {
        setSearch({
            ...props.filter,
            [useFilterCodeOrName]: {
                value,
                operators: props.operators ?? []
            }
        });
    };

    const useFilterCodeOrName = props.filterCode ?? props.name;

    return (
        <FilterModal
            onCancel={handleCancel}
            anchor={props.anchorEl}
            showModal={props.showModal}
            onApplyFilter={handleApplyFilter}
            onResetFilters={handleResetFilters}
        >
            <div className="filter-body--title">{t(`contractDetail.control.dropdown.filter.${props.name}`)}</div>
            <div className="checkbox-button__container">
                <FilterTextField
                    fieldName={props.name}
                    onChange={handleChange}
                    id={useFilterCodeOrName}
                    value={search[useFilterCodeOrName]?.value}
                />
            </div>
        </FilterModal>
    );
};

export default FilterColumn;
