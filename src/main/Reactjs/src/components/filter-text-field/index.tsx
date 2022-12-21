import { FormControl, InputLabel, makeStyles } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next/';
import CustomTextField from '../custom-text-field/custom-text-field';
import './filter-text-field.scss';

interface Props {
    fieldName?: string;
    onChange: (value: string) => void;
    value: string;
    id: string;
}

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const FilterTextField = ({ fieldName, onChange, value, id }: Props) => {
    const [t] = useTranslation();
    const classes = useStyles();

    return (
        <div className="base-selectfield" >
            <FormControl variant="filled" className={classes.formControl}>
                {fieldName && !value && <InputLabel htmlFor="filled-age-native-simple">{t(`contractDetail.control.dropdown.${fieldName}`)}</InputLabel>}
                <CustomTextField
                    id={id}
                    value={value}
                    onChange={onChange}
                    className="custom-text-field-reference"
                />
            </FormControl>
        </div>
    );
};

export default FilterTextField;
