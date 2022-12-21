import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import FilterModal from '../filter-modal';
import GroupCheckButton from './group-check-button';
import { GroupType, ReportFieldType } from '../../model/enums/admin-report';
import './styles.scss';

interface FilterReportGroupProps {
  filter: any;
  anchorEl: any;
  showModal: boolean;
  onCloseModal: () => void;
  onFilter: (event: any) => void;
};

const FilterReportGroup = (props: FilterReportGroupProps) => {
  const [t] = useTranslation();
  const [search, setSearch] = useState<{ [key: string]: boolean }>({});

  const handleApplyFilter = () => {
    const defaultSelectFields = {
      DOCTOR_NAME: true,
      NAME_SCHEDULE: true,
      ON_CALL_DATE: true,
      ON_CALL_END_TIME: true,
      ON_CALL_SECTOR: true,
      ON_CALL_START_TIME: true,
      TOTAL_AMOUNT_ON_CALL_EXPECTED: true,
      UNIT_SERVICE_TYPE: true
    };
    if (isEmpty(props.filter.selectFields)) {
      props.onFilter({
        ...props.filter,
        selectFields: defaultSelectFields,
        groupByFields: search
      });
    } else {
      props.onFilter({
        ...props.filter,
        groupByFields: search
      });
    };
    props.onCloseModal();
  };

  const handleCancel = () => {
    props.onCloseModal();
    setSearch(props.filter.groupByFields ?? {});
  };

  const handleResetFilters = () => {
    setSearch({});
    props.onCloseModal();
    props.onFilter({
      ...props.filter,
      groupByFields: null
    });
  };

  const handleClickGroup = (statusType) => {
    setSearch({
      ...search,
      [statusType]: !search[statusType]
    });
  };

  return (
    <div className="filter-report-group__container">
      <FilterModal
          onCancel={handleCancel}
          anchor={props.anchorEl}
          showModal={props.showModal}
          onApplyFilter={handleApplyFilter}
          onResetFilters={handleResetFilters}
      >
        <div className="checkbox-button__container">
          <div className="checkbox-button__container--buttons">
            <GroupCheckButton isActive={search[GroupType.TOTAL_AMOUNT_ON_CALL_EXPECTED]} label={`report.admin.dropdown.group.${GroupType.TOTAL_AMOUNT_ON_CALL_EXPECTED}`} onClick={handleClickGroup} value={GroupType.TOTAL_AMOUNT_ON_CALL_EXPECTED} />
            <GroupCheckButton isActive={search[GroupType.HOUR_VALUE_EXPECTED_TO_RECEIVE]} label={`report.admin.dropdown.group.${GroupType.HOUR_VALUE_EXPECTED_TO_RECEIVE}`} onClick={handleClickGroup} value={GroupType.HOUR_VALUE_EXPECTED_TO_RECEIVE} />
            <GroupCheckButton isActive={search[GroupType.TOTAL_AMOUNT_EXPECTED_TO_RECEIVE]} label={`report.admin.dropdown.group.${GroupType.TOTAL_AMOUNT_EXPECTED_TO_RECEIVE}`} onClick={handleClickGroup} value={GroupType.TOTAL_AMOUNT_EXPECTED_TO_RECEIVE}/>
            <GroupCheckButton isActive={search[GroupType.TOTAL_AMOUNT_EXPECTED_DOCTOR]} label={`report.admin.dropdown.group.${GroupType.TOTAL_AMOUNT_EXPECTED_DOCTOR}`} onClick={handleClickGroup} value={GroupType.TOTAL_AMOUNT_EXPECTED_DOCTOR}/>
            <GroupCheckButton isActive={search[GroupType.TOTAL_HOURS_DOCTOR_ACCOMPLISHED]} label={`report.admin.dropdown.group.${GroupType.TOTAL_HOURS_DOCTOR_ACCOMPLISHED}`} onClick={handleClickGroup} value={GroupType.TOTAL_HOURS_DOCTOR_ACCOMPLISHED}/>
            <GroupCheckButton isActive={search[GroupType.TOTAL_AMOUNT_PAID_DOCTOR]} label={`report.admin.dropdown.group.${GroupType.TOTAL_AMOUNT_PAID_DOCTOR}`} onClick={handleClickGroup} value={GroupType.TOTAL_AMOUNT_PAID_DOCTOR}/>
            <GroupCheckButton isActive={search[GroupType.AMOUNT_PAID_DOCTOR_BORE]} label={`report.admin.dropdown.group.${GroupType.AMOUNT_PAID_DOCTOR_BORE}`} onClick={handleClickGroup} value={GroupType.AMOUNT_PAID_DOCTOR_BORE}/>
            <GroupCheckButton isActive={search[GroupType.EXTRAORDINARY_EXPENSE_AMOUNT]} label={`report.admin.dropdown.group.${GroupType.EXTRAORDINARY_EXPENSE_AMOUNT}`} onClick={handleClickGroup} value={GroupType.EXTRAORDINARY_EXPENSE_AMOUNT}/>
          </div>
        </div>
      </FilterModal>
    </div>
  );
};

export default FilterReportGroup;