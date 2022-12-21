import { css } from '@emotion/core';
import RcIf from 'rc-if';
import React from 'react';
import FileBase64 from 'react-file-base64';
import InputMask from 'react-input-mask';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { cloneDeep, isEmpty } from 'lodash';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Select, Modal, Row, Table } from 'reactstrap';
import Label from 'reactstrap/es/Label';
import swal from 'sweetalert';
import ImageEditorModal from '../../../components/ImageEditor/image-editor';
import AddressService from '../../../services/address.service';
import AttachmentService from '../../../services/attachment.service';
import CursoService from '../../../services/curso.service';
import EscalaService from '../../../services/escala.service';
import UsuarioAppService from '../../../services/usuario.app.service';
import UtilService from '../../../services/util.service';
import { DOWNLOAD_INTERVAL, DOWNLOAD_TTL, ERRO_INTERNO } from '../../../util/Constantes';
import { formatBRToUTC, formatUTCToBR, isNullOrEmpty } from '../../../util/Util';
import UsuarioFactory from '../../Usuario/Usuario.factory';
import PreferencesMedic from './components/PreferencesMedic';
import './Medico.cadastro.scss';
import DoctorPayments from '../../../components/doctor-payments/doctor-payments';

const cidadeEstado = require('../../../util/estados_cidades');

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

class MedicoCadastro extends React.Component {
    constructor(props) {
        super(props);

        this.emptyAddress = {
            street: '',
            number: '',
            zipcode: '',
            complement: '',
            city: {
                state: {}
            }
        };

        this.state = {
            ttlDots: 0,
            listaCidadeEstado: cidadeEstado,
            listStates: [],
            listCities: [],
            permissaoAdicionais: false,
            waitingDownload: false,

            formData: {
                id: '',
                nome: '',
                senha: '',
                telefone: '',
                email: '',
                ufConselhoMedico: '',
                ufConselhoMedicoAdicional: '',
                numeroCrm: '',
                numeroCrmAdicional: '',
                birthDate: '',
                crmIssueDate: '',
                crmAdicionalIssueDate: '',
                sexo: '',
                status: '',
                ativo: true,
                rgPossuiCpf: false,

                address: this.emptyAddress,

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
                tipoRecebimento: '',

                listaEspecialidadeSelecionado: [],
                listaConfiguracao: [],
                listaTipoConfiguracao: [],
                // listAnexoCampoCadrastroMedico: [],
                listTodosAnexosMedicoVo: [],
                listaBloqueioMedicoEscala: [],
                listaMedicoEspecialidade: [],
                listaMedicoCurso: [],
                pontuacao: '0',

                paymentsData: [],
                temporaryPaymentsData: []
            },
            ufSelecionado: false,
            ufAdicionalSelecionado: false,

            // states utilizados para a modal de Anexar Frente/Verso
            modalAnexarArquivos: false,
            campoAnexoModalAnexarArquivos: {},
            arquivoUpload: [],
            indexCampoAnexo: null,

            // Campos p/ validação
            formErro: {
                login: ''
            },
            formVazios: {
                id: false,
                nome: false,
                senha: false,
                telefone: false,
                email: false,
                ufConselhoMedico: false,
                numeroCrm: false,
                sexo: false,
                birthDate: false,
                crmIssueDate: false,
                address: {
                    street: false,
                    number: false,
                    zipcode: false,
                    city: {
                        id: false,
                        state: {
                            id: false
                        }
                    }
                },
                pontuacao: false
            },
            formVaziosModalPessoaFisica: {
                bank: false,
                agency: false,
                transaction: false,
                bankAccount: false,
                cpf: false,
                cnpj: false,
                accountOwnerName: false,
                pisNumber: false,
                pix: {
                    pixKey: '',
                    pixKeyType: ''
                }
            },
            loginValido: false,
            formValido: false,
            emailValido: true,
            editando: false,
            especialidade: {},
            listaEspecialidade: [],
            listaEscala: [],
            escala: {},
            formEspecialidadeModal: {
                descricao: ''
            },

            curso: {},
            listaCurso: [],
            medicoCurso: {},
            cursoDate: '',
            formCursoModal: {
                id: '',
                nome: ''
            },

            modalVisualizarAnexo: false,
            especialidadeModal: false,
            cursoModal: false,
            modalPessoaFisica: false,

            formAnexoModal: {
                base64Anexo: '',
                ehHistorico: '',
                nomeAnexo: '',
                indexListaTodosAnexos: '',
                indexListaAnexo: '',
                validado: false,
                campoAnexo: null,
                attachment: null
            },
            formImageModal: {
                showModal: false,
                anexo: null,
                height: null,
                width: null
            },
            excluir: true,
            medicoAnexoSelecionado: {}
        };
    }

    componentDidMount = async () => {
        this.carregarCombos();
        const {
            match: { params }
        } = this.props;

        const usuarioLogado = UsuarioFactory.getUsuarioLogado();
        if (!usuarioLogado) {
            this.props.history.push('/auth/login');
        } else {
            if (!!usuarioLogado.listaUsuarioTipoPermissao) {
                for (let i = 0; i < usuarioLogado.listaUsuarioTipoPermissao.length; i++) {
                    if (usuarioLogado.listaUsuarioTipoPermissao[i].tipoPermissao.id === 11) {
                        this.setState({ permissao: true });
                    } else if (usuarioLogado.listaUsuarioTipoPermissao[i].tipoPermissao.id === 12) {
                        this.setState({ permissaoAdicionais: true });
                    }
                }
            }
        }

        if (!!params && !!params.userId) {
            let usuarioAppVo = { id: params.userId };
            this.setState({ editando: true, loading: true });
            await UsuarioAppService.getById(usuarioAppVo).subscribe(
                data => {
                    if (!!data && !data.erro) {
                        usuarioAppVo = data.objeto;
                        this.setObjToState(usuarioAppVo);
                        this.setState(
                            {
                                loading: false
                            },
                            () => {
                                this.loadListCities(
                                    this.state.formData.address.city != null
                                        ? this.state.formData.address.city.state != null
                                            ? this.state.formData.address.city.state.id
                                            : null
                                        : null
                                );
                            }
                        );
                    }
                },
                error => {
                    console.error(error);
                    this.setState({ loading: false });
                    toast.error(ERRO_INTERNO);
                }
            );
        } else {
            let usuarioAppVo;
            await UsuarioAppService.carregarCampoAnexo(usuarioAppVo).subscribe(
                data => {
                    if (!!data && !data.erro) {
                        usuarioAppVo = data.objeto;
                        this.setObjToState(usuarioAppVo);
                    }
                },
                error => {
                    toast.error(ERRO_INTERNO);
                    console.error(error);
                    this.setState({ loading: false });
                }
            );
        }

        this.loadListStates();
    };

    loadListStates = async () => {
        AddressService.states().subscribe(
            ({ objeto }) => {
                this.setState({ listStates: objeto });
            },
            error => {}
        );
    };

    loadListCities = async stateId => {
        await AddressService.cities({ stateId }).subscribe(
            ({ objeto }) => {
                this.setState({ listCities: objeto });
            },
            error => {}
        );
    };
    carregarCombos = async () => {
        await EscalaService.listarComboEspecialidade().subscribe(
            data => {
                if (!!data) {
                    this.setState({ listaEspecialidade: data });
                }
            },
            error => console.error(error)
        );
        await EscalaService.listarComboEscala().subscribe(
            data => {
                if (!!data) {
                    this.setState({ listaEscala: data });
                }
            },
            error => console.error(error)
        );
        await CursoService.listarComboCurso().subscribe(
            data => {
                if (!!data) {
                    this.setState({ listaCurso: data.objeto });
                }
            },
            error => console.log(error)
        );
    };

    setObjToState = obj => {
        let formData = { ...this.state.formData };
        formData.id = obj.id;
        formData.nome = obj.nome;
        formData.telefone = obj.telefone;
        formData.email = obj.email;
        formData.ufConselhoMedico = obj.ufConselhoMedico;
        formData.ufConselhoMedicoAdicional = obj.ufConselhoMedicoAdicional;
        formData.numeroCrm = obj.numeroCrm;
        formData.numeroCrmAdicional = obj.numeroCrmAdicional;
        if (obj.crmIssueDate) {
            formData.crmIssueDate = formatUTCToBR(obj.crmIssueDate);
        }
        if (obj.crmAdicionalIssueDate) {
            formData.crmAdicionalIssueDate = formatUTCToBR(obj.crmAdicionalIssueDate);
        }
        if (obj.birthDate) {
            formData.birthDate = formatUTCToBR(obj.birthDate);
        }
        formData.preferencesMedic = obj.preferencesMedic;
        formData.address = obj.address !== undefined ? obj.address : this.emptyAddress;

        formData.sexo = obj.sexo;
        formData.listaConfiguracao = obj.listaConfiguracao;
        formData.status = obj.status;
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

        if (!!obj.listaMedicoEspecialidade) {
            formData.listaMedicoEspecialidade = obj.listaMedicoEspecialidade;
        }
        if (!!obj.listaBloqueioMedicoEscala) {
            formData.listaBloqueioMedicoEscala = obj.listaBloqueioMedicoEscala;
        }
        if (!!obj.listaMedicoCurso) {
            formData.listaMedicoCurso = obj.listaMedicoCurso;
        }
        // formData.listAnexoCampoCadrastroMedico = obj.listAnexoCampoCadrastroMedico;
        formData.listTodosAnexosMedicoVo = obj.listTodosAnexosMedicoVo;

        if (formData.listTodosAnexosMedicoVo != null) {
            const rg = formData.listTodosAnexosMedicoVo.filter(it => it.campoAnexo.id === 4)[0];
            if (rg != null && rg.listMedicoAnexo.length > 0) {
                formData.rgPossuiCpf = rg.listMedicoAnexo.filter(it => it.extra != null && it.extra.rgPossuiCpf).length > 0;
            }
        }

        if (obj.paymentsData != null && obj.paymentsData.length > 0) {
            obj.paymentsData.forEach(item => {
                formData.paymentsData.push(item);
                formData.temporaryPaymentsData.push(item);
            });
        }

        // const paymentData = {
        //   id: 0,
        //   bank: obj.bank,
        //   agency: obj.agency,
        //   pisNumber: obj.pisNumber,
        //   paymentType: 'LEGAL_ENTITY',
        //   transaction: obj.transaction,
        //   bankAccount: obj.bankAccount,
        //   accountOwnerName: obj.accountOwnerName,
        //   isCompanyAccount: obj.isCompanyAccount
        // };

        // formData.paymentsData.push(paymentData);

        // formData.ativo = obj.ativo != null ? obj.ativo : true;

        if (obj.cnpj !== '') {
            formData.cpfOuCnpj = 'CNPJ';
        }
        if (obj.cpf !== '') {
            formData.cpfOuCnpj = 'CPF';
        }

        formData.pontuacao = obj.pontuacao;

        this.setState({ formData });
    };

    updateExtraAnexo = () => {
        const formData = { ...this.state.formData };
        const rg = formData.listTodosAnexosMedicoVo.filter(it => it.campoAnexo.id === 4)[0];
        if (rg != null && rg.listMedicoAnexo.length > 0) {
            rg.listMedicoAnexo.forEach(it => {
                if (it.extra == null) {
                    it.extra = {
                        rgPossuiCpf: formData.rgPossuiCpf
                    };
                } else {
                    it.extra.rgPossuiCpf = formData.rgPossuiCpf;
                }
            });
        }
        this.setState({
            formData
        });
    };

    mountAddressObject = () => {
        const { address } = this.state.formData;

        const city =
            address.city != null && address.city.id != null
                ? {
                      id: address.city.id,
                      name: address.city.name,
                      state:
                          address.city.state != null && address.city.state.id != null
                              ? {
                                    id: address.city.state.id,
                                    name: address.city.state.name,
                                    acronym: address.city.state.acronym
                                }
                              : null
                  }
                : null;

        if (isNullOrEmpty(address.street) && isNullOrEmpty(address.number) && isNullOrEmpty(address.zipcode) && city == null) {
            return null;
        }

        const addressMounted = {
            id: address.id,
            street: address.street,
            number: address.number,
            zipcode: address.zipcode,
            district: address.district,
            complement: address.complement,
            city: city
        };

        return addressMounted;
    };

    handleSubmit = async e => {
        e.preventDefault();

        this.updateExtraAnexo();

        this.setState({ formVazios: this.verificaPreenchimento() });

        let emailValido = false;

        if (!!this.state.formData.email) {
            emailValido = this.validaCampo('email', this.state.formData.email);
        }

        this.setState({ emailValido: emailValido });

        if (this.state.formData != null) {
            if (
                (!!this.state.formData.nome &&
                    this.state.formData.nome.length !== 0 &&
                    !!this.state.formData.telefone &&
                    this.state.formData.telefone.length !== 0 &&
                    !!this.state.formData.email &&
                    this.state.formData.email.length !== 0 &&
                    !!this.state.formData.senha &&
                    this.state.formData.senha.length !== 0 &&
                    !!this.state.formData.ufConselhoMedico &&
                    this.state.formData.ufConselhoMedico.length !== 0) ||
                (this.state.editando &&
                    emailValido &&
                    !!this.state.formData.sexo &&
                    this.state.formData.sexo !== 'nenhum' &&
                    !!this.state.formData.ufConselhoMedico &&
                    this.state.formData.ufConselhoMedico !== 0)
            ) {
                let { formData } = this.state;

                if (formData.birthDate) {
                    formData.birthDate = formatBRToUTC(formData.birthDate);
                }
                if (formData.crmIssueDate) {
                    formData.crmIssueDate = formatBRToUTC(formData.crmIssueDate);
                }
                if (formData.crmAdicionalIssueDate) {
                    formData.crmAdicionalIssueDate = formatBRToUTC(formData.crmAdicionalIssueDate);
                }

                this.salvaRegistro(formData);
            } else {
                if (!!this.state.formData.email && this.state.formData.email.length !== 0 && !emailValido) {
                    toast.error('Email inválido!!!');
                }
                if (
                    !this.state.formData.nome ||
                    this.state.formData.nome.length === 0 ||
                    !this.state.formData.telefone ||
                    this.state.formData.telefone.length === 0 ||
                    !this.state.formData.senha ||
                    (this.state.formData.senha.length === 0 && !this.state.formData.editando) ||
                    !this.state.formData.login ||
                    this.state.formData.login.length === 0
                ) {
                    toast.error('Preencha os Campos Obrigatórios!!!');
                }
            }
        } else {
            toast.error('Preencha os Campos do Formuláio!!!');
        }
    };

    handleLoginChange = e => {
        let formData = { ...this.state.formData };
        formData.email = e.target.value;
        this.setState({ formData });
    };

    handleNomeChange = e => {
        let formData = { ...this.state.formData };
        formData.nome = e.target.value;
        this.setState({ formData });
    };

    handleTelefoneChange = e => {
        let formData = { ...this.state.formData };
        formData.telefone = e.target.value;
        this.setState({ formData });
    };

    handleSenhaChange = e => {
        let formData = { ...this.state.formData };
        formData.senha = e.target.value;
        this.setState({ formData });
    };

    handleNumeroCrmChange = e => {
        let formData = { ...this.state.formData };
        formData.numeroCrm = e.target.value;
        this.setState({ formData });
    };

    handleNumeroCrmAdicionalChange = e => {
        let formData = { ...this.state.formData };
        formData.numeroCrmAdicional = e.target.value;
        this.setState({ formData });
    };

    handleUfConselhoMedicoChange = e => {
        let formData = { ...this.state.formData };
        let ufSelecionado;
        ufSelecionado = e.target.value !== 'default';
        formData.ufConselhoMedico = e.target.value;
        this.setState({
            formData: formData,
            ufSelecionado: ufSelecionado
        });
    };

