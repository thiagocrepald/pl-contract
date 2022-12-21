import React from 'react';

// reactstrap components
import { Button, Card, Col, Input, Row, Table } from 'reactstrap';
import { Link } from 'react-router-dom';

import './Escala.lista.scss';
import EscalaService from '../../services/escala.service';
import Container from 'reactstrap/es/Container';
import { toast } from 'react-toastify/index';
// import swal from "sweetalert/typings/sweetalert";
import swal from 'sweetalert';
import UsuarioService from '../../services/usuario.service';
import moment from 'moment';
import { ClipLoader } from 'react-spinners';
import UsuarioFactory from '../Usuario/Usuario.factory';
import Eye from 'react-icons/lib/fa/eye';
import Edit from 'react-icons/lib/ti/edit';
import Trash from 'react-icons/lib/fa/trash';
import ReactDatetime from 'react-datetime';

class EscalaLista extends React.Component {
    constructor(props) {
        super(props);
        this.excluir = this.excluir.bind(this);
        this.state = {
            listaEscala: [],
            loading: true,
            permissao: false,
            filtroEscalas: 'ATIVOS',
            filtroDataInicio: null,
            filtroDataFim: null,
            filtroCodigoContrato: null
        };
    }

    defineFiltroParams = () => {
        const tipoEscalaParam = new URLSearchParams(this.props.location.search).get('tipoEscala');
        const dataInicio = new URLSearchParams(this.props.location.search).get('dataInicio');
        const dataFim = new URLSearchParams(this.props.location.search).get('dataFim');
        const contractId = new URLSearchParams(this.props.location.search).get('contractId');

        this.setState(
            {
                filtroEscalas: tipoEscalaParam != null ? tipoEscalaParam : 'ATIVOS',
                filtroCodigoContrato: contractId != null ? contractId : null,
                filtroDataInicio: dataInicio != null ? dataInicio : null,
                filtroDataFim: dataFim != null ? dataFim : null
            },
            () => this.listar()
        );
    };

    componentDidMount = async () => {
        const usuarioLogado = UsuarioFactory.getUsuarioLogado();
        if (!usuarioLogado) {
            this.props.history.push('/auth/login');
        } else {
            if (!!usuarioLogado.listaUsuarioTipoPermissao) {
                for (let i = 0; i < usuarioLogado.listaUsuarioTipoPermissao.length; i++) {
                    if (usuarioLogado.listaUsuarioTipoPermissao[i].tipoPermissao.id === 3) {
                        this.setState({ permissao: true });
                    }
                }
            }
        }
        this.defineFiltroParams();
    };

    changePath() {
        const { filtroEscalas, filtroDataInicio, filtroDataFim, filtroCodigoContrato} = this.state;
        const hasFiltroEscala = filtroEscalas !== 'TODAS_ESCALAS';
        const hasFiltroDataInicio = filtroDataInicio != null;
        const hasFiltroDataFim = filtroDataFim != null;
        const hasFiltroCodigoContrato = filtroCodigoContrato != null;
        this.props.history.push(
            `${this.props.location.pathname}${hasFiltroEscala || hasFiltroDataInicio || hasFiltroDataFim ? '?' : ''}${
                hasFiltroEscala ? `tipoEscala=${filtroEscalas}` : ''
            }${hasFiltroDataInicio && hasFiltroEscala ? '&' : ''}${hasFiltroDataInicio ? `dataInicio=${filtroDataInicio}` : ''}${
                hasFiltroDataFim && (hasFiltroEscala || hasFiltroDataInicio) ? '&' : ''
            }${hasFiltroDataFim ? `dataFim=${filtroDataFim}` : ''}${hasFiltroCodigoContrato ? `contractId=${filtroCodigoContrato}` : ''}`
        );
    }

    listar = async () => {
        const { filtroEscalas, filtroDataInicio, filtroDataFim, filtroCodigoContrato } = this.state;
        const filtroAtivo = filtroEscalas === 'TODAS_ESCALAS' ? null : filtroEscalas;
        this.setState({
            loading: true
        });
        await EscalaService.listar(filtroAtivo, filtroDataInicio, filtroDataFim, filtroCodigoContrato).subscribe(
            data => {
                if (!!data) {
                    this.setState({ listaEscala: data });
                    this.setState({ loading: false });
                    this.changePath();
                }
            },
            error => console.error(error)
        );
    };

