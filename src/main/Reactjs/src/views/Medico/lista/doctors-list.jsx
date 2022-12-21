import { css } from '@emotion/core';
import React, { Fragment } from 'react';
import moment from 'moment';
import { isEmpty } from 'lodash';
import Trash from 'react-icons/lib/fa/trash';
import Edit from 'react-icons/lib/ti/edit';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
// reactstrap components
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '../../../components/icon-button/icon-button';
import NotificationModal from '../../../components/notification-modal/notification-modal';
import ContractTable from '../../../components/contract-table/contract-table';
import Container from 'reactstrap/es/Container';
import swal from 'sweetalert';
import check from '../../../assets/img/check-circle-solid.svg';
import clock from '../../../assets/img/clock-solid.svg';
import exclamationBlue from '../../../assets/img/exclamation-circle-solid-blue.svg';
import exclamation from '../../../assets/img/exclamation-circle-solid.svg';
import AttachmentService from '../../../services/attachment.service';
import UsuarioAppService from '../../../services/usuario.app.service';
import EscalaService from '../../../services/escala.service';
import { BTN_CADASTRAR_MEDICO, BTN_EXPORTAR, DOWNLOAD_INTERVAL, DOWNLOAD_TTL, ERRO_INTERNO } from '../../../util/Constantes';
import SimpleOrderTable, { ColumnSort } from '../../../components/simple-ordered-table/simple-ordered-table';
import UsuarioFactory from '../../Usuario/Usuario.factory';
import './doctors-list.scss';
import DoctorService from '../../../services/doctor-service';
import { Input, Select } from '@material-ui/core';
import FiltersModal from '../../../components/filters-modal/filters-modal';
import SearchTextField from '../../../components/search-text-field/search-text-field';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