    handleUfConselhoMedicoAdicionalChange = e => {
        let formData = { ...this.state.formData };
        let ufAdicionalSelecionado;
        ufAdicionalSelecionado = e.target.value !== 'default';
        formData.ufConselhoMedicoAdicional = e.target.value;
        this.setState({
            formData: formData,
            ufAdicionalSelecionado: ufAdicionalSelecionado
        });
    };

    handleCrmIssueDateChange = e => {
        let formData = { ...this.state.formData };
        formData.crmIssueDate = e.target.value;
        this.setState({ formData });
    };

    handleCrmAdicionalIssueDateChange = e => {
        let formData = { ...this.state.formData };
        formData.crmAdicionalIssueDate = e.target.value;
        this.setState({ formData });
    };

    handleBirthDateChange = e => {
        let formData = { ...this.state.formData };
        formData.birthDate = e.target.value;
        this.setState({ formData });
    };

    handleAddressStreetChange = e => {
        let formData = { ...this.state.formData };
        formData.address.street = e.target.value;
        this.setState({ formData });
    };

    handleAddressNumberChange = e => {
        let formData = { ...this.state.formData };
        formData.address.number = e.target.value;
        this.setState({ formData });
    };

    handleAddressZipcodeChange = e => {
        let formData = { ...this.state.formData };
        formData.address.zipcode = e.target.value;
        this.setState({ formData });
    };

    handleAddressComplementChange = e => {
        let formData = { ...this.state.formData };
        formData.address.complement = e.target.value;
        this.setState({ formData });
    };

    handleAddressStateChange = e => {
        let formData = { ...this.state.formData };
        const state = this.state.listStates.find(it => it.id == e.target.value);

        if (formData.address.city.state == null) {
            formData.address.city = {
                state: {
                    id: state ? state.id : state,
                    name: state ? state.name : state
                }
            };
        } else {
            formData.address.city.state.id = state ? state?.id : state;
        }

        formData.address.city.state.name = state?.name;
        formData.address.city.state.acronym = state?.acronym;

        this.loadListCities(state.id);
        formData.address.city.id = '';
        formData.address.city.name = '';

        this.setState({ formData });
    };

    handleAddressCityChange = e => {
        let formData = { ...this.state.formData };
        const city = this.state.listCities.find(it => it.id === e.target.value);

        formData.address.city.id = city?.id;
        formData.address.city.name = city?.name;

        this.setState({ formData });
    };

    handlePreferencesMedic = e => {
        let formData = { ...this.state.formData };
        formData.preferencesMedic = e;
        this.setState({ formData });
    };

    handleSexoChange = e => {
        let formData = { ...this.state.formData };
        formData.sexo = e.target.value;
        this.setState({ formData });
    };

    handleAtivo = e => {
        const value = e.target.value === 'Ativo';
        let formData = { ...this.state.formData };
        formData.ativo = value;
        this.setState({ formData });
    };

    //Anexos

    handelAnexoCrmFrenteChange = fileCrmFrente => {
        let formData = { ...this.state.formData };
        formData.anexoCrmFrente = fileCrmFrente.base64;
        formData.nomeAnexoCrmFrente = fileCrmFrente.name;
        formData.tamanhoAnexoCrmFrente = fileCrmFrente.size;
        formData.tipoAnexoCrmFrente = fileCrmFrente.type;
        this.setState({ formData: formData });
    };

    handelAnexoCrmVersoChange = fileCrmVerso => {
        let formData = { ...this.state.formData };
        formData.anexoCrmVerso = fileCrmVerso.base64;
        formData.nomeAnexoCrmVerso = fileCrmVerso.name;
        formData.tamanhoAnexoCrmVerso = fileCrmVerso.size;
        formData.tipoAnexoCrmVerso = fileCrmVerso.type;
        this.setState({ formData: formData });
    };

    handelAnexoProtocoloChange = fileProtocolo => {
        let formData = { ...this.state.formData };
        formData.anexoProtocolo = fileProtocolo.base64;
        formData.nomeAnexoProtocolo = fileProtocolo.name;
        formData.tamanhoAnexoProtocolo = fileProtocolo.size;
        formData.tipoAnexoProtocolo = fileProtocolo.type;
        this.setState({ formData: formData });
    };

    handelAnexoDiplomaChange = fileDiploma => {
        let formData = { ...this.state.formData };
        formData.anexoDiploma = fileDiploma.base64;
        formData.nomeAnexoDiploma = fileDiploma.name;
        formData.tamanhoAnexoDiploma = fileDiploma.size;
        formData.tipoAnexoDiploma = fileDiploma.type;
        this.setState({ formData: formData });
    };

    handelAnexoRgChange = fileRg => {
        let formData = { ...this.state.formData };
        formData.anexoRg = fileRg.base64;
        formData.nomeAnexoRg = fileRg.name;
        formData.tamanhoAnexoRg = fileRg.size;
        formData.tipoAnexoRg = fileRg.type;
        this.setState({ formData: formData });
    };

    handelAnexoCpfChange = fileCpf => {
        let formData = { ...this.state.formData };
        formData.anexoCpf = fileCpf.base64;
        formData.nomeAnexoCpf = fileCpf.name;
        formData.tamanhoAnexoCpf = fileCpf.size;
        formData.tipoAnexoCpf = fileCpf.type;
        this.setState({ formData: formData });
    };

    handelAnexoEnderecoChange = fileEndereco => {
        let formData = { ...this.state.formData };
        formData.anexoEndereco = fileEndereco.base64;
        formData.nomeAnexoEndereco = fileEndereco.name;
        formData.tamanhoAnexoEndereco = fileEndereco.size;
        formData.tipoAnexoEndereco = fileEndereco.type;
        this.setState({ formData: formData });
    };

    handelAnexoRqeChange = fileRqe => {
        let formData = { ...this.state.formData };
        formData.anexoRqe = fileRqe.base64;
        formData.nomeAnexoRqe = fileRqe.name;
        formData.tamanhoAnexoRqe = fileRqe.size;
        formData.tipoAnexoRqe = fileRqe.type;
        this.setState({ formData: formData });
    };

    handelAnexoTituloChange = fileTitulo => {
        let formData = { ...this.state.formData };
        formData.anexoTitulo = fileTitulo.base64;
        formData.nomeAnexoTitulo = fileTitulo.name;
        formData.tamanhoAnexoTitulo = fileTitulo.size;
        formData.tipoAnexoTitulo = fileTitulo.type;
        this.setState({ formData: formData });
    };

    handelAnexoCasamentoChange = fileCasamento => {
        let formData = { ...this.state.formData };
        formData.anexoCasamento = fileCasamento.base64;
        formData.nomeAnexoCasamento = fileCasamento.name;
        formData.tamanhoAnexoCasamento = fileCasamento.size;
        formData.tipoAnexoCasamento = fileCasamento.type;
        this.setState({ formData: formData });
    };

    handelAnexoCursosChange = fileCursos => {
        let formData = { ...this.state.formData };
        formData.anexoCursos = fileCursos.base64;
        formData.nomeAnexoCursos = fileCursos.name;
        formData.tamanhoAnexoCursos = fileCursos.size;
        formData.tipoAnexoCursos = fileCursos.type;
        this.setState({ formData: formData });
    };

    handelAnexoFotoChange = fileFoto => {
        let formData = { ...this.state.formData };
        formData.anexoFoto = fileFoto.base64;
        formData.nomeAnexoFoto = fileFoto.name;
        formData.tamanhoAnexoFoto = fileFoto.size;
        formData.tipoAnexoFoto = fileFoto.type;
        this.setState({ formData: formData });
    };

    handelAnexosChange = file => {
        let formData = { ...this.state.formData };
        formData.base64Anexo = file.base64;
        formData.tipoAnexo = file.type;
        formData.nomeAnexo = file.name;
        formData.tamanhoAnexo = file.size;
        this.setState({ formData: formData });
    };

    handlePontuacaoChange = e => {
        let formData = { ...this.state.formData };
        if (e.target.value >= 0 && e.target.value <= 10) {
            formData.pontuacao = e.target.value;
            this.setState({ formData });
        }
    };

    CreateObjectAndIncludeInList = (file, isVerso = false) => {
        const hash = Math.floor(Math.random() * 1000000000);
        let obj = {};
        let array = [];
        let campoAnexo = this.state.campoAnexoModalAnexarArquivos;
        if (Array.isArray(file)) {
            file.forEach(function(arquivo) {
                obj.base64Anexo = arquivo.base64;
                obj.tipoAnexo = arquivo.type;
                obj.nomeAnexo = arquivo.name;
                obj.hash = hash;
                obj.tamanhoAnexo = arquivo.size;
                obj.campoAnexo = campoAnexo;
                obj.novo = true;
                obj.ehVerso = isVerso;
                if (campoAnexo.id === 7) {
                    obj.especialidade = this.state.especialidade;
                }
                if (campoAnexo.id === 10) {
                    obj.medicoCurso = this.state.medicoCurso;
                }
                if (campoAnexo.id === 15) {
                    obj.extra = JSON.stringify({ appIgnoreStatus: false });
                }
                // all attachment create by web are valid
                obj.validado = true;

                array.push(obj);
                obj = {};
            });
            this.setState({ arquivoUpload: array });
        } else {
            obj.base64Anexo = file.base64;
            obj.tipoAnexo = file.type;
            obj.nomeAnexo = file.name;
            obj.tamanhoAnexo = file.size;
            obj.hash = hash;
            obj.campoAnexo = this.state.campoAnexoModalAnexarArquivos;
            obj.novo = true;
            obj.ehVerso = isVerso;
            if (campoAnexo.id === 7) {
                obj.especialidade = this.state.especialidade;
            }
            if (campoAnexo.id === 10) {
                obj.medicoCurso = this.state.medicoCurso;
            }
            if (campoAnexo.id === 15) {
                obj.extra = JSON.stringify({ appIgnoreStatus: false });
            }

            // all attachment create by web are valid
            obj.validado = true;

            const list = [...this.state.arquivoUpload];
            const index = list.findIndex(item => item.ehVerso === isVerso);
            if (index >= 0) {
                list[index] = obj;
                this.setState({ arquivoUpload: list });
            } else {
                this.setState({ arquivoUpload: [...list, obj] });
            }
        }
    };

    openModalAndLoadCampoAnexo(campoAnexo, index = null) {
        this.setState({ campoAnexoModalAnexarArquivos: campoAnexo });
        this.setState({ modalAnexarArquivos: true });
        this.setState({ indexCampoAnexo: index });
    }

    handelAnexosBancoChange(itemAnexo) {
        setTimeout(() => {
            const indexObjSelecionado = this.state.formData.listTodosAnexosMedicoVo.findIndex(obj => obj.campoAnexo.id === itemAnexo.campoAnexo.id);
            let formData = { ...this.state.formData };
            if (indexObjSelecionado !== -1) {
                let listTodosAnexosMedicoVo = {
                    ...this.state.formData.listTodosAnexosMedicoVo
                };

                let obj = {
                    base64Anexo: formData.base64Anexo,
                    tipoAnexo: formData.tipoAnexo,
                    nomeAnexo: formData.nomeAnexo,
                    id: null,
                    novo: true
                };
                listTodosAnexosMedicoVo[indexObjSelecionado].listMedicoAnexo.push(obj);

                this.setState({ listTodosAnexosMedicoVo });
            }
        }, 1000);
    }

    //Fim Anexos

    handleCursoDateChange = e => {
        const cursoDate = e.target.value;
        this.setState({ cursoDate });
    };

    handleCursoChange = e => {
        const indexObjSelecionado = this.state.listaCurso.findIndex(obj => obj.id === e.target.value);
        if (indexObjSelecionado !== -1) {
            const obj = this.state.listaCurso[indexObjSelecionado];
            let curso = { ...this.state.curso };
            curso.id = obj.id;
            curso.nome = obj.nome;
            this.setState({ curso });
        }
    };

    handleEspecialidadeChange = e => {
        const indexObjSelecionado = this.state.listaEspecialidade.findIndex(obj => obj.id === Number(e.target.value));
        const obj = this.state.listaEspecialidade[indexObjSelecionado];
        if (indexObjSelecionado !== -1) {
            let especialidade = { ...this.state.especialidade };
            especialidade.id = obj.id;
            especialidade.descricao = obj.descricao;
            this.setState({ especialidade });
        }
    };

    handleEscalaChange = e => {
        const indexObjSelecionado = this.state.listaEscala.findIndex(obj => obj.id === Number(e.target.value));
        const obj = this.state.listaEscala[indexObjSelecionado];
        if (indexObjSelecionado !== -1) {
            let escala = { ...this.state.escala };
            escala.id = obj.id;
            escala.nomeEscala = obj.nomeEscala;
            this.setState({ escala });
        }
    };

    handleRgPossuiCpfChange = e => {
        let formData = { ...this.state.formData };
        formData.rgPossuiCpf = e.target.checked;
        this.setState({ formData });
    };

    handleEspecialidadeModalDescricaoChange = e => {
        let formEspecialidadeModal = { ...this.state.formEspecialidadeModal };
        formEspecialidadeModal.descricao = e.target.value;
        this.setState({ formEspecialidadeModal });
    };

    handleCursoNomeChange = e => {
        let formCursoModal = { ...this.state.formCursoModal };
        formCursoModal.nome = e.target.value;
        this.setState({ formCursoModal });
    };

    removerEspecialidade = index => {
        let formData = { ...this.state.formData };
        formData.listaEspecialidadeSelecionado.splice(index, 1);
        this.setState({ formData });
    };

    adicionaCurso = e => {
        e.preventDefault();
        if (!this.state.curso.id) {
            toast.warn("Selecione um curso no campo Cursos, ou click no botão '+' para cadastrar um novo.");
            return;
        }
        if (!this.state.cursoDate || formatBRToUTC(this.state.cursoDate) === 'Invalid date') {
            toast.warn('Selecione uma data de vencimento válida para o curso selecionado.');
            return;
        }
        if (this.state.formData.listaMedicoCurso.some(medicoCurso => medicoCurso.curso.id === this.state.curso.id)) {
            toast.warn('Curso já cadastrado.');
            return;
        }

        let formData = { ...this.state.formData };

        const indexObjSelecionado = this.state.listaCurso.findIndex(obj => obj.id === e.target.value);
        if (indexObjSelecionado === -1) {
            let medicoCurso = {
                id: null,
                medico: { id: this.state.formData.id },
                curso: this.state.curso,
                dataVencimento: formatBRToUTC(this.state.cursoDate)
            };
            formData.listaMedicoCurso = [...formData.listaMedicoCurso, medicoCurso];
            let campoAnexoCurso = {
                id: 10,
                descricao: 'Carteirinha de cursos ATLS/ACLS/SAVE/PALS, etc.'
            };

            this.openModalAndLoadCampoAnexo(campoAnexoCurso);

            this.setState({ formData, medicoCurso });
        } else {
            toast.info('Especialidade já adicionada!');
        }
    };

    adicionaEspecialidade = e => {
        e.preventDefault();

        if (!this.state.especialidade.id) {
            toast.warn("Selecione uma especialidade no campo Especialidades, ou click no botão '+' para cadastrar uma nova.");
            return;
        }
        let formData = { ...this.state.formData };

        const indexObjSelecionado = this.state.formData.listaMedicoEspecialidade.findIndex(obj => obj.especialidade.id === this.state.especialidade.id);
        if (indexObjSelecionado === -1) {
            let medicoEspecialidade = {
                id: null,
                especialidade: this.state.especialidade,
                medico: {}
            };
            formData.listaMedicoEspecialidade = [...formData.listaMedicoEspecialidade, medicoEspecialidade];

            let campoAnexoEspecialidade = {
                id: 7,
                descricao: 'Títulos de especialidade'
            };

            this.openModalAndLoadCampoAnexo(campoAnexoEspecialidade);

            this.setState({ formData });
        } else {
            toast.info('Especialidade já adicionada!');
        }
    };
    adicionaEscala = e => {
        e.preventDefault();
        if (!this.state.escala.id) {
            toast.warn('Selecione uma escala no campo Escalas para bloqueio.');
            return;
        }
        let formData = { ...this.state.formData };

        const indexObjSelecionado = this.state.formData.listaBloqueioMedicoEscala.findIndex(obj => obj.escala.id === this.state.escala.id);
        if (indexObjSelecionado === -1) {
            let bloqueiaMedicoEscala = {
                id: null,
                escala: this.state.escala,
                medico: {}
            };
            formData.listaBloqueioMedicoEscala = [...formData.listaBloqueioMedicoEscala, bloqueiaMedicoEscala];
            this.setState({ formData });
        } else {
            toast.info('Escala já adicionado!');
        }
    };

