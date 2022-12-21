import React, { useEffect, useRef, useState } from 'react';
// import SearchTextField from "../search-text-field/search-text-field";
import { useTranslation } from 'react-i18next';
import { Button, FormControl, Grow, InputLabel, makeStyles, Paper, Popper, Select } from '@material-ui/core';
import { ContractRequestContent } from '../../model/contract';
import '../../views/Contrato/contact-detail/contract-base.scss';
import '../main.scss';
import './index.scss';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export interface IFilterFields {
    name: string;
    field: string;
}

export interface IProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setRows: React.Dispatch<React.SetStateAction<any[]>>;
    handleTable: (content: any[] | undefined) => any[][];
    tableData: any[];
    filterFields: IFilterFields[];
}

const CustomMultiFieldFilter = (props: IProps) => {
    const { t, i18n } = useTranslation();
    const anchorRef = useRef(null);
    const classes = useStyles();
    const [filteredTableData, setFilteredTableData] = useState<ContractRequestContent[]>([]);
    const [filterOptions, setFilterOptions] = useState<any>({});
    const [state, setState] = useState<any>({});

    const getFilterFieldsOptions = (filterFields: IFilterFields[], tableData: any[]) => {
        let filterFieldsOptions = {};
        let tempArr: any;
        
        for (let i = 0; i < filterFields.length; i++){
            tempArr = [];
            let field = filterFields[i].field;

            if (field === "month") {
                tempArr = [
                    t("global.filter.month.textField.january"),
                    t("global.filter.month.textField.february"),
                    t("global.filter.month.textField.march"),
                    t("global.filter.month.textField.april"),
                    t("global.filter.month.textField.may"),
                    t("global.filter.month.textField.june"),
                    t("global.filter.month.textField.july"),
                    t("global.filter.month.textField.august"),
                    t("global.filter.month.textField.september"),
                    t("global.filter.month.textField.october"),
                    t("global.filter.month.textField.november"),
                    t("global.filter.month.textField.december")
                ]
                filterFieldsOptions[field] = Array.from(new Set(tempArr));
                continue;
            }
            if (field === "year") {
                let now = new Date();
                for (let j = 0; j < 10; j++) {
                    tempArr.push(now.getFullYear() - j);
                }
                filterFieldsOptions[field] = Array.from(new Set(tempArr));
                continue;
            }

            for (let j = 0; j < tableData.length; j++) {
                tempArr.push(tableData[j][field]);
            }
            filterFieldsOptions[field] = Array.from(new Set(tempArr));

        }
        setFilterOptions(filterFieldsOptions);   
    }

    // const handleTextFilter = (newFilter: any) => {
        // if (newFilter != null) {
        //   setFilter(newFilter);
        // }
    
        // @TODO Fazer requisição para 
        // return
    // };

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
          ...state,
          [name]: event.target.value,
        });
    };
    

    const handleApplyFilter = () => {
        let filteredList = props.tableData;

        if (state) {
            for (let [key, value] of Object.entries(state)) {

                if (key === 'year') {
                    filteredList = filteredList.filter((item) => item["date"].slice(-4) === value);
                    continue;
                }

                if (key === 'month') {
                    filteredList = filteredList.filter((item) => parseInt(item["date"].slice(3,-5)) == value);
                    continue;
                }

                filteredList = filteredList.filter((item) => item[key] === value);
            }
        }
    
        setFilteredTableData(filteredList);
        props.setOpen(false);
    }

    const handleCleanFilters = () => {
        setState({});
        setFilteredTableData([]);
        props.setOpen(false);
    }


    useEffect(() => {
        getFilterFieldsOptions(props.filterFields, props.tableData);

        let isStateEmpty = true;
        if (Object.keys(state).length !== 0) {
            isStateEmpty = false;
        }
    
        if (filteredTableData.length !== 0 || (filteredTableData.length === 0 && isStateEmpty === false)) {
            props.setRows(props.handleTable(filteredTableData));
        } else {
            props.setRows(props.handleTable(props.tableData));
        } 
    
    }, [filteredTableData, props.tableData])

   
    return(
        <div className="multi-field-filter__container" style={{ display: "flex", alignItems: "center" }}>
            
            {/* <div style={{ maxWidth: "222px" }}>
                <SearchTextField onChange={handleTextFilter} id={"search-field"} placeholder="Buscar por" />
            </div> */}

            <div className="base-selectfield" style={{ minWidth: "222px", maxWidth: "222px", marginLeft: "12px" }}>
                <Button ref={anchorRef} aria-controls={props.open ? "menu-list-grow" : undefined} aria-haspopup="true" onClick={() => props.setOpen(!props.open)}>
                    {t("global.filter.title")}
                    <div className="downarrow-icon" />
                </Button>
            
                <Popper className="paper-filter" open={props.open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow {...TransitionProps} style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}>
                            <Paper>
                                <div className="filter-body__container">
                                    <div className="filter-body__container-control">

                                        {props.filterFields.map((item) =>
                                            <div className="base-selectfield" style={{ minWidth: "222px", maxWidth: "222px" }}>
                                                <FormControl variant="filled" className={classes.formControl}>
                                                    {!state[item.field] && <InputLabel htmlFor="filled-age-native-simple">{item.name}</InputLabel>}
                                                    <Select native value={state[item.field]} onChange={handleChange} inputProps={{ name: item.field, }}>
                                                        <option aria-label="None" value="" />
                                                        {filterOptions[item.field].map((option, index) => <option value={item.field === "month" ? index + 1 : option}>{option}</option>)}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        )}

                                    </div>
                                    <hr style={{ margin: "20px 0 16px 0" }} />
                                    <div className="filter-body__container-buttons">
                                        <div onClick={handleCleanFilters}>{t("contractDetail.control.dropdown.buttons.clean")}</div>
                                        <div style={{ display: "flex" }}>
                                            <div style={{color:"#979797"}} onClick={() => props.setOpen(false)}>{t("contractDetail.control.dropdown.buttons.cancel")}</div>
                                            <div style={{ marginLeft: "18px" }} onClick={handleApplyFilter}>{t("contractDetail.control.dropdown.buttons.apply")}</div>
                                        </div>
                                    </div>
                                </div>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
       
        </div>
    )
}

export default CustomMultiFieldFilter;
