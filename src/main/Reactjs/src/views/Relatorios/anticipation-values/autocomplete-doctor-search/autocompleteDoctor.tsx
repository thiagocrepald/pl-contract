import React, { ChangeEvent, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Importation } from "../../../../model/importation-type";
import "./autocomplete-doctor.scss";

export interface AutocompleteProps {
    error?: boolean;
    helperText?: string;
    doctorsList: Importation[];
    defaultDoctor?: Importation | null;
    keyToClearInput: number;
    onBlur?: () => void;
    onChange?: (event: ChangeEvent<{}>, value: any) => void;
    onInputChange?: (event: React.ChangeEvent<{}>, value: string) => void;
}

const AutocompleteDoctor = ({
    error,
    helperText,
    doctorsList,
    defaultDoctor,
    keyToClearInput,
    onChange,
    onInputChange,
    onBlur
}: AutocompleteProps): JSX.Element => {
    const { t } = useTranslation();
    const handleInput = ({ params }): ReactNode => {
        return <TextField {...params} error={error} label={t('report.import.textField.search')} helperText={helperText} onBlur={onBlur} variant="filled" />;
    };

    return (
        <Autocomplete
            key={keyToClearInput}
            id="anticipation-values-search-doctor"
            value={defaultDoctor ?? null}
            freeSolo
            clearText=""
            options={doctorsList}
            getOptionLabel={option => `${option?.importationKey?.doctor?.name} - ${option?.importationKey?.doctor?.crmNumber}`}
            renderInput={params => handleInput({ params })}
            onChange={onChange}
            onInputChange={onInputChange}
        />
    );
};

export default AutocompleteDoctor;