    salvaRegistro = item => {
        if (this.state.loading) {
            return;
        }
        this.setState({
            loading: true,
            formData: {
                ...this.state.formData,
                temporaryPaymentsData: []
            }
        });

        item.nome = item.nome.toUpperCase();
        item.address = this.mountAddressObject();
        if (item.ufConselhoMedico) {
            item.ufConselhoMedico = item.ufConselhoMedico.toUpperCase();
        }
        if (item.ufConselhoMedicoAdicional) {
            item.ufConselhoMedicoAdicional = item.ufConselhoMedicoAdicional.toUpperCase();
        }

        UsuarioAppService.salvar(item).subscribe(
            data => {
                this.setState({ loading: false });
                if (!!data) {
                    if (data.erro) {
                        toast.error(data.mensagem);
                    } else {
                        toast.success(data.mensagem);
                        this.props.history.goBack();
                    }
                }
            },
            error => {
                console.error(error);
                this.setState({ loading: false });
                toast.error(ERRO_INTERNO);
            }
        );
    };

    validaCampo(campo, valor) {
        let erroValidacao = this.state.formErro;
        let loginValido = this.state.loginValido;
        let valido;

        switch (campo) {
            case 'email':
                loginValido = valor.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                erroValidacao.login = loginValido ? '' : ' com email inválido';
                valido = !!loginValido;
                break;
            default:
                break;
        }
        this.setState(
            {
                formErro: erroValidacao,
                loginValido: loginValido
            },
            this.validaForm
        );

        return valido;
    }

    validaForm() {
        this.setState({ formValido: this.state.loginValido });
    }

    verificaPreenchimento() {
        let formVazio = { ...this.state.formVazios };
        if (!this.state.formData.nome || this.state.formData.nome.length === 0) {
            formVazio.nome = true;
        } else {
            formVazio.nome = false;
        }

        if (!this.state.formData.email || this.state.formData.email.length === 0) {
            formVazio.email = true;
        } else {
            formVazio.email = false;
        }

        if (!this.state.formData.senha || this.state.formData.senha.length === 0) {
            formVazio.senha = true;
        } else {
            formVazio.senha = false;
        }

        // if (!this.state.formData.sexo || this.state.formData.sexo === 'nenhum') {
        //     formVazio.sexo = true;
        // } else {
        //     formVazio.sexo = false;
        // }

        if (!this.state.formData.ufConselhoMedico || this.state.formData.ufConselhoMedico.length === 0) {
            formVazio.ufConselhoMedico = true;
        } else {
            formVazio.ufConselhoMedico = false;
        }

        if (!this.state.formData.numeroCrm || this.state.formData.numeroCrm.length === 0) {
            formVazio.numeroCrm = true;
        } else {
            formVazio.numeroCrm = false;
        }

        // if (
        //   !this.state.formData.crmIssueDate ||
        //   this.state.formData.crmIssueDate.length === 0
        // ) {
        //   formVazio.crmIssueDate = true;
        // } else {
        //   formVazio.crmIssueDate = false;
        // }

        // if (
        //   !this.state.formData.birthDate ||
        //   this.state.formData.birthDate.length === 0
        // ) {
        //   formVazio.birthDate = true;
        // } else {
        //   formVazio.birthDate = false;
        // }

        // if (
        //   !this.state.address ||
        //   !this.state.address.street ||
        //   this.state.address.street.length === 0
        // ) {
        //   formVazio.address.street = true;
        // } else {
        //   formVazio.address.street = false;
        // }

        // if (
        //   !this.state.address ||
        //   !this.state.address.number ||
        //   this.state.address.number.length === 0
        // ) {
        //   formVazio.address.number = true;
        // } else {
        //   formVazio.address.number = false;
        // }

        // if (
        //   !this.state.address ||
        //   !this.state.address.zipcode ||
        //   this.state.address.zipcode.length === 0
        // ) {
        //   formVazio.address.zipcode = true;
        // } else {
        //   formVazio.address.zipcode = false;
        // }

        // if (
        //   !this.state.address ||
        //   !this.state.address.city ||
        //   !this.state.address.city.id
        // ) {
        //   formVazio.address.city = true;
        // } else {
        //   formVazio.address.city = false;
        // }

        return formVazio;
    }

    // Mascara p/ telefone e celular

    setMascara(valor) {
        let valorTemp;
        let ddd;
        let frsDigit;
        let secDigit;
        let tel;

        valor = valor.replace(/^([a-zA-Z]+)/g, '');

        valorTemp = valor.split('-');

        if (valorTemp.length < 2) {
            valor = valor.replace(/^([0-9]{2})([0-9])/g, '($1) $2');
            valor = valor.replace(/([0-9]{4,})([0-9]{4})$/, '$1-$2');
        } else if (valorTemp.length === 2) {
            ddd = valorTemp[0].split(') ')[0].substring(1, 3);
            frsDigit = valorTemp[0].split(' ')[1];
            secDigit = valorTemp[1];
            if (frsDigit.length === 4 && secDigit.length === 5) {
                tel = ddd + frsDigit + secDigit;
                valor = tel;
                valor = valor.replace(/^([0-9]{2})([0-9])/g, '($1) $2');
                valor = valor.replace(/([0-9]{5})([0-9]{4})$/, '$1-$2');
            } else if (frsDigit.length === 5 && secDigit.length === 3) {
                tel = ddd + frsDigit + secDigit;
                valor = tel;
                valor = valor.replace(/^([0-9]{2})([0-9])/g, '($1) $2');
                valor = valor.replace(/([0-9]{4})([0-9]{4})$/, '$1-$2');
            }
        }

        return valor;
    }

    handleSubmitModalCurso = async e => {
        e.preventDefault();

        let formCursoModal = { ...this.state.formCursoModal };
        if (!formCursoModal.nome || !formCursoModal.nome.length) {
            toast.info('Informe o nome do Curso.');
            return;
        }

        let nome = formCursoModal.nome.toUpperCase();
        formCursoModal.nome = nome;
        this.setState({ formCursoModal });

        await CursoService.salvarCurso(formCursoModal).subscribe(
            data => {
                if (!!data) {
                    if (data.erro) {
                        toast.error(data.mensagem);
                    } else {
                        toast.success('Curso salvo com sucesso.');

                        CursoService.listarComboCurso().subscribe(
                            data => {
                                if (!!data) {
                                    this.setState({ listaCurso: data.objeto });
                                }
                            },
                            error => console.log(error)
                        );
                        this.toggleModal('cursoModal');
                    }
                }
            },
            error => {
                console.error(error);
                toast.error('Ocorreu um erro, tente novamente.');
            }
        );
    };

    handleSubmitModalEspecialidade = async e => {
        e.preventDefault();
        let formEspecialidadeModal = { ...this.state.formEspecialidadeModal };
        if (!formEspecialidadeModal.descricao || !formEspecialidadeModal.descricao.length) {
            toast.info('Informe a descrição da Especialidade.');
            return;
        }

        // let formModal = {...this.state.formModal};
        let servico = formEspecialidadeModal.descricao.toUpperCase();
        formEspecialidadeModal.descricao = servico;
        this.setState({ formEspecialidadeModal });

        this.setState({ formEspecialidadeModal: { descricao: servico } });

        await EscalaService.salvarEspecialidade(formEspecialidadeModal).subscribe(
            data => {
                if (!!data) {
                    if (data.erro) {
                        toast.error(data.mensagem);
                    } else {
                        toast.success('Especialidade salva com sucesso.');
                        this.setState({
                            listaEspecialidade: [...this.state.listaEspecialidade, data.objeto]
                        });
                        let formData = { ...this.state.formData };
                        let medicoEspecialidade = { id: null, especialidade: data.objeto };
                        formData.listaMedicoEspecialidade = [...formData.listaMedicoEspecialidade, medicoEspecialidade];
                        this.setState({ formData });

                        this.toggleModal('especialidadeModal');
                    }
                }
            },
            error => {
                console.error(error);
                toast.error('Ocorreu um erro, tente novamente.');
            }
        );
    };

    excluirEspecialidade = (item, e) => {
        e.preventDefault();
        swal({
            title: 'Confirmar Exclusão',
            text: 'Deseja excluir essa Especialidade?',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        }).then(willDelete => {
            if (willDelete) {
                this.setState({ loading: true });
                if (!!item.descricao) {
                    let { listaMedicoEspecialidade } = this.state.formData;

                    const index = listaMedicoEspecialidade.findIndex(o => o.id === item.id);

                    listaMedicoEspecialidade.splice(index, 1);
                    this.setState({ loading: false });
                    toast.success('Especialidade removida com sucesso!');
                    return;
                }
                UsuarioAppService.excluirUsuarioAppEspecialidade(item).subscribe(
                    data => {
                        if (!!data) {
                            if (data.erro) {
                                toast.error(data.mensagem);
                            } else {
                                const obj = item;
                                let { listaMedicoEspecialidade } = this.state.formData;

                                const index = listaMedicoEspecialidade.findIndex(o => o.especialidade.id === obj.especialidade.id);

                                listaMedicoEspecialidade.splice(index, 1);

                                this.setState({ loading: false });
                                toast.success('Especialidade removida com sucesso!');
                            }
                        }
                    },
                    error => {
                        console.error(error);
                        this.setState({ loading: false });
                        toast.error(ERRO_INTERNO);
                    }
                );
            }
        });
    };

    excluirCurso = (item, e) => {
        e.preventDefault();

        swal({
            title: 'Confirmar Exclusão',
            text: 'Deseja excluir esse Curso?',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        }).then(willDelete => {
            if (willDelete) {
                this.setState({ loading: true });

                if (item.id == null) {
                    let { listaMedicoCurso } = this.state.formData;

                    const index = listaMedicoCurso.findIndex(o => o.curso.id === item.curso.id);

                    listaMedicoCurso.splice(index, 1);

                    this.setState({ loading: false });
                    toast.success('Curso removido com sucesso!');

                    const { formData } = this.state;
                    const listMedicoAnexo = formData.listTodosAnexosMedicoVo[10].listMedicoAnexo.filter(anexo => anexo.medicoCurso.curso.id !== item.curso.id);
                    formData.listTodosAnexosMedicoVo[10].listMedicoAnexo = listMedicoAnexo;
                    this.setState({ formData });
                    return;
                }
                UsuarioAppService.excluirUsuarioAppCurso(item).subscribe(
                    data => {
                        if (!!data) {
                            if (data.erro) {
                                toast.error(data.mensagem);
                            } else {
                                const obj = item;
                                let { listaMedicoCurso } = this.state.formData;

                                const index = listaMedicoCurso.findIndex(o => o.curso.id === obj.curso.id);

                                listaMedicoCurso.splice(index, 1);

                                this.setState({ loading: false });
                                toast.success('Curso removido com sucesso!');

                                const { formData } = this.state;
                                const listMedicoAnexo = formData.listTodosAnexosMedicoVo[10].listMedicoAnexo.filter(
                                    anexo => anexo.medicoCurso.curso.id !== item.curso.id
                                );
                                formData.listTodosAnexosMedicoVo[10].listMedicoAnexo = listMedicoAnexo;

                                this.setState({ formData });
                                // const indexAnexo = this.state.formData.listTodosAnexosMedicoVo[10].findIndex(
                                //   (o) => o.medicoCurso.id === obj.curso.id
                                // );
                            }
                        }
                    },
                    error => {
                        console.error(error);
                        this.setState({ loading: false });
                        toast.error(ERRO_INTERNO);
                    }
                );
            }
        });
    };

    excluirEscala = (item, e) => {
        e.preventDefault();
        swal({
            title: 'Confirmar Exclusão',
            text: 'Deseja excluir essa Escala do bloqueio?',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        }).then(willDelete => {
            if (willDelete) {
                this.setState({ loading: true });
                if (!!item.descricao) {
                    let { listaBloqueioMedicoEscala } = this.state.formData;

                    const index = listaBloqueioMedicoEscala.findIndex(o => o.id === item.id);

                    listaBloqueioMedicoEscala.splice(index, 1);
                    this.setState({ loading: false });
                    toast.success('Escala removida com sucesso!');
                    return;
                }
                UsuarioAppService.excluirBloqueioMedicoEscala(item).subscribe(
                    data => {
                        if (!!data) {
                            if (data.erro) {
                                toast.error(data.mensagem);
                            } else {
                                const obj = item;
                                let { listaBloqueioMedicoEscala } = this.state.formData;

                                const index = listaBloqueioMedicoEscala.findIndex(o => o.escala.id === obj.escala.id);

                                listaBloqueioMedicoEscala.splice(index, 1);

                                this.setState({ loading: false });
                                toast.success('Escala removida com sucesso!');
                            }
                        }
                    },
                    error => console.error(error)
                );
            }
        });
    };

    changeColorRow = itemAnexo => {
        if (itemAnexo.ehHistorico) {
            return { color: '#d93025' };
        } else if (!itemAnexo.ehHistorico) {
            return { color: '#188038' };
        }
    };

    changeColorRowValidado = itemAnexo => {
        if (!itemAnexo.validado) {
            return { color: '#d93025' };
        } else if (itemAnexo.validado) {
            return { color: '#188038' };
        }
    };

    toggleModal = (state, itemAnexo, indexListaTodosAnexos, indexListaAnexo) => {
        this.setState({
            [state]: !this.state[state],
            itemAnexo: itemAnexo
        });
        let formAnexoModal = { ...this.state.formAnexoModal };
        formAnexoModal.base64Anexo = !!itemAnexo && !!itemAnexo.base64Anexo ? itemAnexo.base64Anexo : null;
        formAnexoModal.ehHistorico = !!itemAnexo && !!itemAnexo.ehHistorico ? itemAnexo.ehHistorico : null;
        formAnexoModal.nomeAnexo = !!itemAnexo && !!itemAnexo.nomeAnexo ? itemAnexo.nomeAnexo : null;
        formAnexoModal.tipoAnexo = !!itemAnexo && !!itemAnexo.tipoAnexo ? itemAnexo.tipoAnexo : null;
        formAnexoModal.campoAnexo = !!itemAnexo && !!itemAnexo.campoAnexo ? itemAnexo.campoAnexo : null;
        formAnexoModal.attachment = !!itemAnexo && !!itemAnexo.attachment ? itemAnexo.attachment : null;
        formAnexoModal.indexListaTodosAnexos = indexListaTodosAnexos;
        formAnexoModal.indexListaAnexo = indexListaAnexo;
        this.setState({ formAnexoModal: formAnexoModal });
    };