class MedicoLista extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ttlDots: 0,
            listaUsuarioApp: [],
            listaEspecialidade: [],
            listaMedicosSelecionados: [],
            nomeEspecialidade: '',
            nome: '',
            login: '',
            permissao: false,
            permissao11: false,
            loading: true,
            todosMedicosSelecionados: true,
            filtroMedicos: 'TODOS_MEDICOS',
            filtroDoc: 'TODOS_DOCS',
            filtroEstados: 'TODOS_ESTADOS',
            filtroEspecialidade: 'TODAS_ESPECIALIDADES',
            startDate: '',
            endDate: '',
            waitingDownload: false,
            exporting: false,
            showNotifications: false,
            showFilters: false,
            showDotsModal: false,
            pageable: { offset: 0, size: 10, page: 0, totalPages: 0 },
            page: 0,
            anchorEl: null,
            modalItem: {}
        };
    }

    defineFiltroParams = () => {
        const tipoMedicoParam = new URLSearchParams(this.props.location.search).get('tipoMedico');
        const tipoDocParam = new URLSearchParams(this.props.location.search).get('tipoDoc');
        const tipoEstadoParam = new URLSearchParams(this.props.location.search).get('tipoEstado');
        const tipoEspecialidadeParam = new URLSearchParams(this.props.location.search).get('tipoEspecialidade');

        this.setState(
            {
                filtroMedicos: tipoMedicoParam != null ? tipoMedicoParam : 'TODOS_MEDICOS',
                filtroDoc: tipoDocParam != null ? tipoDocParam : 'TODOS_DOCS',
                filtroEstados: tipoEstadoParam != null ? tipoEstadoParam : 'TODOS_ESTADOS',
                filtroEspecialidade: tipoEspecialidadeParam != null ? tipoEspecialidadeParam : 'TODAS_ESPECIALIDADES'
            },
            () => this.listar()
        );
    };

    componentDidMount() {
        const usuarioLogado = UsuarioFactory.getUsuarioLogado();
        if (!usuarioLogado) {
            this.props.history.push('/auth/login');
        } else {
            if (!!usuarioLogado.listaUsuarioTipoPermissao) {
                for (let i = 0; i < usuarioLogado.listaUsuarioTipoPermissao.length; i++) {
                    if (usuarioLogado.listaUsuarioTipoPermissao[i].tipoPermissao.id === 9) {
                        this.setState({ permissao: true });
                    }
                    if (usuarioLogado.listaUsuarioTipoPermissao[i].tipoPermissao.id === 11) {
                        this.setState({ permissao11: true });
                    }
                }
            }
        }

        this.defineFiltroParams();
    }

    listar = () => {
        const { filtroDoc, filtroMedicos, filtroEstados, filtroEspecialidade, startDate, endDate, page, pageable, showFilters, searchDoctor } = this.state;

        const filtroAtivo = filtroMedicos === 'TODOS_MEDICOS' ? null : filtroMedicos === 'ATIVOS' ? true : filtroMedicos === 'INATIVOS' && false;
        const status = filtroDoc === 'TODOS_DOCS' ? null : filtroDoc;
        const ufConselhoMedico = filtroEstados === 'TODOS_ESTADOS' ? null : filtroEstados;
        const especialidade = filtroEspecialidade === 'TODAS_ESPECIALIDADES' ? null : filtroEspecialidade;
        const startDateFilter = startDate === '' ? null : startDate;
        const endDateFilter = endDate === '' ? null : endDate;
        const searchDoctorField = searchDoctor === '' ? null : searchDoctor;

        this.setState(
            {
                loading: true,
                showFilters: false
            },
            () => {
                DoctorService.getDoctors(
                    pageable.page,
                    pageable.offset,
                    pageable.size,
                    especialidade,
                    startDateFilter,
                    endDateFilter,
                    status,
                    ufConselhoMedico,
                    filtroAtivo,
                    searchDoctorField
                ).then(result => {
                    if (!!result) {
                        const newPageable = { ...this.state.pageable, totalPages: result.totalPages };

                        this.setState({
                            listaUsuarioApp: result.content,
                            pageable: newPageable
                        });
                        this.setState({ loading: false});
                        // this.changePath();
                    }
                });
                EscalaService.listarComboEspecialidade().subscribe(
                    data => {
                        if (!!data) {
                            this.setState({ listaEspecialidade: data });
                        }
                    },
                    error => console.error(error)
                );
            }
        );
    };

    gerarExcel = () => {
        const { filtroDoc, filtroMedicos, filtroEstados, filtroEspecialidade, listaEspecialidade, listaMedicosSelecionados } = this.state;
        let status = '';

        if (filtroDoc === 'PRE_REGISTRATION') {
            status = 'P';
        } else if (filtroDoc === 'IN_ANALYSIS') {
            status = 'EA';
        } else if (filtroDoc === 'PENDING_DOCUMENTS') {
            status = 'DP';
        } else if (filtroDoc === 'FINISHED') {
            status = 'C';
        } else if (filtroDoc) {
            status = null;
        }

        const filtroAtivo = filtroMedicos === 'TODOS_MEDICOS' ? null : filtroMedicos;
        const ufConselhoMedico = filtroEstados === 'TODOS_ESTADOS' ? null : filtroEstados;
        let medicosSelecionados = listaMedicosSelecionados === [] ? null : listaMedicosSelecionados.join('');

        let nomeEspecialidade = '';
        listaEspecialidade.forEach(element => (parseInt(filtroEspecialidade) === element.id ? (nomeEspecialidade = element.descricao) : null));

        const especialidade = filtroEspecialidade === 'TODAS_ESPECIALIDADES' ? null : nomeEspecialidade;

        this.setState(
            {
                exporting: true
            },
            () => {
                UsuarioAppService.gerarExcel(filtroAtivo, status, ufConselhoMedico, especialidade, medicosSelecionados).subscribe(
                    data => {
                        if (!isEmpty(data)) {
                            const sampleArr = this.base64ToArrayBuffer(data.arquivo);
                            this.saveByteArray(data.nmAnexo, sampleArr);
                        }
                        this.setState({ exporting: false });
                    },
                    error => {
                        console.error(error);
                        this.setState({ exporting: false });
                    }
                );
            }
        );
    };

    base64ToArrayBuffer(base64) {
        const binaryString = window.atob(base64);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    saveByteArray(reportName, byte) {
        const blob = new Blob([byte], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
        });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        const fileName = reportName;
        link.download = fileName;
        link.click();
    }

    handleSubmit = async e => {
        e.preventDefault();
    };

    excluir = (item, e) => {
        e.preventDefault();
        swal({
            title: 'Confirmar Exclusão',
            text: 'Deseja excluir o médico ' + item.nome + '?',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        }).then(willDelete => {
            if (willDelete) {
                this.setState({ loading: true });
                UsuarioAppService.excluir(item).subscribe(
                    data => {
                        if (!!data) {
                            if (data.erro) {
                                toast.error(data.mensagem);
                            } else {
                                const obj = data.objeto;

                                let listaUsuarioApp = [...this.state.listaUsuarioApp];

                                const index = listaUsuarioApp.findIndex(o => o.id === obj.id);

                                listaUsuarioApp.splice(index, 1);

                                this.setState({ listaUsuarioApp });

                                toast.success(data.mensagem);

                                this.setState({ loading: false });
                            }
                        }
                    },
                    error => console.error(error)
                );
                swal('Deletado!', {
                    icon: 'success'
                });
            }
        });
    };

    getStatusImage = (status, cadastroCompleto) => {
        if (status === 'PRE_REGISTRATION') {
            return clock;
        } else if (status === 'IN_ANALYSIS') {
            return exclamationBlue;
        } else if (status === 'PENDING_DOCUMENTS') {
            return exclamation;
        } else if (status === 'FINISHED') {
            return check;
        } else if (cadastroCompleto) {
            return exclamation;
        }
        return '';
    };

    getStatusTitle = (status, cadastroCompleto) => {
        if (status === 'PRE_REGISTRATION') {
            return 'Pré-cadastro';
        } else if (status === 'IN_ANALYSIS') {
            return 'Em análise';
        } else if (status === 'PENDING_DOCUMENTS') {
            return 'Documentos pendentes';
        } else if (status === 'FINISHED') {
            return 'Cadastro completo';
        } else if (cadastroCompleto) {
            return 'Documentos pendentes';
        }
        return '';
    };

    handleLimparFiltro = () => {
        this.setState(
            {
                filtroMedicos: 'TODOS_MEDICOS',
                filtroDoc: 'TODOS_DOCS',
                filtroEstados: 'TODOS_ESTADOS',
                filtroEspecialidade: 'TODAS_ESPECIALIDADES',
                listaMedicosSelecionados: [],
                startDate: '',
                endDate: ''
            },
            () => this.listar()
        );
    };

    handleFiltroMedico = e => {
        this.setState({
            filtroMedicos: e.target.value
        });
    };

    handleFiltroDocs = e => {
        this.setState({
            filtroDoc: e.target.value
        });
    };

    handleFiltroEstados = e => {
        this.setState({
            filtroEstados: e.target.value
        });
    };

    handleFiltroEspecialidade = e => {
        this.setState({
            filtroEspecialidade: e.target.value
        });
    };
    handleStartDate = e => {
        this.setState({
            startDate: moment(e.target.value).format('YYYY-MM-DD')
        });
    };
    handleEndDate = e => {
        this.setState({
            endDate: e.target.value
        });
    };
    handleSearchDoctor = value => {
        const newPageable = { ...this.state.pageable, page: 0 };

        this.setState({
            searchDoctor: value,
            pageable: newPageable
        });
        this.listar();
    };
    handleCheckTodosMedicos = e => {
        if (e.target.checked) {
            this.setState({ listaMedicosSelecionados: [], todosMedicosSelecionados: true });
            this.listar();
        } else {
            this.setState({ listaMedicosSelecionados: [], todosMedicosSelecionados: false });
        }
    };
    handleCheckMedico = (e, id) => {
        const { listaMedicosSelecionados } = this.state;

        let newListaMedicosSelecionados = listaMedicosSelecionados;

        if (e.target.checked) {
            newListaMedicosSelecionados.push(`medicos=${id}&`);
            this.setState({
                listaMedicosSelecionados: newListaMedicosSelecionados,
                todosMedicosSelecionados: false
            });
        } else {
            newListaMedicosSelecionados.forEach((item, i) => {
                if (item === id) {
                    newListaMedicosSelecionados.splice(i, 1);
                }
            });
            this.setState({ listaMedicosSelecionados: newListaMedicosSelecionados });
        }
    };

    changePath() {
        const { filtroDoc, filtroMedicos, filtroEstados, filtroEspecialidade } = this.state;
        const hasFiltroDoc = filtroDoc !== 'TODOS_DOCS';
        const hasFiltroMedico = filtroMedicos !== 'TODOS_MEDICOS';
        const hasFiltroEstado = filtroEstados !== 'TODOS_ESTADOS';
        const hasFiltroEspecialidade = filtroEspecialidade !== 'TODAS_ESPECIALIDADES';

        this.props.history.push(
            `${this.props.location.pathname}${hasFiltroDoc || hasFiltroMedico || hasFiltroEstado || hasFiltroEspecialidade ? '?' : ''}${
                hasFiltroMedico ? `tipoMedico=${filtroMedicos}&` : ''
            }${hasFiltroDoc ? `tipoDoc=${filtroDoc}&` : ''}${hasFiltroEstado ? `Estado=${filtroEstados}&` : ''}${
                hasFiltroEspecialidade ? `tipoEspecialidade=${filtroEspecialidade}&` : ''
            }`
        );
    }

    waitUntilCompressAttachmentIsProcessed = (ttl = 0) => {
        AttachmentService.get(this.state.compressAttachment.id).subscribe(
            data => {
                if (data && data.processed && data.url && data.key) {
                    this.setState(
                        {
                            waitingDownload: false,
                            compressAttachment: data,
                            waitingDownalodProcess: false
                        },
                        () => {
                            window.open(this.state.compressAttachment.url);
                        }
                    );
                } else {
                    if (ttl < DOWNLOAD_TTL) {
                        this.setState({ ttlDots: this.state.ttlDots + 1 });
                        setTimeout(() => {
                            this.waitUntilCompressAttachmentIsProcessed(ttl + 1);
                        }, DOWNLOAD_INTERVAL);
                    } else {
                        this.setState(
                            {
                                compressError: true,
                                waitingDownload: false,
                                waitingDownalodProcess: true
                            },
                            () => {
                                toast.warn(
                                    'Limite de tempo atingido, verifique mais tarde se terminou de processar o arquivo comprimido. Não atualize a página.'
                                );
                            }
                        );
                    }
                }
            },
            error => {
                toast.error('Erro ao processar arquivo zip.');
                this.setState({
                    compressError: true,
                    waitingDownload: false,
                    compressAttachment: null
                });
            }
        );
    };

    handleButtonAttachmentDownload = () => {
        this.setState(
            {
                waitingDownload: true
            },
            () => {
                // if exist compress attachment, download it again
                if (!!this.state.compressAttachment) {
                    this.waitUntilCompressAttachmentIsProcessed();
                    return;
                }
                const { filtroDoc, filtroMedicos, filtroEstados, filtroEspecialidade, listaEspecialidade, listaMedicosSelecionados } = this.state;
                let status = '';

                if (filtroDoc === 'PRE_REGISTRATION') {
                    status = 'P';
                } else if (filtroDoc === 'IN_ANALYSIS') {
                    status = 'EA';
                } else if (filtroDoc === 'PENDING_DOCUMENTS') {
                    status = 'DP';
                } else if (filtroDoc === 'FINISHED') {
                    status = 'C';
                } else if (filtroDoc) {
                    status = null;
                }

                const filtroAtivo = filtroMedicos === 'TODOS_MEDICOS' ? null : filtroMedicos;
                const ufConselhoMedico = filtroEstados === 'TODOS_ESTADOS' ? null : filtroEstados;
                let medicosSelecionados = listaMedicosSelecionados === [] ? null : listaMedicosSelecionados.join('');

                let nomeEspecialidade = '';
                listaEspecialidade.forEach(element => (parseInt(filtroEspecialidade) === element.id ? (nomeEspecialidade = element.descricao) : null));

                const especialidade = filtroEspecialidade === 'TODAS_ESPECIALIDADES' ? null : nomeEspecialidade;

                AttachmentService.compress('MEDIC', undefined, filtroAtivo, status, ufConselhoMedico, especialidade, medicosSelecionados).subscribe(
                    data => {
                        if (data.erro === true) {
                            toast.warn(data.mensagem);
                            this.setState({
                                compressError: true,
                                waitingDownload: false,
                                compressAttachment: null
                            });
                            return;
                        }
                        this.setState(
                            {
                                compressAttachment: data.objeto
                            },
                            () => {
                                this.waitUntilCompressAttachmentIsProcessed();
                            }
                        );
                    },
                    error => {
                        toast.error('Erro ao gerar arquivo zip para o médico.');
                        this.setState({
                            compressError: true,
                            waitingDownload: false,
                            compressAttachment: null
                        });
                    }
                );
            }
        );
    };
    handleTransformToTableContent = content => {
        if (content == null || content.length === 0) return [];

        return content.map((item, index) => [
            <Input
                type="checkbox"
                // checked={this.state.listaMedicosSelecionados.map(idSelecionado => idSelecionado === item.id ? true : false)}
                className="checkbox"
                onClick={e => this.handleCheckMedico(e, item.id)}
            />,
            item.name ?? '',
            item.email ?? '',
            item.gender ?? '',
            item.phone ?? '',
            item.medicalCouncilUf ?? '',
            moment(item.incUserDate)
                .utc()
                .format('DD/MM/YYYY') ?? '',
            <img alt="" title={this.getStatusTitle(item.status, item.cadastroCompleto)} src={this.getStatusImage(item.status, item.cadastroCompleto)} />,
            <Fragment key={index}>
                {this.state.permissao && (
                    <div>
                        <div
                            className="icon-dots"
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={e => this.setState({ showDotsModal: true, anchorEl: e.currentTarget, modalItem: item })}
                        />
                    </div>
                )}
            </Fragment>
        ]);
    };

    handleClickDoctor = index => {
        this.props.history.push(`/admin/cadastro-usuario-app/${this.state.listaUsuarioApp[index].id}`)
    }

    updatePage = newPage => {
        const newPageable = { ...this.state.pageable, page: newPage };
        this.setState({ pageable: newPageable }, () => this.listar());
    };
    
    
    render() {
        const tableContent = this.handleTransformToTableContent(this.state.listaUsuarioApp);

        return (
            <div className="doctor__container">
                <div className="doctor__container--header">
                    <span> {'Médicos'} </span>
                    <div
                        className="notification-img"
                        onClick={() => {
                            this.setState({ showNotifications: !this.state.showNotifications });
                        }}
                    />
                </div>
                {this.state.showNotifications && <NotificationModal />}
                <div className="doctor__container--body">
                    {/* <div style={{ maxWidth: '222px' }}>
                        <SearchTextField onChange={setSearchField} id={'search-field'} placeholder="Buscar por" value={searchField} />
                    </div> */}
                    {this.state.permissao && (
                        <div style={{ marginLeft: '24px' }}>
                            <IconButton isAlignCenter width={'170px'} height={'40px'} filled clickButton={this.gerarExcel}>
                                {this.state.exporting ? (
                                    <ClipLoader css={override} sizeUnit={'px'} size={15} color={'#fff'} loading={this.state.exporting} />
                                ) : (
                                    <div className="icon-plus" />
                                )}
                                {'Download Médicos'}
                            </IconButton>
                        </div>
                    )}
                    {this.state.permissao && (
                        <div style={{ marginLeft: '24px' }}>
                            <IconButton isAlignCenter width={'170px'} height={'40px'} filled clickButton={this.handleButtonAttachmentDownload}>
                                {this.state.waitingDownload ? (
                                    <ClipLoader css={override} sizeUnit={'px'} size={15} color={'#fff'} loading={this.state.waitingDownload} />
                                ) : (
                                    <div className="icon-plus" />
                                )}
                                {'Download Documentos'}
                            </IconButton>
                        </div>
                    )}
                    {this.state.permissao && (
                        <Link style={{ marginLeft: '24px' }} to="/admin/cadastro-usuario-app">
                            <IconButton isAlignCenter width={'170px'} height={'40px'} filled clickButton={() => {}}>
                                <div className="icon-plus" />
                                {'Adicionar Novo'}
                            </IconButton>
                        </Link>
                    )}
                    {this.state.permissao && (
                        <div style={{ marginLeft: '24px' }}>
                            <SearchTextField
                                id={'search-field'}
                                style={{ marginRight: '10px' }}
                                placeholder="Buscar por"
                                onChange={this.handleSearchDoctor}
                                value={this.state.searchDoctor}
                            />
                        </div>
                    )}
                    <div style={{ marginLeft: '24px' }}>
                        <IconButton
                            color={'gray'}
                            isAlignCenter
                            width={'170px'}
                            height={'40px'}
                            filled
                            clickButton={() => this.setState({ showFilters: !this.state.showFilters })}
                        >
                            {'Filtrar por ...'}
                        </IconButton>
                    </div>
                </div>

                {this.state.showFilters && (
                    <FiltersModal
                        onCancel={() => this.setState({ showFilters: false })}
                        onClear={this.handleLimparFiltro}
                        onFilter={this.listar}
                        handleDoctorFilter={this.handleFiltroMedico}
                        handleDoctorStatus={this.handleFiltroDocs}
                        handleStateFilter={this.handleFiltroEstados}
                        handleDoctorSpecialty={this.handleFiltroEspecialidade}
                        handleStartDate={this.handleStartDate}
                        handleEndDate={this.handleEndDate}
                        SpecialtyList={this.state.listaEspecialidade}
                        active={this.state.filtroMedicos}
                        status={this.state.filtroDoc}
                        state={this.state.filtroEstados}
                        specialty={this.state.filtroEspecialidade}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                    />
                )}

                <div className={'doctor-list'} style={{ padding: '0 26px', overflow: 'auto' }}>
                    <SimpleOrderTable
                        rows={tableContent}
                        // disabledRows={inactiveContracts}
                        page={this.state.pageable}
                        // firstCustom={true}
                        totalPages={this.state.pageable.totalPages}
                        columnNameKeys={[
                            { name: '', sortDisabled: true },
                            { name: 'Nome', sortCode: 'accountOwnerName' },
                            { name: 'E-mail', sortCode: 'email' },
                            { name: 'Sexo', sortCode: 'gender' },
                            { name: 'Telefone', sortCode: 'phone' },
                            { name: 'Uf Conselho Médico', sortCode: 'medicalCouncilUf' },
                            { name: 'Data de Inclusão', sortCode: 'incUserDate' },
                            { name: 'Status', sortDisabled: true }
                        ]}
                        onChangePage={this.updatePage}
                        onClickRow={this.handleClickDoctor}
                        // handleChangePage={this.listar}
                        // items={this.state.listaUsuarioApp}
                    />
                    <Menu
                        className="simple-menu"
                        anchorEl={this.state.anchorEl}
                        keepMounted
                        open={this.state.showDotsModal}
                        onClose={() => this.setState({ showDotsModal: false, anchorEl: null })}
                    >
                        <Link to={`/admin/cadastro-usuario-app/${this.state.modalItem.id}`}>
                            <MenuItem>{'Editar'}</MenuItem>
                        </Link>
                        <MenuItem onClick={e => this.excluir(this.state.modalItem, e)}>{this.state.modalItem.active ? 'Desativar' : 'Inativar'}</MenuItem>
                    </Menu>
                </div>
            </div>
        );
    }
}

export default MedicoLista;