    excluir = (item, e) => {
        e.preventDefault();
        swal({
            title: 'Confirmar Exclusão',
            text: 'Deseja excluir essa Escala?',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        }).then(willDelete => {
            if (willDelete) {
                this.excluirComSenha(item, e);
            }
        });
    };

    excluirComSenha = (item, e) => {
        e.preventDefault();

        swal({
            title: 'Confirmar Exclusão',
            text: 'Insira sua senha de exclusão de escalas para confirmação',
            content: {
                element: 'input',
                attributes: {
                    type: 'password'
                }
            },
            showLoaderOnConfirm: true
        }).then(password => {
            const usuarioLogado = UsuarioFactory.getUsuarioLogado();

            UsuarioService.verificaSenhaExclusaoEscala(usuarioLogado.id, password).subscribe(
                data => {
                    if (!!data) {
                        if (!data.erro && data.objeto) {
                            EscalaService.excluir(item).subscribe(
                                data => {
                                    if (!!data) {
                                        console.log(data);
                                        if (data.erro) {
                                            toast.error(data.mensagem);
                                        } else {
                                            const obj = data.objeto;
                                            let listaEscala = [...this.state.listaEscala];
                                            const index = listaEscala.findIndex(o => o.id === obj.id);

                                            listaEscala.splice(index, 1);
                                            this.setState({ listaEscala });
                                            // toast.success(data.mensagem);
                                            swal('Deletado!', {
                                                icon: 'success'
                                            });
                                        }
                                    }
                                },
                                error => console.error(error)
                            );
                        } else if (!data.objeto) {
                            swal('Oops!', 'Senha de exclusão incorreta', 'error');
                        }
                    }
                },
                error => {
                    console.error(error);
                }
            );
        });
    };

    handleFiltroEscala = e => {
        this.setState({
            filtroEscalas: e.target.value
        });
    };

    handleFiltroCodigoContrato = e => {
        this.setState({
            filtroCodigoContrato: e.target.value
        });
    };
    
    handleDataInicioChange = data => {
        let filtroDataInicio = { ...this.state.filtroDataInicio };
        filtroDataInicio = moment(data).format('DD/MM/YYYY');
        this.setState({ filtroDataInicio });
        console.log(filtroDataInicio);
    };

    handleDataFimChange = data => {
        let filtroDataFim = { ...this.state.filtroDataFim };
        filtroDataFim = moment(data).format('DD/MM/YYYY');
        this.setState({ filtroDataFim });
        console.log(filtroDataFim);
    };

    handleLimparFiltro = () => {
        this.setState(
            {
                filtroEscalas: 'TODAS_ESCALAS',
                filtroDataInicio: null,
                filtroDataFim: null,
                filtroCodigoContrato: null
            },
            () => this.listar()
        );
    };