    retornaBase64 = formAnexoModal => {
        if (formAnexoModal && formAnexoModal.base64Anexo) {
            if (formAnexoModal.base64Anexo.indexOf('base64,') > 0) {
                formAnexoModal.base64Anexo = formAnexoModal.base64Anexo.toString().substring(formAnexoModal.base64Anexo.indexOf('base64,') + 7);
            }
            return 'data:' + this.state.formAnexoModal.tipoAnexo + ';base64,' + this.state.formAnexoModal.base64Anexo;
        } else if (formAnexoModal.attachment != null) {
            if (formAnexoModal.attachment.file != null) {
                if (formAnexoModal.attachment.file.indexOf('base64,') > 0) {
                    formAnexoModal.attachment.file = formAnexoModal.attachment.file.toString().substring(formAnexoModal.attachment.file.indexOf('base64,') + 7);
                }
                return 'data:' + this.state.formAnexoModal.tipoAnexo + ';base64,' + this.state.formAnexoModal.attachment.file;
            } else if (formAnexoModal.attachment.processed) {
                return formAnexoModal.attachment.url;
            }
        }
        return '';
    };

    baixarAnexo = (e, formAnexoModal) => {
        e.preventDefault();
        if (formAnexoModal.attachment != null) {
            if (formAnexoModal.attachment.file != null) {
                UtilService.downloadPdfOrImage(formAnexoModal.attachment.file, formAnexoModal.nomeAnexo, formAnexoModal.tipoAnexo);
            } else if (formAnexoModal.attachment.processed) {
                UtilService.openPdfOrImageUrl(formAnexoModal.attachment.url);
            }
        } else if (formAnexoModal && formAnexoModal.base64Anexo && formAnexoModal && formAnexoModal.base64Anexo.length > 0) {
            UtilService.download(formAnexoModal.base64Anexo, formAnexoModal.nomeAnexo, formAnexoModal.tipoAnexo);
        }
    };

