import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import moment from 'moment';
import FilterModal from '../filter-modal';
import { Autocomplete } from '@material-ui/lab';
import { TextField, Container, Checkbox, Tooltip } from '@material-ui/core';
import ImgChecked from '../../assets/img/svg/blue-checkbox2.svg';
import ImgEmptyChecked from '../../assets/img/svg/empty-checkbox.svg';
import { DropdownType } from '../../model/enums/admin-report';
import { IAdminReport } from '../../model/admin-report';
import { Doctor } from '../../model/doctor';
import { Contract } from '../../model/contract';
import { OnCall } from '../../model/on-call';
import { Schedule } from '../../model/schedule';
import { Pageable } from '../../model/pageable';
import { ComparisonOperator, LogicalOperator, PredicateOperators } from '../../model/predicate-operators';
import AdminReportService from '../../services/admin-report.service';
import ScheduleService from '../../services/schedule.service';
import DoctorService from '../../services/doctor-service';
import ContractService from '../../services/contract-service';
import OnCallService from '../../services/on-call.service';
import { APP_LOCAL_DATE_FORMAT, APP_TIME_FORMAT } from '../../config/constants';
import './styles.scss';

interface IProps {
    type: DropdownType;
    anchorEl: any;
    showModal: boolean;
    onCloseModal: () => void;
    hiddenData: any;
    setHiddenData: React.Dispatch<React.SetStateAction<any>>;
    pageRef: React.MutableRefObject<null>;
};

