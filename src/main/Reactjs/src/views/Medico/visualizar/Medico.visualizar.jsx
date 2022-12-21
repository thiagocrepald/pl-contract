import Divider from '@material-ui/core/Divider';
import RcIf from 'rc-if';
import React from 'react';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify/index';
// reactstrap components
import { Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Modal, Row } from 'reactstrap';
import UsuarioAppService from '../../../services/usuario.app.service';
import UtilService from '../../../services/util.service';
import UsuarioFactory from '../../Usuario/Usuario.factory';
import './Medico.visualizar.scss';

class MedicoVisualizar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            permissao: false,
            formData: {
                id: '',
                nome: '',
                email: '',
                senha: '',
                telefone: '',
                ufConselhoMedico: '',
                sexo: '',
                loading: true,
                validado: '',
                observacoesValidacao: '',
                listaEspecialidadeSelecionado: [],
                listTodosAnexosMedicoVo: [],

                //Anexos
                anexoCrmFrente: '',
                nomeAnexoCrmFrente: '',
                tamanhoAnexoCrmFrente: '',
                tipoAnexoCrmFrente: '',

                anexoCrmVerso: '',
                nomeAnexoCrmVerso: '',
                tamanhoAnexoCrmVerso: '',
                tipoAnexoCrmVerso: '',

                anexoFoto: '',
                nomeAnexoFoto: '',
                tamanhoAnexoFoto: '',
                tipoAnexoFoto: '',

                anexoProtocolo: '',
                nomeAnexoProtocolo: '',
                tamanhoAnexoProtocolo: '',
                tipoAnexoProtocolo: '',

                anexoDiploma: '',
                nomeAnexoDiploma: '',
                tamanhoAnexoDiploma: '',
                tipoAnexoDiploma: '',

                anexoRg: '',
                nomeAnexoRg: '',
                tamanhoAnexoRg: '',
                tipoAnexoRg: '',

                anexoCpf: '',
                nomeAnexoCpf: '',
                tamanhoAnexoCpf: '',
                tipoAnexoCpf: '',

                anexoEndereco: '',
                nomeAnexoEndereco: '',
                tamanhoAnexoEndereco: '',
                tipoAnexoEndereco: '',

                anexoRqe: '',
                nomeAnexoRqe: '',
                tamanhoAnexoRqe: '',
                tipoAnexoRqe: '',

                anexoTitulo: '',
                nomeAnexoTitulo: '',
                tamanhoAnexoTitulo: '',
                tipoAnexoTitulo: '',

                anexoCasamento: '',
                nomeAnexoCasamento: '',
                tamanhoAnexoCasamento: '',
                tipoAnexoCasamento: '',

                anexoCursos: '',
                nomeAnexoCursos: '',
                tamanhoAnexoCursos: '',
                tipoAnexoCursos: '',
                //Fim Anexos

                base64Anexo: '',
                campoAnexo: '',
                nomeAnexo: '',
                tamanhoAnexo: '',

                tipoRecebimento: ''
            },
            modalVisualizarAnexo: false,
            formAnexoModal: {
                id: '',
                base64Anexo: '',
                ehHistorico: '',
                nomeAnexo: '',
                tipoAnexo: ''
            },
            itemAnexoModal: ''
        };
    }

    componentDidMount = async () => {
        const usuarioLogado = UsuarioFactory.getUsuarioLogado();
        if (!usuarioLogado) {
            this.props.history.push('/auth/login');
        } else {
            if (!!usuarioLogado.listaUsuarioTipoPermissao) {
                for (let i = 0; i < usuarioLogado.listaUsuarioTipoPermissao.length; i++) {
                    if (usuarioLogado.listaUsuarioTipoPermissao[i].tipoPermissao.id === 9) {
                        this.setState({ permissao: true });
                    }
                }
            }
        }
        const {
            match: { params }
        } = this.props;
        if (!!params && !!params.userId) {
            let usuarioAppVo = { id: params.userId };

            this.retornaUsuario(usuarioAppVo);
        }
    };

    retornaUsuario = async (usuarioAppVo) => {
        await UsuarioAppService.getByIdVisualizar(usuarioAppVo).subscribe(
            (data) => {
                if (!!data && !data.erro) {
                    usuarioAppVo = data.objeto;
                    this.setObjToState(usuarioAppVo);
                }
            },
            (error) => console.error(error)
        );
    };

    setObjToState = (obj) => {
        let { formData } = this.state;
        /*        let formData = {...this.state.formData};*/
        formData.id = obj.id;
        formData.nome = obj.nome;
        formData.telefone = obj.telefone;
        formData.email = obj.email;
        formData.ufConselhoMedico = obj.ufConselhoMedico;
        formData.sexo = obj.sexo;

        //Anexos
        formData.anexoCrmFrente = obj.anexoCrmFrente;
        formData.nomeAnexoCrmFrente = obj.nomeAnexoCrmFrente;
        formData.tamanhoAnexoCrmFrente = obj.tamanhoAnexoCrmFrente;
        formData.tipoAnexoCrmFrente = obj.tipoAnexoCrmFrente;

        formData.anexoCrmVerso = obj.anexoCrmVerso;
        formData.nomeAnexoCrmVerso = obj.nomeAnexoCrmVerso;
        formData.tamanhoAnexoCrmVerso = obj.tamanhoAnexoCrmVerso;
        formData.tipoAnexoCrmVerso = obj.tipoAnexoCrmVerso;

        formData.anexoProtocolo = obj.anexoProtocolo;
        formData.nomeAnexoProtocolo = obj.nomeAnexoProtocolo;
        formData.tamanhoAnexoProtocolo = obj.tamanhoAnexoProtocolo;
        formData.tipoAnexoProtocolo = obj.tipoAnexoProtocolo;

        formData.anexoDiploma = obj.anexoDiploma;
        formData.nomeAnexoDiploma = obj.nomeAnexoDiploma;
        formData.tamanhoAnexoDiploma = obj.tamanhoAnexoDiploma;
        formData.tipoAnexoDiploma = obj.tipoAnexoDiploma;

        formData.anexoRg = obj.anexoRg;
        formData.nomeAnexoRg = obj.nomeAnexoRg;
        formData.tamanhoAnexoRg = obj.tamanhoAnexoRg;
        formData.tipoAnexoRg = obj.tipoAnexoRg;

        formData.anexoCpf = obj.anexoCpf;
        formData.nomeAnexoCpf = obj.nomeAnexoCpf;
        formData.tamanhoAnexoCpf = obj.tamanhoAnexoCpf;
        formData.tipoAnexoCpf = obj.tipoAnexoCpf;

        formData.anexoEndereco = obj.anexoEndereco;
        formData.nomeAnexoEndereco = obj.nomeAnexoEndereco;
        formData.tamanhoAnexoEndereco = obj.tamanhoAnexoEndereco;
        formData.tipoAnexoEndereco = obj.tipoAnexoEndereco;

        formData.anexoRqe = obj.anexoRqe;
        formData.nomeAnexoRqe = obj.nomeAnexoRqe;
        formData.tamanhoAnexoRqe = obj.tamanhoAnexoRqe;
        formData.tipoAnexoRqe = obj.tipoAnexoRqe;

        formData.anexoTitulo = obj.anexoTitulo;
        formData.nomeAnexoTitulo = obj.nomeAnexoTitulo;
        formData.tamanhoAnexoTitulo = obj.tamanhoAnexoTitulo;
        formData.tipoAnexoTitulo = obj.tipoAnexoTitulo;

        formData.anexoCasamento = obj.anexoCasamento;
        formData.nomeAnexoCasamento = obj.nomeAnexoCasamento;
        formData.tamanhoAnexoCasamento = obj.tamanhoAnexoCasamento;
        formData.tipoAnexoCasamento = obj.tipoAnexoCasamento;

        formData.anexoCursos = obj.anexoCursos;
        formData.nomeAnexoCursos = obj.nomeAnexoCursos;
        formData.tamanhoAnexoCursos = obj.tamanhoAnexoCursos;
        formData.tipoAnexoCursos = obj.tipoAnexoCursos;

        formData.anexoFoto = obj.anexoFoto;
        formData.nomeAnexoFoto = obj.nomeAnexoFoto;
        formData.tamanhoAnexoFoto = obj.tamanhoAnexoFoto;
        formData.tipoAnexoFoto = obj.tipoAnexoFoto;
        //anexos

        formData.validado = obj.validado;
        formData.observacoesValidacao = obj.observacoesValidacao;
        formData.listaEspecialidadeSelecionado = obj.listaEspecialidadeSelecionado;
        formData.listTodosAnexosMedicoVo = obj.listTodosAnexosMedicoVo;

        formData.tipoRecebimento = obj.tipoRecebimento;

        this.setState({ formData });
    };

    handleValidarChange = (e) => {
        let formData = { ...this.state.formData };
        formData.validado = !this.state.formData.validado;
        this.setState({ formData: formData });
    };

    handleObservacaoChange = (e) => {
        let formData = { ...this.state.formData };
        formData.observacoesValidacao = e.target.value;
        this.setState({ formData: formData });
    };

    handleValidadoChange = (e) => {
        let formData = { ...this.state.formData };
        formData.validado = !formData.validado;
        this.setState({ formData });
    };

    handleSubmitValidar = async (e) => {
        e.preventDefault();
        if (this.state != null) {
            // if (this.state.formData.observacoesValidacao.length !== 0) {
            this.salvaRegistro(this.state.formData);
            // } else {
            //     if (this.state.formData.observacoesValidacao.length === 0) {
            //         toast.error("Preencha os Campos Obrigatórios!!!");
            //     }
            // }
        } else {
            toast.error('Preencha os Campos do Formuláio!!!');
        }
    };

    salvaRegistro = (item) => {
        UsuarioAppService.validar(item).subscribe(
            (data) => {
                if (!!data) {
                    if (data.erro) {
                        toast.error(data.mensagem);
                    } else {
                        toast.success(data.mensagem);
                        this.props.history.push('/admin/usuarioApp');
                    }
                }
            },
            (error) => console.error(error)
        );
    };

    retornaEspecialidades = (especialidades) => {
        if (especialidades.length !== 0) {
            let esp = '';
            for (let i = 0; i < especialidades.length; i++) {
                esp += especialidades[i].especialidade.descricao + ' ';
            }
            return esp;
        }
    };

    verificaTipoAnexo = (anexoTipo) => {
        if (anexoTipo !== undefined && anexoTipo !== '' && anexoTipo !== null) {
            let tipoAnexo = anexoTipo.split('/');
            if (tipoAnexo[0] === 'image') {
                return 'image';
            } else {
                return 'application';
            }
        }
        return;
    };

    baixarAnexo = (e, formAnexoModal) => {
        e.preventDefault();
        if (formAnexoModal && formAnexoModal.base64Anexo && formAnexoModal && formAnexoModal.base64Anexo.length > 0) {
            UtilService.download(formAnexoModal.base64Anexo, formAnexoModal.nomeAnexo);
        }
    };

    retornaBase64 = (formAnexoModal) => {
        if (formAnexoModal && formAnexoModal.base64Anexo) {
            if (formAnexoModal.base64Anexo.indexOf('base64,') > 0) {
                formAnexoModal.base64Anexo = formAnexoModal.base64Anexo.toString().substring(formAnexoModal.base64Anexo.indexOf('base64,') + 7);
            }
            return 'data:' + this.state.formAnexoModal.tipoAnexo + ';base64,' + this.state.formAnexoModal.base64Anexo;
        }
        return '';
    };

    retornaTipoArquivo = (nomeArquivo) => {
        if (nomeArquivo !== undefined && nomeArquivo !== '' && nomeArquivo !== null) {
            let nomeSplit = nomeArquivo.split('.');
            let tipoArquivo = nomeSplit[nomeSplit.length - 1];
            if (tipoArquivo === 'png') {
                return tipoArquivo;
            } else if (tipoArquivo === 'raw') {
                return tipoArquivo;
            } else if (tipoArquivo === 'jpg') {
                return tipoArquivo;
            } else {
                return 'jpeg';
            }
        }
    };

    handelObervacaoValidadoChange(itemAnexo, i, u) {
        const indexObjSelecionado = this.state.formData.listTodosAnexosMedicoVo.findIndex((obj) => obj.campoAnexo.id === itemAnexo.campoAnexo.id);

        if (indexObjSelecionado !== -1) {
            let listTodosAnexosMedicoVo = { ...this.state.formData.listTodosAnexosMedicoVo };

            const indexObjAnexoSelecionado = listTodosAnexosMedicoVo[indexObjSelecionado].listMedicoAnexo.findIndex((objAnexo) => objAnexo.id === itemAnexo.id);
            if (indexObjAnexoSelecionado !== -1) {
                listTodosAnexosMedicoVo[indexObjSelecionado].listMedicoAnexo[indexObjAnexoSelecionado].observacaoValidacao = u.target.value;
            }
            this.setState({ listTodosAnexosMedicoVo });
            console.log(listTodosAnexosMedicoVo);
        }
    }

    handleValidaChange(itemAnexo, i, e) {
        const indexObjSelecionado = this.state.formData.listTodosAnexosMedicoVo.findIndex((obj) => obj.campoAnexo.id === itemAnexo.campoAnexo.id);

        if (indexObjSelecionado !== -1) {
            let listTodosAnexosMedicoVo = { ...this.state.formData.listTodosAnexosMedicoVo };
            const indexObjAnexoSelecionado = listTodosAnexosMedicoVo[indexObjSelecionado].listMedicoAnexo.findIndex((objAnexo) => objAnexo.id === itemAnexo.id);
            if (indexObjAnexoSelecionado !== -1) {
                listTodosAnexosMedicoVo[indexObjSelecionado].listMedicoAnexo[indexObjAnexoSelecionado].validado = !itemAnexo.validado;
            }
            this.setState({ listTodosAnexosMedicoVo });
            console.log(listTodosAnexosMedicoVo);
        }
    }

    toggleModal = (state, itemAnexo, item = '') => {
        this.setState({
            [state]: !this.state[state],
            itemAnexo: itemAnexo
        });
        let formAnexoModal = { ...this.state.formAnexoModal };
        formAnexoModal.id = !!itemAnexo && !!itemAnexo.id ? itemAnexo.id : null;
        formAnexoModal.base64Anexo = !!itemAnexo && !!itemAnexo.base64Anexo ? itemAnexo.base64Anexo : null;
        formAnexoModal.ehHistorico = !!itemAnexo && !!itemAnexo.ehHistorico ? itemAnexo.ehHistorico : null;
        formAnexoModal.nomeAnexo = !!itemAnexo && !!itemAnexo.nomeAnexo ? itemAnexo.nomeAnexo : null;
        formAnexoModal.tipoAnexo = !!itemAnexo && !!itemAnexo.tipoAnexo ? itemAnexo.tipoAnexo : null;

        this.setState({ formAnexoModal: formAnexoModal, itemAnexoModal: item });
    };

    changeColorRow = (itemAnexo) => {
        if (itemAnexo.ehHistorico) {
            return { color: '#d93025' };
        } else if (!itemAnexo.ehHistorico) {
            return { color: '#188038' };
        }
    };

    renderizaAnexos(lista) {
        let hashAnterior = null;
        let html = null;
        lista.map((anexo, index) => {
            if (hashAnterior !== null && anexo.hash !== null) {
                if (anexo.hash !== hashAnterior) {
                    html = (
                        <div>
                            <Divider />
                            <a className='cursor-custom' onClick={() => this.toggleModal('modalVisualizarAnexo', anexo)}>
                                {anexo.nomeAnexo}
                            </a>
                            <label className='p-l-5' style={this.changeColorRow(anexo)} hidden={!anexo.ehHistorico}>
                                (Histórico) {anexo.ehVerso ? ' VERSO' : ' FRENTE'}
                            </label>
                            <label className='p-l-5' style={this.changeColorRow(anexo)} hidden={!!anexo.ehHistorico}>
                                {anexo.ehVerso ? ' VERSO' : ' FRENTE'}
                            </label>

                            <label>{anexo.hash ? anexo.hash : ''}</label>

                            <label hidden={anexo.ehHistorico} onChange={(e) => this.handleValidaChange(anexo, index, e)} key={index}>
                                <input className='p-l-3' type='radio' value={true} checked={anexo.validado} />
                                Válido
                                <input type='radio' value={false} checked={!anexo.validado} />
                                Inválido
                            </label>
                        </div>
                    );
                }
            } else {
                html = (
                    <div>
                        <a className='cursor-custom' onClick={() => this.toggleModal('modalVisualizarAnexo', anexo)}>
                            {anexo.nomeAnexo}
                        </a>
                        <label className='p-l-5' style={this.changeColorRow(anexo)} hidden={!anexo.ehHistorico}>
                            (Histórico) {anexo.ehVerso ? ' VERSO' : ' FRENTE'}
                        </label>
                        <label className='p-l-5' style={this.changeColorRow(anexo)} hidden={!!anexo.ehHistorico}>
                            {anexo.ehVerso ? ' VERSO' : ' FRENTE'}
                        </label>

                        <label>{anexo.hash ? anexo.hash : ''}</label>

                        <label hidden={anexo.ehHistorico} onChange={(e) => this.handleValidaChange(anexo, index, e)} key={index}>
                            <input className='p-l-3' type='radio' value={true} checked={anexo.validado} />
                            Válido
                            <input type='radio' value={false} checked={!anexo.validado} />
                            Inválido
                        </label>
                    </div>
                );
            }

            hashAnterior = anexo.hash;
            return html;
        });
    }

    excluirMedicoAnexo = async () => {
        // console.log('formAnexoModal:', this.state.formAnexoModal);
        // console.log('itemAnexoModal:', this.state.itemAnexoModal);

        await UsuarioAppService.excluirMedicoAnexo(this.state.formAnexoModal).subscribe(
            (info) => {
                if (!!info && !info.erro) {
                    for (let i = 0; i < this.state.formData.listTodosAnexosMedicoVo.length; i++) {
                        const item = this.state.formData.listTodosAnexosMedicoVo[i];
                        if (!!item.campoAnexo) {
                            if (item.campoAnexo.id === this.state.itemAnexoModal.campoAnexo.id) {
                                console.log('ENTROU1');
                                for (let j = 0; j < item.listMedicoAnexo.length; j++) {
                                    const obj = item.listMedicoAnexo[j];
                                    if (!!obj && obj.id === this.state.formAnexoModal.id) {
                                        console.log('ENTROU2');
                                        this.state.formData.listTodosAnexosMedicoVo[i].listMedicoAnexo.splice(j, 1);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    toast.success('Anexo exluído com sucesso');
                    this.toggleModal('modalVisualizarAnexo');
                }
            },
            (erro) => {
                console.error(erro);
                toast.error('Erro ao salvar o anexo');
            }
        );
    };

    render() {
        const that = this;
        return (
            <>
                {/* Page content */}
                <div id='usuarioApp-visualizar'>
                    <Card className='pt-lg-1 b-r-1 w-95'>
                        <CardHeader className='bg-transparent'>
                            <Row>
                                <Col md={{ size: 4 }}>
                                    <div className='text-muted text-center mt-2 mb-4'>
                                        {this.state.formData.anexoFoto ? (
                                            <img
                                                className='w-300'
                                                alt={this.state.formData.nome}
                                                src={`data:image/${this.retornaTipoArquivo(this.state.formData.nomeAnexoFoto)};base64,${this.state.formData.anexoFoto}`}
                                            />
                                        ) : null}
                                        <h1 className='card-title mt-10'>Médico: {this.state.formData.nome}</h1>
                                    </div>
                                </Col>
                                <Col md={5}>
                                    <div>
                                        <Row className='w'>
                                            <Col md='6'>
                                                <h4>Nome</h4>
                                                <FormGroup>{this.state.formData.nome}</FormGroup>
                                            </Col>
                                            <Col md='6'>
                                                <h4>Telefone</h4>
                                                <FormGroup>{this.state.formData.telefone}</FormGroup>
                                            </Col>
                                            <Col md='6'>
                                                <h4>Email</h4>
                                                <FormGroup>{this.state.formData.email}</FormGroup>
                                            </Col>
                                            <Col md='6'>
                                                <h4>UF Conselho Médico: </h4>
                                                <FormGroup>{this.state.formData.ufConselhoMedico}</FormGroup>
                                            </Col>
                                            <Col md='6'>
                                                <h4>Sexo</h4>
                                                <FormGroup>{this.state.formData.sexo}</FormGroup>
                                            </Col>
                                            <Col md='6'>
                                                <h4>Especialidades</h4>
                                                <FormGroup>
                                                    <strong>{that.retornaEspecialidades(this.state.formData.listaEspecialidadeSelecionado)}</strong>
                                                    <br />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <Col md='12'>
                                        <FormGroup>
                                            <h3>Observação Validação</h3>
                                            <textarea
                                                placeholder='Observaçao de Validação'
                                                onChange={this.handleObservacaoChange}
                                                value={this.state.formData.observacoesValidacao}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <label onChange={this.handleValidadoChange}>
                                                <input type='radio' value={true} checked={this.state.formData.validado} />
                                                Válido
                                                <input type='radio' value={false} className='m-l-15px' checked={!this.state.formData.validado} />
                                                Inválido
                                            </label>
                                        </FormGroup>
                                    </Col>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody className='px-lg-5 py-lg-5'>
                            {this.state.loading ? (
                                <div className='text-center'>
                                    <ClipLoader sizeUnit={'px'} size={50} margin={'2px'} color={'#149d5b'} loading={this.state.formData.loading} />
                                </div>
                            ) : null}
                            {/* Formulário de cadastro */}
                            <Form>
                                {/* anexos */}
                                <Row>
                                    {this.state.formData.listTodosAnexosMedicoVo.map((item, i) => {
                                        return (
                                            <Col className='m-b-2p' md='6' key={i}>
                                                <Col>
                                                    <div className='text-muted text-left mt-2 m-b-2p'>
                                                        <span className='card-title'>{item.campoAnexo.descricao}:</span>
                                                    </div>
                                                </Col>

                                                <Col key={i}>
                                                    {/*{this.renderizaAnexos(item.listMedicoAnexo)}*/}
                                                    {item.listMedicoAnexo.map((itemAnexo, d) => {
                                                        let anterior = null;
                                                        if (d !== 0) {
                                                            anterior = item.listMedicoAnexo[d - 1];
                                                        }

                                                        if (!!anterior) {
                                                            if (anterior.hash !== itemAnexo.hash) {
                                                                return (
                                                                    <Col key={d}>
                                                                        <Divider />
                                                                        <Row className='w'>
                                                                            <Col md='12'>
                                                                                <a
                                                                                    className='cursor-custom'
                                                                                    onClick={() => this.toggleModal('modalVisualizarAnexo', itemAnexo, item)}>
                                                                                    {itemAnexo.nomeAnexo}
                                                                                </a>
                                                                                <label className='p-l-5' style={this.changeColorRow(itemAnexo)} hidden={!itemAnexo.ehHistorico}>
                                                                                    (Histórico) {itemAnexo.ehVerso ? ' VERSO' : ' FRENTE'}
                                                                                </label>
                                                                                <label className='p-l-5' style={this.changeColorRow(itemAnexo)} hidden={!!itemAnexo.ehHistorico}>
                                                                                    {itemAnexo.ehVerso ? ' VERSO' : ' FRENTE'}
                                                                                </label>

                                                                                <label
                                                                                    hidden={itemAnexo.ehHistorico}
                                                                                    onChange={(e) => this.handleValidaChange(itemAnexo, i, e)}
                                                                                    key={i}>
                                                                                    <input className='p-l-3' type='radio' value={true} checked={itemAnexo.validado} />
                                                                                    Válido
                                                                                    <input type='radio' value={false} className='m-l-15px' checked={!itemAnexo.validado} />
                                                                                    Inválido
                                                                                </label>
                                                                            </Col>
                                                                            <Col md='6' hidden={itemAnexo.ehHistorico}>
                                                                                <textarea
                                                                                    placeholder='Observaçao de Validação'
                                                                                    onChange={(u) => this.handelObervacaoValidadoChange(itemAnexo, i, u)}
                                                                                    value={itemAnexo.observacaoValidacao}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                );
                                                            }
                                                        }
                                                        return (
                                                            <Col key={d}>
                                                                <Row className='w'>
                                                                    <Col md='12'>
                                                                        <a className='cursor-custom' onClick={() => this.toggleModal('modalVisualizarAnexo', itemAnexo, item)}>
                                                                            {itemAnexo.nomeAnexo}
                                                                        </a>
                                                                        <label className='p-l-5' style={this.changeColorRow(itemAnexo)} hidden={!itemAnexo.ehHistorico}>
                                                                            (Histórico) {itemAnexo.ehVerso ? ' VERSO' : ' FRENTE'}
                                                                        </label>
                                                                        <label className='p-l-5' Inválido style={this.changeColorRow(itemAnexo)} hidden={!!itemAnexo.ehHistorico}>
                                                                            {itemAnexo.ehVerso ? ' VERSO' : ' FRENTE'}
                                                                        </label>
                                                                        <br />
                                                                        <label hidden={itemAnexo.ehHistorico} onChange={(e) => this.handleValidaChange(itemAnexo, i, e)} key={i}>
                                                                            <input className='p-l-3' type='radio' value={true} checked={itemAnexo.validado} />
                                                                            Válido
                                                                            <input type='radio' value={false} className='m-l-15px' checked={!itemAnexo.validado} />
                                                                            Inválido
                                                                        </label>
                                                                    </Col>
                                                                    <Col md='6' hidden={itemAnexo.ehHistorico}>
                                                                        <textarea
                                                                            placeholder='Observaçao de Validação'
                                                                            onChange={(u) => this.handelObervacaoValidadoChange(itemAnexo, i, u)}
                                                                            value={itemAnexo.observacaoValidacao}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        );
                                                    })}
                                                </Col>
                                            </Col>
                                        );
                                    })}
                                </Row>

                                {/*Botões de ação*/}
                                <Row>
                                    <Col md='3'></Col>
                                    <Col md='3'>
                                        <Link className='btn-primary' to='/admin/usuarioApp'>
                                            Voltar
                                        </Link>
                                    </Col>
                                    <Col md='3' hidden={!this.state.permissao}>
                                        <Button className='btn-primary' onClick={(e) => this.handleSubmitValidar(e)}>
                                            Salvar
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                    {/* Modal visualizar anexo */}
                    <Modal className='modal-dialog-centered' isOpen={this.state.modalVisualizarAnexo} toggle={() => this.toggleModal('modalVisualizarAnexo')}>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='modalVisualizarAnexo'>
                                {this.state.formAnexoModal.nomeAnexo}
                            </h5>
                            <button aria-label='Close' className='close' data-dismiss='modal' type='button' onClick={() => this.toggleModal('modalVisualizarAnexo')}>
                                <span aria-hidden={true}>×</span>
                            </button>
                        </div>

                        <div className='modal-body'>
                            <RcIf if={this.state.formAnexoModal.nomeAnexo != null}>
                                <RcIf if={this.state.formAnexoModal.tipoAnexo && this.state.formAnexoModal.tipoAnexo.indexOf('image') >= 0}>
                                    <img className='img-cadastro-medico' src={`${this.retornaBase64(this.state.formAnexoModal)}`} alt=''/>
                                </RcIf>
                                <a href={''} onClick={(e) => this.baixarAnexo(e, this.state.formAnexoModal)}>
                                    {this.state.formAnexoModal.nomeAnexo}
                                </a>
                            </RcIf>
                        </div>

                        <div className='modal-footer'>
                            <Button color='danger' data-dismiss='modal' type='button' onClick={() => this.excluirMedicoAnexo()}>
                                Excluir
                            </Button>
                            <Button color='secondary' data-dismiss='modal' type='button' onClick={() => this.toggleModal('modalVisualizarAnexo')}>
                                Fechar
                            </Button>
                        </div>
                    </Modal>
                </div>
            </>
        );
    }
}

export default MedicoVisualizar;