    retornaTipoArquivo = nomeArquivo => {
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

    cleanRecebimentoFormData = () => {
        const formData = { ...this.state.formData };
        formData.bank = '';
        formData.agency = '';
        formData.transaction = '';
        formData.bankAccount = '';
        formData.cpf = '';
        formData.cnpj = '';
        formData.accountOwnerName = '';
        formData.pisNumber = '';
        return formData;
    };

    loadAntigoRecebimentoFormData = () => {
        const formData = { ...this.state.formData };
        formData.bank = formData.antigoRecebimento.bank;
        formData.agency = formData.antigoRecebimento.agency;
        formData.transaction = formData.antigoRecebimento.transaction;
        formData.bankAccount = formData.antigoRecebimento.bankAccount;
        formData.cpf = formData.antigoRecebimento.cpf;
        formData.cnpj = formData.antigoRecebimento.cpnj;
        formData.accountOwnerName = formData.antigoRecebimento.accountOwnerName;
        formData.pisNumber = formData.antigoRecebimento.pisNumber;
        return formData;
    };

    handleTipoRecebimentoChange = e => {
        let formData = { ...this.state.formData };
        if (e.target.value === formData.antigoTipoRecebimento) {
            formData = this.loadAntigoRecebimentoFormData();
        } else if (e.target.value !== formData.tipoRecebimento) {
            formData = this.cleanRecebimentoFormData();
        }
        formData.tipoRecebimento = e.target.value;

        this.setState({ formData });
    };

    handleContaEmpresaChange = e => {
        let formData = { ...this.state.formData };
        this.getTemporaryPaymentSelectedByProperty(formData, 'isCompanyAccount').isCompanyAccount = e.target.value === 'true';
        this.setState({ formData });
    };
    handleCpfOuCnpjChange = e => {
        let formData = { ...this.state.formData };
        formData.cpfOuCnpj = e.target.value;
        this.setState({ formData });
    };

    handleBancoChange = e => {
        let formData = { ...this.state.formData };
        this.getTemporaryPaymentSelectedByProperty(formData, 'bank').bank = e.target.value;
        this.setState({ formData });
    };
    handleAgenciaChange = e => {
        let formData = { ...this.state.formData };
        this.getTemporaryPaymentSelectedByProperty(formData, 'agency').agency = e.target.value;
        this.setState({ formData });
    };
    handleOperacaoChange = e => {
        let formData = { ...this.state.formData };
        this.getTemporaryPaymentSelectedByProperty(formData, 'transaction').transaction = e.target.value;
        this.setState({ formData });
    };
    handleContaChange = e => {
        let formData = { ...this.state.formData };
        this.getTemporaryPaymentSelectedByProperty(formData, 'bankAccount').bankAccount = e.target.value;
        this.setState({ formData });
    };
    handleCpfChange = e => {
        let formData = { ...this.state.formData };
        this.getTemporaryPaymentSelectedByProperty(formData, 'cpf').cpf = e.target.value;
        this.setState({ formData });
    };
    handleCnpjChange = e => {
        let formData = { ...this.state.formData };
        this.getTemporaryPaymentSelectedByProperty(formData, 'cnpj').cnpj = e.target.value;
        this.setState({ formData });
    };
    handleNomeTitularChange = e => {
        let formData = { ...this.state.formData };
        this.getTemporaryPaymentSelectedByProperty(formData, 'accountOwnerName').accountOwnerName = e.target.value;
        this.setState({ formData });
    };
    handleNumeroPisChange = e => {
        let formData = { ...this.state.formData };
        this.getTemporaryPaymentSelectedByProperty(formData, 'pisNumber').pisNumber = e.target.value;
        this.setState({ formData });
    };
    handlePixKeyChange = e => {
        let formData = { ...this.state.formData };
        this.getTemporaryPaymentSelectedByProperty(formData, 'pix').pix = {...this.getTemporaryPaymentSelectedByProperty(formData, 'pix').pix, pixKey: e.target.value};
        this.setState({ formData });
    };
    handlePixKeyTypeChange = e => {
        let formData = { ...this.state.formData };
        this.getTemporaryPaymentSelectedByProperty(formData, 'pix').pix = {...this.getTemporaryPaymentSelectedByProperty(formData, 'pix').pix, pixKeyType: e.target.value};
        this.getTemporaryPaymentSelectedByProperty(formData, 'pix').pix = {...this.getTemporaryPaymentSelectedByProperty(formData, 'pix').pix, pixKey: ''};
        this.setState({ formData });
    };

    toggleModalPessoaFisica = state => {
        this.setState({
            [state]: !this.state[state]
        });
    };

    submitModalPessoaFisica = form => {
        this.handleSubmitModalPessoaFisica(form);
    };

    handleSubmitModalPessoaFisica = onlyGetError => {
        let error = false;
        let formVaziosModalPessoaFisica = {
            ...this.state.formVaziosModalPessoaFisica
        };

        if (!this.getTemporaryPaymentSelected()?.bank || this.getTemporaryPaymentSelected()?.bank.length === 0) {
            formVaziosModalPessoaFisica.bank = true;
            error = true;
        } else {
            formVaziosModalPessoaFisica.bank = false;
        }

        if (!this.getTemporaryPaymentSelected()?.agency || this.getTemporaryPaymentSelected()?.agency?.length === 0) {
            formVaziosModalPessoaFisica.agency = true;
            error = true;
        } else {
            formVaziosModalPessoaFisica.agency = false;
        }

        if (this.state.formData.tipoRecebimento === 'SO') {
            formVaziosModalPessoaFisica.transaction = true;
        } else {
            //   if (
            //       !this.getTemporaryPaymentSelected()?.transaction ||
            //       this.getTemporaryPaymentSelected()?.senha?.transaction === 0
            //   ) {
            //     formVaziosModalPessoaFisica.transaction = true;
            //     error = true;
            //   } else {
            formVaziosModalPessoaFisica.transaction = false;
            //   }
        }

        if (!this.getTemporaryPaymentSelected()?.bankAccount || this.getTemporaryPaymentSelected()?.bankAccount?.length === 0) {
            formVaziosModalPessoaFisica.bankAccount = true;
            error = true;
        } else {
            formVaziosModalPessoaFisica.bankAccount = false;
        }

        if (this.state.formData.tipoRecebimento === 'PJ') {
            if (this.getTemporaryPaymentSelected()?.isCompanyAccount) {
                if (!this.getTemporaryPaymentSelected()?.cnpj || this.getTemporaryPaymentSelected()?.cnpj?.length === 0) {
                    formVaziosModalPessoaFisica.cnpj = true;
                    error = true;
                } else {
                    formVaziosModalPessoaFisica.cnpj = false;
                }
            } else {
                if (!this.getTemporaryPaymentSelected()?.cpf || this.getTemporaryPaymentSelected()?.cpf?.length === 0) {
                    formVaziosModalPessoaFisica.cpf = true;
                    error = true;
                } else {
                    formVaziosModalPessoaFisica.cpf = false;
                }
            }
        } else {
            if (!this.getTemporaryPaymentSelected()?.cpf || this.getTemporaryPaymentSelected()?.cpf?.length === 0) {
                formVaziosModalPessoaFisica.cpf = true;
                error = true;
            } else {
                formVaziosModalPessoaFisica.cpf = false;
            }
        }

        if (!this.getTemporaryPaymentSelected()?.accountOwnerName || this.getTemporaryPaymentSelected()?.accountOwnerName?.length === 0) {
            formVaziosModalPessoaFisica.accountOwnerName = true;
            error = true;
        } else {
            formVaziosModalPessoaFisica.accountOwnerName = false;
        }

        if (!this.getTemporaryPaymentSelected()?.pisNumber || this.getTemporaryPaymentSelected()?.pisNumber?.length === 0) {
            formVaziosModalPessoaFisica.pisNumber = true;
            error = true;
        } else {
            formVaziosModalPessoaFisica.pisNumber = false;
        }

        if (!this.getTemporaryPaymentSelected()?.pixKey || this.getTemporaryPaymentSelected()?.pixKey?.length === 0) {
            formVaziosModalPessoaFisica.pixKey = true;
            error = true;
        } else {
            formVaziosModalPessoaFisica.pixKey = false;
        }

        if (!this.getTemporaryPaymentSelected()?.pixKeyType || this.getTemporaryPaymentSelected()?.pixKeyType?.length === 0) {
            formVaziosModalPessoaFisica.pixKeyType = true;
            error = true;
        } else {
            formVaziosModalPessoaFisica.pixKeyType = false;
        }

        this.setState({ formVaziosModalPessoaFisica }, () => {
            if (error) {
                return toast.error('Preencha os Campos Obrigatórios!');
            }
            const temporaryPaymentsData = cloneDeep(this.state.formData.temporaryPaymentsData);
            this.setState(
                {
                    formData: {
                        ...this.state.formData,
                        temporaryPaymentsData: [],
                        paymentsData: temporaryPaymentsData
                    }
                },
                () => {
                    toast.success('Dados gravados com sucesso!');
                    this.toggleModalPessoaFisica('modalPessoaFisica');
                }
            );
        });

        // if (this.state.formData.bank.length !== 0 && this.state.formData.agency.length !== 0 && this.state.formData.transaction.length !== 0 && this.state.formData.bankAccount.length !== 0 &&
        //     this.state.formData.accountOwnerName.length !== 0 && this.state.formData.pisNumber.length !== 0 && (this.state.formData.cpf.length !== 0 || this.state.formData.cnpj.length !== 0)) {
        //     toast.success("Dados gravados com sucesso!");
        //     this.toggleModalPessoaFisica("modalPessoaFisica");
        // } else {
        //     toast.error("Preencha os Campos Obrigatórios!");
        // }
    };

    //  async verificaPreenchimentoModalPessoaFisica() {
    //     let error = false;
    //     let formVaziosModalPessoaFisica = {...this.state.formVaziosModalPessoaFisica};
    //     if (!this.state.formData.bank || this.state.formData.bank.length === 0) {
    //         formVaziosModalPessoaFisica.bank = true;
    //         error = true;
    //     } else {
    //         formVaziosModalPessoaFisica.bank = false;
    //     }
    //
    //     if (!this.state.formData.agency || this.state.formData.agency.length === 0) {
    //         formVaziosModalPessoaFisica.agency = true;
    //         error = true;
    //     } else {
    //         formVaziosModalPessoaFisica.agency = false;
    //     }
    //
    //     if (!this.state.formData.transaction || this.state.formData.senha.transaction === 0) {
    //         formVaziosModalPessoaFisica.transaction = true;
    //         error = true;
    //     } else {
    //         formVaziosModalPessoaFisica.transaction = false;
    //     }
    //
    //     if (!this.state.formData.bankAccount || this.state.formData.bankAccount.length === 0) {
    //         formVaziosModalPessoaFisica.bankAccount = true;
    //         error = true;
    //     } else {
    //         formVaziosModalPessoaFisica.bankAccount = false;
    //     }
    //
    //     if (!this.state.formData.cpf || this.state.formData.cpf.length === 0) {
    //         formVaziosModalPessoaFisica.cpf = true;
    //         error = true;
    //     } else {
    //         formVaziosModalPessoaFisica.cpf = false;
    //     }
    //
    //     if (!this.state.formData.cnpj || this.state.formData.cnpj.length === 0) {
    //         formVaziosModalPessoaFisica.cnpj = true;
    //         error = true;
    //     } else {
    //         formVaziosModalPessoaFisica.cnpj = false;
    //     }
    //
    //     if (!this.state.formData.accountOwnerName || this.state.formData.accountOwnerName.length === 0) {
    //         formVaziosModalPessoaFisica.accountOwnerName = true;
    //         error = true;
    //     } else {
    //         formVaziosModalPessoaFisica.accountOwnerName = false;
    //     }
    //
    //     if (!this.state.formData.pisNumber || this.state.formData.pisNumber.length === 0) {
    //         formVaziosModalPessoaFisica.pisNumber = true;
    //         error = true;
    //     } else {
    //         formVaziosModalPessoaFisica.pisNumber = false;
    //     }
    //     await this.setState({formVaziosModalPessoaFisica});
    //      return error;
    //
    // };

    excluirAnexo = e => {
        e.preventDefault();
        swal({
            title: 'Confirmar Exclusão',
            text: 'Deseja excluir esse Anexo?',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        }).then(willDelete => {
            if (willDelete) {
                let formAnexoModal = { ...this.state.formAnexoModal };

                let formData = { ...this.state.formData };
                formData.listTodosAnexosMedicoVo[formAnexoModal.indexListaTodosAnexos].listMedicoAnexo[formAnexoModal.indexListaAnexo].excluido = true;
                this.setState({ formData });
                this.toggleModalPessoaFisica('modalVisualizarAnexo');
                toast.success('Anexo Removido! Para salvar as alterações clique no botão salvar na parte inferior da tela.');
            }
        });
    };

    validarAnexo = e => {
        e.preventDefault();
        if (this.state.itemAnexo.validado == null) {
            this.setState({ errorItemAnexoRadiobox: true });
            return;
        }

        if (this.state.itemAnexo.campoAnexo.id === 15) {
            const itemAnexo = this.state.itemAnexo;
            itemAnexo.extra = JSON.stringify({ appIgnoreStatus: false });
            this.setState({ itemAnexo });
        }
        let formAnexoModal = { ...this.state.formAnexoModal };

        let formData = { ...this.state.formData };
        formData.listTodosAnexosMedicoVo[formAnexoModal.indexListaTodosAnexos].listMedicoAnexo[formAnexoModal.indexListaAnexo] = this.state.itemAnexo;

        this.setState({ formData });
        this.toggleModalPessoaFisica('modalVisualizarAnexo');
        toast.success('Gravado com sucesso! Para salvar as alterações clique no botão salvar na parte inferior da tela.');
    };

    handleValidadoChange = e => {
        let itemAnexo = { ...this.state.itemAnexo };
        itemAnexo.validado = e.target.value === 'true';
        this.setState(
            {
                itemAnexo,
                errorItemAnexoRadiobox: false
            },
            () => {}
        );
    };

    handleObservacaoChange = e => {
        let itemAnexo = { ...this.state.itemAnexo };
        itemAnexo.observacaoValidacao = e.target.value;
        this.setState({ itemAnexo });
    };

    handleEditarImagem = base64 => {
        let i = new Image();
        i.src = base64;
        i.onload = () => {
            this.setState({
                formImageModal: {
                    anexo: base64,
                    showModal: true,
                    height: i.height,
                    width: i.width
                }
            });
        };
    };

    toggleEditarImagemModal = () => {
        this.setState({
            formImageModal: {
                anexo: null,
                showModal: false,
                height: null,
                width: null
            }
        });
    };

    onFinishEditingImagemModal = image => {
        const { formData, formAnexoModal } = this.state;
        const base64 = image.split('base64,')[1];
        formData.listTodosAnexosMedicoVo[formAnexoModal.indexListaTodosAnexos].listMedicoAnexo[formAnexoModal.indexListaAnexo].base64Anexo = base64;
        this.setState(prevState => ({
            formImageModal: {
                anexo: null,
                showModal: false,
                height: null,
                width: null
            },
            formAnexoModal: {
                ...prevState.formAnexoModal,
                base64Anexo: base64
            },
            formData
        }));
    };

    /* Verifica permissão para adicionar/editar documentos, com base no campoAnexo para verificar para campos adicionais */
    checkHiddenDocumentsPermission = campoAnexoId => {
        const { permissao, permissaoAdicionais } = this.state;

        if (campoAnexoId === 15 && permissaoAdicionais) {
            return false;
        } else if (campoAnexoId === 15 && !permissaoAdicionais) {
            return true;
        } else if (permissao) {
            return true;
        }

        return false;
    };

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
                AttachmentService.compress('MEDIC', this.state.formData.id, null, null, null, null, null).subscribe(
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

    onChangeDoctor = (paymentsData, tipoRecebimento, isNew) => {
        const correctPayment = isNew ? 'temporaryPaymentsData' : 'paymentsData';
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    tipoRecebimento,
                    [correctPayment]: paymentsData
                }
            },
            () => {
                if (paymentsData.findIndex(paymentData => paymentData.type === tipoRecebimento) !== -1) {
                    const correctModalPayment = isNew ? this.state.formData.temporaryPaymentsData : this.state.formData.paymentsData;
                    this.setState(
                        {
                            formData: {
                                ...this.state.formData,
                                temporaryPaymentsData: correctModalPayment
                            }
                        },
                        () => this.toggleModalPessoaFisica('modalPessoaFisica')
                    );
                }
            }
        );
    };

    onClickDoctor = tipoRecebimento => {
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    tipoRecebimento,
                    temporaryPaymentsData: this.state.formData.paymentsData
                }
            },
            () => {
                const paymentsData = this.state.formData.paymentsData;
                if (paymentsData?.findIndex(paymentData => paymentData.type === tipoRecebimento) !== -1) {
                    this.toggleModalPessoaFisica('modalPessoaFisica');
                }
            }
        );
    };

    getTemporaryPaymentSelected = () => {
        return this.state.formData?.temporaryPaymentsData?.find(item => item.type === this.state.formData.tipoRecebimento) ?? {};
    };

    getTemporaryPaymentSelectedByProperty = (formData, property) => {
        const entity = formData?.temporaryPaymentsData?.find(item => item.type === this.state.formData.tipoRecebimento);
        if (!entity) return {};
        if (entity[property] != null) return entity;
        entity[property] = undefined;
        return entity;
    };

    render() {
        return (
            <>
                {/* Page content */}
                <div id="usuarioApp-cadastro">
                    {/* Modal Especialidade */}
                    {this.state.formImageModal.showModal && (
                        <ImageEditorModal
                            showModal={this.state.formImageModal.showModal}
                            image={this.state.formImageModal.anexo}
                            zoomRate={0.1}
                            rotationRate={90}
                            height={this.state.formImageModal.height}
                            width={this.state.formImageModal.width}
                            toggleModal={this.toggleEditarImagemModal}
                            cancelAction={this.toggleEditarImagemModal}
                            primaryButtonAction={this.onFinishEditingImagemModal}
                        />
                    )}
                    <Modal className="modal-dialog-centered" isOpen={this.state.especialidadeModal} toggle={() => this.toggleModal('especialidadeModal')}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="especialidadeModalModalLabel">
                                Cadastrar Nova Especialidade
                            </h5>
                            <button
                                aria-label="Close"
                                className="close"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => this.toggleModal('especialidadeModal')}
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
                                                id="descricao"
                                                placeholder="Descrição"
                                                value={this.state.formEspecialidadeModal.descricao}
                                                onChange={this.handleEspecialidadeModalDescricaoChange}
                                                autoComplete="off"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className="modal-footer">
                            <Button color="secondary" data-dismiss="modal" type="button" onClick={() => this.toggleModal('especialidadeModal')}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="button" onClick={this.handleSubmitModalEspecialidade}>
                                Salvar
                            </Button>
                        </div>
                    </Modal>

                    <Modal className="modal-dialog-centered" isOpen={this.state.cursoModal} toggle={() => this.toggleModal('cursoModal')}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="cursoModalLabel">
                                Cadastrar Novo Curso
                            </h5>
                            <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={() => this.toggleModal('cursoModal')}>
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
                                                id="nome"
                                                placeholder="Nome"
                                                value={this.state.formCursoModal.nome}
                                                onChange={this.handleCursoNomeChange}
                                                autoComplete="off"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className="modal-footer">
                            <Button color="secondary" data-dismiss="modal" type="button" onClick={() => this.toggleModal('cursoModal')}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="button" onClick={this.handleSubmitModalCurso}>
                                Salvar
                            </Button>
                        </div>
                    </Modal>

                    <Card className="pt-lg-1 b-r-1 w-95">
                        <CardHeader className="bg-transparent pb-5">
                            <div className="text-muted text-center mt-2 mb-4">
                                {this.state.loading ? (
                                    <ClipLoader css={override} sizeUnit={'px'} size={50} color={'#009776'} loading={this.state.loading} />
                                ) : null}
                                <div className="head-title__items">
                                    <h1 className="head-title">{!!this.state.formData.nome ? this.state.formData.nome : 'Novo Médico'}</h1>
                                    <div>
                                        {this.state.waitingDownload ? (
                                            <ClipLoader css={override} sizeUnit={'px'} size={50} color={'#009776'} loading={this.state.waitingDownload} />
                                        ) : null}
                                        <Button
                                            className="btn-primary"
                                            onClick={this.handleButtonAttachmentDownload}
                                            disabled={this.state.waitingDownload || this.state.loading}
                                        >
                                            {!!this.state.waitingDownalodProcess && !!this.state.compressAttachment
                                                ? 'Verificar se terminou de comprimir' + '.'.repeat(this.state.ttlDots % 5)
                                                : this.state.waitingDownload
                                                ? 'Comprimindo os arquivos' + '.'.repeat(this.state.ttlDots % 5)
                                                : 'Download dos documentos'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {!!this.state.formData.id && !this.state.formData.status ? (
                                <h2 className="text-red">*Médico ainda não realizou o cadastro completo</h2>
                            ) : null}
                        </CardHeader>
                        <CardBody className="px-lg-5 py-lg-5">
                            {/* Formulário de cadastro */}
                            <Form onSubmit={this.handleSubmit}>
                                <Row className="w">
                                    {/*Nome*/}
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Nome</h2>
                                        </Label>
                                        {!this.state.formVazios.nome ? (
                                            <FormGroup>
                                                <Input
                                                    id="nome"
                                                    placeholder="Nome"
                                                    value={this.state.formData.nome}
                                                    onChange={this.handleNomeChange}
                                                    autoComplete="off"
                                                    maxLength="50"
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className="campo-invalido">
                                                <Input
                                                    id="nome"
                                                    placeholder="Nome"
                                                    value={this.state.formData.nome}
                                                    onChange={this.handleNomeChange}
                                                    autoComplete="off"
                                                    maxLength="50"
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>

                                    {/*Telefone*/}
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Telefone</h2>
                                        </Label>
                                        {!this.state.formVazios.telefone ? (
                                            <FormGroup>
                                                <InputMask
                                                    className="custom-input"
                                                    mask="(99) 99999-9999"
                                                    placeholder="Telefone"
                                                    onChange={this.handleTelefoneChange}
                                                    value={this.state.formData.telefone}
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className="campo-invalido">
                                                <InputMask
                                                    className="custom-input"
                                                    mask="(99) 99999-9999"
                                                    placeholder="Telefone"
                                                    onChange={this.handleTelefoneChange}
                                                    value={this.state.formData.telefone}
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    {/*Email*/}
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">E-mail</h2>
                                        </Label>
                                        {!this.state.formVazios.email && this.state.emailValido ? (
                                            <FormGroup>
                                                <Input
                                                    id="email"
                                                    placeholder="E-mail"
                                                    value={this.state.formData.email}
                                                    onChange={this.handleLoginChange}
                                                    autoComplete="off"
                                                    maxLength="50"
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className="campo-invalido">
                                                <Input
                                                    id="email"
                                                    placeholder="E-mail"
                                                    value={this.state.formData.email}
                                                    onChange={this.handleLoginChange}
                                                    autoComplete="off"
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>

                                    {/*Senha*/}
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Senha</h2>
                                        </Label>
                                        {!this.state.formVazios.senha || this.state.editando ? (
                                            <FormGroup>
                                                <Input
                                                    id="senha"
                                                    placeholder="Senha"
                                                    value={this.state.formData.senha}
                                                    onChange={this.handleSenhaChange}
                                                    autoComplete="off"
                                                    maxLength="20"
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className="campo-invalido">
                                                <Input
                                                    id="senha"
                                                    placeholder="Senha"
                                                    value={this.state.formData.senha}
                                                    onChange={this.handleSenhaChange}
                                                    autoComplete="off"
                                                    maxLength="20"
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Data de nascimento</h2>
                                        </Label>
                                        {!this.state.formVazios.birthDate ? (
                                            <FormGroup>
                                                <InputMask
                                                    className="custom-input"
                                                    mask="99/99/9999"
                                                    placeholder="Data de nascimento"
                                                    onChange={this.handleBirthDateChange}
                                                    value={this.state.formData.birthDate}
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className="campo-invalido">
                                                <InputMask
                                                    className="custom-input"
                                                    mask="99/99/9999"
                                                    placeholder="Data de nascimento"
                                                    onChange={this.handleBirthDateChange}
                                                    value={this.state.formData.birthDate}
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>
                                    {/*sexo*/}
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Sexo</h2>
                                        </Label>
                                        {!this.state.formVazios.sexo ? (
                                            <FormGroup>
                                                <Input
                                                    type="select"
                                                    name="select"
                                                    id="sexoSelect"
                                                    onChange={this.handleSexoChange}
                                                    value={this.state.formData.sexo}
                                                >
                                                    <option value="nenhum">Selecione o Sexo</option>
                                                    <option value="M">Masculino</option>
                                                    <option value="F">Feminino</option>
                                                </Input>
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className="campo-invalido">
                                                <Input
                                                    type="select"
                                                    name="select"
                                                    id="sexoSelect"
                                                    onChange={this.handleSexoChange}
                                                    value={this.state.formData.sexo}
                                                >
                                                    <option value="">Selecione o Sexo</option>
                                                    <option value="M">Masculino</option>
                                                    <option value="F">Feminino</option>
                                                </Input>
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>

                                <hr />
                                <Row>
                                    <Col md="9">
                                        <Label>
                                            <h2 className="card-title text-center">Logradouro</h2>
                                        </Label>

                                        {!this.state.formVazios.address.street ? (
                                            <FormGroup>
                                                <Input
                                                    placeholder="Logradouro"
                                                    onChange={this.handleAddressStreetChange}
                                                    value={this.state.formData.address.street}
                                                    autoComplete="off"
                                                    maxLength="250"
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className="campo-invalido">
                                                <Input
                                                    placeholder="Logradouro"
                                                    onChange={this.handleAddressStreetChange}
                                                    value={this.state.formData.address.street}
                                                    autoComplete="off"
                                                    maxLength="250"
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>
                                    <Col md="3">
                                        <Label>
                                            <h2 className="card-title text-center">Número</h2>
                                        </Label>

                                        {!this.state.formVazios.address.number ? (
                                            <FormGroup>
                                                <Input
                                                    type="number"
                                                    placeholder="Número"
                                                    onChange={this.handleAddressNumberChange}
                                                    value={this.state.formData.address.number}
                                                    autoComplete="off"
                                                    maxLength="50"
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className="campo-invalido">
                                                <Input
                                                    type="number"
                                                    placeholder="Número"
                                                    onChange={this.handleAddressNumberChange}
                                                    value={this.state.formData.address.number}
                                                    autoComplete="off"
                                                    maxLength="50"
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">CEP</h2>
                                        </Label>

                                        {!this.state.formVazios.address.zipcode ? (
                                            <FormGroup>
                                                <InputMask
                                                    className="custom-input"
                                                    mask="99999-999"
                                                    placeholder="CEP"
                                                    onChange={this.handleAddressZipcodeChange}
                                                    value={this.state.formData.address.zipcode}
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className="campo-invalido">
                                                <InputMask
                                                    className="custom-input"
                                                    mask="99999-999"
                                                    placeholder="CEP"
                                                    onChange={this.handleAddressZipcodeChange}
                                                    value={this.state.formData.address.zipcode}
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Complemento</h2>
                                        </Label>

                                        <FormGroup>
                                            <Input
                                                placeholder="Complemento (Opcional)"
                                                onChange={this.handleAddressComplementChange}
                                                value={this.state.formData.address.complement}
                                                autoComplete="off"
                                                maxLength="250"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Estado</h2>
                                        </Label>
                                        {!this.state.formVazios.address.city ||
                                        !this.state.formVazios.address.city.state ||
                                        !this.state.formVazios.address.city.state.id ? (
                                            <FormGroup>
                                                <Input
                                                    type="select"
                                                    name="select"
                                                    onChange={this.handleAddressStateChange}
                                                    value={
                                                        this.state.formData.address.city != null
                                                            ? this.state.formData.address.city.state != null
                                                                ? this.state.formData.address.city.state.id
                                                                : 'default'
                                                            : 'default'
                                                    }
                                                >
                                                    <option name="default" value="default">
                                                        Selecionar
                                                    </option>
                                                    {this.state.listStates.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.id}>
                                                                {item.name}
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
                                                    onChange={this.handleAddressStateChange}
                                                    value={
                                                        this.state.formData.address.city != null
                                                            ? this.state.formData.address.city.state != null
                                                                ? this.state.formData.address.city.state.id
                                                                : 'default'
                                                            : 'default'
                                                    }
                                                >
                                                    <option name="default" value="default">
                                                        Selecionar
                                                    </option>
                                                    {this.state.listStates.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        );
                                                    })}
                                                </Input>
                                            </FormGroup>
                                        )}
                                    </Col>
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Cidade</h2>
                                        </Label>

                                        {!this.state.formVazios.address.city || !this.state.formVazios.address.city.id ? (
                                            <FormGroup>
                                                <Input
                                                    type="select"
                                                    name="select"
                                                    onChange={this.handleAddressCityChange}
                                                    value={this.state.formData.address.city != null ? this.state.formData.address.city.id : 'default'}
                                                >
                                                    <option name="default" value="default">
                                                        Selecionar
                                                    </option>
                                                    {this.state.listCities.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.id}>
                                                                {item.name}
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
                                                    onChange={this.handleAddressCityChange}
                                                    value={this.state.formData.address.city.id}
                                                >
                                                    <option name="default" value="default">
                                                        Selecionar
                                                    </option>
                                                    {this.state.listCities.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        );
                                                    })}
                                                </Input>
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    {/*Número CRM*/}
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Número do CRM</h2>
                                        </Label>
                                        {!this.state.formVazios.numeroCrm ? (
                                            <FormGroup>
                                                <Input
                                                    type="number"
                                                    placeholder="Número CRM"
                                                    value={this.state.formData.numeroCrm}
                                                    onChange={this.handleNumeroCrmChange}
                                                    autoComplete="off"
                                                    maxLength="50"
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className="campo-invalido">
                                                <Input
                                                    type="number"
                                                    placeholder="Número CRM"
                                                    value={this.state.formData.numeroCrm}
                                                    onChange={this.handleNumeroCrmChange}
                                                    autoComplete="off"
                                                    maxLength="50"
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>

                                    {/*Uf*/}
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Estado do CRM</h2>
                                        </Label>
                                        {!this.state.formVazios.ufConselhoMedico ? (
                                            <FormGroup>
                                                <Input
                                                    type="select"
                                                    name="select"
                                                    id="ufSelect"
                                                    onChange={this.handleUfConselhoMedicoChange}
                                                    value={this.state.formData.ufConselhoMedico}
                                                >
                                                    <option name="default" value="default">
                                                        Selecionar UF conselho médico
                                                    </option>
                                                    {this.state.listaCidadeEstado.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.sigla}>
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
                                                    id="ufSelect"
                                                    onChange={this.handleUfConselhoMedicoChange}
                                                    value={this.state.formData.ufConselhoMedico}
                                                >
                                                    <option name="default" value="default">
                                                        Selecionar UF conselho médico
                                                    </option>
                                                    {this.state.listaCidadeEstado.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.sigla}>
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
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Emissão do CRM</h2>
                                        </Label>
                                        {!this.state.formVazios.crmIssueDate ? (
                                            <FormGroup>
                                                <InputMask
                                                    className="custom-input"
                                                    mask="99/99/9999"
                                                    placeholder="Emissão do CRM"
                                                    onChange={this.handleCrmIssueDateChange}
                                                    value={this.state.formData.crmIssueDate}
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className="campo-invalido">
                                                <InputMask
                                                    className="custom-input"
                                                    mask="99/99/9999"
                                                    placeholder="Emissão do CRM"
                                                    onChange={this.handleCrmIssueDateChange}
                                                    value={this.state.formData.crmIssueDate}
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>

                                <Row>
                                    {/*Número CRM*/}
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Número do CRM Adicional</h2>
                                        </Label>
                                        {!this.state.formVazios.numeroCrmAdicional ? (
                                            <FormGroup>
                                                <Input
                                                    type="number"
                                                    placeholder="Número CRM Adicional"
                                                    value={this.state.formData.numeroCrmAdicional}
                                                    onChange={this.handleNumeroCrmAdicionalChange}
                                                    autoComplete="off"
                                                    maxLength="50"
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className="campo-invalido">
                                                <Input
                                                    type="number"
                                                    placeholder="Número CRM Adicional"
                                                    value={this.state.formData.numeroCrmAdicional}
                                                    onChange={this.handleNumeroCrmAdicionalChange}
                                                    autoComplete="off"
                                                    maxLength="50"
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>

                                    {/*Uf*/}
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Estado do CRM Adicional</h2>
                                        </Label>
                                        {!this.state.formVazios.ufConselhoMedicoAdicional ? (
                                            <FormGroup>
                                                <Input
                                                    type="select"
                                                    name="select"
                                                    id="ufSelect"
                                                    onChange={this.handleUfConselhoMedicoAdicionalChange}
                                                    value={this.state.formData.ufConselhoMedicoAdicional}
                                                >
                                                    <option name="default" value="default">
                                                        Selecionar UF conselho médico adicional
                                                    </option>
                                                    {this.state.listaCidadeEstado.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.sigla}>
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
                                                    id="ufSelect"
                                                    onChange={this.handleUfConselhoMedicoAdicionalChange}
                                                    value={this.state.formData.ufConselhoMedicoAdicional}
                                                >
                                                    <option name="default" value="default">
                                                        Selecionar UF conselho médico adicional
                                                    </option>
                                                    {this.state.listaCidadeEstado.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.sigla}>
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
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Emissão do CRM Adicional</h2>
                                        </Label>
                                        {!this.state.formVazios.crmAdicionalIssueDate ? (
                                            <FormGroup>
                                                <InputMask
                                                    className="custom-input"
                                                    mask="99/99/9999"
                                                    placeholder="Emissão do CRM Adicional"
                                                    onChange={this.handleCrmAdicionalIssueDateChange}
                                                    value={this.state.formData.crmAdicionalIssueDate}
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className="campo-invalido">
                                                <InputMask
                                                    className="custom-input"
                                                    mask="99/99/9999"
                                                    placeholder="Emissão do CRM Adicional"
                                                    onChange={this.handleCrmAdicionalIssueDateChange}
                                                    value={this.state.formData.crmAdicionalIssueDate}
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>
                                <hr />
                                {this.state.formData.id != null && (
                                    <Row>
                                        <Col md="6">
                                            <Label>
                                                <h2 className="card-title text-center">Status</h2>
                                            </Label>
                                            <FormGroup>
                                                <Input
                                                    type="select"
                                                    name="select"
                                                    id="sexoSelect"
                                                    onChange={this.handleAtivo}
                                                    value={this.state.formData.ativo ? 'Ativo' : 'Inativo'}
                                                >
                                                    <option value="Ativo">Ativo</option>
                                                    <option value="Inativo">Inativo</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                )}
                                <Row>
                                    {/*PONTUACAO*/}
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Pontuação</h2>
                                        </Label>
                                        {!this.state.formVazios.pontuacao ? (
                                            <FormGroup>
                                                <Input
                                                    type="number"
                                                    placeholder="Pontuação"
                                                    onChange={this.handlePontuacaoChange}
                                                    value={this.state.formData.pontuacao}
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className="campo-invalido">
                                                <InputMask
                                                    type="number"
                                                    placeholder="Pontuação"
                                                    onChange={this.handlePontuacaoChange}
                                                    value={this.state.formData.pontuacao}
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>

                                <hr />
                                <PreferencesMedic value={this.state.formData.preferencesMedic} onChange={this.handlePreferencesMedic} />
                                <hr />
                                <Row className="mobile-anexos">
                                    <Col md="6">
                                        <Label>
                                            <h2 className="card-title text-center">Tipo de recebimento</h2>
                                        </Label>
                                        <Col md="12">
                                            <DoctorPayments
                                                onClick={this.onClickDoctor}
                                                onChange={this.onChangeDoctor}
                                                doctorId={this.state.formData?.id}
                                                payments={this.state.formData?.paymentsData ?? []}
                                            />
                                        </Col>
                                    </Col>
                                </Row>

                                {/* anexos */}
                                <Row>
                                    {this.state.formData.listTodosAnexosMedicoVo.map((item, i) => {
                                        return (
                                            /*esconde os campos anexos 11, 12, 13 quando o tipo Recebimento for pj e pf*/
                                            <Col
                                                md="6"
                                                key={i}
                                                hidden={
                                                    ((this.state.formData.tipoRecebimento === 'SO' || this.state.formData.tipoRecebimento === 'PF') &&
                                                        (item.campoAnexo.id === 11 || item.campoAnexo.id === 12 || item.campoAnexo.id === 13)) ||
                                                    item.campoAnexo.id === 7 ||
                                                    item.campoAnexo.id === 10
                                                }
                                            >
                                                <div className="text-muted text-left mt-2">
                                                    <span className="card-title">Anexo {item.campoAnexo.descricao}</span>
                                                    <br />
                                                    <span hidden={item.campoAnexo.id !== 14}>
                                                        Caso você tenha anexado o RG e o CPF não é necessário anexar a CNH.
                                                    </span>
                                                </div>
                                                <Button
                                                    className="btn-primary"
                                                    onClick={() => this.openModalAndLoadCampoAnexo(item.campoAnexo, i)}
                                                    hidden={this.checkHiddenDocumentsPermission(item.campoAnexo.id)}
                                                >
                                                    Anexar
                                                </Button>

                                                {/*<div onChange={() =>this.handelAnexosBancoChange(item)}>
                                                    <FileBase64
                                                        multiple={false}
                                                        onDone={this.handelAnexosChange}
                                                    />
                                                </div>*/}

                                                <div className="ml-3 mb-3" key={i}>
                                                    <div>
                                                        {item.listMedicoAnexo.map((itemAnexo, d) => {
                                                            return (
                                                                !itemAnexo.excluido && (
                                                                    <div key={d} onChange={() => this.handelAnexosBancoChange(itemAnexo)}>
                                                                        <Col>
                                                                            <a
                                                                                className="cursor-custom"
                                                                                onClick={() => this.toggleModal('modalVisualizarAnexo', itemAnexo, i, d)}
                                                                            >
                                                                                Anexo: {itemAnexo.nomeAnexo}
                                                                            </a>
                                                                            <label
                                                                                className="p-l-5"
                                                                                style={this.changeColorRow(itemAnexo)}
                                                                                hidden={!itemAnexo.ehHistorico}
                                                                            >
                                                                                (Histórico)
                                                                            </label>
                                                                            <label
                                                                                className="p-l-5"
                                                                                style={this.changeColorRow(itemAnexo)}
                                                                                hidden={!!itemAnexo.ehHistorico}
                                                                            >
                                                                                (Atual)
                                                                            </label>
                                                                            <label
                                                                                className="p-l-5"
                                                                                style={this.changeColorRowValidado(itemAnexo)}
                                                                                hidden={itemAnexo.validado == null}
                                                                            >
                                                                                {itemAnexo.validado ? '(Válido)' : '(Inválido)'}
                                                                            </label>
                                                                            <label className="p-l-5" hidden={!itemAnexo.novo}>
                                                                                Novo
                                                                            </label>
                                                                            <label
                                                                                className="p-l-5"
                                                                                hidden={!(itemAnexo.campoAnexo.id === 15 && itemAnexo.visualizado === true)}
                                                                            >
                                                                                Visualizado
                                                                            </label>

                                                                            <br hidden={itemAnexo.validado === false || itemAnexo.validado === undefined} />
                                                                            <label
                                                                                className="p-l-5"
                                                                                hidden={!(itemAnexo.campoAnexo.id === 15 && itemAnexo.visualizado === true)}
                                                                            >
                                                                                Visualizado
                                                                            </label>
                                                                        </Col>
                                                                    </div>
                                                                )
                                                            );
                                                        })}
                                                        {item.campoAnexo.id === 4 && item.listMedicoAnexo.length > 0 && (
                                                            <FormGroup className="checkbox-form-control">
                                                                <input
                                                                    type="checkbox"
                                                                    name="checkbox"
                                                                    id="checkbox-rg"
                                                                    onChange={this.handleRgPossuiCpfChange}
                                                                    defaultChecked={this.state.formData.rgPossuiCpf}
                                                                />
                                                                <span className="text-center">Marque se o RG anexado possuir o dado de CPF</span>
                                                            </FormGroup>
                                                        )}
                                                    </div>
                                                </div>
                                            </Col>
                                        );
                                    })}
                                </Row>
                                {/*lista de especialidade*/}
                                <Container className=" mt-5" fluid id="contrato-lista">
                                    {/*lista de especialidades*/}
                                    <div>
                                        <Card>
                                            <Row className="m-0">
                                                <Col md="4" className="text-muted text-center mt-2 mb-4">
                                                    <h1 className="card-title">Especialidades</h1>
                                                </Col>
                                                {/*combo de especialidades*/}
                                                <Col md="4" className="m-t-10">
                                                    <FormGroup>
                                                        <Input
                                                            type="select"
                                                            name="select"
                                                            id="setorSelect"
                                                            onChange={this.handleEspecialidadeChange}
                                                            value={this.state.especialidade.id}
                                                        >
                                                            <option name="default" value="default">
                                                                Selecione Especialidade
                                                            </option>
                                                            {this.state.listaEspecialidade.map((item, i) => {
                                                                return (
                                                                    <option key={i} value={item.id}>
                                                                        {item.descricao}
                                                                    </option>
                                                                );
                                                            })}
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="2" className="m-t-17">
                                                    <Button className="btn-primary" onClick={this.adicionaEspecialidade} hidden={this.state.permissao}>
                                                        Adicionar
                                                    </Button>
                                                </Col>
                                                <Col md="2" className="m-t-12">
                                                    <FormGroup>
                                                        <Button
                                                            className="outline-secondary-mobile"
                                                            color="secondary"
                                                            outline
                                                            type="button"
                                                            onClick={() => this.toggleModal('especialidadeModal')}
                                                            hidden={this.state.permissao}
                                                        >
                                                            <i className="fa fa-plus-circle fa-lg" />
                                                        </Button>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            {/*tabela especialidade*/}
                                            <Table className="table__web">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th scope="col">Especialidade</th>
                                                        <th scope="col">Opções</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {this.state.formData.listaMedicoEspecialidade.map((item, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>{item.especialidade.descricao}</td>
                                                                <td key={item.id}>
                                                                    <Row>
                                                                        <Col md="2">
                                                                            <span
                                                                                onClick={e => this.excluirEspecialidade(item, e)}
                                                                                className="fa fa-minus-circle"
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </Table>
                                            <div className="table__mobile">
                                                {this.state.formData.listaMedicoEspecialidade.length > 0
                                                    ? this.state.formData.listaMedicoEspecialidade.map((item, i) => {
                                                          return (
                                                              <Row>
                                                                  <Col style={{ marginBottom: '20px' }}>
                                                                      <Card>
                                                                          <Table>
                                                                              <tbody>
                                                                                  <tr>
                                                                                      <td className="table__mobile--header-second">Especialidade</td>
                                                                                      <td
                                                                                          style={{
                                                                                              whiteSpace: 'initial'
                                                                                          }}
                                                                                      >
                                                                                          {item.especialidade.descricao}
                                                                                      </td>
                                                                                  </tr>
                                                                                  <tr>
                                                                                      <td className="table__mobile--header-second">Opções</td>
                                                                                      <td key={item.id}>
                                                                                          <Row>
                                                                                              <Col md="2">
                                                                                                  <span
                                                                                                      onClick={e => this.excluirEspecialidade(item, e)}
                                                                                                      className="fa fa-minus-circle"
                                                                                                  />
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
                                                      })
                                                    : 'Sem Registros'}
                                            </div>
                                        </Card>
                                    </div>
                                </Container>

                                <Container className=" mt-5" fluid>
                                    <Card>
                                        <Row>
                                            <Col md="12" className="text-muted mt-2 mb-4 p-l-45">
                                                <h1 className="card-title card-title-mobile">Títulos de Especialidade</h1>
                                            </Col>
                                        </Row>

                                        <Table>
                                            <thead className="thead-light">
                                                <tr>
                                                    <th scope="col">Arquivos</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {!!this.state.formData.listTodosAnexosMedicoVo[7] &&
                                                !!this.state.formData.listTodosAnexosMedicoVo[7].listMedicoAnexo
                                                    ? this.state.formData.listTodosAnexosMedicoVo[7].listMedicoAnexo.map((itemAnexo, i) => {
                                                          return (
                                                              <tr key={i}>
                                                                  {!itemAnexo.excluido ? (
                                                                      <td>
                                                                          <a>{`${
                                                                              itemAnexo.especialidade.descricao ? itemAnexo.especialidade.descricao : ''
                                                                          } - `}</a>
                                                                          <a
                                                                              className="cursor-custom"
                                                                              onClick={() => this.toggleModal('modalVisualizarAnexo', itemAnexo, 7, i)}
                                                                          >
                                                                              {itemAnexo.nomeAnexo}
                                                                          </a>
                                                                          <label
                                                                              className="p-l-5"
                                                                              style={this.changeColorRow(itemAnexo)}
                                                                              hidden={!itemAnexo.ehHistorico}
                                                                          >
                                                                              (Histórico)
                                                                          </label>
                                                                          <label
                                                                              className="p-l-5"
                                                                              style={this.changeColorRow(itemAnexo)}
                                                                              hidden={!!itemAnexo.ehHistorico}
                                                                          >
                                                                              (Atual)
                                                                          </label>
                                                                          <label
                                                                              className="p-l-5"
                                                                              style={this.changeColorRowValidado(itemAnexo)}
                                                                              hidden={itemAnexo.validado == null}
                                                                          >
                                                                              {itemAnexo.validado ? '(Válido)' : '(Inválido)'}
                                                                          </label>
                                                                          <label className="p-l-5" hidden={!itemAnexo.novo}>
                                                                              Novo
                                                                          </label>
                                                                      </td>
                                                                  ) : null}
                                                              </tr>
                                                          );
                                                      })
                                                    : null}
                                            </tbody>
                                        </Table>
                                    </Card>
                                </Container>

                                <Container className=" mt-5" fluid id="contrato-lista">
                                    {/*lista de Cursos*/}
                                    <Card>
                                        <Row className="m-0">
                                            <Col md="4" className="text-muted text-center mt-2 mb-4">
                                                <h1 className="card-title">Cursos</h1>
                                            </Col>
                                        </Row>
                                        <Row className="m-0">
                                            <Col md="4" className=" mt-2 mb-4">
                                                <FormGroup>
                                                    <InputMask
                                                        className="custom-input"
                                                        mask="99/99/9999"
                                                        placeholder="Data de vencimento"
                                                        onChange={this.handleCursoDateChange}
                                                        value={this.state.cursoDate}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            {/*combo de cursos*/}
                                            <Col md="4" className="m-t-10">
                                                <FormGroup>
                                                    <Input
                                                        type="select"
                                                        name="select"
                                                        id="setorSelect"
                                                        onChange={this.handleCursoChange}
                                                        value={this.state.curso.id}
                                                    >
                                                        <option name="default" value="default">
                                                            Selecione Curso
                                                        </option>
                                                        {this.state.listaCurso.map((item, i) => {
                                                            return (
                                                                <option key={i} value={item.id}>
                                                                    {item.nome}
                                                                </option>
                                                            );
                                                        })}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col md="2" className="m-t-17">
                                                <Button className="btn-primary" onClick={this.adicionaCurso} hidden={this.state.permissao}>
                                                    Adicionar
                                                </Button>
                                            </Col>
                                            <Col md="2" className="m-t-12">
                                                <FormGroup>
                                                    <Button
                                                        className="outline-secondary-mobile"
                                                        color="secondary"
                                                        outline
                                                        type="button"
                                                        onClick={() => this.toggleModal('cursoModal')}
                                                        hidden={this.state.permissao}
                                                    >
                                                        <i className="fa fa-plus-circle fa-lg" />
                                                    </Button>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        {/*tabela cursos*/}
                                        <Table className="table__web">
                                            <thead className="thead-light">
                                                <tr>
                                                    <th scope="col">Curso</th>
                                                    <th scope="col">Data de vencimento</th>
                                                    <th scope="col">Opções</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {this.state.formData.listaMedicoCurso.map((item, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{item.curso.nome}</td>
                                                            <td>{formatUTCToBR(item.dataVencimento)}</td>
                                                            <td key={item.id}>
                                                                <Row>
                                                                    <Col md="2">
                                                                        <span onClick={e => this.excluirCurso(item, e)} className="fa fa-minus-circle" />
                                                                    </Col>
                                                                </Row>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                        <div className="table__mobile">
                                            {this.state.formData.listaMedicoCurso.length > 0
                                                ? this.state.formData.listaMedicoCurso.map((item, i) => {
                                                      return (
                                                          <Row>
                                                              <Col style={{ marginBottom: '20px' }}>
                                                                  <Card>
                                                                      <Table>
                                                                          <tbody>
                                                                              <tr>
                                                                                  <td className="table__mobile--header-second">Curso</td>
                                                                                  <td>{item.curso.nome}</td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td className="table__mobile--header-second">Data de Vencimento</td>
                                                                                  <td>{formatUTCToBR(item.dataVencimento)}</td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td className="table__mobile--header-second">Opções</td>
                                                                                  <td key={item.id}>
                                                                                      <Row>
                                                                                          <Col md="2">
                                                                                              <span
                                                                                                  onClick={e => this.excluirCurso(item, e)}
                                                                                                  className="fa fa-minus-circle"
                                                                                              />
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
                                                  })
                                                : 'Sem Registros'}
                                        </div>
                                    </Card>
                                </Container>

                                <Container className=" mt-5" fluid>
                                    <Card>
                                        <Row>
                                            <Col md="12" className="text-muted mt-2 mb-4 p-l-45">
                                                <h1 className="card-title card-title-mobile">Títulos de Cursos</h1>
                                            </Col>
                                        </Row>

                                        <Table>
                                            <thead className="thead-light">
                                                <tr>
                                                    <th scope="col">Arquivos</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {!!this.state.formData.listTodosAnexosMedicoVo[10] &&
                                                !!this.state.formData.listTodosAnexosMedicoVo[10].listMedicoAnexo
                                                    ? this.state.formData.listTodosAnexosMedicoVo[10].listMedicoAnexo.map((itemAnexo, i) => {
                                                          return (
                                                              <tr key={i}>
                                                                  {!itemAnexo.excluido ? (
                                                                      <td>
                                                                          <a>{`${itemAnexo.medicoCurso ? itemAnexo.medicoCurso.curso.nome : ''} - `}</a>
                                                                          <a
                                                                              className="cursor-custom"
                                                                              onClick={() => this.toggleModal('modalVisualizarAnexo', itemAnexo, 10, i)}
                                                                          >
                                                                              {itemAnexo.nomeAnexo}
                                                                          </a>
                                                                          <label
                                                                              className="p-l-5"
                                                                              style={this.changeColorRow(itemAnexo)}
                                                                              hidden={!itemAnexo.ehHistorico}
                                                                          >
                                                                              (Histórico)
                                                                          </label>
                                                                          <label
                                                                              className="p-l-5"
                                                                              style={this.changeColorRow(itemAnexo)}
                                                                              hidden={!!itemAnexo.ehHistorico}
                                                                          >
                                                                              (Atual)
                                                                          </label>
                                                                          <label
                                                                              className="p-l-5"
                                                                              style={this.changeColorRowValidado(itemAnexo)}
                                                                              hidden={itemAnexo.validado == null}
                                                                          >
                                                                              {itemAnexo.validado ? '(Válido)' : '(Inválido)'}
                                                                          </label>
                                                                          <label className="p-l-5" hidden={!itemAnexo.novo}>
                                                                              Novo
                                                                          </label>
                                                                      </td>
                                                                  ) : null}
                                                              </tr>
                                                          );
                                                      })
                                                    : null}
                                            </tbody>
                                        </Table>
                                    </Card>
                                </Container>

                                {/*lista de Escalas p/ bloquear*/}
                                <Container className=" mt-5" fluid id="contrato-lista">
                                    {/*lista de escala*/}
                                </Container>

                                {/*Botões de ação*/}
                                <Row className="p-t-35">
                                    <Col md="6"></Col>
                                    <Col md="3">
                                        <Button className="btn-primary" onClick={() => this.props.history.goBack()}>
                                            Cancelar
                                        </Button>
                                    </Col>
                                    <Col md="3">
                                        <Button className="btn-primary" type="submit" disabled={this.state.loading} hidden={this.state.permissao}>
                                            {this.state.loading ? (
                                                <ClipLoader css={override} sizeUnit={'px'} size={20} color={'#FFFFFF'} loading={this.state.loading} />
                                            ) : null}
                                            Salvar
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>

                    {/* Modal visualizar anexo */}
                    <Modal className="modal-dialog-centered" isOpen={this.state.modalVisualizarAnexo} toggle={() => this.toggleModal('modalVisualizarAnexo')}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalVisualizarAnexo">
                                {this.state.formAnexoModal.nomeAnexo}
                            </h5>
                            <button
                                aria-label="Close"
                                className="close"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => this.toggleModal('modalVisualizarAnexo')}
                            >
                                <span aria-hidden={true}>×</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            <RcIf if={this.state.formAnexoModal.nomeAnexo != null}>
                                <RcIf if={this.state.formAnexoModal.tipoAnexo && this.state.formAnexoModal.tipoAnexo.indexOf('image') >= 0}>
                                    <img alt="" className="img-cadastro-medico" src={`${this.retornaBase64(this.state.formAnexoModal)}`} />
                                    <Button
                                        onClick={() => this.handleEditarImagem(this.retornaBase64(this.state.formAnexoModal))}
                                        className="m-t-10 m-b-10"
                                        hidden={this.state.itemAnexo ? this.checkHiddenDocumentsPermission(this.state.itemAnexo.campoAnexo.id) : true}
                                    >
                                        Editar imagem
                                    </Button>
                                </RcIf>
                                <a href="" onClick={e => this.baixarAnexo(e, this.state.formAnexoModal)}>
                                    {this.state.formAnexoModal.nomeAnexo}
                                </a>

                                <Row>
                                    <FormGroup>
                                        <h3>Observações</h3>
                                        <textarea
                                            placeholder="Observação de Validação"
                                            onChange={this.handleObservacaoChange}
                                            value={
                                                !!this.state.itemAnexo && !!this.state.itemAnexo.observacaoValidacao
                                                    ? this.state.itemAnexo.observacaoValidacao
                                                    : ''
                                            }
                                        />
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <label className="p-l-5" style={{ color: '#d93025' }} hidden={!this.state.errorItemAnexoRadiobox}>
                                        Selecione um status para o arquivo
                                    </label>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <label onChange={this.handleValidadoChange}>
                                            <input
                                                type="radio"
                                                value={true}
                                                onChange={() => {}}
                                                // checked={!!this.state.formData.listTodosAnexosMedicoVo[this.state.formAnexoModal.indexListaTodosAnexos].validado}/>
                                                checked={!!this.state.itemAnexo && this.state.itemAnexo.validado}
                                            />
                                            Válido
                                            <input
                                                type="radio"
                                                value={false}
                                                style={{ marginLeft: 10 }}
                                                onChange={() => {}}
                                                checked={!!this.state.itemAnexo && this.state.itemAnexo.validado != null && !this.state.itemAnexo.validado}
                                            />
                                            Inválido
                                        </label>
                                    </FormGroup>
                                </Row>
                            </RcIf>
                        </div>

                        <div className="modal-footer">
                            <Button data-dismiss="modal" type="button" onClick={() => this.toggleModal('modalVisualizarAnexo')}>
                                Cancelar
                            </Button>
                            <Button
                                color="danger"
                                data-dismiss="modal"
                                type="button"
                                onClick={e => this.excluirAnexo(e)}
                                hidden={this.state.itemAnexo ? this.checkHiddenDocumentsPermission(this.state.itemAnexo.campoAnexo.id) : true}
                            >
                                Remover
                            </Button>
                            <Button
                                color="primary"
                                data-dismiss="modal"
                                type="button"
                                onClick={e => this.validarAnexo(e)}
                                hidden={this.state.itemAnexo ? this.checkHiddenDocumentsPermission(this.state.itemAnexo.campoAnexo.id) : true}
                            >
                                Gravar
                            </Button>
                        </div>
                    </Modal>

                    {/* Modal anexar arquivos frente e verso. */}
                    <Modal className="modal-dialog-centered" isOpen={this.state.modalAnexarArquivos} toggle={() => this.toggleModal('modalAnexarArquivos')}>
                        <div className="modal-header">
                            <h3 className="modal-title" id="modalAnexarArquivos">
                                Anexar novos arquivos
                            </h3>
                            <button
                                aria-label="Close"
                                className="close"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => this.toggleModal('modalAnexarArquivos')}
                            >
                                <span aria-hidden={true}>×</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            <Container>
                                <Row>
                                    <h3>Anexar {this.canAttachMultipleFiles() ? '' : 'Frente'}</h3>
                                    <FileBase64 multiple={this.canAttachMultipleFiles()} onDone={file => this.CreateObjectAndIncludeInList(file)} />
                                </Row>
                                <Row hidden={this.canAttachMultipleFiles()}>
                                    <h3>Anexar Verso</h3>
                                    <FileBase64 multiple={false} onDone={file => this.CreateObjectAndIncludeInList(file, true)} />
                                </Row>
                                {/*           <Row>
                                    <FormGroup>
                                        <h3>Observações</h3>
                                        <textarea
                                            placeholder='Observaçao de Validação'
                                            onChange={this.handleObservacaoChange}
                                            value={this.state.formData.observacoesValidacao}
                                        />
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <label onChange={this.handleValidadoChange}>
                                            <input type="radio" value={true}
                                                   checked={this.state.formData.validado}/>
                                            Válido
                                            <input type="radio" value={false} className="m-l-15px"
                                                   checked={!this.state.formData.validado}/>
                                            Inválido
                                        </label>
                                    </FormGroup>
                                </Row>*/}
                            </Container>
                        </div>
                        <div className="modal-footer">
                            <Container>
                                <Row>
                                    <Col md={12}>
                                        <Button
                                            className="btn-primary"
                                            data-dismiss="modal"
                                            type="button"
                                            onClick={() => this.toggleModal('modalAnexarArquivos')}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            className="btn-primary"
                                            type="button"
                                            onClick={() => this.putFilesOnListAndCloseModal(this.state.arquivoUpload)}
                                        >
                                            Confirmar
                                        </Button>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Modal>

                    {/* Modal pessoa fisica */}
                    <Modal
                        className="modal-dialog-centered"
                        isOpen={this.state.modalPessoaFisica}
                        toggle={() => this.toggleModalPessoaFisica('modalPessoaFisica')}
                    >
                        <div className="modal-header">
                            <h1 className="card-title" id="modalPessoaFisica">
                                Dados Bancários
                            </h1>
                            <button
                                aria-label="Close"
                                className="close"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => this.toggleModalPessoaFisica('modalPessoaFisica')}
                            >
                                <span aria-hidden={true}>×</span>
                            </button>
                        </div>

                        <Col
                            md="12"
                            hidden={
                                this.state.formData.tipoRecebimento === 'SO' ||
                                this.state.formData.tipoRecebimento === 'PF' ||
                                this.state.formData.tipoRecebimento === ''
                            }
                        >
                            <FormGroup>
                                <Col md="12">
                                    <Label>
                                        <h2 className="card-title text-center">É conta da empresa?</h2>
                                    </Label>
                                    <FormGroup>
                                        <label onChange={this.handleContaEmpresaChange}>
                                            <Col md="12">
                                                <input type="radio" value={true} checked={this.getTemporaryPaymentSelected()?.isCompanyAccount === true} />
                                                Sim
                                            </Col>
                                            <Col md="12">
                                                <input
                                                    type="radio"
                                                    value={false}
                                                    className="m-l-15px"
                                                    checked={this.getTemporaryPaymentSelected()?.isCompanyAccount === false}
                                                />
                                                Não
                                            </Col>
                                        </label>
                                    </FormGroup>
                                </Col>
                            </FormGroup>
                        </Col>

                        {/*bank*/}
                        <Col md="12">
                            <Label>
                                <h2 className="card-title text-center">Banco</h2>
                            </Label>
                            {!this.state.formVaziosModalPessoaFisica?.bank ? (
                                <FormGroup>
                                    <Input
                                        id="bank"
                                        placeholder="Banco"
                                        value={this.getTemporaryPaymentSelected()?.bank}
                                        onChange={this.handleBancoChange}
                                        autoComplete="off"
                                        maxLength="50"
                                    />
                                </FormGroup>
                            ) : (
                                <FormGroup>
                                    <Input
                                        className="campo-invalido"
                                        id="bank"
                                        placeholder="Banco"
                                        value={this.getTemporaryPaymentSelected()?.bank}
                                        onChange={this.handleBancoChange}
                                        autoComplete="off"
                                        maxLength="50"
                                    />
                                </FormGroup>
                            )}
                        </Col>

                        {/*agency*/}
                        <Col md="12">
                            <Label>
                                <h2 className="card-title text-center">Agência</h2>
                            </Label>
                            {!this.state.formVaziosModalPessoaFisica?.agency ? (
                                <FormGroup>
                                    <Input
                                        type="number"
                                        id="agency"
                                        placeholder="Agência"
                                        value={this.getTemporaryPaymentSelected()?.agency}
                                        onChange={this.handleAgenciaChange}
                                        autoComplete="off"
                                        maxLength="50"
                                    />
                                </FormGroup>
                            ) : (
                                <FormGroup className="campo-invalido">
                                    <Input
                                        type="number"
                                        id="agency"
                                        placeholder="Agencia"
                                        value={this.getTemporaryPaymentSelected()?.agency}
                                        onChange={this.handleAgenciaChange}
                                        autoComplete="off"
                                        maxLength="50"
                                    />
                                </FormGroup>
                            )}
                        </Col>

                        {/*transaction*/}
                        <Col md="12" hidden={this.state.formData.tipoRecebimento === 'SO'}>
                            <Label>
                                <h2 className="card-title text-center">Operação</h2>
                            </Label>
                            {!this.state.formVaziosModalPessoaFisica?.transaction ? (
                                <FormGroup>
                                    <Input
                                        id="transaction"
                                        placeholder="Operacão"
                                        value={this.getTemporaryPaymentSelected()?.transaction}
                                        onChange={this.handleOperacaoChange}
                                        autoComplete="off"
                                        maxLength="50"
                                    />
                                </FormGroup>
                            ) : (
                                <FormGroup className="campo-invalido">
                                    <Input
                                        id="transaction"
                                        placeholder="Operacão"
                                        value={this.getTemporaryPaymentSelected()?.transaction}
                                        onChange={this.handleOperacaoChange}
                                        autoComplete="off"
                                        maxLength="50"
                                    />
                                </FormGroup>
                            )}
                        </Col>

                        {/*bankAccount*/}
                        <Col md="12">
                            <Label>
                                <h2 className="card-title text-center">Conta</h2>
                            </Label>
                            {!this.state.formVaziosModalPessoaFisica?.bankAccount ? (
                                <FormGroup>
                                    <Input
                                        type="number"
                                        id="bankAccount"
                                        placeholder="Conta"
                                        value={this.getTemporaryPaymentSelected()?.bankAccount}
                                        onChange={this.handleContaChange}
                                        autoComplete="off"
                                        maxLength="50"
                                    />
                                </FormGroup>
                            ) : (
                                <FormGroup className="campo-invalido">
                                    <Input
                                        id="bankAccount"
                                        type="number"
                                        placeholder="Conta"
                                        value={this.getTemporaryPaymentSelected()?.bankAccount}
                                        onChange={this.handleContaChange}
                                        autoComplete="off"
                                        maxLength="50"
                                    />
                                </FormGroup>
                            )}
                        </Col>

                        {/*<Row>*/}
                        {/*    <Col md="12">*/}
                        {/*        <FormGroup>*/}
                        {/*            <Col md="12" onChange={this.handleCpfOuCnpjChange}>*/}
                        {/*                <Col md="6">*/}
                        {/*                    <input type="radio" value={"CPF"}*/}
                        {/*                           checked={this.state.formData.cpfOuCnpj === "CPF"}/>*/}
                        {/*                    CPF*/}
                        {/*                </Col>*/}
                        {/*                <Col md="6">*/}
                        {/*                    <input type="radio" value={"CNPJ"} className="m-l-15px"*/}
                        {/*                           checked={this.state.formData.cpfOuCnpj === "CNPJ"}/>*/}
                        {/*                    CNPJ*/}
                        {/*                </Col>*/}

                        {/*            </Col>*/}
                        {/*        </FormGroup>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}

                        {/*cpf*/}
                        <Col md="12" hidden={this.state.formData.tipoRecebimento === 'PJ' && !!this.getTemporaryPaymentSelected()?.isCompanyAccount}>
                            <Label>
                                <h2 className="card-title text-center">CPF</h2>
                            </Label>
                            {!this.state.formVaziosModalPessoaFisica?.cpf ? (
                                <FormGroup>
                                    <InputMask
                                        mask="999.999.999-99"
                                        id="cpf"
                                        placeholder="CPF"
                                        value={this.getTemporaryPaymentSelected()?.cpf}
                                        onChange={this.handleCpfChange}
                                        autoComplete="off"
                                        maxLength="50"
                                        className="cnpj form-control"
                                    />
                                </FormGroup>
                            ) : (
                                <FormGroup className="campo-invalido">
                                    <InputMask
                                        mask="999.999.999-99"
                                        id="cpf"
                                        placeholder="CPF"
                                        value={this.getTemporaryPaymentSelected()?.cpf}
                                        onChange={this.handleCpfChange}
                                        autoComplete="off"
                                        maxLength="50"
                                        className="cnpj form-control"
                                    />
                                </FormGroup>
                            )}
                        </Col>

                        {/*cnpj*/}
                        <Col
                            md="12"
                            hidden={
                                this.state.formData.tipoRecebimento === 'SO' ||
                                this.state.formData.tipoRecebimento === 'PF' ||
                                (this.state.formData.tipoRecebimento === 'PJ' && !this.getTemporaryPaymentSelected()?.isCompanyAccount)
                            }
                        >
                            <Label>
                                <h2 className="card-title text-center">CNPJ</h2>
                            </Label>
                            {!this.state.formVaziosModalPessoaFisica?.cnpj ? (
                                <FormGroup>
                                    <InputMask
                                        id="cnpj"
                                        className="cnpj form-control"
                                        mask="99.999.999/9999-99"
                                        placeholder="CNPJ"
                                        value={this.getTemporaryPaymentSelected()?.cnpj}
                                        onChange={this.handleCnpjChange}
                                    />
                                </FormGroup>
                            ) : (
                                <FormGroup className="campo-invalido">
                                    <InputMask
                                        id="cnpj"
                                        className="cnpj form-control"
                                        mask="99.999.999/9999-99"
                                        placeholder="CNPJ"
                                        value={this.getTemporaryPaymentSelected()?.cnpj}
                                        onChange={this.handleCnpjChange}
                                    />
                                </FormGroup>
                            )}
                        </Col>

                        {/*accountOwnerName*/}
                        <Col md="12">
                            <Label>
                                <h2 className="card-title text-center">Nome do titular</h2>
                            </Label>
                            {!this.state.formVaziosModalPessoaFisica?.accountOwnerName ? (
                                <FormGroup>
                                    <Input
                                        id="accountOwnerName"
                                        placeholder="Nome Do Titular"
                                        value={this.getTemporaryPaymentSelected()?.accountOwnerName}
                                        onChange={this.handleNomeTitularChange}
                                        autoComplete="off"
                                        maxLength="50"
                                    />
                                </FormGroup>
                            ) : (
                                <FormGroup className="campo-invalido">
                                    <Input
                                        id="accountOwnerName"
                                        placeholder="Nome Do Titular"
                                        value={this.getTemporaryPaymentSelected()?.accountOwnerName}
                                        onChange={this.handleNomeTitularChange}
                                        autoComplete="off"
                                        maxLength="50"
                                    />
                                </FormGroup>
                            )}
                        </Col>

                        {/*pisNumber*/}
                        <Col md="12">
                            <Label>
                                <h2 className="card-title text-center">Número do PIS/NIT</h2>
                            </Label>
                            {!this.state.formVaziosModalPessoaFisica?.pisNumber ? (
                                <FormGroup>
                                    <Input
                                        type="number"
                                        id="pisNumber"
                                        placeholder="Número Pis"
                                        value={this.getTemporaryPaymentSelected()?.pisNumber}
                                        onChange={this.handleNumeroPisChange}
                                        autoComplete="off"
                                        maxLength="50"
                                    />
                                </FormGroup>
                            ) : (
                                <FormGroup className="campo-invalido">
                                    <Input
                                        type="number"
                                        id="pisNumber"
                                        placeholder="Número Pis"
                                        value={this.state.formData.pisNumber}
                                        onChange={this.handleNumeroPisChange}
                                        autoComplete="off"
                                        maxLength="50"
                                    />
                                </FormGroup>
                            )}
                        </Col>

                        {/*pix*/}
                        <Col md="12">
                            <Label>
                                <h2 className="card-title text-center">Chave PIX</h2>
                            </Label>
                            {!this.state.formVaziosModalPessoaFisica?.pix?.pixKey ? (
                                <>
                                    <FormGroup>
                                        <Input
                                            id="selectPixKeyType"
                                            name="selectPixKeyType"
                                            type="select"
                                            value={this.getTemporaryPaymentSelected()?.pix?.pixKeyType}
                                            onChange={this.handlePixKeyTypeChange}
                                        >
                                            <option value="">Tipo Chave Pix</option>
                                            <option value="CPF">CPF</option>
                                            <option value="CNPJ">CNPJ</option>
                                            <option value="CELL_PHONE">Celular</option>
                                            <option value="EMAIL">Email</option>
                                            <option value="RANDOM_KEY">Chave Aleatória</option>
                                        </Input>
                                    </FormGroup>

                                    <FormGroup>
                                        {this.getTemporaryPaymentSelected()?.pix?.pixKeyType === 'CPF' ? (
                                            <InputMask
                                                id="pixKey"
                                                className="cnpj form-control"
                                                mask="999.999.999-99"
                                                placeholder="CPF"
                                                value={this.getTemporaryPaymentSelected()?.pix?.pixKey}
                                                onChange={this.handlePixKeyChange}
                                            />
                                        ) : this.getTemporaryPaymentSelected()?.pix?.pixKeyType === 'CNPJ' ? (
                                            <InputMask
                                                id="pixKey"
                                                className="cnpj form-control"
                                                mask="99.999.999/9999-99"
                                                placeholder="CNPJ"
                                                value={this.getTemporaryPaymentSelected()?.pix?.pixKey}
                                                onChange={this.handlePixKeyChange}
                                            />
                                        ) : this.getTemporaryPaymentSelected()?.pix?.pixKeyType === 'CELL_PHONE' ? (
                                            <InputMask
                                                id="pixKey"
                                                className="cnpj form-control"
                                                mask="(99)99999-9999"
                                                placeholder="Celular"
                                                value={this.getTemporaryPaymentSelected()?.pix?.pixKey}
                                                onChange={this.handlePixKeyChange}
                                            />
                                        ) : this.getTemporaryPaymentSelected()?.pix?.pixKeyType === 'EMAIL' ? (
                                            <Input
                                                type="text"
                                                id="pixKey"
                                                placeholder="Email"
                                                value={this.getTemporaryPaymentSelected()?.pix?.pixKey}
                                                onChange={this.handlePixKeyChange}
                                                autoComplete="off"
                                                // maxLength="50"
                                            />
                                        ) : (
                                            this.getTemporaryPaymentSelected()?.pix?.pixKeyType === 'RANDOM_KEY' && (
                                                <Input
                                                    type="text"
                                                    id="pixKey"
                                                    placeholder="Chave Aleatória"
                                                    value={this.getTemporaryPaymentSelected()?.pix?.pixKey}
                                                    onChange={this.handlePixKeyChange}
                                                    autoComplete="off"
                                                    // maxLength="50"
                                                />
                                            )
                                        )}
                                    </FormGroup>
                                </>
                            ) : (
                                <>
                                    <FormGroup>
                                        <Input
                                            id="selectPixKeyType"
                                            name="selectPixKeyType"
                                            type="select"
                                            value={this.getTemporaryPaymentSelected()?.pix?.pixKeyType}
                                            onChange={this.handlePixKeyTypeChange}
                                        >
                                            <option value="">Tipo Chave Pix</option>
                                            <option value="CPF">CPF</option>
                                            <option value="CNPJ">CNPJ</option>
                                            <option value="CELL_PHONE">Celular</option>
                                            <option value="EMAIL">Email</option>
                                            <option value="RANDOM_KEY">Chave Aleatória</option>
                                        </Input>
                                    </FormGroup>

                                    <FormGroup>
                                        {this.getTemporaryPaymentSelected()?.pix?.pixKeyType === 'CPF' ? (
                                            <InputMask
                                                id="pixKey"
                                                className="cnpj form-control"
                                                mask="999.999.999-99"
                                                placeholder="CPF"
                                                value={this.getTemporaryPaymentSelected()?.pix?.pixKey}
                                                onChange={this.handlePixKeyChange}
                                            />
                                        ) : this.getTemporaryPaymentSelected()?.pix?.pixKeyType === 'CNPJ' ? (
                                            <InputMask
                                                id="pixKey"
                                                className="cnpj form-control"
                                                mask="99.999.999/9999-99"
                                                placeholder="CNPJ"
                                                value={this.getTemporaryPaymentSelected()?.pix?.pixKey}
                                                onChange={this.handlePixKeyChange}
                                            />
                                        ) : this.getTemporaryPaymentSelected()?.pix?.pixKeyType === 'CELL_PHONE' ? (
                                            <InputMask
                                                id="pixKey"
                                                className="cnpj form-control"
                                                mask="(99)99999-9999"
                                                placeholder="Celular"
                                                value={this.getTemporaryPaymentSelected()?.pix?.pixKey}
                                                onChange={this.handlePixKeyChange}
                                            />
                                        ) : this.getTemporaryPaymentSelected()?.pix?.pixKeyType === 'EMAIL' ? (
                                            <Input
                                                type="text"
                                                id="pixKey"
                                                placeholder="Email"
                                                value={this.getTemporaryPaymentSelected()?.pix?.pixKey}
                                                onChange={this.handlePixKeyChange}
                                                autoComplete="off"
                                                // maxLength="50"
                                            />
                                        ) : (
                                            this.getTemporaryPaymentSelected()?.pix?.pixKeyType === 'RANDOM_KEY' && (
                                                <Input
                                                    type="text"
                                                    id="pixKey"
                                                    placeholder="Chave Aleatória"
                                                    value={this.getTemporaryPaymentSelected()?.pix?.pixKey}
                                                    onChange={this.handlePixKeyChange}
                                                    autoComplete="off"
                                                    // maxLength="50"
                                                />
                                            )
                                        )}
                                    </FormGroup>
                                </>
                            )}
                        </Col>

                        <div className="modal-footer">
                            <Button data-dismiss="modal" type="button" onClick={() => this.toggleModalPessoaFisica('modalPessoaFisica')}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="button" onClick={() => this.submitModalPessoaFisica(this.state.formData)}>
                                Gravar
                            </Button>
                        </div>
                    </Modal>
                </div>
            </>
        );
    }

    retornaTipoArquivo = nomeArquivo => {
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

    putFilesOnListAndCloseModal(items, isVerso) {
        this.inputFilesInTodosAnexos(items, isVerso);
        this.setState({ modalAnexarArquivos: false, arquivoUpload: [] });
        console.log(this.state);
    }

    inputFilesInTodosAnexos(items) {
        let formData = { ...this.state.formData };
        let index = this.state.indexCampoAnexo;
        items.forEach(function(anexo) {
            if (anexo.campoAnexo.id === 7 || anexo.campoAnexo.id === 10) {
                formData.listTodosAnexosMedicoVo
                    .filter(item => item.campoAnexo.id === anexo.campoAnexo.id)
                    .map(item => {
                        if (!item.listMedicoAnexo) {
                            item.listMedicoAnexo = [];
                        }
                        item.listMedicoAnexo.push(anexo);
                    });
            } else {
                formData.listTodosAnexosMedicoVo[index].listMedicoAnexo.push(anexo);
            }
        });

        this.setState({ formData: formData });
    }

    //amazing
    canAttachMultipleFiles() {
        return (
            this.state.campoAnexoModalAnexarArquivos.descricao === 'Contrato social consolidado' ||
            this.state.campoAnexoModalAnexarArquivos.descricao === 'Documentos adicionais'
        );
    }
}

export default MedicoCadastro;
