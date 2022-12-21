import React from 'react';

// reactstrap components
import { Button, Card, Col, Input, Row, Table } from 'reactstrap';

import './GestaoEscala.lista.scss';
import EscalaService from '../../services/escala.service';
import Container from 'reactstrap/es/Container';
import { ClipLoader } from 'react-spinners';
import moment from 'moment';
import ReactDatetime from 'react-datetime';

class GestaoEscalaLista extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listaEscala: [],
            loading: true,
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
        this.defineFiltroParams();
    };

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

    toPage = (item, e) => {
        e.preventDefault();
        // window.close("/admin/lista-gestao-escala/");
        this.props.history.push('/admin/tabela-gestao-escala/' + item.id + '/' + window.btoa(item.nomeEscala));
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
                filtroDataFim: null
            },
            () => this.listar()
        );
    };

    render() {
        return (
            <>
                <Container className=" mt-5" fluid id="gestao-escala-lista">
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
                        <Col className="button-style" md="3">
                            <Button className="button-style--first" color="secondary" type="button" onClick={() => this.listar()}>
                                Filtrar
                            </Button>
                            <Button className="button-style--second" color="secondary" type="button" onClick={() => this.handleLimparFiltro()}>
                                Limpar filtros
                            </Button>
                        </Col>
                    </Row>
                    <div className="table__web">
                        <Card>
                            <Table>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Nome da Escala</th>
                                        <th scope="col">Mês</th>
                                        <th scope="col">Cód do Contrato</th>
                                        <th scope="col">Local</th>
                                        <th scope="col">Coordenador</th>
                                        {/*<th scope="col">Opções</th>*/}
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.loading ? (
                                        <tr>
                                            <td colSpan="12" align="center">
                                                <ClipLoader sizeUnit={'px'} size={50} margin={'2px'} color={'#149d5b'} loading={this.state.loading} />
                                            </td>
                                        </tr>
                                    ) : null}
                                    {this.state.listaEscala.map((item, i) => {
                                        return (
                                            <tr key={i} onClick={e => this.toPage(item, e)} className="select-escala">
                                                {/*<td  key={item.id}>*/}
                                                <td>
                                                    <div className="round-number-container">
                                                        <span>{item.numeroCandidatos}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    {/*<Link to={`/admin/tabela-gestao-escala/${item.id}`}>*/}
                                                    {item.nomeEscala}
                                                    {/*</Link>*/}
                                                </td>
                                                <td>
                                                    {new Intl.DateTimeFormat('default', {
                                                        month: 'long'
                                                    })
                                                        .format(moment(item.periodoInicio))
                                                        .toUpperCase()}
                                                </td>
                                                <td>{item.contrato.codigo}</td>
                                                <td>{item.contrato.local}</td>
                                                <td>{item.coordenador.nome}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </Card>
                    </div>
                    <div className="table__mobile">
                        {this.state.listaEscala.map((item, i) => {
                            return (
                                <Row key={i} onClick={e => this.toPage(item, e)}>
                                    <Col style={{ marginBottom: '20px' }}>
                                        <Card>
                                            <Table>
                                                <tbody>
                                                    <tr>
                                                        <td className="table__mobile--header">Nr. Candidatos</td>
                                                        <td>
                                                            {' '}
                                                            <div className="round-number-container">
                                                                <div className="round-number-container--mobile">{item.numeroCandidatos}</div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="table__mobile--header">Escala</td>
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
                                                        <td>{item.contrato.codigo}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="table__mobile--header">Local</td>
                                                        <td>{item.contrato.local}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="table__mobile--header">Coordenador</td>
                                                        <td>{item.coordenador.nome}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Card>
                                    </Col>
                                </Row>
                            );
                        })}
                    </div>
                </Container>
            </>
        );
    }
}
export default GestaoEscalaLista;
