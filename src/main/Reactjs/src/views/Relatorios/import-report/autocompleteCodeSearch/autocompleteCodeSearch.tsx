import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import { Contract } from '../../../../model/contract';
import ImportationService from '../../../../services/importation-service';
import './autocomplete-code-search.scss';
import { isEmpty } from 'lodash';

export interface AutocompleteProps {
    onChange?: (event: ChangeEvent<{}>, doctor: any) => void;
}

const AutocompleteCodeSearch = ({ onChange }: AutocompleteProps): JSX.Element => {
    const [searchCode, setSearchCode] = useState<string>('');
    const [contracts, setContracts] = useState<Contract[]>([]);

    useEffect(() => {
        if (!isEmpty(searchCode)) {
            getResultsCenter();
        }
    }, [searchCode]);

    const getResultsCenter = async () => {
        await ImportationService.getResultsCenter(searchCode).then(result => setContracts(result.content));
    };

    const handleInput = ({ params }): ReactNode => {
        return <TextField {...params} value={searchCode} variant="filled" />;
    };

    return (
        <Autocomplete
            id="search-code"
            freeSolo
            clearText=""
            onChange={onChange}
            options={contracts ?? []}
            renderInput={params => handleInput({ params })}
            className={"floating-label-custom-autocomplete-code"}
            getOptionLabel={option => `${option.resultsCenter}`}
            inputValue={searchCode ?? ""}
            onInputChange={(event, inputValue) => setSearchCode(inputValue)}
        />
    );
};

export default AutocompleteCodeSearch;
