import React, { Fragment, useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import FilterModal from '../filter-modal';
import GroupCheckButton from '../filter-report-group/group-check-button';
import { ColumnType, ReportFieldType, ReportParameterType } from '../../model/enums/admin-report';
// import { IAdminReport } from '../../model/admin-report';
import './styles.scss';

interface FilterReportColumnProps {
    className?: string;
    filter: any;
    anchorEl: any;
    showModal: boolean;
    onCloseModal: () => void;
    onFilter: (event: any) => void;
    reportData?: any;
};

const FilterReportColumn = (props: FilterReportColumnProps) => {
    const [search, setSearch] = useState<{ [key: string]: boolean }>({});
    const [shouldGetFields, setShouldGetFields] = useState<boolean>(true);

    useEffect(() => {
        // gets fields from reportData to be shown as checked
        if (isEmpty(search) && !isEmpty(props.reportData) && shouldGetFields) {
            const searchData = {};
            const fields = Object.keys(props.reportData[0]).filter((item) => item !== ReportParameterType.UUID &&  item !== ReportParameterType.ID_DOCTOR && item !== ReportParameterType.ID_CONTRACT && item !== ReportParameterType.ID_SCHEDULE && item !== ReportParameterType.ID_ON_CALL)
            fields.map((item) => searchData[ColumnType[item]] = true);
            setSearch(searchData);
        };
    }, [props.reportData]);

    const handleApplyFilter = () => {
        // sort selected fields to show as table content
        const localSearch: any[] = [];
        const orderedSearch = {}; 

        Object.keys(search).filter((item) => search[item] !== false).map((item) => localSearch.push(item))
        const columnOrder = Object.values(ReportFieldType);
        const orderedSearchKeys = localSearch.sort((a, b) => columnOrder.indexOf(a) - columnOrder.indexOf(b))
        orderedSearchKeys.map((item) => orderedSearch[item] = true);

        props.onCloseModal();
        props.onFilter({
            ...props.filter,
            selectFields: orderedSearch
        });
    };

    const handleCancel = () => {
        props.onCloseModal();
        setSearch(props.filter.selectFields ?? {});
    };

    const handleResetFilters = () => {
        setShouldGetFields(false);
        setSearch({});
        props.onCloseModal();
        props.onFilter({
            ...props.filter,
            selectFields: null
        });
    };

    const handleClickGroup = statusType => {
        setSearch({
            ...search,
            [ColumnType[statusType]]: !search[ColumnType[statusType]]
        });
    };

    return (
        <div className="filter-report-column__container">
            <FilterModal
                onCancel={handleCancel}
                anchor={props.anchorEl}
                showModal={props.showModal}
                onApplyFilter={handleApplyFilter}
                onResetFilters={handleResetFilters}
            >
                <div className="checkbox-button__container">
                    <div className="checkbox-button__container--buttons" >
                        {Object.keys(ColumnType)
                            .filter(column => typeof column !== 'number')
                            .map((column, index) => (
                                <Fragment key={index}>
                                    {column.toLocaleString().split('_')[0] === 'separator' ? (
                                        <div style={{width: '280px', borderBottom: '1px solid rgba(0,0,0,0.1)', color: '#404040', marginTop: '10px'}}>{ColumnType[column]}</div>
                                    ) : (
                                        <GroupCheckButton
                                            isActive={search[ColumnType[column]]}
                                            label={`report.admin.table.${column.toLocaleString()}`}
                                            value={column.toLocaleString()}
                                            onClick={handleClickGroup}
                                        />
                                    )}
                                </Fragment>
                            ))}
                    </div>
                </div>
            </FilterModal>
        </div>
    );
};

export default FilterReportColumn;
