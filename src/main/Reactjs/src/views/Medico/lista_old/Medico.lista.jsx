import { css } from '@emotion/core';
import React from 'react';
import { isEmpty } from 'lodash';
import Trash from 'react-icons/lib/fa/trash';
import Edit from 'react-icons/lib/ti/edit';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
// reactstrap components
import { Button, Card, Col, Input, Row, Table } from 'reactstrap';
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
import UsuarioFactory from '../../Usuario/Usuario.factory';
import './Medico.lista.scss';

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
            waitingDownload: false,
            exporting: false
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
        const { filtroDoc, filtroMedicos, filtroEstados, filtroEspecialidade } = this.state;

        const filtroAtivo = filtroMedicos === 'TODOS_MEDICOS' ? null : filtroMedicos;
        const status = filtroDoc === 'TODOS_DOCS' ? null : filtroDoc;
        const ufConselhoMedico = filtroEstados === 'TODOS_ESTADOS' ? null : filtroEstados;
        const especialidade = filtroEspecialidade === 'TODAS_ESPECIALIDADES' ? null : filtroEspecialidade;

        this.setState({
            loading: true
        });

        UsuarioAppService.listar(filtroAtivo, status, ufConselhoMedico, especialidade).subscribe(
            data => {
                if (!!data) {
                    this.setState({ listaUsuarioApp: data });
                    this.setState({ loading: false });
                    this.changePath();
                }
            },
            error => {
                this.setState({ loading: false });
                console.error(error);
                toast.error(ERRO_INTERNO);
            }
        );
        EscalaService.listarComboEspecialidade().subscribe(
            data => {
                if (!!data) {
                    this.setState({ listaEspecialidade: data });
                }
            },
            error => console.error(error)
        );
    };

    gerarExcel() {
        const { filtroDoc, filtroMedicos, filtroEstados, filtroEspecialidade, listaEspecialidade, listaMedicosSelecionados } = this.state;

        const filtroAtivo = filtroMedicos === 'TODOS_MEDICOS' ? null : filtroMedicos;
        const status = filtroDoc === 'TODOS_DOCS' ? null : filtroDoc;
        const ufConselhoMedico = filtroEstados === 'TODOS_ESTADOS' ? null : filtroEstados;
        let medicosSelecionados = listaMedicosSelecionados === [] ? null : listaMedicosSelecionados.join('');

        let nomeEspecialidade = '';
        listaEspecialidade.forEach(element => (parseInt(filtroEspecialidade) === element.id ? (nomeEspecialidade = element.descricao) : null));

        const especialidade = filtroEspecialidade === 'TODAS_ESPECIALIDADES' ? null : nomeEspecialidade;

        this.setState({
            exporting: true
        });

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
        if (status === 'P') {
            return clock;
        } else if (status === 'EA') {
            return exclamationBlue;
        } else if (status === 'DP') {
            return exclamation;
        } else if (status === 'C') {
            return check;
        } else if (cadastroCompleto) {
            return exclamation;
        }
        return '';
    };

    getStatusTitle = (status, cadastroCompleto) => {
        if (status === 'P') {
            return 'Pré-cadastro';
        } else if (status === 'EA') {
            return 'Em análise';
        } else if (status === 'DP') {
            return 'Documentos pendentes';
        } else if (status === 'C') {
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
                listaMedicosSelecionados: []
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

                const filtroAtivo = filtroMedicos === 'TODOS_MEDICOS' ? null : filtroMedicos;
                const status = filtroDoc === 'TODOS_DOCS' ? null : filtroDoc;
                const ufConselhoMedico = filtroEstados === 'TODOS_ESTADOS' ? null : filtroEstados;
                let medicosSelecionados = listaMedicosSelecionados === [] ? null : listaMedicosSelecionados.join('');

                let nomeEspecialidade = '';
                listaEspecialidade.forEach(element => (parseInt(filtroEspecialidade) === element.id ? (nomeEspecialidade = element.descricao) : null));

                const especialidade = filtroEspecialidade === 'TODAS_ESPECIALIDADES' ? null : nomeEspecialidade;

                // console.log(filtroAtivo, status, ufConselhoMedico, especialidade);
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

    render() {
        return (
            <>
                {/*<Header/>*/}

                {/* Page content */}
                <Container className=" mt-5 list-medic">
                    <Row id="header-list-medic" className="mb-2">
                        <Col xs="12">
                            {this.state.exporting ? (
                                <ClipLoader css={override} sizeUnit={'px'} size={50} color={'#009776'} loading={this.state.exporting} />
                            ) : null}
                            <Button hidden={!this.state.permissao} className="btn-primary ml-2 mt-2" onClick={() => this.gerarExcel()}>
                                <span>{BTN_EXPORTAR}</span>
                            </Button>
                        </Col>
                    </Row>
                    <Row id="header-list-medic" className="mb-2">
                        <Col xs="12">
                            {this.state.waitingDownload ? (
                                <ClipLoader css={override} sizeUnit={'px'} size={50} color={'#009776'} loading={this.state.waitingDownload} />
                            ) : null}
                            <Button
                                hidden={!this.state.permissao}
                                className="btn-primary btn-primary-mobile ml-2 mt-2"
                                onClick={this.handleButtonAttachmentDownload}
                                disabled={this.state.waitingDownload || this.state.loading}
                            >
                                <span>
                                    {!!this.state.waitingDownalodProcess && !!this.state.compressAttachment
                                        ? 'Verificar se terminou de comprimir' + '.'.repeat(this.state.ttlDots % 5)
                                        : this.state.waitingDownload
                                        ? 'Comprimindo os arquivos' + '.'.repeat(this.state.ttlDots % 5)
                                        : 'Download dos documentos de todos os médicos'}
                                </span>
                            </Button>
                        </Col>
                    </Row>
                    <Row id="header-list-medic" className="mb-5">
                        <Col md="6">
                            <Link hidden={!this.state.permissao} to="/admin/cadastro-usuario-app">
                                <Button className="btn-primary btn-primary-mobile ml-2">{BTN_CADASTRAR_MEDICO}</Button>
                            </Link>
                        </Col>
                    </Row>
                    <Card className="b-r-1 p-t-50  header-list-mobile__medic">
                        <Row className="p-b-20 p-t-20 m-l-0 m-r-1">
                            <Col md="2" xs="12" className="list-medic-mobile--imput">
                                <Input
                                    type="select"
                                    name="select"
                                    id="diaSelect"
                                    defaultValue={'TODOS_MEDICOS'}
                                    onChange={this.handleFiltroMedico}
                                    value={this.state.filtroMedicos}
                                >
                                    <option value="TODOS_MEDICOS">Todos os médicos</option>
                                    <option value="ATIVOS">Médicos ativos</option>
                                    <option value="INATIVOS">Médicos inativos</option>
                                </Input>
                            </Col>
                            <Col md="2" className="list-medic-mobile--imput">
                                <Input type="select" name="select" id="diaSelect" onChange={this.handleFiltroDocs} value={this.state.filtroDoc}>
                                    <option value="TODOS_DOCS">Todos os status</option>
                                    <option value="PRE_REGISTRATION">Pré-cadastro</option>
                                    <option value="FINISHED">Cadastro completo</option>
                                    <option value="IN_ANALYSIS">Em análise</option>
                                    <option value="PENDING_DOCUMENTS">Documentos pendentes</option>
                                </Input>
                            </Col>
                            <Col md="2" className="list-medic-mobile--imput">
                                <Input type="select" name="select" id="diaSelect" onChange={this.handleFiltroEstados} value={this.state.filtroEstados}>
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
                                </Input>
                            </Col>
                            <Col md="2" className="list-medic-mobile--imput">
                                <Input
                                    type="select"
                                    name="select"
                                    id="diaSelect"
                                    onChange={this.handleFiltroEspecialidade}
                                    value={this.state.filtroEspecialidade}
                                >
                                    <option value="TODAS_ESPECIALIDADES">Todas as Especialidades</option>
                                    {this.state.listaEspecialidade.map((item, i) => {
                                        return (
                                            <option key={item.id} value={item.id}>
                                                {item.descricao}
                                            </option>
                                        );
                                    })}
                                </Input>
                            </Col>
                            <Col md="3" className="button-style">
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
                                            <th scope="col">
                                                {/* <Input 
                          type="checkbox" 
                          checked={this.state.todosMedicosSelecionados ? true : false} 
                          className="checkbox" 
                          id="checkbox-th" 
                          onClick={e => this.handleCheckTodosMedicos(e)}
                        /> */}
                                            </th>
                                            <th scope="col">Nome</th>
                                            <th scope="col">E-mail</th>
                                            <th scope="col">Sexo</th>
                                            <th scope="col">Telefone</th>
                                            <th scope="col">Uf Conselho Médico</th>
                                            <th scope="col">Status</th>
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

                                        {this.state.listaUsuarioApp.map((item, i) => {
                                            return (
                                                <tr
                                                    // key={i}
                                                    key={item.id}
                                                    className={`table-line-container ${item.ativo ? '' : 'deactivated'}`}
                                                >
                                                    <td>
                                                        <Input
                                                            type="checkbox"
                                                            // checked={this.state.listaMedicosSelecionados.map(idSelecionado => idSelecionado === item.id ? true : false)}
                                                            className="checkbox"
                                                            onClick={e => this.handleCheckMedico(e, item.id)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <span>{item.nome}</span>
                                                    </td>
                                                    <td>
                                                        <span>{item.email}</span>
                                                    </td>
                                                    <td>
                                                        <span>{item.sexo}</span>
                                                    </td>
                                                    <td>
                                                        <span>{item.telefone}</span>
                                                    </td>
                                                    <td>
                                                        <span>{item.ufConselhoMedico}</span>
                                                    </td>
                                                    <td>
                                                        <img
                                                            alt=""
                                                            title={this.getStatusTitle(item.status, item.cadastroCompleto)}
                                                            src={this.getStatusImage(item.status, item.cadastroCompleto)}
                                                        />
                                                    </td>
                                                    <td key={item.id}>
                                                        <Row>
                                                            {/*           <Col md="2">
                                                        <Link to={`/admin/visualizar-usuario-app/${item.id}`}>
                                                            <Eye size={24} color="black"/>
                                                        </Link>
                                                    </Col>*/}
                                                            <Col md="2" hidden={!this.state.permissao}>
                                                                <Link to={`/admin/cadastro-usuario-app/${item.id}`}>
                                                                    <Edit size={24} color="black" />
                                                                </Link>
                                                            </Col>
                                                            <Col md="2" hidden={!this.state.permissao || this.state.permissao11} className="pointer">
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
                        </div>
                    </Card>
                    <div className="table__mobile">
                        {this.state.listaUsuarioApp.map((item, i) => {
                            return (
                                <Row>
                                    <Col style={{ marginBottom: '20px' }}>
                                        <Card>
                                            <Table>
                                                <tbody>
                                                    <tr>
                                                        <td className="table__mobile--header-second">Nome</td>
                                                        <td style={{ whiteSpace: 'initial' }}>{item.nome}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="table__mobile--header-second">Status</td>
                                                        <td>
                                                            {' '}
                                                            <img
                                                                alt=""
                                                                title={this.getStatusTitle(item.status, item.cadastroCompleto)}
                                                                src={this.getStatusImage(item.status, item.cadastroCompleto)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="table__mobile--header-second">Opções</td>
                                                        <td key={item.id}>
                                                            <div
                                                                style={{
                                                                    display: 'flex'
                                                                }}
                                                            >
                                                                <div style={{ marginRight: '60px' }} hidden={!this.state.permissao}>
                                                                    <Link to={`/admin/cadastro-usuario-app/${item.id}`}>
                                                                        <Edit size={24} color="black" />
                                                                    </Link>
                                                                </div>
                                                                <div hidden={!this.state.permissao || this.state.permissao11} className="pointer">
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
                </Container>
            </>
        );
    }
}

export default MedicoLista;
