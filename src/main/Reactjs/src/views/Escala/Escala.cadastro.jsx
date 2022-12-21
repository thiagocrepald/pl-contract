import React from 'react';

// reactstrap components
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Modal,
    Row,
    Table
} from 'reactstrap';
import swal from 'sweetalert';
import RcIf from 'rc-if';

import PlantaoCadastro from '../Plantao/Plantao.cadastro.jsx';
import ReactDatetime from 'react-datetime';

import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Escala.cadastro.scss';

import EscalaService from '../../services/escala.service';
import moment from 'moment';
import UsuarioService from '../../services/usuario.service';
import * as Util from '../../util/Util';
import { ClipLoader } from 'react-spinners';
import ContractService from '../../services/contract-service';
import WorkplaceService from '../../services/work-place-service';
import { MSG_DATA_FIM_MAIOR_DATA_INICIO } from '../../util/Constantes';
import Label from 'reactstrap/es/Label';
import arrowDown from '../../assets/img/arrow-circle-down-solid.svg';
import arrowUp from '../../assets/img/arrow-circle-up-solid.svg';
import { unset } from 'lodash';

require('moment/locale/pt-br');

class EscalaCadastro extends React.Component {
    tableRef;
    scrollToTop = ref => (this.tableRef.parentNode.scrollTop = 0);
    scrollToBottom = ref => (this.tableRef.parentNode.scrollTop = this.tableRef.parentNode.scrollHeight);
    constructor(props) {
        super(props);
        this.tableRef = React.createRef();
        this.state = {
            formData: {
                id: '',
                nomeEscala: '',
                periodoInicio: moment(),
                periodoFim: moment().add(1, 'M'),
                previsaoPagamento: moment().add(2, 'M'),
                coordenador: {},
                contrato: {},
                workplace: {},
                listaPlantao: []
            },
            formModal: {
                descricao: ''
            },
            formEscalaModal: {
                escala: {},
                nomeEscala: '',
                periodoInicio: moment(),
                periodoFim: moment(),
                previsaoPagamento: moment(),
                coordenador: {},
                contrato: {},
                workplace: {},
                replicaFixo: false
            },
            formVazio: {
                contrato: false,
                workplace: false,
                coordenador: false,
                nomeEscala: false,
                previsaoPagamento: false,
                periodoInicio: false,
                tiperiodoFimpo: false
            },
            listaPlantao: [],
            listaContrato: [],
            listaWorkPlaces: [],
            listaSetor: [],
            listaEspecialidade: [],
            listaUsuario: [],
            listaEscala: [],
            stateCadPlantao: false,
            replicarEscalaModal: false,
            duracaoPlantao: '',
            loading: false
        };
    }

    setObjToState = async obj => {
        let formData = { ...this.state.formData };
        await this.handleGetWorkplaces(obj.contrato.id);
        formData.id = obj.id;
        formData.nomeEscala = obj.nomeEscala;
        formData.periodoInicio = moment(obj.periodoInicio);
        formData.periodoFim = moment(obj.periodoFim);
        formData.previsaoPagamento = moment(obj.previsaoPagamento);
        formData.coordenador = obj.coordenador;
        formData.contrato = obj.contrato;
        formData.workplace = obj.workplace;
        this.setState({ formData });
    };

    toggleModal = state => {
        this.setState({
            [state]: !this.state[state]
        });
    };

