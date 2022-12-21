import React, { useState } from 'react';
import FilterModal from '../filter-modal';
import './filter-status.scss';
import StatusCheckButton from '../status-check-button';
import { useTranslation } from 'react-i18next/';
import { Tag } from '../../model/enums/contract-request';

interface FilterStatusProps {
  filter: any;
  anchorEl: any;
  showModal: boolean;
  onCloseModal: () => void;
  onFilter: (event: any) => void;
}

const FilterStatus = (props: FilterStatusProps) => {
  const [t] = useTranslation();
  const [search, setSearch] = useState<{ [key: string]: boolean }>({});

  const handleApplyFilter = () => {
    props.onCloseModal();
    props.onFilter({
      ...props.filter,
      status: search
    });
  };

  const handleCancel = () => {
    props.onCloseModal();
    setSearch(props.filter.status ?? {});
  };

  const handleResetFilters = () => {
    setSearch({});
    props.onCloseModal();
    props.onFilter({
      ...props.filter,
      status: null
    });
  };

  const handleClickStatus = (statusType) => {
    if (statusType === Tag.ADJUSTED_DOCTOR) {
      setSearch({...search, [Tag.ADJUSTED_DOCTOR]: !search[Tag.ADJUSTED_DOCTOR], [Tag.CONTESTED]: !search[Tag.CONTESTED]});
      return;
    };
    if (statusType === Tag.ADJUSTED_ADMIN) {
      setSearch({...search, [Tag.ADJUSTED_ADMIN]: !search[Tag.ADJUSTED_ADMIN], [Tag.CORRECTION]: !search[Tag.CORRECTION]});
      return;
    };
    setSearch({
      ...search,
      [statusType]: !search[statusType]
    });
  };

  return (
      <FilterModal
          onCancel={handleCancel}
          anchor={props.anchorEl}
          showModal={props.showModal}
          onApplyFilter={handleApplyFilter}
          onResetFilters={handleResetFilters}
      >
        <div className="filter-body--title">{t("contractDetail.control.dropdown.filter.status")}</div>
        <div className="checkbox-button__container">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "260px", marginBottom:'11px'  }}>
            <StatusCheckButton isActive={search.OK} tagColor={Tag.OK} onClick={handleClickStatus} />
            <StatusCheckButton isActive={search.ADJUSTED} tagColor={Tag.ADJUSTED} onClick={handleClickStatus} />
            <StatusCheckButton isActive={search.ATTENDANCE} tagColor={Tag.ATTENDANCE} onClick={handleClickStatus} />
            <StatusCheckButton isActive={search.PROGRAMMED} tagColor={Tag.PROGRAMMED} onClick={handleClickStatus} />
            <StatusCheckButton isActive={search.PENDING} tagColor={Tag.PENDING} onClick={handleClickStatus} />
            <StatusCheckButton isActive={search.ADJUSTED_ADMIN} tagColor={Tag.ADJUSTED_ADMIN} onClick={handleClickStatus} />
            <StatusCheckButton isActive={search.ADJUSTED_DOCTOR} tagColor={Tag.ADJUSTED_DOCTOR} onClick={handleClickStatus} />
            <StatusCheckButton isActive={search.NOT_REGISTERED} tagColor={Tag.NOT_REGISTERED} onClick={handleClickStatus} />
            <StatusCheckButton isActive={search.REJECTED} tagColor={Tag.REJECTED} onClick={handleClickStatus} />
            <StatusCheckButton isActive={search.CANCELED} tagColor={Tag.CANCELED} onClick={handleClickStatus} />
          </div>
        </div>
      </FilterModal>
  );
};

export default FilterStatus;
