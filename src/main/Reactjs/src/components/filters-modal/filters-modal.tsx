import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { APP_LOCAL_DATE_FORMAT } from '../../config/constants';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { INotifications } from '../../model/notifications';
import NotificationService from '../../services/notification.service';
import './filters-modal.scss';
import { ClipLoader } from 'react-spinners';
import RightImg from '../../assets/img/svg/arrow-right.svg';
import { Button, ButtonGroup, FormControl, Input, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
const FiltersModal = props => {
    const { t } = useTranslation();
    const history = useHistory();

    return (
        <>
            <div className="notification__container">
                <div className="notification__container--items">
                    <div className="triangle-img" />
                    <div className="notification__container--items-title">{'Filtrar por'}</div>
                </div>
                <div className="notification__container--items-body">
                    <div style={{ margin: '10px' }}>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-age-native-simple">Ativo</InputLabel>
                            <Select native value={props.active} onChange={e => props.handleDoctorFilter(e)} label="Ativo">
                                <option value="TODOS_MEDICOS">Todos os médicos</option>
                                <option value="ATIVOS">Médicos ativos</option>
                                <option value="INATIVOS">Médicos inativos</option>
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{ margin: '10px' }}>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-age-native-simple">Status</InputLabel>
                            <Select native value={props.status} onChange={e => props.handleDoctorStatus(e)} label="Status">
                                <option value="TODOS_DOCS">Todos os status</option>
                                <option value="PRE_REGISTRATION">Pré-cadastro</option>
                                <option value="FINISHED">Cadastro completo</option>
                                <option value="IN_ANALYSIS">Em análise</option>
                                <option value="PENDING_DOCUMENTS">Documentos pendentes</option>
                            </Select>
                        </FormControl>
                    </div>

                    <div style={{ margin: '10px' }}>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-age-native-simple">Estado</InputLabel>
                            <Select native value={props.state} onChange={e => props.handleStateFilter(e)} label="Estado">
                                <option value="TODOS_ESTADOS">Todos os Estados</option>
                                <option value="AC">Acre</option>
                                <option value="AL">Alagoas</option>
                                <option value="AP">Amapá</option>
                                <option value="AM">Amazonas</option>
                                <option value="BA">Bahia</option>
                                <option value="CE">Ceará</option>
                                <option value="DF">Distrito Federal</option>
                                <option value="ES">Espírito Santo</option>
                                <option value="GO">Goiás</option>
                                <option value="MA">Maranhão</option>
                                <option value="MT">Mato Grosso</option>
                                <option value="MS">Mato Grosso do Sul</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="PA">Pará</option>
                                <option value="PB">Paraíba</option>
                                <option value="PR">Paraná</option>
                                <option value="PE">Pernambuco</option>
                                <option value="PI">Piauí</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="RN">Rio Grande do Norte</option>
                                <option value="RS">Rio Grande do Sul</option>
                                <option value="RO">Rondônia</option>
                                <option value="RR">Roraima</option>
                                <option value="SC">Santa Catarina</option>
                                <option value="SP">São Paulo</option>
                                <option value="SE">Sergipe</option>
                                <option value="TO">Tocantins</option>
                            </Select>
                        </FormControl>
                    </div>

                    <div style={{ margin: '10px' }}>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-age-native-simple">Status</InputLabel>
                            <Select native value={props.specialty} onChange={e => props.handleDoctorSpecialty(e)} label="Status">
                                <option value="TODAS_ESPECIALIDADES">Todas as Especialidades</option>
                                {props.SpecialtyList.map((item, i) => {
                                    return (
                                        <option key={item.id} value={item.id}>
                                            {item.descricao}
                                        </option>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </div>

                    <div style={{ margin: '10px' }}>
                        <InputLabel shrink htmlFor="end-date">De qual data</InputLabel>
                        <OutlinedInput id="date" type="date" onChange={e => props.handleStartDate(e)} value={props.startDate} fullWidth />
                    </div>

                    <div style={{ margin: '10px' }}>
                        <InputLabel shrink htmlFor="end-date">Até qual data</InputLabel>
                        <OutlinedInput id="end-date" type="date" onChange={e => props.handleEndDate(e)} value={props.endDate} fullWidth />
                    </div>

                    <div style={{ margin: '25px 10px', display: 'flex', justifyContent: 'space-evenly' }}>
                        <Button color="secondary" size="small" variant="outlined" onClick={props.onClear}>
                            Limpar Filtros
                        </Button>
                        <Button color="default" size="small" variant="outlined" onClick={props.onCancel}>
                            Cancelar
                        </Button>
                        <Button color="primary" size="small" variant="outlined" onClick={props.onFilter}>
                            Aplicar
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default FiltersModal;