    componentDidMount = async () => {
        this.carregarCombos();
        const {
            match: { params }
        } = this.props;

        if (!!params && !!params.id) {
            let escala = { id: params.id };

            await EscalaService.getById(escala).subscribe(
                data => {
                    if (!!data) {
                        if (data.erro) {
                            toast.error(data.mensagem);
                            this.props.history.push('/admin/escala/');
                        } else {
                            escala = data.objeto;
                            this.setObjToState(escala);
                        }
                    }
                },
                error => console.error(error)
            );
            let escalaPlantao = (escala = { id: params.id });
            this.setState({ loading: true });
            await EscalaService.listarEscalaPlantao(escalaPlantao).subscribe(
                data => {
                    if (!!data) {
                        if (data.erro) {
                            toast.error(data.mensagem);
                            this.props.history.push('/admin/escala/');
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                const duracaoPlantao = Util.calculaDiferencaDeHoras(data[i].horaInicio, data[i].horaFim);

                                this.setState({ duracaoPlantao: duracaoPlantao });

                                data[i].duracaoPlantao = this.state.duracaoPlantao;
                            }
                            this.setState({ listaPlantao: data });
                            this.setState({ loading: false });
                        }
                    }
                },
                error => console.error(error)
            );
        }
    };

    carregarCombos = async () => {
        await ContractService.getAllContracts({ size: 100, page: 0, totalPages: 0 }, {status: "startsWith(ACTIVE)"}).then(result => {
            this.setState({ listaContrato: result.content });
        });
        await UsuarioService.listar().subscribe(
            data => {
                if (!!data) {
                    this.setState({ listaUsuario: data });
                }
            },
            error => console.error(error)
        );
        await EscalaService.listarComboEspecialidade().subscribe(
            data => {
                if (!!data) {
                    this.setState({ listaEspecialidade: data });
                }
            },
            error => console.error(error)
        );
        await EscalaService.listarComboSetor().subscribe(
            data => {
                if (!!data) {
                    this.setState({ listaSetor: data });
                }
            },
            error => console.error(error)
        );
        await EscalaService.listarComboEscala().subscribe(
            data => {
                if (data) {
                    this.setState({ listaEscala: data });
                }
            },
            error => console.error(error)
        );
    };

    handleSubmit = async e => {
        e.preventDefault();
        this.setState({
            formVazio: this.verificaPreenchimento(this.state.formData)
        });

        if (!!this.state.formData) {
            if (!this.state.formData.contrato.id || this.state.formData.contrato.id === 'default') {
                console.log(this.state);
                toast.error('Selecione o contrato.');
                return;
            }
            if (!this.state.formData.coordenador.id || this.state.formData.coordenador.id === 'default') {
                console.log(this.state);
                toast.error('Selecione o coordenador.');
                return;
            }
            if (!this.state.formData.workplace.id || this.state.formData.workplace === 'default') {
                console.log(this.state);
                toast.error('Selecione o lote.');
                return;
            }
            if (
                this.state.formData.nomeEscala.length !== 0 &&
                !!this.state.formData.previsaoPagamento &&
                !!this.state.formData.periodoInicio &&
                !!this.state.formData.periodoFim
            ) {
                this.salvaRegistro(this.state.formData, true);
            } else {
                toast.error('Preencha os Campos Obrigatórios!');
            }
        } else {
            toast.error('Preencha os Campos Obrigatórios!');
        }
    };

    salvaRegistro = salvarPlantoes => {
        this.state.formData.nomeEscala = this.state.formData.nomeEscala.toUpperCase();
        EscalaService.salvar(this.state.formData).subscribe(
            data => {
                if (!!data) {
                    if (data.erro) {
                        toast.error(data.mensagem);
                    } else {
                        if (salvarPlantoes) {
                            toast.success(data.mensagem);
                            this.props.history.push('/admin/escala');
                        } else {
                            const {
                                match: { params }
                            } = this.props;
                            if (!!params && !!params.id) {
                                document.location.reload();
                            } else {
                                document.location.href = document.location.href + '/' + data.objeto.id;
                            }
                        }
                        let { formData } = this.state;
                        formData.id = data.objeto.id;
                        this.setState({ formData });
                    }
                }
            },
            error => console.error(error)
        );
    };

    handleNomeEscalaChange = e => {
        let formData = { ...this.state.formData };
        formData.nomeEscala = e.target.value;
        this.setState({ formData });
    };

    handleContratoChange = async e => {
        let formData = { ...this.state.formData };
        formData.contrato.id = e.target.value;
        this.setState({ formData });
        await this.handleGetWorkplaces(e.target.value);
    };

    handleWorkPlaceChange = e => {
        let formData = { ...this.state.formData };
        formData.workplace.id = e.target.value;
        this.setState({ formData });
        console.log({'teste': formData.workplace})
    };

    handleCoordenadorChange = e => {
        let formData = { ...this.state.formData };
        formData.coordenador.id = e.target.value;
        this.setState({ formData });
    };

    handlePeriodoInicioChange = data => {
        let formData = { ...this.state.formData };
        formData.periodoInicio = data;
        this.setState({ formData });
    };

    handlePeriodoFimChange = data => {
        if (moment(this.state.formData.periodoInicio).isSameOrAfter(data)) {
            toast.warn(MSG_DATA_FIM_MAIOR_DATA_INICIO);
            return;
        }
        let formData = { ...this.state.formData };
        formData.periodoFim = data;
        this.setState({ formData });
    };

    handlePrevisaoPagamentoChange = data => {
        let formData = { ...this.state.formData };
        formData.previsaoPagamento = data;
        this.setState({ formData });
    };

    handleModalDescricaoChange = e => {
        let formModal = { ...this.state.formModal };
        formModal.descricao = e.target.value;
        this.setState({ formModal });
    };

    handleFixoChange = e => {
        let formEscalaModal = { ...this.state.formEscalaModal };
        formEscalaModal.replicaFixo = !formEscalaModal.replicaFixo;
        this.setState({ formEscalaModal });
    };

    handleSubmitModalSetor = async e => {
        e.preventDefault();
        const formModal = { ...this.state.formModal };
        if (!formModal.descricao || !formModal.descricao.length) {
            toast.info('Informe a descrição do tipo de serviço.');
            return;
        }
        await EscalaService.salvarTipoServico(formModal).subscribe(
            data => {
                if (!!data) {
                    if (data.error) {
                        toast.error(data.mensagem);
                    } else {
                        toast.success('Tipo de serviço salvo com sucesso.');
                        this.setState({
                            listaTipoServico: [...this.state.listaTipoServico, data.objeto]
                        });

                        let formData = { ...this.state.formData };
                        formData.tipoServico.id = data.objeto.id;
                        this.setState({ formData });

                        this.toggleModal('replicarEscalaModal');
                    }
                }
            },
            error => {
                console.error(error);
                toast.error('Ocorreu um erro, tente novamente.');
            }
        );
    };

    voltarEscala = () => {
        this.setState({ stateCadPlantao: false });
    };

    // Recebe algo do componente filho (PlantaoCadastro)
    receiveFromChield = plantoes => {
        plantoes.map((plantao, _) => {
            if (plantao.numeroVaga > 1) {
                for (let i = 0; i < plantao.numeroVaga; i++) {
                    plantao.duracaoPlantao = Util.calculaDiferencaDeHoras(plantao.horaInicio, plantao.horaFim);
                    this.state.listaPlantao.push(plantao);
                    this.state.formData.listaPlantao.push(plantao);
                }
            } else {
                plantao.duracaoPlantao = Util.calculaDiferencaDeHoras(plantao.horaInicio, plantao.horaFim);
                this.state.listaPlantao.push(plantao);
                this.state.formData.listaPlantao.push(plantao);
            }
        });

        /*   plantao.duracaoPlantao = Util.calculaDiferencaDeHoras(plantao.horaInicio, plantao.horaFim);*/
        /*       this.state.listaPlantao.push(plantao);
        this.state.formData.listaPlantao.push(plantao);*/
        this.setState({ stateCadPlantao: false });

        this.salvaRegistro(false);

        console.log(this.state);
    };

    excluirPlantao = (item, e) => {
        e.preventDefault();
        swal({
            title: 'Confirmar Exclusão',
            text: 'Deseja excluir esse Plantão?',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        }).then(willDelete => {
            if (willDelete) {
                this.setState({ loading: true });
                EscalaService.excluirEscalaPlantao(item).subscribe(
                    data => {
                        if (!!data) {
                            console.log(data);
                            if (data.erro) {
                                toast.error(data.mensagem);
                            } else {
                                const obj = item;
                                let listaPlantao = [...this.state.listaPlantao];

                                const index = listaPlantao.findIndex(o => o.id === obj.id);

                                listaPlantao.splice(index, 1);

                                this.setState({ listaPlantao });

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

    handleEscalaChange = e => {
        let formEscalaModal = { ...this.state.formEscalaModal };
        formEscalaModal.escala.id = e.target.value;
        this.setState({ formEscalaModal });
    };

    handleGetWorkplaces = async (id?: number) => {
        if (id == null) {
            id = '';
        }
        const result = await WorkplaceService.getAllWorkplaces({ size: 100, page: 0, totalPages: 0 }, { 'contract.id': id });
        this.setState({ listaWorkPlaces: result });
    };

    handleSubmitModalReplicarEscalaModal = async () => {
        let formEscalaModal = { ...this.state.formEscalaModal };
        formEscalaModal.escala.nomeEscala = this.state.formData.nomeEscala;
        formEscalaModal.escala.periodoInicio = this.state.formData.periodoInicio.utc().format();
        formEscalaModal.escala.periodoFim = this.state.formData.periodoFim.utc().format();
        formEscalaModal.escala.previsaoPagamento = this.state.formData.previsaoPagamento;
        formEscalaModal.escala.coordenador = this.state.formData.coordenador;
        formEscalaModal.escala.contrato = this.state.formData.contrato;
        formEscalaModal.escala.replicaFixo = this.state.formEscalaModal.replicaFixo;
        this.setState({ formEscalaModal });

        await EscalaService.replicarEscala(this.state.formEscalaModal.escala).subscribe(
            data => {
                if (!!data) {
                    if (data.error) {
                        toast.error(data.mensagem);
                    } else {
                        toast.success('Escala Replicada com sucesso.');
                        this.toggleModal('replicarEscalaModal');
                        this.props.history.push('/admin/escala');
                    }
                }
            },
            error => {
                console.error(error);
                toast.error('Ocorreu um erro, tente novamente.');
            }
        );
    };

    verificaPreenchimento(state) {
        let formVazio = { ...this.state.formVazios };
        formVazio.contrato = !state.contrato.id || state.contrato.id === 'default';
        formVazio.coordenador = !state.coordenador.id || state.coordenador.id === 'default';
        formVazio.nomeEscala = state.nomeEscala.length === 0;
        formVazio.previsaoPagamento = state.previsaoPagamento.length === 0;
        formVazio.periodoInicio = state.periodoInicio.length === 0;
        formVazio.periodoFim = !!state.periodoFim.length === 0;
        return formVazio;
    }

    disableReplicarEscala = () => {
        return (
            !this.state.formData.contrato.id ||
            this.state.formData.contrato.id === 'default' ||
            !this.state.formData.coordenador.id ||
            this.state.formData.coordenador.id === 'default' ||
            this.state.formData.nomeEscala.length === 0 ||
            this.state.formData.previsaoPagamento.length === 0 ||
            this.state.formData.periodoInicio.length === 0 ||
            this.state.formData.periodoFim.length === 0
        );
    };

    cadastroPlantoes = () => {
        let formData = { ...this.state.formData };
        formData.listaPlantao = [];
        this.setState({
            stateCadPlantao: true,
            formData: formData
        });
    };

    renderColumn = (columnText, md) => (
        <Col md={md}>
            <span>{columnText}</span>
        </Col>
    );

    returnStringListSelecionados = listSelecionados => {
        let names = '';
        listSelecionados.map((item, index) => {
            names += !!item.setor ? item.setor.descricao : !!item.descricao ? item.descricao : '';

            if (index < listSelecionados.length - 1) {
                names += ', ';
            }
        });

        return names;
    };

    returnStringListEspecialidades = listEspecialidades => {
        let names = '';
        listEspecialidades.map((item, index) => {
            names += !!item.especialidade ? item.especialidade.descricao : !!item.descricao ? item.descricao : '';

            if (index < listEspecialidades.length - 1) {
                names += ', ';
            }
        });

        return names;
    };

    renderListPlantoesFixedHeader = () => {
        const mdList = [1, 1, 1, 1, 1, 2, 1, 2, 1, 1];
        return (
            <CardBody style={{ position: 'relative' }}>
                <div className="top-down-button-container">
                    <img src={arrowDown} onClick={() => this.scrollToBottom()} alt="" />
                    <img src={arrowUp} onClick={() => this.scrollToTop()} alt="" />
                </div>
                <div style={{ position: 'relative' }}>
                    <div className="scroll-list-container">
                        <Row className="row-list-container header header-follow-container ">
                            {this.renderColumn('Hora início', mdList[0])}
                            {this.renderColumn('Hora fim', mdList[1])}
                            {this.renderColumn('Data', mdList[2])}
                            {this.renderColumn('Dia', mdList[3])}
                            {this.renderColumn('Turno', mdList[4])}
                            {this.renderColumn('Duração', mdList[5])}
                            {this.renderColumn('Valor', mdList[6])}
                            {this.renderColumn('Setores', mdList[7])}
                            <Col md={mdList[8]} className="remove-padding">
                                <span>{'Especialidades'}</span>
                            </Col>
                            {this.renderColumn('Opções', mdList[9])}
                        </Row>
                        <div className="list-body-follow-container" ref={ref => (this.tableRef = ref)}>
                            {this.state.loading ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        width: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <ClipLoader sizeUnit={'px'} size={50} margin={'2px'} color={'#149d5b'} loading={this.state.loading} />
                                </div>
                            ) : null}

                            {this.state.listaPlantao.map((item, i) => {
                                return (
                                    <Row key={i} className="row-list-container item-row">
                                        {this.renderColumn(
                                            new Intl.DateTimeFormat('default', {
                                                hour: 'numeric',
                                                minute: 'numeric'
                                            }).format(moment(item.horaInicio)),
                                            mdList[0]
                                        )}
                                        {this.renderColumn(
                                            new Intl.DateTimeFormat('default', {
                                                hour: 'numeric',
                                                minute: 'numeric'
                                            }).format(moment(item.horaFim)),
                                            mdList[1]
                                        )}
                                        {this.renderColumn(
                                            new Intl.DateTimeFormat('default', {
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric'
                                            }).format(moment(item.data)),
                                            mdList[2]
                                        )}
                                        {this.renderColumn(item.dia, mdList[3])}
                                        {this.renderColumn(item.turno, mdList[4])}
                                        {this.renderColumn(item.duracaoPlantao, mdList[5])}
                                        {this.renderColumn(item.valor, mdList[6])}
                                        <RcIf if={!!item.listaSetorSelecionado}>
                                            {this.renderColumn(this.returnStringListSelecionados(item.listaSetorSelecionado), mdList[7])}
                                        </RcIf>
                                        <RcIf if={!!item.listaEspecialidadeSelecionado}>
                                            {this.renderColumn(this.returnStringListEspecialidades(item.listaEspecialidadeSelecionado), mdList[8])}
                                        </RcIf>
                                        <Col md="1">
                                            <span onClick={e => this.excluirPlantao(item, e)} className="fa fa-minus-circle" />
                                        </Col>
                                    </Row>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </CardBody>
        );
    };

    renderListPlantoesFixedHeaderMobile = () => (
        <div className="table__mobile">
            {this.state.listaPlantao.map((item, i) => {
                return (
                    <Row>
                        <Col style={{ marginBottom: '20px' }}>
                            <Card>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <td className="table__mobile--header">Hora início</td>
                                            <td>
                                                {new Intl.DateTimeFormat('default', {
                                                    hour: 'numeric',
                                                    minute: 'numeric'
                                                }).format(moment(item.horaInicio))}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="table__mobile--header">Hora fim</td>
                                            <td>
                                                {new Intl.DateTimeFormat('default', {
                                                    hour: 'numeric',
                                                    minute: 'numeric'
                                                }).format(moment(item.horaFim))}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="table__mobile--header">Data</td>
                                            <td>
                                                {new Intl.DateTimeFormat('default', {
                                                    year: 'numeric',
                                                    month: 'numeric',
                                                    day: 'numeric'
                                                }).format(moment(item.data))}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="table__mobile--header">Dia</td>
                                            <td>{item.dia}</td>
                                        </tr>
                                        <tr>
                                            <td className="table__mobile--header">Turno</td>
                                            <td>{item.turno}</td>
                                        </tr>
                                        <tr>
                                            <td className="table__mobile--header">Duração</td>
                                            <td>{item.duracaoPlantao}</td>
                                        </tr>
                                        <tr>
                                            <td className="table__mobile--header">Valor</td>
                                            <td>{item.valor}</td>
                                        </tr>
                                        <tr>
                                            <td className="table__mobile--header">Setores</td>
                                            <td>
                                                <RcIf if={!!item.listaSetorSelecionado}>
                                                    {item.listaSetorSelecionado.map((item, i) => {
                                                        return (
                                                            <Col key={i}>{!!item.setor ? item.setor.descricao : !!item.descricao ? item.descricao : ''}</Col>
                                                        );
                                                    })}
                                                </RcIf>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="table__mobile--header">Especialidades</td>
                                            <td>
                                                <RcIf if={!!item.listaEspecialidadeSelecionado}>
                                                    {item.listaEspecialidadeSelecionado.map((item, i) => {
                                                        return (
                                                            <Col key={i}>
                                                                {!!item.especialidade ? item.especialidade.descricao : !!item.descricao ? item.descricao : ''}
                                                            </Col>
                                                        );
                                                    })}
                                                </RcIf>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="table__mobile--header">Opções</td>
                                            <td key={item.id}>
                                                <Row>
                                                    <Col md="2">
                                                        <span onClick={e => this.excluirPlantao(item, e)} className="fa fa-minus-circle" />
                                                    </Col>
                                                </Row>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card>
                        </Col>
                    </Row>
                );
            })}
        </div>
    );

    renderListaPlantoes = () => (
        <CardBody style={{ position: 'relative' }}>
            <div className="top-down-button-container">
                <img src={arrowDown} onClick={() => this.scrollToBottom()} alt="" />
                <img src={arrowUp} onClick={() => this.scrollToTop()} alt="" />
            </div>
            <Container className=" mt-5" fluid id="escala-lista">
                <div className="table__web">
                    <Card className="over-table">
                        <div ref={ref => (this.tableRef = ref)}>
                            <Table>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">
                                            Hora
                                            <br />
                                            Início
                                        </th>
                                        <th scope="col">
                                            Hora
                                            <br />
                                            Fim
                                        </th>
                                        <th scope="col">Data</th>
                                        <th scope="col">Dia</th>
                                        <th scope="col">Turno</th>
                                        <th scope="col">Duração</th>
                                        <th scope="col">Valor</th>
                                        <th scope="col">Setores</th>
                                        <th scope="col">Especialidades</th>
                                        <th scope="col">Opções</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.loading ? (
                                        <tr>
                                            <td colSpan="7" align="center">
                                                <ClipLoader sizeUnit={'px'} size={50} margin={'2px'} color={'#149d5b'} loading={this.state.loading} />
                                            </td>
                                        </tr>
                                    ) : null}

                                    {this.state.listaPlantao.map((item, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    {new Intl.DateTimeFormat('default', {
                                                        hour: 'numeric',
                                                        minute: 'numeric'
                                                    }).format(moment(item.horaInicio))}
                                                </td>
                                                <td>
                                                    {new Intl.DateTimeFormat('default', {
                                                        hour: 'numeric',
                                                        minute: 'numeric'
                                                    }).format(moment(item.horaFim))}
                                                </td>
                                                <td>
                                                    {new Intl.DateTimeFormat('default', {
                                                        year: 'numeric',
                                                        month: 'numeric',
                                                        day: 'numeric'
                                                    }).format(moment(item.data))}
                                                </td>
                                                <td>{item.dia}</td>
                                                <td>{item.turno}</td>
                                                <td>{item.duracaoPlantao}</td>
                                                <td>{item.valor}</td>
                                                <td>
                                                    <RcIf if={!!item.listaSetorSelecionado}>
                                                        {item.listaSetorSelecionado.map((item, i) => {
                                                            return (
                                                                <Col key={i}>
                                                                    {!!item.setor ? item.setor.descricao : !!item.descricao ? item.descricao : ''}
                                                                </Col>
                                                            );
                                                        })}
                                                    </RcIf>
                                                </td>
                                                <td>
                                                    <RcIf if={!!item.listaEspecialidadeSelecionado}>
                                                        {item.listaEspecialidadeSelecionado.map((item, i) => {
                                                            return (
                                                                <Col key={i}>
                                                                    {!!item.especialidade
                                                                        ? item.especialidade.descricao
                                                                        : !!item.descricao
                                                                        ? item.descricao
                                                                        : ''}
                                                                </Col>
                                                            );
                                                        })}
                                                    </RcIf>
                                                </td>
                                                <td key={item.id}>
                                                    <Row>
                                                        <Col md="2">
                                                            <span onClick={e => this.excluirPlantao(item, e)} className="fa fa-minus-circle" />
                                                        </Col>
                                                    </Row>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </Container>
        </CardBody>
    );

    render() {
        return (
            <>
                {/* Page content */}
                <RcIf if={!this.state.stateCadPlantao}>
                    <div id="escala-cadastro">
                        {/* Modal replicar escala */}
                        <Modal className="modal-dialog-centered" isOpen={this.state.replicarEscalaModal} toggle={() => this.toggleModal('replicarEscalaModal')}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="setorModalLabel">
                                    Replicar Escala
                                </h5>
                                <button
                                    aria-label="Close"
                                    className="close"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => this.toggleModal('replicarEscalaModal')}
                                >
                                    <span aria-hidden={true}>×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <Form>
                                    <Row className="w">
                                        {/*  */}
                                        <Col md="12">
                                            <FormGroup>
                                                <Input
                                                    type="select"
                                                    name="select"
                                                    id="escalaSelect"
                                                    onChange={this.handleEscalaChange}
                                                    value={this.state.formEscalaModal.escala.id}
                                                >
                                                    <option name="default" value="default">
                                                        Escala
                                                    </option>
                                                    {this.state.listaEscala.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.id}>
                                                                {item.nomeEscala}
                                                            </option>
                                                        );
                                                    })}
                                                </Input>
                                            </FormGroup>
                                        </Col>

                                        <Col md="12">
                                            <FormGroup>
                                                <h2 className="text-center">Deseja replicar os plantões cadastrados como fixo na escala?</h2>
                                                <input
                                                    type="checkbox"
                                                    name="checkbox"
                                                    id="fixoSelect"
                                                    style={{ visibility: 'visible'}}
                                                    onChange={this.handleFixoChange}
                                                    defaultChecked={this.state.formEscalaModal.replicaFixo}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                            <div className="modal-footer">
                                <Button color="secondary" data-dismiss="modal" type="button" onClick={() => this.toggleModal('replicarEscalaModal')}>
                                    Cancelar
                                </Button>
                                <Button color="primary" type="button" onClick={this.handleSubmitModalReplicarEscalaModal}>
                                    Salvar
                                </Button>
                            </div>
                        </Modal>

                        <Card className="pt-lg-1 b-r-1 w-95">
                            <CardHeader className="bg-transparent pb-5">
                                <div className="text-muted text-center mt-2 mb-4">
                                    <h1 className="card-title">
                                        {this.state.formData.nomeEscala ? 'Escala: ' + this.state.formData.nomeEscala : 'Cadastrar nova escala'}
                                    </h1>
                                </div>
                            </CardHeader>

                            <CardBody className="px-lg-5 py-lg-5">
                                {/* Formulário de cadastro */}
                                <Form onSubmit={this.handleSubmit}>
                                    <Row className="w">
                                        {/* Contrato */}
                                        <Col md="6">
                                            <Label>
                                                <h2 className="card-title text-center">Contrato</h2>
                                            </Label>
                                            {!this.state.formVazio.contrato ? (
                                                <FormGroup>
                                                    <Input
                                                        type="select"
                                                        name="select"
                                                        id="contratoSelect"
                                                        onChange={this.handleContratoChange}
                                                        value={this.state.formData.contrato.id}
                                                        required
                                                    >
                                                        <option name="default" value="default">
                                                            Selecionar Contrato
                                                        </option>
                                                        {this.state.listaContrato.map((item, i) => {
                                                            return (
                                                                <option key={i} value={item.id}>
                                                                    {item.resultsCenter + '/' + item.sankhyaCode}
                                                                </option>
                                                            );
                                                        })}
                                                    </Input>
                                                </FormGroup>
                                            ) : (
                                                <FormGroup className="campo-invalido">
                                                    <Input
                                                        type="select"
                                                        name="select"
                                                        id="contratoSelect"
                                                        onChange={this.handleContratoChange}
                                                        value={this.state.formData.contrato.id}
                                                        required
                                                    >
                                                        <option name="default" value="default">
                                                            Selecionar Contrato
                                                        </option>
                                                        {this.state.listaContrato.map((item, i) => {
                                                            return (
                                                                <option key={i} value={item.id}>
                                                                    {item.resultsCenter + '/' + item.sankhyaCode}
                                                                </option>
                                                            );
                                                        })}
                                                    </Input>
                                                </FormGroup>
                                            )}
                                        </Col>
                                        {/* Contrato */}
                                        <Col md="6">
                                            <Label>
                                                <h2 className="card-title text-center">Lote</h2>
                                            </Label>
                                            {this.state.formVazio.workplace === false ? (
                                                <FormGroup>
                                                    <Input
                                                        type="select"
                                                        name="select"
                                                        id="workplaceSelect"
                                                        onChange={this.handleWorkPlaceChange}
                                                        value={this.state.formData.workplace.id}
                                                        required
                                                    >
                                                        <option name="default" value="default">
                                                            Selecionar Lote
                                                        </option>
                                                        {this.state.listaWorkPlaces.map((item, i) => {
                                                            return (
                                                                <option key={i} value={item.id}>
                                                                    {item.unitName}
                                                                </option>
                                                            );
                                                        })}
                                                    </Input>
                                                </FormGroup>
                                            ) : (
                                                <FormGroup className="campo-invalido">
                                                    <Input
                                                        type="select"
                                                        name="select"
                                                        id="workPlaceSelect"
                                                        onChange={this.handleWorkPlaceChange}
                                                        value={this.state.formData.workplace.id}
                                                        required
                                                    >
                                                        <option name="default" value="default">
                                                            Selecionar Lote
                                                        </option>
                                                        {this.state.listaWorkPlaces.map((item, i) => {
                                                            return (
                                                                <option key={i} value={item.id}>
                                                                    {item.unitName}
                                                                </option>
                                                            );
                                                        })}
                                                    </Input>
                                                </FormGroup>
                                            )}
                                        </Col>
                                    </Row>

                                    <Row>
                                        {/* nome escala */}
                                        <Col md="6">
                                            <Label>
                                                <h2 className="card-title text-center">Nome da escala</h2>
                                            </Label>
                                            {!this.state.formVazio.nomeEscala ? (
                                                <FormGroup>
                                                    <Input
                                                        id="nomeEscala"
                                                        placeholder="Nome da Escala"
                                                        value={this.state.formData.nomeEscala}
                                                        onChange={this.handleNomeEscalaChange}
                                                    />
                                                </FormGroup>
                                            ) : (
                                                <FormGroup className="campo-invalido">
                                                    <Input
                                                        id="nomeEscala"
                                                        placeholder="Nome da Escala"
                                                        value={this.state.formData.nomeEscala}
                                                        onChange={this.handleNomeEscalaChange}
                                                    />
                                                </FormGroup>
                                            )}
                                        </Col>
                                        {/* Coordenador */}
                                        <Col md="6">
                                            <Label>
                                                <h2 className="card-title text-center">Coordenador</h2>
                                            </Label>
                                            {!this.state.formVazio.coordenador ? (
                                                <FormGroup>
                                                    <Input
                                                        type="select"
                                                        name="select"
                                                        id="coordenadorSelect"
                                                        onChange={this.handleCoordenadorChange}
                                                        value={this.state.formData.coordenador.id}
                                                        required
                                                    >
                                                        <option name="default" value="default">
                                                            Selecionar Coordenador
                                                        </option>
                                                        {this.state.listaUsuario.map((item, i) => {
                                                            return (
                                                                <option key={i} value={item.id}>
                                                                    {item.nome}
                                                                </option>
                                                            );
                                                        })}
                                                    </Input>
                                                </FormGroup>
                                            ) : (
                                                <FormGroup className="campo-invalido">
                                                    <Input
                                                        type="select"
                                                        name="select"
                                                        id="coordenadorSelect"
                                                        onChange={this.handleCoordenadorChange}
                                                        value={this.state.formData.coordenador.id}
                                                        required
                                                    >
                                                        <option name="default" value="default">
                                                            Selecionar Coordenador
                                                        </option>
                                                        {this.state.listaUsuario.map((item, i) => {
                                                            return (
                                                                <option key={i} value={item.id}>
                                                                    {item.nome}
                                                                </option>
                                                            );
                                                        })}
                                                    </Input>
                                                </FormGroup>
                                            )}
                                        </Col>
                                    </Row>

                                    <Row>
                                        {/* previsao Pagamamento */}
                                        <Col md="4">
                                            <Label>
                                                <h2 className="card-title text-center">Previsão de pagamento</h2>
                                            </Label>
                                            {!this.state.formVazio.previsaoPagamento ? (
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="ni ni-calendar-grid-58" />
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <ReactDatetime
                                                            onChange={this.handlePrevisaoPagamentoChange}
                                                            value={this.state.formData.previsaoPagamento}
                                                            inputProps={{
                                                                placeholder: 'Data de Previsão do Pagamento'
                                                            }}
                                                            timeFormat={false}
                                                            dateFormat="DD/MM/YYYY"
                                                            locale="pt-br"
                                                            closeOnSelect={true}
                                                            required
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                            ) : (
                                                <FormGroup className="campo-invalido">
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="ni ni-calendar-grid-58" />
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <ReactDatetime
                                                            onChange={this.handlePrevisaoPagamentoChange}
                                                            value={this.state.formData.previsaoPagamento}
                                                            inputProps={{
                                                                placeholder: 'Data de Previsão do Pagamento'
                                                            }}
                                                            timeFormat={false}
                                                            dateFormat="DD/MM/YYYY"
                                                            locale="pt-br"
                                                            closeOnSelect={true}
                                                            required
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                            )}
                                        </Col>
                                        {/* Data de inicio*/}
                                        <Col md="4">
                                            <Label>
                                                <h2 className="card-title text-center">Data de início</h2>
                                            </Label>
                                            {!this.state.formVazio.periodoInicio ? (
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="ni ni-calendar-grid-58" />
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <ReactDatetime
                                                            onChange={this.handlePeriodoInicioChange}
                                                            value={this.state.formData.periodoInicio}
                                                            inputProps={{
                                                                placeholder: 'Data de Início do período'
                                                            }}
                                                            timeFormat={false}
                                                            dateFormat="DD/MM/YYYY"
                                                            locale="pt-br"
                                                            closeOnSelect={true}
                                                            required
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                            ) : (
                                                <FormGroup className="campo-invalido">
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="ni ni-calendar-grid-58" />
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <ReactDatetime
                                                            onChange={this.handlePeriodoInicioChange}
                                                            value={this.state.formData.periodoInicio}
                                                            inputProps={{
                                                                placeholder: 'Data de Início do período'
                                                            }}
                                                            timeFormat={false}
                                                            dateFormat="DD/MM/YYYY"
                                                            locale="pt-br"
                                                            closeOnSelect={true}
                                                            required
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                            )}
                                        </Col>

                                        {/* Data de periodo fim*/}
                                        <Col md="4">
                                            <Label>
                                                <h2 className="card-title text-center">Data de fim</h2>
                                            </Label>
                                            {!this.state.formVazio.periodoFim ? (
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="ni ni-calendar-grid-58" />
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <ReactDatetime
                                                            onChange={this.handlePeriodoFimChange}
                                                            value={this.state.formData.periodoFim}
                                                            inputProps={{
                                                                placeholder: 'Data de Fim do período'
                                                            }}
                                                            timeFormat={false}
                                                            dateFormat="DD/MM/YYYY"
                                                            locale="pt-br"
                                                            closeOnSelect={true}
                                                            required
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                            ) : (
                                                <FormGroup className="campo-invalido">
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="ni ni-calendar-grid-58" />
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <ReactDatetime
                                                            onChange={this.handlePeriodoFimChange}
                                                            value={this.state.formData.periodoFim}
                                                            inputProps={{
                                                                placeholder: 'Data de Fim do período'
                                                            }}
                                                            timeFormat={false}
                                                            dateFormat="DD/MM/YYYY"
                                                            locale="pt-br"
                                                            closeOnSelect={true}
                                                            required
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                            )}
                                        </Col>
                                    </Row>

                                    {/*Botões de ação*/}

                                    <Card>
                                        <CardHeader className="bg-transparent pb-5">
                                            <Row className="button__action--second">
                                                <Col md="2" className="m-t-12">
                                                    <FormGroup>
                                                        <Button
                                                            className="btn-primary btn-primary-mobile"
                                                            type="button"
                                                            disabled={this.disableReplicarEscala()}
                                                            onClick={() => this.toggleModal('replicarEscalaModal')}
                                                        >
                                                            Replicar Escala
                                                        </Button>
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Row className="button__action--first">
                                                <Col md="12">
                                                    <div className="text-muted text-center mt-2 mb-4">
                                                        <h1 className="card-title">Plantões</h1>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row className="button__action--third">
                                                <Col md="8"></Col>
                                                <Col md="4">
                                                    {/* se clicar muda o state para o cadastro de plantão */}
                                                    <Button
                                                        className="btn-primary btn-primary-mobile"
                                                        type="button"
                                                        disabled={this.disableReplicarEscala()}
                                                        onClick={() => this.cadastroPlantoes()}
                                                    >
                                                        Adicionar Plantão
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </CardHeader>
                                    </Card>
                                    <Row className="p-t-40">
                                        <Col md={{ size: '2', offset: '8' }} xs={{ size: '6' }}>
                                            <Link className="btn-primary btn-primary-mobile" to="/admin/escala">
                                                Cancelar
                                            </Link>
                                        </Col>
                                        <Col md="2" xs={{ size: '6' }}>
                                            <Button className="btn-primary btn-primary-mobile" type="submit">
                                                Salvar
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                            {/* {this.renderListaPlantoes()} */}
                            <div className="table__web">{this.renderListPlantoesFixedHeader()}</div>
                        </Card>
                        <div className="table__mobile container">{this.renderListPlantoesFixedHeaderMobile()}</div>
                    </div>
                </RcIf>
                {/* se estiver no state de cadastro de plantao */}
                <RcIf if={this.state.stateCadPlantao}>
                    {/* passando uma propriedade action para o componente, assim posso acessar uma função deste componente por lá */}
                    <PlantaoCadastro action={this.receiveFromChield} voltar={this.voltarEscala} workplace={this.state.formData?.workplace} />
                </RcIf>
            </>
        );
    }
}

export default EscalaCadastro;