    render() {
        return (
            <>
                <Container className=" mt-5" fluid id="escala-lista">
                    <div className="container">
                        <Row>
                            <Col className="botton-to-right" hidden={!this.state.permissao}>
                                <div className="botton-to-right__mobile">
                                    <Link className="custom-link" to="/admin/cadastro-escala">
                                        Cadastrar Escala
                                    </Link>
                                </div>
                            </Col>
                        </Row>
                        <Row className="p-b-20 p-t-20">
                            <Col md="2">
                                <Input
                                    type="select"
                                    name="select"
                                    id="diaSelect"
                                    defaultValue={'TODAS_ESCALAS'}
                                    onChange={this.handleFiltroEscala}
                                    value={this.state.filtroEscalas}
                                >
                                    <option value="TODAS_ESCALAS">Todas as escalas</option>
                                    <option value="ATIVOS">Escalas ativas</option>
                                    <option value="INATIVOS">Escalas inativas</option>
                                </Input>
                            </Col>
                            <Col md="2">
                                <ReactDatetime
                                    onChange={this.handleDataInicioChange}
                                    value={this.state.filtroDataInicio}
                                    inputProps={{
                                        placeholder: 'Data de início'
                                    }}
                                    timeFormat={false}
                                    dateFormat="DD/MM/YYYY"
                                    locale="pt-br"
                                    closeOnSelect={true}
                                />
                            </Col>
                            <Col md="2">
                                <ReactDatetime
                                    onChange={this.handleDataFimChange}
                                    value={this.state.filtroDataFim}
                                    inputProps={{
                                        placeholder: 'Data de fim'
                                    }}
                                    timeFormat={false}
                                    dateFormat="DD/MM/YYYY"
                                    locale="pt-br"
                                    closeOnSelect={true}
                                />
                            </Col>
                            <Col md="2">
                                <Input
                                    type="text"
                                    name="text"
                                    id="codText"
                                    onChange={this.handleFiltroCodigoContrato}
                                    value={this.state.filtroCodigoContrato}
                                    placeholder={'Código do contrato'}
                                />
                            </Col>
                            <Col className="button-style" md="3" style={{ display: 'flex' }}>
                                <Button className="button-style--first" color="secondary" type="button" onClick={() => this.listar()}>
                                    Filtrar
                                </Button>
                                <Button className="button-style--second" color="secondary" type="button" onClick={() => this.handleLimparFiltro()}>
                                    Limpar filtros
                                </Button>
                            </Col>
                        </Row>
                        <div className="table__web">
                            <Card className="b-r-1 p-t-50">
                                <Card>
                                    <Table>
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Nome da Escala</th>
                                                <th scope="col">Mês</th>
                                                <th scope="col">Cód. do Contrato</th>
                                                <th scope="col">Local</th>
                                                <th scope="col">Coordenador</th>
                                                <th scope="col">Opções</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {this.state.loading ? (
                                                <tr>
                                                    <td colSpan="6" align="center">
                                                        <ClipLoader sizeUnit={'px'} size={50} margin={'2px'} color={'#149d5b'} loading={this.state.loading} />
                                                    </td>
                                                </tr>
                                            ) : null}

                                            {this.state.listaEscala.map((item, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{item.nomeEscala}</td>
                                                        <td>
                                                            {new Intl.DateTimeFormat('default', {
                                                                month: 'long'
                                                            })
                                                                .format(moment(item.periodoInicio))
                                                                .toUpperCase()}
                                                        </td>
                                                        <td>{item.contrato.codigo}</td>
                                                        <td>{item.workplace?.unitName ?? item.contrato?.local}</td>
                                                        <td>{item.coordenador.nome}</td>
                                                        <td key={item.id}>
                                                            <Row>
                                                                <Col md="2">
                                                                    <Link to={`/admin/visualizar-escala/${item.id}/${item.nomeEscala}`}>
                                                                        <Eye size={24} color="black" />
                                                                    </Link>
                                                                </Col>
                                                                <Col md="2" hidden={!this.state.permissao}>
                                                                    <Link to={`/admin/cadastro-escala/${item.id}`}>
                                                                        <Edit size={24} color="black" />
                                                                    </Link>
                                                                </Col>

                                                                <Col md="2" hidden={!this.state.permissao} className="pointer">
                                                                    <Trash onClick={e => this.excluir(item, e)} size={24} color="black" />
                                                                </Col>
                                                            </Row>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </Card>
                            </Card>
                        </div>
                        <div className="table__mobile">
                            {this.state.listaEscala.map((item, i) => {
                                return (
                                    <Row>
                                        <Col style={{ marginBottom: '20px' }}>
                                            <Card>
                                                <Table>
                                                    <tbody>
                                                        <tr>
                                                            <td className="table__mobile--header">Nome da Escala</td>
                                                            <td>{item.nomeEscala}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="table__mobile--header">Mês</td>
                                                            <td>
                                                                {new Intl.DateTimeFormat('default', {
                                                                    month: 'long'
                                                                })
                                                                    .format(moment(item.periodoInicio))
                                                                    .toUpperCase()}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="table__mobile--header">Cód. Contrato</td>
                                                            <td> </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="table__mobile--header">Local</td>
                                                            <td>{item.contrato.local}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="table__mobile--header">Coordenador</td>
                                                            <td>{item.coordenador.nome}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="table__mobile--header">Opções</td>
                                                            <td key={item.id}>
                                                                <div
                                                                    style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between'
                                                                    }}
                                                                >
                                                                    <div>
                                                                        <Link to={`/admin/visualizar-escala/${item.id}/${item.nomeEscala}`}>
                                                                            <Eye size={24} color="black" />
                                                                        </Link>
                                                                    </div>
                                                                    <div hidden={!this.state.permissao}>
                                                                        <Link to={`/admin/cadastro-escala/${item.id}`}>
                                                                            <Edit size={24} color="black" />
                                                                        </Link>
                                                                    </div>

                                                                    <div hidden={!this.state.permissao} className="pointer">
                                                                        <Trash onClick={e => this.excluir(item, e)} size={24} color="black" />
                                                                    </div>
                                                                </div>
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
                    </div>
                </Container>
            </>
        );
    }
}

export default EscalaLista;
