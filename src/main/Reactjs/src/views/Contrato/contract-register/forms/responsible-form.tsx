import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import '../../../../components/main.scss';
import { Contract } from '../../../../model/contract';
import { User } from '../../../../model/user';
import ContractService from '../../../../services/contract-service';
import '../contract-register.scss';

interface Props {
    classes: any;
    contract: Contract;
    setContract: (contract: Contract) => void;
}

export const ResponsibleForm = (props: Props) => {
    const { setContract, contract, classes } = props;
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([{}]);
    const i18nDefaultPath = 'contractRegister.body.responsibleControl';

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        ContractService.getUsers().then((result) => setUsers(result));
    };

    return (
        <>
            <div className='contract-register__container--body-title'>{t(`${i18nDefaultPath}.textField.responsibleAccess`)}</div>
            <Row>
                <Col>
                    <FormControl variant='filled' className={classes.formControl}>
                        <InputLabel htmlFor='filled-age-native-simple'>{t(`${i18nDefaultPath}.textField.responsibleAccess`)}</InputLabel>
                        <Select
                            value={contract?.responsibleAccessUser?.id ?? 0}
                            onChange={(e) => setContract({ ...contract, responsibleAccessUser: { id: Number(e.target.value) } })}>
                            {users?.map((user) => (
                                <MenuItem value={user?.id}>{user?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Col>
                <Col>
                    <FormControl variant='filled' className={classes.formControl}>
                        <InputLabel htmlFor='filled-age-native-simple'>{t(`${i18nDefaultPath}.textField.responsibleClose`)}</InputLabel>
                        <Select
                            value={contract?.closingOfficerUser?.id ?? 0}
                            onChange={(e) => setContract({ ...contract, closingOfficerUser: { id: Number(e.target.value) } })}>
                            {users?.map((user) => (
                                <MenuItem value={user?.id}>{user?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Col>
            </Row>

        </>
    );
};