import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import FilterModal from '../filter-modal';
import { Autocomplete } from '@material-ui/lab';
import { TextField, Container, Checkbox, Tooltip } from '@material-ui/core';
// import { IAdminReport } from '../../model/admin-report';
import { Contract } from '../../model/contract';
import { Pageable } from '../../model/pageable';
// import AdminReportService from '../../services/admin-report.service';
import ContractService from '../../services/contract-service';
import './styles.scss';

interface IProps {
    anchorEl: any;
    showModal: boolean;
    onCloseModal: () => void;
    pageRef: React.MutableRefObject<null>;
    selectedOption: any;
    setSelectedOption: React.Dispatch<any>;
};

const SelectInfinity = ({anchorEl, showModal, onCloseModal, pageRef, selectedOption, setSelectedOption}: IProps) => {
    const [t] = useTranslation();
    // const [search, setSearch] = useState<{ [key: string]: boolean }>({});

    const pageDefault = {
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0,
        sort: ''
      };
    const [page, setPage] = useState<any>({...pageDefault, sort: 'id,desc'});

    const [predicate, setPredicate] = useState<any>({search: ''});
    const [reports, setReports] = useState<Contract[]>([]);

    // const [forceRender, setForceRender] = useState<string>(moment().toISOString());
    const [options, setOptions] = useState<any[]>([]);

    const fixedBoxHeight = 122;
    const fixedBoxGapHeight = 330;
    const [triggerHeight, setTriggerHeight] = useState<number>(fixedBoxHeight);
    const [count, setCount] = useState<number>(1);
    const maxCharacters = 40;
    
    const [shouldReplaceOptions, setShouldReplaceOptions] = useState<boolean>(false);
    
    const [inputValue, setInputValue] = useState<string>('');
    const [searchPage, setSearchPage] = useState<Pageable>({...pageDefault, sort: ''});
    const [shouldSearch, setShouldSearch] = useState<boolean>(false);
    const [shoudSearchMore, setShouldSearchMore] = useState<boolean>(false);
    const [searchTriggerHeight, setSearchTriggerHeight] = useState<number>(fixedBoxHeight);
    const [searchCount, setSearchCount] = useState<number>(1);
    const inputRef = useRef('');

    useEffect(() => {
        if (isEmpty(reports)) {
            getReportsList();
        };
        setShouldReplaceOptions(true);
    }, []);

    useEffect(() => {
        setInputValue('');
        replaceInitialOptions();
    }, [showModal]);

    useEffect(() => {
        if (!isEmpty(reports)) {
            getReportsList();
        };
    }, [page]);

    useEffect(() => {
        if (shouldReplaceOptions) {
            replaceInitialOptions();
            setShouldReplaceOptions(false);
        };
    }, [reports]);

    useEffect(() => {
        if(shoudSearchMore && inputValue) {
            handleOnSearch();
            setShouldSearchMore(false);
        };
        if (shouldSearch) {
            handleOnSearch();
            setShouldSearch(false);
        };
    }, [shoudSearchMore, shouldSearch]);

    useEffect(() => {
        setTimeout(() => {
            if (inputValue === inputRef.current) {
                if (!isEmpty(inputValue)) {
                    // set up for next search
                    getSearchedData();
                };
                if (isEmpty(inputValue) && options !== reports) {
                    // set options after clear input field
                    // time to handle gap between clear and get new options (else, it will replace options of first letter)
                    replaceInitialOptions();
                };
            };
        }, 200);
    }, [inputValue]);

    const handleOnSearch = () => {
        getReportsList(true);
    };

    const replaceInitialOptions = () => {
        setOptions(reports);
    };

    const getReportsList = (isSearch?: boolean) => {
        // using contract data as mock
        // must change to AdminReportService
        if (isSearch === true) {
            const predicate = ({searchCombobox: inputValue});
            ContractService.getAllContracts(page, predicate)
                .then((result) => {
                    setOptions([...options, ...result.content]);
                });
        } else {
            ContractService.getAllContracts(page, predicate)
                .then((result) => {
                    setReports([...reports, ...result.content]);
                    setOptions([...options, ...result.content]);
                });
        };
    };

    const loadMore = async (event) => {
        // console.log('height', event.target.scrollTop);
        // console.log('triggerHeight', triggerHeight);
        // console.log('searchTriggerHeight', searchTriggerHeight);

        if (!isEmpty(inputValue) && event.target.scrollTop >= searchTriggerHeight) {
            setSearchPage({...searchPage, page: searchCount })
            setSearchTriggerHeight(fixedBoxHeight + searchCount * fixedBoxGapHeight);
            setSearchCount(searchCount + 1);
            setShouldSearchMore(true);
        };
        
        if (isEmpty(inputValue) && event.target.scrollTop >= triggerHeight) {
            setTriggerHeight(fixedBoxHeight + count * fixedBoxGapHeight);
            setPredicate({search: inputValue});
            const currentPage = pageRef.current ?? page;

            setPage({...page, page: count});
            pageRef.current = {...currentPage, page: count};
            setCount(count + 1);
        };
    };

    const getSearchedData = () => {
        setPredicate({search: inputValue});
        setSearchPage({...pageDefault, sort: 'id,desc'}); 
        setSearchTriggerHeight(fixedBoxHeight);
        setSearchCount(1);

        setOptions([]);
        setShouldSearch(true);
    };

    const handleInput = ({ params }): ReactNode => {
        return <TextField {...params} label={t('report.admin.dropdown.label.reportName')} variant="filled" multiline={false}/>;
    };

    const handleOnClickOption = (option, selected) => {
        if (selectedOption && selectedOption.id === option.id) {
            // uncheck option
            setSelectedOption({});
        } else {
            setSelectedOption(option);
        };
        onCloseModal();
    };

    const handleOption = (option, selected): ReactNode => {
        let isSelected = false;
        if (selectedOption && selectedOption.id === option.id) {
            isSelected = true;
        };

        return (
            <div className={isSelected ? 'checkbox-button__container--buttons-selected' : 'checkbox-button__container--buttons-unselected'} onClick={() => handleOnClickOption(option, selected)}>
                <Checkbox
                    style={{ marginRight: 0, paddingRight: 0 }}
                    checked={isSelected}
                />
                <Tooltip title={`${option.resultsCenter ?? ''} ${option.contractNumber ?? ''} ${option.contractingParty?.name ?? ''}`} placement="top">
                    <span>{(`${option.resultsCenter ?? ''} ${option.contractNumber ?? ''} ${option.contractingParty?.name ?? ''}`).slice(0, maxCharacters) + ((`${option.resultsCenter ?? ''} ${option.contractNumber ?? ''} ${option.contractingParty?.name ?? ''}`).length > maxCharacters ? '...' : '')}</span>
                </Tooltip>
            </div>
        );
    };

    const handleOptionLabel = (option: any) => {
        return `${option.resultsCenter} ${option.contractNumber} ${option.contractingParty?.name ?? ''}`;
    };
    
    const handleInputChange = (event: any, value: string) => {
        inputRef.current = value;
        setInputValue(value);
    };

    const fixedPopper = (props) => {
        return <Container {...props} className='filter-report-data__options-wrapper' />;
    };

    return (
        <div className='select-infinity__container'>
            <FilterModal
                onCancel={onCloseModal}
                anchor={anchorEl}
                showModal={showModal}
                onApplyFilter={() => {}}
                onResetFilters={() => {}}
            >
                <div className="checkbox-button__container">
                    <div className="checkbox-button__container--buttons" >
                        <Autocomplete
                            className={'floating-label-custom-autocomplete'}
                            freeSolo
                            clearText="Limpar"
                            options={options}
                            disablePortal={true}
                            getOptionLabel={option => handleOptionLabel(option)}
                            renderInput={params => handleInput({ params })}
                            renderOption={(option, {selected}) => handleOption(option, !selected)}
                            PopperComponent={fixedPopper}
                            multiple={true}
                            open={true}
                            onInputChange={(event, value) => handleInputChange(event, value)}
                            ListboxProps={{onScroll: loadMore, style: {height: `${fixedBoxHeight}px`}}}
                        />
                    </div>
                </div>
            </FilterModal>
        </div>
    );
};

export default SelectInfinity;