const FilterReportData = ({type, anchorEl, showModal, onCloseModal, hiddenData, setHiddenData, pageRef}: IProps) => {
    const [t] = useTranslation();
    const pageDefault = {
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0,
        sort: ''
    };
    const [page, setPage] = useState<any>({
        [DropdownType.DOCTOR]: {...pageDefault, sort: 'name,asc'},
        [DropdownType.ON_CALL]: {...pageDefault, sort: ''},
        [DropdownType.SCHEDULE]: {...pageDefault, sort: 'scheduleName,asc'},
        [DropdownType.CONTRACT]: {...pageDefault, sort: 'id,desc'}
    });

    const [predicate, setPredicate] = useState<any>({search: ''});
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [onCalls, setOnCalls] = useState<OnCall[]>([]);
    
    const fixedBoxHeight = 122;
    const fixedBoxGapHeight = 330;
    const maxCharacters = 40;
    const [triggerHeight, setTriggerHeight] = useState<number>(fixedBoxHeight);
    const [options, setOptions] = useState<any[]>([]);
    const [shouldReplaceOptions, setShouldReplaceOptions] = useState<boolean>(false);
    const [count, setCount] = useState<number>(1);
    
    const [inputValue, setInputValue] = useState<string>('');
    const [searchPage, setSearchPage] = useState<Pageable>({...pageDefault, sort: ''});
    const [shouldSearch, setShouldSearch] = useState<boolean>(false);
    const [shoudSearchMore, setShouldSearchMore] = useState<boolean>(false);
    const [searchTriggerHeight, setSearchTriggerHeight] = useState<number>(fixedBoxHeight);
    const [searchCount, setSearchCount] = useState<number>(1);
    const [searchCode, setSearchCode] = useState<string>('');
    const [operators, setOperators] = useState<(ComparisonOperator | LogicalOperator)[]>([]);
    const inputRef = useRef('');

    useEffect(() => {
        if (isEmpty(doctors) && type === DropdownType.DOCTOR) {
            getDoctors();
        };
        if (isEmpty(contracts) && type === DropdownType.CONTRACT) {
            getContracts();
        };
        if (isEmpty(schedules) && type === DropdownType.SCHEDULE) {
            getSchedules();
            setSearchCode('scheduleName');
            setOperators([ComparisonOperator.CI, ComparisonOperator.CONTAINS]);
        };
        if (isEmpty(onCalls) && type === DropdownType.ON_CALL) {
            getOnCalls();
        };
        setShouldReplaceOptions(true);
    }, []);

    useEffect(() => {
        setInputValue('');
        replaceInitialOptions();
    }, [showModal]);

    useEffect(() => {
        if (!isEmpty(doctors)) {
            getDoctors();
        };
    }, [page[DropdownType.DOCTOR]]);

    useEffect(() => {
        if (!isEmpty(onCalls)) {
            getOnCalls();
        };
    }, [page[DropdownType.ON_CALL]]);

    useEffect(() => {
        if (!isEmpty(schedules)) {
            getSchedules();
        };
    }, [page[DropdownType.SCHEDULE]]);

    useEffect(() => {
        if (!isEmpty(contracts)) {
            getContracts();
        };
    }, [page[DropdownType.CONTRACT]]);

    useEffect(() => {
        if (shouldReplaceOptions) {
            replaceInitialOptions();
            setShouldReplaceOptions(false);
        };
    }, [doctors, contracts, schedules, onCalls]);

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
                if (isEmpty(inputValue) && options !== doctors && options !== onCalls && options !== schedules && options !== contracts) {
                    // set options after clear input field
                    // time to handle gap between clear and get new options (else, it will replace options of first letter)
                    replaceInitialOptions();
                };
            };
        }, 200);
    }, [inputValue]);

    const handleOnSearch = () => {
        if (type === DropdownType.DOCTOR) {getDoctors(true)};
        if (type === DropdownType.ON_CALL) {getOnCalls(true)};
        if (type === DropdownType.SCHEDULE) {getSchedules(true)};
        if (type === DropdownType.CONTRACT) {getContracts(true)};
    };

    const replaceInitialOptions = () => {
        if (type === DropdownType.DOCTOR) {setOptions(doctors)};
        if (type === DropdownType.ON_CALL) {setOptions(onCalls)};
        if (type === DropdownType.SCHEDULE) {setOptions(schedules)};
        if (type === DropdownType.CONTRACT) {setOptions(contracts)};
    };

    const getDoctors = (isSearch?: boolean) => {
        if (isSearch === true) {
            DoctorService.getPartialDoctors(predicate, searchPage)
                .then((result) => {
                    setOptions([...options, ...result.content]);
                });
        } else {
            DoctorService.getPartialDoctors(predicate, page[DropdownType.DOCTOR])
                .then((result) => {
                    setDoctors([...doctors, ...result.content]);
                    setOptions([...options, ...result.content]);
                });
        };
    };

    const getOnCalls = (isSearch?: boolean) => {
        if (isSearch === true) {
            OnCallService.getSearchedOnCalls(predicate, searchPage)
                .then((result) => {
                    setOptions([...options, ...result.content]);
                });
        } else {
            OnCallService.getAllOnCalls(predicate, page[DropdownType.ON_CALL])
                .then((result) => {
                    setOnCalls([...onCalls, ...result.content]);
                    setOptions([...options, ...result.content]);
                });
        };
    };

    const getSchedules = (isSearch?: boolean) => {
        if (isSearch === true) {
            const predicate = ({search: ''});
            const predicateOperators: PredicateOperators[] = [{
                [searchCode]: {
                    value: inputValue,
                    operators: operators
                }
            }];

            ScheduleService.getAllSchedules(predicate, searchPage, predicateOperators)
                .then((result) => {
                    setOptions([...options, ...result.content]);
                });
        } else {
            ScheduleService.getAllSchedules(predicate, page[DropdownType.SCHEDULE])
                .then((result) => {
                    setSchedules([...schedules, ...result.content]);
                    setOptions([...options, ...result.content]);
                });
        };
    };

    const getContracts = (isSearch?: boolean) => {
        if (isSearch === true) {
            const predicate = ({searchCombobox: inputValue});
            ContractService.getAllContracts(page[DropdownType.CONTRACT], predicate)
                .then((result) => {
                    setOptions([...options, ...result.content]);
                });
        } else {
            ContractService.getAllContracts(page[DropdownType.CONTRACT], predicate)
                .then((result) => {
                    setContracts([...contracts, ...result.content]);
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

            setPage({...page, [type]: {...page[type], page: count}});
            pageRef.current = {...currentPage, [type]: {...page[type], page: count}};
            setCount(count + 1);
        };
    };

    const getSearchedData = () => {
        setPredicate({search: inputValue});
        setSearchPage({...pageDefault, sort: (type === DropdownType.DOCTOR ? 'name,asc' : (type === DropdownType.CONTRACT ? 'id,desc' : (type === DropdownType.SCHEDULE ? 'scheduleName,asc' : '')))}); 
        setSearchTriggerHeight(fixedBoxHeight);
        setSearchCount(1);

        setOptions([]);
        setShouldSearch(true);
    };

    const handleOnUndo = () => {
        if (type === DropdownType.DOCTOR) {setHiddenData({...hiddenData, ['doctorsId']: doctors.map((doctor) => doctor.id)})};
        if (type === DropdownType.ON_CALL) {setHiddenData({...hiddenData, ['onCallsId']: onCalls.map((onCall) => onCall.id)})};
        if (type === DropdownType.SCHEDULE) {setHiddenData({...hiddenData, ['schedulesId']: schedules.map((schedule) => schedule.id)})};
        if (type === DropdownType.CONTRACT) {setHiddenData({...hiddenData, ['contractsId']: contracts.map((contract) => contract.id)})};
    };

    const handleSelectAll = () => {
        if (type === DropdownType.DOCTOR) {setHiddenData({...hiddenData, ['doctorsId']: []})};
        if (type === DropdownType.ON_CALL) {setHiddenData({...hiddenData, ['onCallsId']: []})};
        if (type === DropdownType.SCHEDULE) {setHiddenData({...hiddenData, ['schedulesId']: []})};
        if (type === DropdownType.CONTRACT) {setHiddenData({...hiddenData, ['contractsId']: []})};
    };

    const handleInput = ({ params }): ReactNode => {
        let label = '';
        if (type === DropdownType.DOCTOR) {label = t('report.admin.dropdown.label.doctor')};
        if (type === DropdownType.ON_CALL) {label = t('report.admin.dropdown.label.onCall')};
        if (type === DropdownType.SCHEDULE) {label = t('report.admin.dropdown.label.schedule')};
        if (type === DropdownType.CONTRACT) {label = t('report.admin.dropdown.label.contract')};

        return <TextField {...params} label={label} variant="filled" multiline={false}/>;
    };

    const handleOnClickOption = (option, selected) => {
        let label = '';
        if (type === DropdownType.DOCTOR) {label = 'doctorsId'};
        if (type === DropdownType.ON_CALL) {label = 'onCallsId'};
        if (type === DropdownType.SCHEDULE) {label = 'schedulesId'};
        if (type === DropdownType.CONTRACT) {label = 'contractsId'};

        let newIds = [...hiddenData[label]];

        if (!newIds.includes(option.id)) {
            newIds.push(option.id);
        } 
        else {
            newIds = newIds.filter((id) => id !== option.id);
        }
    
        setHiddenData({...hiddenData, [label]: newIds});
    };

    const handleOption = (option, selected): ReactNode => {
        let isSelected = true;

        if (type === DropdownType.DOCTOR) {
            if (hiddenData.doctorsId.includes(option.id)) {
                isSelected = false;
            };
        };
        if (type === DropdownType.ON_CALL) {
            if (hiddenData.onCallsId.includes(option.id)) {
                isSelected = false;
            };
        };
        if (type === DropdownType.SCHEDULE) {
            if (hiddenData.schedulesId.includes(option.id)) {
                isSelected = false;
            };
        };
        if (type === DropdownType.CONTRACT) {
            if (hiddenData.contractsId.includes(option.id)) {
                isSelected = false;
            };
        };

        return (
            <div style={{ width: '100%' }} onClick={() => handleOnClickOption(option, selected)}>
                <Checkbox
                    // key={forceRender}
                    icon={<img src={ImgEmptyChecked}/>}
                    checkedIcon={<img src={ImgChecked}/>}
                    style={{ marginRight: 0, paddingRight: 0 }}
                    // checked={selected}
                    checked={isSelected}
                />
                {type === DropdownType.DOCTOR && `${option.name ?? ''} ${option.crmNumber ?? ''}`}
                {type === DropdownType.ON_CALL && (
                    <Tooltip title={`${option.date ? moment(option.date).format(APP_LOCAL_DATE_FORMAT) : ''} ${option.startTime ? moment.utc(option.startTime).format(APP_TIME_FORMAT) : ''} ${option.day ?? ''} ${option.shift ?? ''}`} placement="top">
                        <span>{(`${option.date ? moment(option.date).format(APP_LOCAL_DATE_FORMAT) : ''} ${option.startTime ? moment.utc(option.startTime).format(APP_TIME_FORMAT) : ''} ${option.day ?? ''} ${option.shift ?? ''}`).slice(0, maxCharacters) + ((`${option.date ? moment(option.date).format(APP_LOCAL_DATE_FORMAT) : ''} ${option.startTime ? moment.utc(option.startTime).format(APP_TIME_FORMAT) : ''} ${option.day ?? ''} ${option.shift ?? ''}`).length > maxCharacters ? '...' : '')}</span>
                    </Tooltip>
                )}
                {type === DropdownType.SCHEDULE && (
                    <Tooltip title={`${option.scheduleName ?? ''}`} placement="top">
                        <span>{(`${option.scheduleName ?? ''}`).slice(0, maxCharacters) + ((`${option.scheduleName ?? ''}`).length > maxCharacters ? '...' : '')}</span>
                    </Tooltip>
                )}
                {type === DropdownType.CONTRACT && (
                    <Tooltip title={`${option.resultsCenter ?? ''} ${option.contractNumber ?? ''} ${option.contractingParty?.name ?? ''}`} placement="top">
                        <span>{(`${option.resultsCenter ?? ''} ${option.contractNumber ?? ''} ${option.contractingParty?.name ?? ''}`).slice(0, maxCharacters) + ((`${option.resultsCenter ?? ''} ${option.contractNumber ?? ''} ${option.contractingParty?.name ?? ''}`).length > maxCharacters ? '...' : '')}</span>
                    </Tooltip>
                )}
            </div>
        );
    };

    const handleOptionLabel = (option: any) => {
        if (type === DropdownType.CONTRACT) {return `${option.resultsCenter} ${option.contractNumber} ${option.contractingParty?.name ?? ''}`};
        if (type === DropdownType.ON_CALL) {return `${option.date ? moment(option.date).format(APP_LOCAL_DATE_FORMAT) : ''} ${option.startTime ? moment.utc(option.startTime).format(APP_TIME_FORMAT) : ''} ${option.day} ${option.shift}`};
        if (type === DropdownType.SCHEDULE) {return `${option.scheduleName ?? ''}`};
        if (type === DropdownType.DOCTOR) {
            if (option.name && option.crmNumber) {
                return `${option.name} ${option.crmNumber}`;
            } else {
                return option.name;
            }
        };
    };
    
    const handleInputChange = (event: any, value: string) => {
        inputRef.current = value;
        setInputValue(value);
    };

    const fixedPopper = (props) => {
        return <Container {...props} className='filter-report-data__options-wrapper' />;
    };

    return (
        <div className={type === DropdownType.DOCTOR ? 'filter-report-data__container--doctor' : (type === DropdownType.ON_CALL ? 'filter-report-data__container--on-call' : (type === DropdownType.SCHEDULE ? 'filter-report-data__container--schedule' : (type === DropdownType.CONTRACT ? 'filter-report-data__container--contract' : '')))}>
            <FilterModal
                onCancel={onCloseModal}
                anchor={anchorEl}
                showModal={showModal}
                onApplyFilter={() => { /* Empty */ }}
                onResetFilters={() => { /* Empty */ }}
            >
                <div className="checkbox-button__container">
                    <div className="checkbox-button__container--buttons">
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
                        <div className="filter-body__container-buttons-undo" style={{ display: "flex" }}>
                            <div onClick={handleOnUndo}>{t('contractDetail.control.dropdown.title.clean')}</div>
                            <div onClick={handleSelectAll} className="filter-body__container-button-select-all">
                                {t('contractDetail.control.dropdown.title.selectAll')}
                            </div>
                        </div>
                    </div>
                </div>
            </FilterModal>
        </div>
    );
};

export default FilterReportData;
