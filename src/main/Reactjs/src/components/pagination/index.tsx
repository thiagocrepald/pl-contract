import React, { HTMLProps, useEffect, useState } from 'react';
import CustomTextField from '../custom-text-field/custom-text-field';
import { SvgIcon } from '@material-ui/core';
import './styles.scss';

interface StyledPaginationProps extends HTMLProps<HTMLDivElement> {
    page?: {
        page?: number;
        totalPages?: number;
    };
    handleChangePage: (value: number) => void;
};

const Pagination: React.FC<StyledPaginationProps> = ({ page, handleChangePage, ...props }) => {
    const [inputValue, setInputValue] = useState<string>();

    useEffect(() => {
        if(page?.page === 0) {
            setInputValue('1');
        };
    }, [page]);

    function handleChange(value: number) {
        if(page?.page != null && page?.totalPages != null) {
            if (page.page + value <= 0){
                handleChangePage(0);
                setInputValue('1');
            } else if (page.page + value >= page.totalPages - 1) {
                handleChangePage(page.totalPages - 1);
                setInputValue(page.totalPages.toString());
            } else {
                handleChangePage(page.page + value);
                setInputValue((page.page + value + 1).toString());
            };
        };
    };

    const handleInputValue = () => {
        if (inputValue != null && page?.page != null && page?.totalPages != null) {
            let value = parseInt(inputValue) - 1;
            if (value <= 0){
                handleChangePage(0);
                setInputValue('1');
            } else if (value >= page.totalPages - 1) {
                handleChangePage(page.totalPages - 1);
                setInputValue(page.totalPages.toString());
            } else {
                handleChangePage(value);
            };
        };
    };
 
    return (
        <div className="pagination__items" {...props}>
            <div style={{ marginRight: '14px' }}>Página</div>
            <div className="pagination__items--page-edit">
                <CustomTextField
                    id={"pagination-input"}
                    style={{width: "46px", height: "26px", border: "none"}}
                    isOnlyNumbers={true}
                    value={inputValue ?? '1'}
                    onChange={(value)=>setInputValue(value)}
                    onEnterPress={handleInputValue}
                />
            </div>
            <div style={{ marginRight: '16px', marginLeft: '12px' }}>
                {'de '}
                {page?.totalPages}
            </div>
            <div className="pagination__items--previous-btn">
                <div onClick={inputValue !== '1' ? (() => handleChange(-1)) : (()=>{})}>
                    <SvgIcon viewBox="0 0 24 24" aria-hidden="true" style={{color: "#a7d6ca", transform: "rotate(180deg)", stroke: "white"}}>
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                    </SvgIcon>
                </div>
            </div>
            <div className="pagination__items--next-btn">
                <div onClick={inputValue !== page?.totalPages?.toString() ? (() => handleChange(+1)) : (()=>{})}>
                    <SvgIcon viewBox="0 0 24 24" aria-hidden="true" style={{color: "#a7d6ca", stroke: "white"}}>
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                    </SvgIcon>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
