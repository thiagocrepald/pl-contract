import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import { Doctor } from '../../model/doctor';
import DoctorService from '../../services/doctor-service';
import './autocomplete-doctor-search.scss';

export interface AutocompleteProps {
    id?: string;
    label?: string;
    error?: boolean;
    helperText?: string;
    className?: string;
    params?: object;
    isSelfCleanInput?: boolean;
    defaultDoctor?: Doctor;
    onBlur?: () => void;
    onChange?: (event: ChangeEvent<{}>, doctor: any) => void;
}

const AutocompleteDoctorSearch = ({
    id,
    label,
    error,
    helperText,
    defaultDoctor,
    className,
    isSelfCleanInput,
    onChange,
    onBlur
}: AutocompleteProps): JSX.Element => {
    const [searchDoctor, setSearchDoctor] = useState<string>('');
    const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);

    useEffect(() => {
        if (searchDoctor !== '') {
            getDoctors();
        }
    }, [searchDoctor]);

    const getDoctors = async () => {
        const predicate = {
            search: searchDoctor
        };

        await DoctorService.getAllDoctorsNew(predicate)
            .then(result => setDoctorsList(result.content));
    };

    const handleInput = ({ params }): ReactNode => {
        return <TextField
            {...params}
            error={error}
            value={searchDoctor}
            label={label}
            helperText={helperText}
            onBlur={onBlur}
            variant="filled" />
    };

    const onChangeSelfCleanInput = (e: React.ChangeEvent<{}>, doctor: string | Doctor | null) => {
        if (onChange != null) {
            onChange(e, doctor);
            setTimeout(() => setSearchDoctor(''), 100);
        }
    };

    return (
        <Autocomplete
            id={id}
            freeSolo
            clearText=''
            onChange={
                isSelfCleanInput ? onChangeSelfCleanInput : onChange
            }
            options={doctorsList ?? []}
            value={(defaultDoctor ?? defaultDoctor) ?? null}
            renderInput={params => handleInput({ params })}
            className={className ?? "floating-label-custom-autocomplete"}
            getOptionLabel={option => `${option.name} - ${option.crmNumber}`}
            inputValue={searchDoctor ?? ""}
            onInputChange={(event, inputValue) => setSearchDoctor(inputValue)}
        />
    );
};

export default AutocompleteDoctorSearch;
