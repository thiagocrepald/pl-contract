import React from "react";
import Chart from 'react-google-charts';
import { Button, Card, Form, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Modal } from "reactstrap";
import IndicadoresService from "../../services/indicadores.service";
import RcIf from 'rc-if';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MapaBrasil from '../../assets/img/mapa-do-brasil-hygea.png';
import Container from "react-bootstrap/Container";
import ReactDatetime from "react-datetime";

import './Indicadores.scss';
import Table from "react-bootstrap/Table";
import FaBeer from 'react-icons/lib/ti/filter';
import Fab from '@material-ui/core/Fab';
import Footer from "../../components/Footers/AdminFooter";
import { NavLink } from "react-router-dom";

class Indicadores extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            especialidades: [],
            profissionais: [],
            estados: [],
            sexoMasculino: '',
            sexoFeminino: '',
            faltasPlantao: '',
            trocasPlantao: '',
            formFiltro: {
                dataInicio: '',
                dataFim: ''
            },
            formFiltroEstado: {
                dataInicio: '',
                dataFim: ''
            },
            formFiltroProporcao: {
                dataInicio: '',
                dataFim: ''
            },
            dataInicioIndicadorGestao: '',
            dataFimIndicadorGestao: '',

            filtroCargaHorariaModal: false,
            filtroAtuacaoMedicoModal: false,
            filtroGestaoEscalaModal: false


        }
    }

    componentDidMount = async () => {

        await IndicadoresService.criarIndicadores().subscribe(
            data => {
                if (!!data && !!data.objeto) {
                    this.setState({ sexoMasculino: data.objeto.sexoMasculino });
                    this.setState({ sexoFeminino: data.objeto.sexoFeminino });
                    if (!!data.objeto.especialidades) {
                        data.objeto.especialidades.unshift({});
                        this.setState({ especialidades: data.objeto.especialidades });
                    }
                    if (!!data.objeto.estados) {
                        this.setState({ estados: data.objeto.estados });
                    }
                }
            },
            error => {
                console.error(error);
            }
        );
        let filtro = {};
        await IndicadoresService.criarIndicadorGestaoEscala(filtro).subscribe(
            data => {
                if (!!data && !!data.objeto) {
                    if (!!data.objeto) {
                        this.setState({
                            trocasPlantao: data.objeto.trocasPlantao,
                            faltasPlantao: data.objeto.faltasPlantao
                        }, () => {
                            this.setState({ loading: false });
                        });
                    }
                }
            },
            error => {
                console.error(error);
            }
        );

        await IndicadoresService.profissionaisMaisAtivos().subscribe(
            data => {
                if (!!data && !!data.objeto) {
                    if (!!data.objeto.profissionais) {
                        this.setState({ profissionais: data.objeto.profissionais }, () => {
                            this.setState({ loading: false });
                        });
                    }
                }
            },
            error => console.error(error)
        );
    };

    listar = async () => {
        console.log(this.state);
        let filtro = {};
        if (!!this.state.formFiltro) {
            filtro.dataInicio = this.state.formFiltro.dataInicio;
            filtro.dataFim = this.state.formFiltro.dataFim;
        }
        console.log(filtro);
        await IndicadoresService.profissionaisMaisAtivos(filtro).subscribe(
            data => {
                if (!!data && !!data.objeto) {
                    if (!!data.objeto.profissionais) {
                        this.setState({ profissionais: data.objeto.profissionais }, () => {
                            this.setState({ loading: false });
                        });
                        console.log(this.state.profissionais);
                        this.toggleModalAtuacaoMedico("filtroAtuacaoMedicoModal");
                    }
                }
            },
            error => console.error(error)
        );
    };

    listarEstadoComFiltro = async () => {
        let filtro = {};
        if (!!this.state.formFiltroEstado) {
            filtro.dataInicio = this.state.formFiltroEstado.dataInicio;
            filtro.dataFim = this.state.formFiltroEstado.dataFim;
        }
        await IndicadoresService.criarIndicadores(filtro).subscribe(
            data => {
                if (!!data && !!data.objeto) {
                    if (!!data.objeto.estados) {
                        this.setState({ estados: data.objeto.estados });
                        this.toggleModalCargaHoraria("filtroCargaHorariaModal");
                    }
                }
            },
            error => {
                console.error(error);
            }
        );

    };

    listarGestaoComFiltro = async () => {
        let filtro = {};
        if (!!this.state.dataInicioIndicadorGestao && !!this.state.dataFimIndicadorGestao) {
            filtro.dataInicioIndicadorGestao = this.state.dataInicioIndicadorGestao;
            filtro.dataFimIndicadorGestao = this.state.dataFimIndicadorGestao;
        }
        await IndicadoresService.criarIndicadorGestaoEscala(filtro).subscribe(
            data => {
                if (!!data && !!data.objeto) {
                    if (!!data.objeto) {
                        this.setState({
                            trocasPlantao: data.objeto.trocasPlantao,
                            faltasPlantao: data.objeto.faltasPlantao
                        }, () => {
                            this.setState({ loading: false });
                            this.toggleModal("filtroGestaoEscalaModal");
                        });
                    }
                }
            },
            error => {
                console.error(error);
            }
        );

    };

    listarProporcaoComFiltro = async () => {
        let filtro = {};
        if (!!this.state.formFiltroProporcao.dataInicio && !!this.state.formFiltroProporcao.dataFim) {
            filtro.dataInicio = this.state.formFiltroProporcao.dataInicio;
            filtro.dataFim = this.state.formFiltroProporcao.dataFim;
        }
        await IndicadoresService.criarIndicadorPoporcaoSexo(filtro).subscribe(
            data => {
                if (!!data && !!data.objeto) {
                    this.setState({ sexoMasculino: data.objeto.sexoMasculino });
                    this.setState({ sexoFeminino: data.objeto.sexoFeminino });
                    this.toggleModal("filtroProporcaoModal");
                }
            },
            error => {
                console.error(error);
            }
        );

    };

    /*handle % de medicos em cada plantao*/
    handleDataInicioChange = data => {
        let formFiltro = { ...this.state.formFiltro };
        formFiltro.dataInicio = data;
        this.setState({ formFiltro });
    };

    handleDataFimChange = data => {
        let formFiltro = { ...this.state.formFiltro };
        formFiltro.dataFim = data;
        this.setState({ formFiltro });
    };

    handleDataInicioEstadoChange = data => {
        let formFiltroEstado = { ...this.state.formFiltroEstado };
        formFiltroEstado.dataInicio = data;
        this.setState({ formFiltroEstado });
    };

    handleDataFimEstadoChange = data => {
        let formFiltroEstado = { ...this.state.formFiltroEstado };
        formFiltroEstado.dataFim = data;
        this.setState({ formFiltroEstado });
    };

    toggleModalCargaHoraria = state => {
        this.setState({
            [state]: !this.state[state]
        });
    };

    toggleModalAtuacaoMedico = state => {
        this.setState({
            [state]: !this.state[state]
        });
    };

    toggleModal = state => {
        this.setState({
            [state]: !this.state[state]
        });
    };


    handleDataInicioGestaoChange = data => {
        this.setState({ dataInicioIndicadorGestao: data });
    };

    handleDataFimGestaoChange = data => {
        this.setState({ dataFimIndicadorGestao: data });
    };

    handleDataInicioProporcaoChange = data => {
        let formFiltroProporcao = { ...this.state.formFiltroProporcao };
        formFiltroProporcao.dataInicio = data;
        this.setState({ formFiltroProporcao });
    };

    handleDataFimProporcaoChange = data => {
        let formFiltroProporcao = { ...this.state.formFiltroProporcao };
        formFiltroProporcao.dataFim = data;
        this.setState({ formFiltroProporcao });
    };

    mapMobileLink = () => {
        return [
            {
                to: "/admin/escala",
                name: "Cadastro Escalas"
            },
            {
                to: "/admin/lista-gestao-escala",
                name: "Gestão Escalas"
            },
            {
                to: "/admin/usuarioApp",
                name: "Médicos"
            },
            {
                to: "/auth/login",
                name: "Sair"
            },
        ]
    }

    render() {
        return (
            <div id="indicadores">

                <div className="indicadores__mobile">
                    {this.mapMobileLink().map((item, index) => {
                        return (
                            <NavLink
                                className="menu-item-mobile"
                                key={index}
                                to={item.to}>

                                <h2 className="text-secondary text-secondary-mobile">
                                    {item.name}
                                </h2>
                            </NavLink>
                        )
                    })}
                </div>
                <div className="indicadores__web">
                    <Container className="container" id="indicadores">
                        {/*Especialidades e Carga horária*/}
                        <Row>
                            <Col xl="6">
                                <Row className="row-card">
                                    <Col md="12">
                                        <h1>Especialidade de maior demanda</h1>
                                    </Col>
                                </Row>
                                <Card>
                                    <div className="divCard">

                                        <RcIf if={!this.state.loadingEspecialidades}>
                                            <Chart
                                                width={'500px'}
                                                height={'300px'}
                                                chartType="PieChart"
                                                loader={<div>Carregando...</div>}
                                                data={

                                                    this.state.especialidades.map((item, i) => {
                                                        return (
                                                            i === 0 ? ["Especialidade", "Quantidade"] :
                                                                [!!item.especialidade ? item.especialidade : 'NÃO CADASTRADO', item.quantidade]
                                                        )
                                                    })
                                                }
                                                options={{
                                                    title: '',
                                                    // sliceVisibilityThreshold: 0,
                                                    colors: ["#56bbda", "#00a9b9", "#faa457", "#e9c95e", "#fb6c7b"]
                                                }}
                                                rootProps={{ 'data-testid': '1' }}
                                            />

                                        </RcIf>
                                    </div>

                                </Card>
                            </Col>

                            <Col xl="6" className="p-0">
                                <Row className="row-card">
                                    <Col md="8">
                                        <h1>Carga horária por estado</h1>
                                    </Col>

                                    <Col md="4">
                                        <Fab variant="extended" aria-label="Filtrar" className="filtrarIcon"
                                            onClick={() => this.toggleModalCargaHoraria("filtroCargaHorariaModal")}>
                                            <FaBeer size={16} />
                                            Filtrar
                                        </Fab>
                                    </Col>
                                </Row>
                                <Card>
                                    <div className="divCardEstado">
                                        <Row className="row-card">
                                            <Col md="4">
                                                <img className="mapa-brasil" src={MapaBrasil} alt="Mapa" />
                                            </Col>
                                            <Col md="3" />
                                            <Col md="4">
                                                <Table borderless={true} size={5}>

                                                    <tbody>
                                                        {this.state.estados.map((item, i) => {
                                                            return (
                                                                <tr>
                                                                    <td>
                                                                        <div className="quadrado"
                                                                            style={{ backgroundColor: item.cor }} />
                                                                    </td>
                                                                    <td>{item.estado}</td>
                                                                    <td className="td-carga-horaria">{item.cargaHoraria} Horas</td>
                                                                </tr>
                                                            )
                                                        })}

                                                    </tbody>
                                                </Table>
                                            </Col>

                                        </Row>
                                    </div>
                                </Card>
                            </Col>

                            {/*Atuação dos médicos e proporção por sexo*/}
                            <Col xl="6" className="m-t-30">
                                <Row className="row-card">
                                    <Col md="8">
                                        <h1>Atuação dos médicos</h1>
                                    </Col>

                                    <Col md="4">
                                        <Fab variant="extended" aria-label="Filtrar" className="filtrarIcon"
                                            onClick={() => this.toggleModalAtuacaoMedico("filtroAtuacaoMedicoModal")}>
                                            <FaBeer size={16} />
                                            Filtrar
                                        </Fab>
                                    </Col>
                                </Row>
                                <Card>
                                    <RcIf if={!this.state.loading}>

                                        <Table className="tableMedicos">
                                            <thead>
                                                <tr>
                                                    <th>Médico</th>
                                                    <th>% dos Plantões</th>
                                                    <th>Especialidade(s)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.profissionais.map((item, i) => {
                                                    return (
                                                        <tr>
                                                            <td>{item.medico.nome}</td>
                                                            <td>{item.porcentagem.toFixed(2)}%</td>
                                                            <td>{item.especialidade}</td>
                                                        </tr>
                                                    )
                                                })}

                                            </tbody>
                                        </Table>


                                    </RcIf>

                                </Card>
                            </Col>

                            <Col xl="6" className="m-t-30 p-0">
                                <Row className="row-card">
                                    <Col md="9">
                                        <h1>Proporção de médicos por sexo</h1>
                                    </Col>
                                    <Col md="3">
                                        <Fab variant="extended" aria-label="Filtrar" className="filtrarIcon"
                                            onClick={() => this.toggleModal("filtroProporcaoModal")}>
                                            <FaBeer size={16} />
                                            Filtrar
                                        </Fab>
                                    </Col>
                                </Row>
                                <Card>
                                    <Chart
                                        width={'500px'}
                                        height={'300px'}
                                        chartType="PieChart"
                                        loader={<div>Carregando...</div>}
                                        data={[
                                            ["Sexo", "Porcentagem"],
                                            ["Masculino", this.state.sexoMasculino],
                                            ["Feminino", this.state.sexoFeminino]
                                        ]}
                                        options={{
                                            title: '',
                                            colors: ["#56bbda", "#fb6c7b"]
                                        }}
                                        rootProps={{ 'data-testid': '1' }}
                                    />
                                </Card>
                            </Col>

                            {/*Gestão de escalas*/}
                            <Col xl="6" className="m-t-60">
                                <Row className="row-card">
                                    <Col md="8">
                                        <h1>Gestão de escalas</h1>
                                    </Col>

                                    <Col md="4">
                                        <Fab variant="extended" aria-label="Filtrar" className="filtrarIcon"
                                            onClick={() => this.toggleModal("filtroGestaoEscalaModal")}>
                                            <FaBeer size={16} />
                                            Filtrar
                                        </Fab>
                                    </Col>
                                </Row>
                                <Card>
                                    <RcIf if={!this.state.loading}>

                                        <Table className="tableMedicos">
                                            <thead>
                                                <tr>
                                                    <th>Doações de plantões</th>
                                                    <th>Trocas de plantões</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                <tr>
                                                    <td>{this.state.faltasPlantao}</td>
                                                    <td>{this.state.trocasPlantao}</td>
                                                </tr>


                                            </tbody>
                                        </Table>


                                    </RcIf>

                                </Card>
                            </Col>


                        </Row>

                        {/* Modal atuacao medico */}
                        <Modal
                            size="lg"
                            className="modal-dialog-centered"
                            isOpen={this.state.filtroAtuacaoMedicoModal}
                            toggle={() => this.toggleModalCargaHoraria("filtroAtuacaoMedicoModal")}
                        >
                            <div className="modal-header">
                                <h5 className="modal-title" id="filtroCargaHorariaModalLabel">
                                    Filtro
                                </h5>
                                <button
                                    aria-label="Close"
                                    className="close"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => this.toggleModalCargaHoraria("filtroAtuacaoMedicoModal")}
                                >
                                    <span aria-hidden={true}>×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <Form>

                                    <Row>
                                        <Col md="6">
                                            <span>Data Início</span>
                                            <FormGroup>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime onChange={this.handleDataInicioChange}
                                                        value={this.state.formFiltro.dataInicio}
                                                        inputProps={{
                                                            placeholder: 'Data Início',
                                                        }}
                                                        timeFormat={false}
                                                        dateFormat='DD/MM/YYYY'
                                                        locale='pt-br'
                                                        closeOnSelect={true}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <span>Data de Fim</span>
                                            <FormGroup>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime onChange={this.handleDataFimChange}
                                                        value={this.state.formFiltro.dataFim}
                                                        inputProps={{
                                                            placeholder: 'Data Fim',
                                                        }}
                                                        timeFormat={false}
                                                        dateFormat='DD/MM/YYYY'
                                                        locale='pt-br'
                                                        closeOnSelect={true}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Form>


                            </div>
                            <div className="modal-footer">
                                <Button
                                    color="secondary"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => this.toggleModalCargaHoraria("filtroAtuacaoMedicoModal")}
                                >
                                    Cancelar
                                </Button>
                                <Col md="4" className="m-t-24">
                                    <Button
                                        color="primary"
                                        type="button"
                                        onClick={() => this.listar()}
                                    >
                                        Filtrar
                                    </Button>
                                </Col>
                            </div>
                        </Modal>

                        {/* Modal estado */}
                        <Modal
                            size="lg"
                            className="modal-dialog-centered"
                            isOpen={this.state.filtroCargaHorariaModal}
                            toggle={() => this.toggleModalCargaHoraria("filtroCargaHorariaModal")}
                        >
                            <div className="modal-header">
                                <h5 className="modal-title" id="filtroCargaHorariaModalLabel">
                                    Filtro
                                </h5>
                                <button
                                    aria-label="Close"
                                    className="close"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => this.toggleModalCargaHoraria("filtroCargaHorariaModal")}
                                >
                                    <span aria-hidden={true}>×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <Form>

                                    <Row>
                                        <Col md="6">
                                            <span>Data de Início</span>
                                            <FormGroup>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime onChange={this.handleDataInicioEstadoChange}
                                                        value={this.state.formFiltroEstado.dataInicio}
                                                        inputProps={{
                                                            placeholder: 'Data Início',
                                                        }}
                                                        timeFormat={false}
                                                        dateFormat='DD/MM/YYYY'
                                                        locale='pt-br'
                                                        closeOnSelect={true}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <span>Data de Fim</span>
                                            <FormGroup>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime onChange={this.handleDataFimEstadoChange}
                                                        value={this.state.formFiltroEstado.dataFim}
                                                        inputProps={{
                                                            placeholder: 'Data Fim',
                                                        }}
                                                        timeFormat={false}
                                                        dateFormat='DD/MM/YYYY'
                                                        locale='pt-br'
                                                        closeOnSelect={true}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>

                                    </Row>
                                </Form>


                            </div>
                            <div className="modal-footer">
                                <Button
                                    color="secondary"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => this.toggleModalCargaHoraria("filtroCargaHorariaModal")}
                                >
                                    Cancelar
                                </Button>
                                <Col md="4" className="m-t-24">
                                    <Button
                                        color="primary"
                                        type="button"
                                        onClick={() => this.listarEstadoComFiltro()}
                                    >
                                        Filtrar
                                    </Button>
                                </Col>
                            </div>
                        </Modal>

                        {/* Modal gestão */}
                        <Modal
                            size="lg"
                            className="modal-dialog-centered"
                            isOpen={this.state.filtroGestaoEscalaModal}
                            toggle={() => this.toggleModal("filtroGestaoEscalaModal")}
                        >
                            <div className="modal-header">
                                <h5 className="modal-title" id="filtroGestaoEscalaModal">
                                    Filtro
                                </h5>
                                <button
                                    aria-label="Close"
                                    className="close"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => this.toggleModal("filtroGestaoEscalaModal")}
                                >
                                    <span aria-hidden={true}>×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <Form>

                                    <Row>
                                        <Col md="6">
                                            <span>Data de Início</span>
                                            <FormGroup>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime onChange={this.handleDataInicioGestaoChange}
                                                        value={this.state.dataInicioIndicadorGestao}
                                                        inputProps={{
                                                            placeholder: 'Data Início',
                                                        }}
                                                        timeFormat={false}
                                                        dateFormat='DD/MM/YYYY'
                                                        locale='pt-br'
                                                        closeOnSelect={true}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <span>Data de Fim</span>
                                            <FormGroup>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime onChange={this.handleDataFimGestaoChange}
                                                        value={this.state.dataFimIndicadorGestao}
                                                        inputProps={{
                                                            placeholder: 'Data Fim',
                                                        }}
                                                        timeFormat={false}
                                                        dateFormat='DD/MM/YYYY'
                                                        locale='pt-br'
                                                        closeOnSelect={true}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>

                                    </Row>
                                </Form>


                            </div>
                            <div className="modal-footer">
                                <Button
                                    color="secondary"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => this.toggleModal("filtroGestaoEscalaModal")}
                                >
                                    Cancelar
                                </Button>
                                <Col md="4" className="m-t-24">
                                    <Button
                                        color="primary"
                                        type="button"
                                        onClick={() => this.listarGestaoComFiltro()}
                                    >
                                        Filtrar
                                    </Button>
                                </Col>
                            </div>
                        </Modal>

                        {/* Modal proporção sexo */}
                        <Modal
                            size="lg"
                            className="modal-dialog-centered"
                            isOpen={this.state.filtroProporcaoModal}
                            toggle={() => this.toggleModal("filtroProporcaoModal")}
                        >
                            <div className="modal-header">
                                <h5 className="modal-title" id="filtroProporcaoModal">
                                    Filtro
                                </h5>
                                <button
                                    aria-label="Close"
                                    className="close"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => this.toggleModal("filtroProporcaoModal")}
                                >
                                    <span aria-hidden={true}>×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <Form>

                                    <Row>
                                        <Col md="6">
                                            <span>Data de Início</span>
                                            <FormGroup>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime onChange={this.handleDataInicioProporcaoChange}
                                                        value={this.state.formFiltroProporcao.dataInicio}
                                                        inputProps={{
                                                            placeholder: 'Data Início',
                                                        }}
                                                        timeFormat={false}
                                                        dateFormat='DD/MM/YYYY'
                                                        locale='pt-br'
                                                        closeOnSelect={true}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <span>Data de Fim</span>
                                            <FormGroup>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime onChange={this.handleDataFimProporcaoChange}
                                                        value={this.state.formFiltroProporcao.dataFim}
                                                        inputProps={{
                                                            placeholder: 'Data Fim',
                                                        }}
                                                        timeFormat={false}
                                                        dateFormat='DD/MM/YYYY'
                                                        locale='pt-br'
                                                        closeOnSelect={true}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>

                                    </Row>
                                </Form>


                            </div>
                            <div className="modal-footer">
                                <Button
                                    color="secondary"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => this.toggleModal("filtroProporcaoModal")}
                                >
                                    Cancelar
                                </Button>
                                <Col md="4" className="m-t-24">
                                    <Button
                                        color="primary"
                                        type="button"
                                        onClick={() => this.listarProporcaoComFiltro()}
                                    >
                                        Filtrar
                                    </Button>
                                </Col>
                            </div>
                        </Modal>

                    </Container>
                    <Footer />
                </div>
            </div>
        );
    }
}


export default Indicadores;
