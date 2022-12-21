import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import moment from 'moment/moment';
import RcIf, { RcElse } from 'rc-if';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import CurrencyInput from 'react-currency-input';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, FormGroup, Input, Label, Modal, Row, Table } from "reactstrap";
import Container from "reactstrap/es/Container";
import swal from "sweetalert";
import EscalaService from "../../services/escala.service";
import GestaoEscalaService from "../../services/gestao.escala.service";
import UsuarioAppService from "../../services/usuario.app.service";
import { BTN_DIULGAR_PLANTOES, BTN_SALVAR, BTN_VOLTAR, BTN_COMPARTILHAR, BTN_PUBLICAR_PLANTOES, BTN_NOTIFICAR_PLANTOES, BTN_COMPARTILHAR_ESCALA } from "../../util/Constantes";
import { capitalizaString } from "../../util/Util";
import UsuarioFactory from "../Usuario/Usuario.factory";
import "./GestaoEscala.tabela.scss";

class GestaoEscalaTabela extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sendRequest: false,
            loading: true,
            loadingRefresh: false,
            escala: null,
            SEMANAS: [],
            listaMedico: [],
            formCadastroMedicoModal: {
                status: '',
                bloqueado: false,
                medico: null,
                id: '',
                listaCandidatosPlantao: [],
                valor: '',
                blockedReason: '',
            },
            isDraft: false,
            filtroDia: null,
            inicioEscala: moment(),
            fimEscala: moment(),
            objDia: {
                diaSemana: '',
                data: ''
            },
            turnos: [],
            key: 'mes',
            permissaoDivulgar: false,
            permissaoPublicar: false,
            permissaoPlantaoAceitarRecusar: false,
            listaCandidatosPlantao: [],
            formCanditatoPlantao: {
                medico: {}
            },
            checked: false
        };
        //
        // this.toggleModal = this.toggleModal.bind(this);
    }

    componentDidMount = async () => {
        const usuarioLogado = UsuarioFactory.getUsuarioLogado();
        if (!usuarioLogado) {
            this.props.history.push('/auth/login');
        } else {
            if (!!usuarioLogado.listaUsuarioTipoPermissao) {
                for (let i = 0; i < usuarioLogado.listaUsuarioTipoPermissao.length; i++) {
                    if (usuarioLogado.listaUsuarioTipoPermissao[i].tipoPermissao.id === 5) {
                        this.setState({ permissaoDivulgar: true });
                    }
                    if (usuarioLogado.listaUsuarioTipoPermissao[i].tipoPermissao.id === 4) {
                        this.setState({ permissaoPublicar: true });
                    }
                    if (usuarioLogado.listaUsuarioTipoPermissao[i].tipoPermissao.id === 6) {
                        this.setState({ permissaoPlantaoAceitarRecusar: true });
                    }
                }
            }
        }

        const {
            match: { params }
        } = this.props;

        let filtro = {
            escalaVo: null,
            tipo: '',
            data: null
        };

        if (!!params && !!params.id) {
            const escala = {
                id: params.id,
                nomeEscala: window.atob(params.nomeEscala)
            };
            this.setState({ escala });
            filtro.escalaVo = escala;
            filtro.tipo = 'MES';
            await GestaoEscalaService.listaLayoutEscala(filtro).subscribe(
                (data) => {
                    if (!data.erro) {
                        this.setRangeEscala(escala);
                        this.setState({
                            SEMANAS: data.objeto,
                            loading: false
                        });
                    } else {
                        const msg = data.mensagem ? data.mensagem : 'Erro ao listar registros';
                        swal(msg, {
                            icon: 'error'
                        });
                    }
                },
                (error) => console.error(error)
            );
        }
    };

    setRangeEscala = (escala) => {
        EscalaService.getById(escala).subscribe(
            (data) => {
                if (!!data) {
                    let diaSemana = moment(data.objeto.periodoInicio).format('dddd');
                    let dataExt = moment(data.objeto.periodoInicio).format('DD/MM');
                    this.setState({
                        inicioEscala: data.objeto.periodoInicio,
                        fimEscala: data.objeto.periodoFim,
                        filtroDia: data.objeto.periodoInicio,
                        objDia: {
                            diaSemana: diaSemana,
                            data: dataExt
                        },
                        isDraft: data.objeto.isDraft
                    });
                    this.passaDia(this.state.filtroDia, 'proximo');
                    this.preencheDia(data.objeto.periodoInicio);
                }
            },
            (error) => console.error(error)
        );
    };

    gerarExcel(tipo, dia, pdf, newPdf) {
      const filtro = {};
      filtro.escalaVo = this.state.escala;
      filtro.tipo = tipo;
      filtro.data = dia;
      filtro.pdf = pdf;
      filtro.newPdf = newPdf;

        GestaoEscalaService.gerarExcel(filtro).subscribe(
            (data) => {
                if (!!data) {
                    if (!!data.objeto) {
                        const sampleArr = this.base64ToArrayBuffer(data.objeto.arquivo);
                        this.saveByteArray(data.objeto.nmAnexo, sampleArr, data.objeto.pdf);
                    }
                }
            },
            (error) => console.error(error)
        );
    }

    saveByteArray(reportName, byte, pdf) {
        let blob = 0;
        if (pdf) {
            blob = new Blob([byte], { type: 'application/pdf;' });
        } else {
            blob = new Blob([byte], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
            });
        }
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        const fileName = reportName;
        link.download = fileName;
        link.click();
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

    handleCadastroMedicoChange = (e) => {
        let formCadastroMedicoModal = { ...this.state.formCadastroMedicoModal };
        formCadastroMedicoModal.status = e.target.value;
        this.setState({ formCadastroMedicoModal });
    };
    handleBlockedReasonChange = (e) => {
      let formCadastroMedicoModal = { ...this.state.formCadastroMedicoModal };
      formCadastroMedicoModal.blockedReason = e.target.value;
      this.setState({ formCadastroMedicoModal });
  };
    handleCadastroMedicoValor = (event, maskedValue, floatValue) => {
        let formCadastroMedicoModal = { ...this.state.formCadastroMedicoModal };
        formCadastroMedicoModal.valor = floatValue;
        this.setState({ formCadastroMedicoModal });
    };

    handleCadastroMedicoBloqueiaChange = () => {
        let formCadastroMedicoModal = { ...this.state.formCadastroMedicoModal };
        formCadastroMedicoModal.status = '';
        formCadastroMedicoModal.medico = null;
        formCadastroMedicoModal.bloqueado = !formCadastroMedicoModal.bloqueado;
        if(!formCadastroMedicoModal.bloqueado === false){
          formCadastroMedicoModal.justify = '';
        }
        this.setState({ formCadastroMedicoModal });
    };

    handleSubmitModalCadastroMedicoModal = async (plantao) => {
        this.setState({ loading: true });
        console.log(this.state.formCadastroMedicoModal.valor);
        let vo = {
            id: plantao.id,
            bloqueado: this.state.formCadastroMedicoModal.bloqueado,
            medico: !!this.state.formCadastroMedicoModal.medico && this.state.formCadastroMedicoModal.medico.id !== 'default' ? this.state.formCadastroMedicoModal.medico : null,
            status: this.state.formCadastroMedicoModal.status !== '' ? this.state.formCadastroMedicoModal.status : null,
            valor: this.state.formCadastroMedicoModal.valor != null ? this.state.formCadastroMedicoModal.valor : null
        };
        if (vo.medico !== null && (vo.status === null || vo.status === 'default')) {
            toast.warn('Por favor, selecione um status');
        } else {
            this.setState(
                {
                    sendRequest: true
                },
                () => {
                    GestaoEscalaService.atualizaPlantaoGestaoEscala(vo).subscribe(
                        (data) => {
                            if (!!data) {
                                if (data.erro) {
                                    toast.warn(data.mensagem);
                                } else {
                                    toast.success(data.mensagem);
                                    // this.toggleModal("cadastrarMedicoModal");
                                    let formCadastroMedicoModal = {
                                        ...this.state.formCadastroMedicoModal
                                    };
                                    // formCadastroMedicoModal.bloqueado = '';
                                    if (formCadastroMedicoModal.bloqueado === false) {
                                        plantao.medico = null;
                                    }
                                    formCadastroMedicoModal.id = '';
                                    formCadastroMedicoModal.medico = null;
                                    formCadastroMedicoModal.status = '';
                                    formCadastroMedicoModal.valor = '';
                                    if (!!data.objeto) {
                                        plantao.medico = !!data.objeto.medico ? data.objeto.medico : null;
                                        plantao.status = !!data.objeto.status ? data.objeto.status : '';
                                        plantao.bloqueado = data.objeto.bloqueado;
                                        plantao.valor = data.objeto.valor ? data.objeto.valor : null;
                                    } else {
                                        plantao.medico = null;
                                        plantao.status = '';
                                        plantao.bloqueado = formCadastroMedicoModal.bloqueado;
                                    }
                                    this.setState({ formCadastroMedicoModal });
                                    this.setState({
                                        plantao: plantao
                                    });
                                    // this.props.history.push('/admin/lista-gestao-escala');

                                    this.setState(
                                        {
                                            cadastrarMedicoModal: !this.state.cadastrarMedicoModal,
                                            plantao: plantao,
                                            sendRequest: false
                                        },
                                        () => this.refreshTabela()
                                    );
                                }
                            }
                        },
                        (error) => {
                            console.error(error);
                            this.setState({ sendRequest: false });
                        }
                    );
                }
            );
        }
    };

    carregarCombos = async (plantao) => {
        await UsuarioAppService.listarComboMedicoNaoBloqueados(plantao).subscribe(
            (data) => {
                if (!!data) {
                    this.setState({ listaMedico: data });
                }
            },
            (error) => console.error(error)
        );
    };

    handleMedicoChange = (e) => {
        let formCadastroMedicoModal = { ...this.state.formCadastroMedicoModal };
        formCadastroMedicoModal.medico = { id: e.target.value };
        this.setState({ formCadastroMedicoModal });
    };
    
    handleRefusedDoctor = (id) => {
      GestaoEscalaService.recusaMedico(id).subscribe(
        (data) => {
          if (!!data) {
            const icon = data.erro ? "error" : "success";
            swal(data.mensagem, {
              icon: icon,
            });
            this.toggleModal("cadastrarMedicoModal");
          }
        },
        (error) => {
          swal(error.mensagem, {
            icon: "error",
          });
        }
      );
    };

    toggleModal = (state, plantao) => {
        if (plantao !== undefined) {
            this.carregarCombos(plantao);
        }
        this.listarCandidatosPlantao(plantao);
        this.setState({
            [state]: !this.state[state],
            plantao: plantao
        });
        let formCadastroMedicoModal = { ...this.state.formCadastroMedicoModal };
        formCadastroMedicoModal.id = '';
        formCadastroMedicoModal.medico = !!plantao && !!plantao.medico ? plantao.medico : null;
        formCadastroMedicoModal.status = !!plantao && !!plantao.status ? plantao.status : '';
        formCadastroMedicoModal.bloqueado = !!plantao && !!plantao.bloqueado ? plantao.bloqueado : false;
        formCadastroMedicoModal.valor = !!plantao && !!plantao.valor ? plantao.valor : '';
        formCadastroMedicoModal.listaCandidatosPlantao = this.state.listaCandidatosPlantao;
        this.setState({ formCadastroMedicoModal: formCadastroMedicoModal });
        this.state.listaCandidatosPlantao = [];
    };

    passaDia(data, dir) {
        this.setState({ loading: true });
        let filtro;
        switch (dir) {
            case 'anterior':
                if (data > moment(this.state.inicioEscala)) {
                    filtro = moment(data).add(-1, 'days');
                } else {
                    filtro = moment(data);
                }
                break;
            case 'proximo':
                if (data < moment(this.state.fimEscala)) {
                    filtro = moment(data).add(1, 'days');
                } else {
                    filtro = moment(data);
                }
                break;
            default:
                break;
        }
        let diaSemana = moment(filtro).format('dddd');
        let dataExt = moment(filtro).format('DD/MM');
        this.setState({
            filtroDia: filtro,
            objDia: {
                diaSemana: diaSemana,
                data: dataExt
            }
        });
        this.preencheDia(filtro);
    }

    preencheDia = (filtro) => {
        let filtroGestao = {};
        filtroGestao.escalaVo = this.state.escala;
        filtroGestao.tipo = 'DIA';
        filtroGestao.data = filtro;
        GestaoEscalaService.listaLayoutEscala(filtroGestao).subscribe(
            (data) => {
                if (!!data) {
                    this.setState({
                        turnos: data.objeto.turnos,
                        loading: false
                    });
                }
            },
            (error) => console.error(error)
        );
    };

    retornaPlantoesDia = (setor) => {
        let listaRetorno = [];

        if (!!setor.plantoes) {
            switch (this.state.objDia.diaSemana) {
                case 'Segunda-feira':
                    if (!!setor.plantoes.segunda) {
                        listaRetorno = setor.plantoes.segunda;
                    } else {
                        listaRetorno = null;
                    }
                    break;
                case 'Terça-feira':
                    if (!!setor.plantoes.terca) {
                        listaRetorno = setor.plantoes.terca;
                    } else {
                        listaRetorno = null;
                    }
                    break;
                case 'Quarta-feira':
                    if (!!setor.plantoes.quarta) {
                        listaRetorno = setor.plantoes.quarta;
                    } else {
                        listaRetorno = null;
                    }
                    break;
                case 'Quinta-feira':
                    if (!!setor.plantoes.quinta) {
                        listaRetorno = setor.plantoes.quinta;
                    } else {
                        listaRetorno = null;
                    }
                    break;
                case 'Sexta-feira':
                    if (!!setor.plantoes.sexta) {
                        listaRetorno = setor.plantoes.sexta;
                    } else {
                        listaRetorno = null;
                    }
                    break;
                case 'Sábado':
                    if (!!setor.plantoes.sabado) {
                        listaRetorno = setor.plantoes.sabado;
                    } else {
                        listaRetorno = null;
                    }
                    break;
                case 'Domingo':
                    if (!!setor.plantoes.domingo) {
                        listaRetorno = setor.plantoes.domingo;
                    } else {
                        listaRetorno = null;
                    }
                    break;
                default:
                    break;
            }
        } else {
            listaRetorno = null;
        }

        return listaRetorno;
    };

    retornaCorStatus = (plantao) => {
        if (!!plantao.emTroca) {
            return <div className='quadrado doacao' />;
        }
        if (!plantao.medico && !!plantao.temCandidatos) {
            return <div className='quadrado candidato' />;
        }

        if (plantao.status !== '') {
            if (plantao.status === 'F') {
                return <div className='quadrado fixo' />;
            }
            if (plantao.status === 'C') {
                return <div className='quadrado confirmado' />;
            }
            if (plantao.status === 'AC') {
                return <div className='quadrado a-confirmar' />;
            }
            if (plantao.status === 'D') {
                return <div className='quadrado doacao' />;
            }
        }
    };

    getPlantaoStatusLabel = (plantao) => {
        if (!!plantao.emTroca) {
            return 'Troca/Doação';
        }

        if (plantao.status !== '') {
            if (plantao.status === 'F') {
                return 'Fixo';
            }
            if (plantao.status === 'C') {
                return 'Confirmado';
            }
            if (plantao.status === 'AC') {
                return 'A Confirmar';
            }
            if (plantao.status === 'D') {
                return 'Troca/Doação';
            }
        }

        return '';
    };

    retornaNome = (plantao) => {
        if (!plantao.medico && !!plantao.temCandidatos) {
            return 'Candidato';
        }

        return !!plantao.medico && plantao.medico.nome !== 'undefined' ? plantao.medico.nome : '';
    };

    getPlantaoItem = (plantao, indexPlantao) => {
        return (
            <span>
                <RcIf if={indexPlantao > 0}>
                    {' '}
                    <br />{' '}
                </RcIf>
                <strong>
                    {this.retornaCorStatus(plantao)}
                    {this.retornaNome(plantao)}
                </strong>
                <br />
                <strong>{!!plantao.medico && !!plantao.medico.numeroCrm ? 'CRM: ' + plantao.medico.numeroCrm : ''}</strong>
                <br />
                {moment(plantao.horaInicio).format('HH:mm')}/{moment(plantao.horaFim).format('HH:mm')}
                <br />
                <strong>{plantao.especialidades}</strong>
                <br />
                <strong>{this.getPlantaoStatusLabel(plantao)}</strong>
                <br />
            </span>
        );
    };

    handleDivulgarPlantoes() {
        swal({
            title: 'Divulgar plantões',
            text: 'Deseja notificar os usuários no aplicativo?',
            icon: 'info',
            // buttons: ['Não', 'Sim'],
            buttons: {
                cancel: 'Cancelar',
                catch: {
                    text: 'Não!',
                    value: 'nao'
                },
                sim: 'Sim'
            },
            dangerMode: false
        }).then((notificar) => {
            switch (notificar) {
                case 'sim':
                    this.divulgarPlantoes(true);
                    break;
                case 'nao':
                    this.divulgarPlantoes();
                    break;
            }
        });
    }


    handleNotificarPlantoes() {
        swal({
            title: "Notificar Plantões",
            text: "Deseja notificar os usuários no aplicativo?",
            icon: "info",
            buttons: {
                cancel: "Cancelar",
                sim: "Sim",
            },
            dangerMode: false,
        }).then((notificar) => {
            if (notificar == "sim") {
                this.notifyMedics();
            }
        });
    }

    async notifyMedics() {
        this.setState({ loading: true });
        let escala = { ...this.state.escala };
        await EscalaService.notifyMedics(escala).subscribe(
            (data) => {
                this.setState({ loading: false });
                if (!!data) {
                    const icon = data.erro ? "error" : "success";
                    swal(data.mensagem, {
                        icon: icon,
                    });
                }
            },
            (error) => {
                console.log(error);
                this.setState({ loading: false });
                swal("Ocorreu um erro ao notificar os plantões.", {
                    icon: "error",
                });
            }
        );
    }

    async formatRawWhatsappText (rawWhatsappText: string) {
      const textWithLineBreak = rawWhatsappText.replaceAll('%0a', '\n');
      await navigator.clipboard.writeText(textWithLineBreak);
    }

    async handleCompartilharPlantao() {
        let plantao = { ...this.state.plantao };

        await EscalaService.compartilharPlantao(plantao.id).subscribe(
          async (data) => {
            if (data == null) return;
            if (data?.objeto?.plantaoInfo != null) {
                    await this.formatRawWhatsappText(data.objeto.plantaoInfo)
                    window.open(`whatsapp://send?text=${data.objeto.plantaoInfo}`, '_blank');
                }
            },
          (error) => {
              console.log(error);
          }
        );
    }
    
    async handleCompartilharEscala() {
        let escala = { ...this.state.escala };

        await EscalaService.compartilharPlantoesEscala(escala.id).subscribe(
            async (data) => {
                if (!!data) {
                  await this.formatRawWhatsappText(data.objeto.plantaoInfo)
                  window.open(`whatsapp://send?text=${data.objeto.plantaoInfo}`, '_blank');
                }
            },
            (error) => {
                console.log(error);
            }
        );
    }

    handleDisponibilizarPlantoes() {
        swal({
            title: "Disponibilizar Plantões",
            text: "Deseja disponibilizar os plantões no aplicativo?",
            icon: "info",
            buttons: {
                cancel: "Cancelar",
                sim: "Sim",
            },
            dangerMode: false,
        }).then((notificar) => {
            if (notificar == "sim") {
                this.divulgarPlantoes(true);
            }

            this.setState({ isDraft: !this.state.isDraft });
        });
    }

    async divulgarPlantoes(notificar = false) {
        this.setState({ loading: true });
        let escala = { ...this.state.escala };
        escala.notificarMedicos = notificar;
        await EscalaService.divulgarPlantoesEscala(escala).subscribe(
            (data) => {
                this.setState({ loading: false });
                if (!!data) {
                    const icon = data.erro ? 'error' : 'success';
                    swal(data.mensagem, {
                        icon: icon
                    });
                }
            },
            (error) => {
                console.log(error);
                this.setState({ loading: false });
                swal('Ocorreu um erro ao divulgar os plantões.', {
                    icon: 'error'
                });
            }
        );
    }

    setaModalDia = (setor, plantao) => {
        if (!!setor.plantoes) {
            switch (this.state.objDia.diaSemana) {
                case 'Segunda-feira':
                    if (!!setor.plantoes.segunda) {
                        for (let p = 0; p < setor.plantoes.segunda.length; p++) {
                            if (setor.plantoes.segunda[p] === plantao) {
                                this.toggleModal('cadastrarMedicoModal', setor.plantoes.segunda[p]);
                            }
                        }
                    }
                    break;
                case 'Terça-feira':
                    if (!!setor.plantoes.terca) {
                        for (let p = 0; p < setor.plantoes.terca.length; p++) {
                            if (setor.plantoes.terca[p] === plantao) {
                                this.toggleModal('cadastrarMedicoModal', setor.plantoes.terca[p]);
                            }
                        }
                    }
                    break;
                case 'Quarta-feira':
                    if (!!setor.plantoes.quarta) {
                        for (let p = 0; p < setor.plantoes.quarta.length; p++) {
                            if (setor.plantoes.quarta[p] === plantao) {
                                this.toggleModal('cadastrarMedicoModal', setor.plantoes.quarta[p]);
                            }
                        }
                    }
                    break;
                case 'Quinta-feira':
                    if (!!setor.plantoes.quinta) {
                        for (let p = 0; p < setor.plantoes.quinta.length; p++) {
                            if (setor.plantoes.quinta[p] === plantao) {
                                this.toggleModal('cadastrarMedicoModal', setor.plantoes.quinta[p]);
                            }
                        }
                    }
                    break;
                case 'Sexta-feira':
                    if (!!setor.plantoes.sexta) {
                        for (let p = 0; p < setor.plantoes.sexta.length; p++) {
                            if (setor.plantoes.sexta[p] === plantao) {
                                this.toggleModal('cadastrarMedicoModal', setor.plantoes.sexta[p]);
                            }
                        }
                    }
                    break;
                case 'Sábado':
                    if (!!setor.plantoes.sabado) {
                        for (let p = 0; p < setor.plantoes.sabado.length; p++) {
                            if (setor.plantoes.sabado[p] === plantao) {
                                this.toggleModal('cadastrarMedicoModal', setor.plantoes.sabado[p]);
                            }
                        }
                    }
                    break;
                case 'Domingo':
                    if (!!setor.plantoes.domingo) {
                        for (let p = 0; p < setor.plantoes.domingo.length; p++) {
                            if (setor.plantoes.domingo[p] === plantao) {
                                this.toggleModal('cadastrarMedicoModal', setor.plantoes.domingo[p]);
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    };

    refreshTabela = () => {
        let filtroDia = {};
        let filtroMes = {};

        filtroDia.data = this.state.filtroDia;

        filtroMes.escalaVo = this.state.escala;
        filtroMes.tipo = 'MES';
        filtroMes.data = this.state.inicioEscala;

        this.setState({
            loadingRefresh: true
        });

        this.preencheDia(filtroDia.data);
        GestaoEscalaService.listaLayoutEscala(filtroMes).subscribe(
            (data) => {
                if (!!data) {
                    this.setRangeEscala(filtroMes.escalaVo);
                    this.setState({
                        SEMANAS: data.objeto,
                        loading: false,
                        loadingRefresh: false
                    });
                }
            },
            (error) => {
                console.error(error);
                this.setState({
                    loadingRefresh: false
                });
            }
        );
    };

    submitModal = (plantao) => {
        this.handleSubmitModalCadastroMedicoModal(plantao);
    };

    handleSubmitAceitaMedicoModal = () => {
        console.log('handle aceita medico');
        console.log(this.state.formCadastroMedicoModal);
        console.log(this.state.listaCandidatosPlantao);
        console.log(this.state);
        if (this.state.formCadastroMedicoModal.status == null || this.state.formCadastroMedicoModal.status === '' || this.state.formCadastroMedicoModal.status === 'default') {
            toast.warn('Por favor, selecione um status');
            return;
        }
        let vo = {
            id: this.state.plantao.id,
            status: this.state.formCadastroMedicoModal.status,
            listaCandidatosPlantao: this.state.listaCandidatosPlantao
        };
        this.setState(
            {
                sendRequest: true
            },
            () => {
                GestaoEscalaService.aceitaMedico(vo).subscribe(
                    (data) => {
                        this.setState({ sendRequest: false });
                        this.refreshTabela();
                        this.toggleModal('cadastrarMedicoModal');
                        toast.success(data.mensagem);
                    },
                    (error) => {
                        console.error(error);
                        this.setState({ sendRequest: false });
                    }
                );
            }
        );
    };

    trocaTab = (key) => {
        this.refreshTabela();
        this.setState({ key: key });
    };

    listarCandidatosPlantao = (plantao) => {
        if (plantao !== undefined) {
            GestaoEscalaService.listarCandidatosPlantao(plantao).subscribe(
                (data) => {
                    if (!!data) {
                        this.setState({ listaCandidatosPlantao: data });
                    }
                },
                (error) => console.error(error)
            );
        }
    };

    handleCandidatoPlantaoChange = (e) => {
        let formCanditatoPlantao = { ...this.state.formCanditatoPlantao };
        formCanditatoPlantao.medico.id = e.target.value;
        this.setState({ formCanditatoPlantao: formCanditatoPlantao });
    };

    onClickCheck = (e, i) => {
        let listaCandidatosPlantao = [...this.state.listaCandidatosPlantao];
        listaCandidatosPlantao[i].aceito = !listaCandidatosPlantao[i].aceito;
        for (let k = 0; k < listaCandidatosPlantao.length; k++) {
            if (k !== i) {
                listaCandidatosPlantao[k].aceito = false;
            }
        }
        this.setState({ listaCandidatosPlantao: listaCandidatosPlantao });
        console.log(this.state.listaCandidatosPlantao);
    };

    renderPlantaoMobile = (plantao, indexPlantao) => {
        return (
            <RcIf if={plantao.bloqueado}>
                {this.renderPlantaoMobileAvailable(plantao, indexPlantao)}
                <RcElse>
                    <div key={indexPlantao} onClick={() => this.toggleModal("cadastrarMedicoModal", plantao)} className="div-plantao">
                        {this.getPlantaoItem(plantao, indexPlantao)}
                    </div>
                </RcElse>
            </RcIf>
        );
    };

    renderPlantaoMobileAvailable = (plantao, indexPlantao) => {
        const hora = `${moment(plantao.horaInicio).format('HH:mm')}/${moment(plantao.horaFim).format('HH:mm')}`;
        const especialidades = plantao.especialidades;
        return (
            <div key={indexPlantao} onClick={() => this.toggleModal('cadastrarMedicoModal', plantao)} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
                <div style={{ fontSize: '14px' }}>{hora}</div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{especialidades}</div>
            </div>
        );
    };

    renderPlantoesMobile = (plantoes) => {
        if (!plantoes) return null;
        return plantoes.map((plantao, i) => this.renderPlantaoMobile(plantao, i));
    };

    renderSetorMobile = (setor, diaSemana) => {
        if (!setor.plantoes || !setor.plantoes[diaSemana]) return null;
        return (
            <tr>
                <td className="table__mobile--header-test">{setor ? setor.desc : ""}</td>
                <td>{this.renderPlantoesMobile(setor.plantoes[diaSemana])}</td>
            </tr>
        );
    };

  render() {
    // const {SEMANAS} = this.state;
    const that = this;
    const { loading, escala, isDraft } = this.state;
    return (
      <>
        {/*    if (!!plantao.emTroca) {*/}
        {/*    return <div className='quadrado doacao'/>*/}
        {/*}*/}
        {/*    if (plantao.status !== '') {*/}
        {/*    if (plantao.status === 'F') {*/}
        {/*    return <div className='quadrado fixo'/>*/}
        {/*}*/}
        {/*    if (plantao.status === 'C') {*/}
        {/*    return <div className='quadrado confirmado'/>*/}
        {/*}*/}
        {/*    if (plantao.status === 'AC') {*/}
        {/*    return <div className='quadrado a-confirmar'/>*/}
        {/*}*/}
        {/*    if (plantao.status === 'D') {*/}
        {/*    return <div className='quadrado doacao'/>*/}
        {/*}*/}
        <Container fluid id="gestao-escala-tabela">
          <div className="text-muted text-center mt-2 mb-4">
            {!loading && isDraft && <h1 className="card-sub-title">{"Modo Rascunho"}</h1>}
            <h1 className="card-title">{!!this.state.escala && !!this.state.escala.nomeEscala ? "Escala: " + this.state.escala.nomeEscala : ""}</h1>
          </div>

          <Row>
            <Col md="3" xs="12">
              <div className="quadrado candidato p-2" />
              <h3>Candidatos ao plantão</h3>
            </Col>
            <Col md="2" xs="12">
              <div className="quadrado a-confirmar p-2" />
              <h3>A confirmar</h3>
            </Col>
            <Col md="2" xs="12">
              <div className="quadrado confirmado p-2" />
              <h3>Confirmado</h3>
            </Col>
            <Col md="2" xs="12">
              <div className="quadrado fixo p-2" />
              <h3>Fixo</h3>
            </Col>
            <Col md="3" xs="12">
              <div className="quadrado doacao p-2" />
              <h3>Troca/Doação</h3>
            </Col>
          </Row>
          <Tabs activeKey={this.state.key} onSelect={(key) => this.trocaTab(key)} id="noanim-tab-example">
            {/* MENSAL */}
            <Tab eventKey="mes" title="Mês">
              <Row>
                <Col md="12" className="botton-to-right botton-to-right-mobile">
                  <Button disabled={false} hidden={false} className="btn-primary" type="button" onClick={() => this.handleCompartilharEscala()}>
                    {BTN_COMPARTILHAR_ESCALA}
                  </Button>
                  <Button hidden={!this.state.permissaoDivulgar} className="btn-primary" type="button" onClick={() => this.handleDisponibilizarPlantoes()}>
                    {BTN_PUBLICAR_PLANTOES}
                  </Button>
                  <Button disabled={isDraft} hidden={!this.state.permissaoDivulgar} className="btn-primary" type="button" onClick={() => this.handleNotificarPlantoes()}>
                    {BTN_NOTIFICAR_PLANTOES}
                  </Button>
                  <DropdownButton className="dropdown-mobile" id="dropdown-basic-button" title="Exportar" hidden={!this.state.permissaoPublicar}>
                    <Dropdown.Item onClick={() => this.gerarExcel("MES", this.state.inicioEscala, false, false)}>Gerar Excel</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.gerarExcel("MES", this.state.inicioEscala, true, false)}>Gerar Pdf</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.gerarExcel("MES", this.state.inicioEscala, false, true)}>Gerar Pdf (Novo) </Dropdown.Item>
                  </DropdownButton>
                  <Link className="btn-primary" to="/admin/lista-gestao-escala">
                    {BTN_VOLTAR}
                  </Link>
                </Col>
              </Row>
              {this.state.loading ? (
                <Row>
                  <Col colSpan="4" align="center">
                    <ClipLoader sizeUnit={"px"} size={70} margin={"2px"} color={"##009471"} loading={this.state.loading} />
                  </Col>
                </Row>
              ) : null}
              <Card className="table__web">
                {/* GRID */}
                <div style={{ maxHeight: 710, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(8, auto)" }}>
                  {this.state.SEMANAS.map((semana, indexSemana) => [
                    <div className="week__container">{"SEMANA " + semana.numSemana}</div>,
                    ...semana.dias.map((dia, indexDia) => (
                      <div className="day__container" key={indexDia}>
                        <div className="day__container--day">{dia.str}</div>
                        <div className="day__container--date">{indexDia !== 0 ? moment(dia.data).format("DD/MM") : null}</div>
                      </div>
                    )),
                    ...semana.turnos.map((turno, indexTurno) => [
                      <div className="shift__container" key={indexTurno}>
                        {capitalizaString(turno.desc)}
                      </div>,
                      ...turno.setores.map((setor, indexSetor) => {
                        if (setor.plantoes == null || setor.plantoes.length === 0) {
                          return <div style={{ gridColumn: "1/9" }} />;
                        }
                        return [
                          <div className="sector__container">
                            {setor.desc}
                          </div>,
                          <div className="duty__container">
                            {setor.plantoes && setor.plantoes.segunda
                              ? setor.plantoes.segunda.map(function(plantao, indexPlantao) {
                                  return (
                                    <RcIf if={plantao.bloqueado}>
                                      <div
                                        key={indexPlantao}
                                        onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                        className="bloqueado div-plantao"
                                      >
                                        <span>
                                          {/*{moment.utc(plantao.horaInicio).utcOffset('-03:00').format('HH:mm')}/{moment.utc(plantao.horaFim).utcOffset('-03:00').format('HH:mm')}*/}
                                          {moment(plantao.horaInicio).format("HH:mm")}/{moment(plantao.horaFim).format("HH:mm")}
                                          <br />
                                          <strong>{plantao.especialidades}</strong>
                                        </span>
                                      </div>
                                      <RcElse>
                                        <div
                                          key={indexPlantao}
                                          onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                          className="div-plantao"
                                        >
                                          {that.getPlantaoItem(plantao, indexPlantao)}
                                        </div>
                                      </RcElse>
                                    </RcIf>
                                  );
                                })
                              : null}
                          </div>,
                          <div className="duty__container">
                            {!!setor.plantoes && !!setor.plantoes.terca
                              ? setor.plantoes.terca.map(function(plantao, indexPlantao) {
                                  return (
                                    <RcIf if={plantao.bloqueado} key={`indexPlantao-cad-${plantao.id}`}>
                                      <div
                                        key={`indexPlantao-cad-${plantao.id}`}
                                        onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                        className="bloqueado div-plantao"
                                      >
                                        <span>
                                          {/*{moment.utc(plantao.horaInicio).utcOffset('-03:00').format('HH:mm')}/{moment.utc(plantao.horaFim).utcOffset('-03:00').format('HH:mm')}*/}
                                          {moment(plantao.horaInicio).format("HH:mm")}/{moment(plantao.horaFim).format("HH:mm")}
                                          <br />
                                          <strong>{plantao.especialidades}</strong>
                                        </span>
                                      </div>
                                      <RcElse>
                                        <div
                                          key={indexPlantao}
                                          onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                          className="div-plantao"
                                        >
                                          {that.getPlantaoItem(plantao, indexPlantao)}
                                        </div>
                                      </RcElse>
                                    </RcIf>
                                  );
                                })
                              : null}
                          </div>,
                          <div className="duty__container">
                            {!!setor.plantoes && !!setor.plantoes.quarta
                              ? setor.plantoes.quarta.map(function(plantao, indexPlantao) {
                                  return (
                                    <RcIf key={indexPlantao} if={plantao.bloqueado}>
                                      <div onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)} className="bloqueado div-plantao">
                                        <span>
                                          {/*{moment.utc(plantao.horaInicio).utcOffset('-03:00').format('HH:mm')}/{moment.utc(plantao.horaFim).utcOffset('-03:00').format('HH:mm')}*/}
                                          {moment(plantao.horaInicio).format("HH:mm")}/{moment(plantao.horaFim).format("HH:mm")}
                                          <br />
                                          <strong>{plantao.especialidades}</strong>
                                        </span>
                                      </div>
                                      <RcElse>
                                        <div
                                          key={indexPlantao}
                                          onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                          className="div-plantao"
                                        >
                                          {that.getPlantaoItem(plantao, indexPlantao)}
                                        </div>
                                      </RcElse>
                                    </RcIf>
                                  );
                                })
                              : null}
                          </div>,
                          <div className="duty__container">
                            {!!setor.plantoes && !!setor.plantoes.quinta
                              ? setor.plantoes.quinta.map(function(plantao, indexPlantao) {
                                  return (
                                    <RcIf if={plantao.bloqueado}>
                                      <div
                                        key={indexPlantao}
                                        onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                        className="bloqueado div-plantao"
                                      >
                                        <span>
                                          {/*{moment.utc(plantao.horaInicio).utcOffset('-03:00').format('HH:mm')}/{moment.utc(plantao.horaFim).utcOffset('-03:00').format('HH:mm')}*/}
                                          {moment(plantao.horaInicio).format("HH:mm")}/{moment(plantao.horaFim).format("HH:mm")}
                                          <br />
                                          <strong>{plantao.especialidades}</strong>
                                        </span>
                                      </div>
                                      <RcElse>
                                        <div
                                          key={indexPlantao}
                                          onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                          className="div-plantao"
                                        >
                                          {that.getPlantaoItem(plantao, indexPlantao)}
                                        </div>
                                      </RcElse>
                                    </RcIf>
                                  );
                                })
                              : null}
                          </div>,
                          <div className="duty__container">
                            {!!setor.plantoes && !!setor.plantoes.sexta
                              ? setor.plantoes.sexta.map(function(plantao, indexPlantao) {
                                  return (
                                    <RcIf if={plantao.bloqueado}>
                                      <div
                                        key={indexPlantao}
                                        onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                        className="bloqueado div-plantao"
                                      >
                                        <span>
                                          {/*{moment.utc(plantao.horaInicio).utcOffset('-03:00').format('HH:mm')}/{moment.utc(plantao.horaFim).utcOffset('-03:00').format('HH:mm')}*/}
                                          {moment(plantao.horaInicio).format("HH:mm")}/{moment(plantao.horaFim).format("HH:mm")}
                                          <br />
                                          <strong>{plantao.especialidades}</strong>
                                        </span>
                                      </div>
                                      <RcElse>
                                        <div
                                          key={indexPlantao}
                                          onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                          className="div-plantao"
                                        >
                                          {that.getPlantaoItem(plantao, indexPlantao)}
                                        </div>
                                      </RcElse>
                                    </RcIf>
                                  );
                                })
                              : null}
                          </div>,
                          <div className="duty__container">
                            {!!setor.plantoes && !!setor.plantoes.sabado
                              ? setor.plantoes.sabado.map(function(plantao, indexPlantao) {
                                  return (
                                    <RcIf if={plantao.bloqueado}>
                                      <div
                                        key={indexPlantao}
                                        onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                        className="bloqueado div-plantao"
                                      >
                                        <span>
                                          {/*{moment.utc(plantao.horaInicio).utcOffset('-03:00').format('HH:mm')}/{moment.utc(plantao.horaFim).utcOffset('-03:00').format('HH:mm')}*/}
                                          {moment(plantao.horaInicio).format("HH:mm")}/{moment(plantao.horaFim).format("HH:mm")}
                                          <br />
                                          <strong>{plantao.especialidades}</strong>
                                        </span>
                                      </div>
                                      <RcElse>
                                        <div
                                          key={indexPlantao}
                                          onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                          className="div-plantao"
                                        >
                                          {that.getPlantaoItem(plantao, indexPlantao)}
                                        </div>
                                      </RcElse>
                                    </RcIf>
                                  );
                                })
                              : null}
                          </div>,
                          <div className="duty__container" style={{borderBottom:'none'}}>
                            {!!setor.plantoes && !!setor.plantoes.domingo
                              ? setor.plantoes.domingo.map(function(plantao, indexPlantao) {
                                  return (
                                    <RcIf if={plantao.bloqueado}>
                                      <div
                                        key={indexPlantao}
                                        onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                        className="bloqueado div-plantao"
                                      >
                                        <span>
                                          {/*{moment.utc(plantao.horaInicio).format('HH:mm')}/{moment.utc(plantao.horaFim).format('HH:mm')}*/}
                                          {moment(plantao.horaInicio).format("HH:mm")}/{moment(plantao.horaFim).format("HH:mm")}
                                          <br />
                                          <strong>{plantao.especialidades}</strong>
                                        </span>
                                      </div>
                                      <RcElse>
                                        <div
                                          key={indexPlantao}
                                          onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                          className="div-plantao"
                                        >
                                          {that.getPlantaoItem(plantao, indexPlantao)}
                                        </div>
                                      </RcElse>
                                    </RcIf>
                                  );
                                })
                              : null}
                          </div>,
                        ];
                      }),
                    ]),
                  ])}
                </div>
              </Card>
              <div className="table__mobile">
                <Row>
                  <Col>{this.renderCardMobile()}</Col>
                </Row>
              </div>
            </Tab>
            <Tab eventKey="dia" title="Dia">
              <Row>
                <Col md="12" className="botton-to-right">
                  <DropdownButton className="dropdown-mobile" id="dropdown-basic-button" title="Exportar" hidden={!this.state.permissaoPublicar}>
                    <Dropdown.Item onClick={() => this.gerarExcel("DIA", this.state.filtroDia, false)}>Gerar Excel</Dropdown.Item>

                    <Dropdown.Item onClick={() => this.gerarExcel("DIA", this.state.filtroDia, true)}>Gerar Pdf</Dropdown.Item>
                  </DropdownButton>
                </Col>
              </Row>
              {this.state.loading ? (
                <Row>
                  <Col colSpan="4" align="center">
                    <ClipLoader sizeUnit={"px"} size={50} margin={"2px"} color={"#149d5b"} loading={this.state.loading} />
                  </Col>
                </Row>
              ) : null}
              <Row className="m-0" className="table__web">
                <Col className="btn-data">
                  <span onClick={() => this.passaDia(this.state.filtroDia, "anterior")} className="ni ni-bold-left cursor-pointer" />
                </Col>
                <Col className="filtro-data">
                  {this.state.objDia.diaSemana}
                  {" - "}
                  {this.state.objDia.data}
                </Col>
                <Col className="btn-data">
                  <span onClick={() => this.passaDia(this.state.filtroDia, "proximo")} className="ni ni-bold-right cursor-pointer" />
                </Col>
              </Row>
              <Table bordered hover className="table__web">
                <tbody>
                  {this.state.turnos.map((turno, indexTurno) => {
                    return [
                      <tr>
                        <th scope="col" colSpan="8" key={indexTurno} className="row-turno">
                          {capitalizaString(turno.desc)}
                        </th>
                      </tr>,
                      turno.setores.map((setor, indexSetor) => {
                        let plantoes = this.retornaPlantoesDia(setor);
                        if (plantoes !== null) {
                          return (
                            <tr key={indexSetor}>
                              <th scope="col" colSpan="2" className="thead-setor">
                                {setor.desc}
                              </th>
                              <td scope="col" colSpan="6">
                                {!!setor.plantoes && !!plantoes
                                  ? plantoes.map(function(plantao, indexPlantao) {
                                      return (
                                        <RcIf if={plantao.bloqueado}>
                                          <div
                                            key={indexPlantao}
                                            onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                            className="bloqueado div-plantao"
                                          >
                                            <span>
                                              {moment(plantao.horaInicio).format("HH:mm")}/{moment(plantao.horaFim).format("HH:mm")}
                                              <br />
                                              <strong>{plantao.especialidades}</strong>
                                            </span>
                                          </div>
                                          <RcElse>
                                            <div
                                              key={indexPlantao}
                                              // onClick={() => that.toggleModal("cadastrarMedicoModal", plantao)}
                                              onClick={() => that.setaModalDia(setor, plantao)}
                                              className="div-plantao"
                                            >
                                              <span>
                                                <RcIf if={indexPlantao > 0}>
                                                  {" "}
                                                  <br />{" "}
                                                </RcIf>
                                                {/*<RcIf if={!!plantao.medico}>*/}
                                                <strong>
                                                  {that.retornaCorStatus(plantao)}
                                                  {that.retornaNome(plantao)}
                                                </strong>
                                                <br />
                                                <strong>
                                                  {!!plantao.medico && !!plantao.medico.numeroCrm ? "CRM: " + plantao.medico.numeroCrm : ""}
                                                </strong>
                                                <br />
                                                {/*</RcIf>*/}
                                                {moment(plantao.horaInicio).format("HH:mm")}/{moment(plantao.horaFim).format("HH:mm")}
                                                <br />
                                                <strong>{plantao.especialidades}</strong>
                                              </span>
                                            </div>
                                          </RcElse>
                                        </RcIf>
                                      );
                                    })
                                  : null}
                              </td>
                            </tr>
                          );
                        }
                      }),
                    ];
                  })}
                </tbody>
              </Table>
              <div className="table__mobile">
                <Row className="m-1 mb-3" style={{ fontSize: "19px" }}>
                  <Col className="btn-data-mobile">
                    <span onClick={() => this.passaDia(this.state.filtroDia, "anterior")} className="ni ni-bold-left cursor-pointer" />
                  </Col>
                  <Col className="filtro-data-mobile">
                    {this.state.objDia.diaSemana}
                    {" - "}
                    {this.state.objDia.data}
                  </Col>
                  <Col className="btn-data-mobile">
                    <span onClick={() => this.passaDia(this.state.filtroDia, "proximo")} className="ni ni-bold-right cursor-pointer" />
                  </Col>
                </Row>
                <Row>
                  <Col>{this.renderCardDiaMobile()}</Col>
                </Row>
              </div>
            </Tab>
          </Tabs>

          {/*Modal cadastrar*/}
          <Modal className="modal-dialog-centered" isOpen={this.state.cadastrarMedicoModal} toggle={() => this.toggleModal("cadastrarMedicoModal")}>
            <div className="modal-header">
              <h5 className="modal-title" id="cadastrarMedicoModalModalLabel">
                Cadastrar Médico para Plantão
              </h5>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => this.toggleModal("cadastrarMedicoModal")}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>
            <div className="modal-body">
              <Form>
                <Row className="w">
                  {/*medico*/}
                  <Col md="12">
                    <FormGroup>
                      <Input
                        type="select"
                        name="select"
                        id="medicoSelect"
                        onChange={this.handleMedicoChange}
                        value={!!this.state.formCadastroMedicoModal.medico ? this.state.formCadastroMedicoModal.medico.id : null}
                      >
                        <option name="default" value="default">
                          Selecionar Médico
                        </option>
                        {this.state.listaMedico.map((item, i) => {
                          return (
                            <RcIf if={!this.state.formCadastroMedicoModal.bloqueado}>
                              <option key={i} value={item.id}>
                                {item.nome}
                              </option>
                            </RcIf>
                          );
                        })}
                      </Input>
                    </FormGroup>
                  </Col>
                  {/*medicos candidatados*/}
                  <Col md="12" hidden={this.state.listaCandidatosPlantao.length === 0}>
                    <span>Médicos candidatados para o Plantão</span>
                  </Col>
                  <Col md="12" hidden={this.state.listaCandidatosPlantao.length === 0}>
                    <FormGroup>
                      {this.state.listaCandidatosPlantao.map((item, i) => {
                        return (
                          // <FormControlLabel
                          //   control={<Checkbox checked={item.aceito ? item.aceito : false} onChange={(e) => this.onClickCheck(e, i)} />}
                          //   label={item.medico.nome + " - CRM: " + item.medico.numeroCrm}
                          // />
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  // disabled={item.aceito === false ? true : false}
                                  checked={item.aceito ? item.aceito : false}
                                  onChange={(e) => this.onClickCheck(e, i)}
                                />
                              }
                              label={item.medico.nome + " - CRM: " + item.medico.numeroCrm}
                            />
                            <Button
                              color={"danger"}
                              disabled={item.aceito === false ? true : false}
                              onClick={() => this.handleRefusedDoctor(item.id)}
                              size="sm"
                            >
                              {item.aceito === false ? "Recusado" : "Recusar"}
                            </Button>
                          </div>
                        );
                      })}
                    </FormGroup>
                  </Col>

                  <Col md="12">
                    <FormGroup>
                      <Input
                        type="select"
                        name="select"
                        id="statusSelect"
                        onChange={this.handleCadastroMedicoChange}
                        value={this.state.formCadastroMedicoModal.status}
                      >
                        <option name="default" value="default">
                          Selecionar Status
                        </option>
                        <RcIf if={!this.state.formCadastroMedicoModal.bloqueado}>
                          <option value="AC">A Confirmar</option>
                        </RcIf>
                        <RcIf if={!this.state.formCadastroMedicoModal.bloqueado}>
                          <option value="F">Fixo</option>
                        </RcIf>
                        <RcIf if={!this.state.formCadastroMedicoModal.bloqueado}>
                          <option value="C">Confirmado</option>
                        </RcIf>
                      </Input>
                    </FormGroup>
                  </Col>

                  <Col md="12">
                    <FormGroup>
                      <CurrencyInput
                        decimalSeparator=","
                        thousandSeparator="."
                        placeholder="Valor"
                        value={this.state.formCadastroMedicoModal.valor}
                        onChangeEvent={this.handleCadastroMedicoValor}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Vaga Bloqueada?</Label>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup md="6">
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={this.state.formCadastroMedicoModal.bloqueado}
                              onChange={this.handleCadastroMedicoBloqueiaChange}
                            />
                          }
                        />
                    </FormGroup>
                  </Col>
                  {this.state.formCadastroMedicoModal.bloqueado && (<Col md="12">
                    <FormGroup>
                      <Input
                      type="text"
                      name="blockedReason"
                      id="blockedReason"
                      placeholder='Justificativa'
                      onChange={this.handleBlockedReasonChange}
                      value={this.state.formCadastroMedicoModal.blockedReason}   
                      maxLength={30}/>       
                    </FormGroup>
                  </Col>)}
                </Row>
              </Form>
            </div>
            <div className="modal-footer">
              <Button
                color="secondary"
                data-dismiss="modal"
                type="button"
                onClick={() =>
                  this.handleCompartilharPlantao()
                }
              >
                {BTN_COMPARTILHAR}
              </Button>
              <Button
                color="secondary"
                data-dismiss="modal"
                type="button"
                onClick={() =>
                  this.setState({
                    cadastrarMedicoModal: !this.state.cadastrarMedicoModal,
                  })
                }
              >
                {BTN_VOLTAR}
              </Button>
              <Button
                color="primary"
                type="button"
                disabled={this.state.sendRequest}
                hidden={this.state.listaCandidatosPlantao.length > 0 || !this.state.permissaoPlantaoAceitarRecusar}
                onClick={() => this.submitModal(this.state.plantao)}
              >
                {BTN_SALVAR}
              </Button>
              <Button
                color="primary"
                type="button"
                disabled={this.state.sendRequest}
                hidden={this.state.listaCandidatosPlantao.length === 0 || !this.state.permissaoPlantaoAceitarRecusar}
                onClick={() => this.handleSubmitAceitaMedicoModal()}
              >
                {BTN_SALVAR}
              </Button>
            </div>
          </Modal>
        </Container>
      </>
    );
  }
  

    renderTurnoMobile = (turno, diaSemana) => {
        if (!turno || !turno.setores) return null;
        return turno.setores.map((setor) => this.renderSetorMobile(setor, diaSemana));
    };
    renderTurnosDiaMobile = (turnos, diaSemana) => {
        if (!turnos) return null;
        return turnos.map((turno) => {
            return (
                <>
                    <tr className='table__mobile--header-period'>
                        <td colSpan='2'>{turno && turno.desc && capitalizaString(turno.desc)}</td>
                    </tr>
                    {this.renderTurnoMobile(turno, diaSemana)}
                </>
            );
        });
    };
    renderDiaMobile = (dia, turnos) => {
        return (
            <>
                <tr className='table__mobile--header-day'>
                    <td colSpan='2'>{`${dia.str} ${moment(dia.data).format('DD/MM')}`}</td>
                </tr>
                {this.renderTurnosDiaMobile(turnos, this.convertDiaSemana(dia.str))}
            </>
        );
    };
    convertDiaSemana = (str) => {
        if (str === 'sábado') return 'sabado';
        if (str === 'terça') return 'terca';
        return str;
    };
    renderSemanaMobile = (dias, turnos) => {
        return (
            <>
                {dias.slice(1).map((dia, i) => {
                    return this.renderDiaMobile(dia, turnos);
                })}
            </>
        );
    };
    renderTableSemanaMobile = (semana, indexSemana) => {
        return (
            <table style={{ width: '100%' }}>
                <thead>
                    <tr className='table__mobile--header'>
                        <th style={{ padding: '5px' }} colSpan='2'>
                            {'SEMANA ' + semana.numSemana}
                        </th>
                    </tr>
                </thead>
                <tbody>{this.renderSemanaMobile(semana.dias, semana.turnos)}</tbody>
            </table>
        );
    };
    renderCardMobile = () => {
        return <Card>{this.state.SEMANAS.map((semana, indexSemana) => this.renderTableSemanaMobile(semana, indexSemana))}</Card>;
    };
    renderFiltroDiaSetorMobile = (setor) => {
        if (!setor.plantoes || !setor.plantoes) return null;
        const plantoes = Object.keys(setor.plantoes).flatMap((it) => setor.plantoes[it].filter((plantao) => moment(plantao.data).isSame(this.state.filtroDia, 'day')));
        return (
            <tr>
                <td className='table__mobile--header-test'>{setor ? setor.desc : ''}</td>
                <td>{this.renderPlantoesMobile(plantoes)}</td>
            </tr >
        );
    };
    renderFiltroDiaTurnoMobile = (turno, diaSemana) => {
        if (!turno || !turno.setores) return null;
        return turno.setores.map((setor) => this.renderFiltroDiaSetorMobile(setor));
    };
    renderFiltroDiaTurnosMobile = (turnos) => {
        if (!turnos) return null;
        return turnos.map((turno) => {
            return (
                <>
                    <tr className='table__mobile--header-period'>
                        <td colSpan='2'>{turno && turno.desc && capitalizaString(turno.desc)}</td>
                    </tr>
                    {this.renderFiltroDiaTurnoMobile(turno)}
                </>
            );
        });
    };
    renderCardDiaMobile = () => {
        return (
            <Card>
                <table style={{ width: '100%' }}>
                    <thead></thead>
                    <tbody>{this.renderFiltroDiaTurnosMobile(this.state.turnos)}</tbody>
                </table>
            </Card>
        );
    };
    renderCardMobileMock = () => {
        return (
            <Card>
                <table>
                    <thead>
                        <tr className='table__mobile--header'>
                            <th style={{ padding: '5px' }} colSpan='2'>
                                Semana 1
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='table__mobile--header-day'>
                            <td colSpan='2'>Segunda</td>
                        </tr>
                        <tr>
                            <td className='table__mobile--header-test'>TESTE SETOR</td>
                            <td>
                                <div className='table__mobile--header-period'>Manhã</div>
                                <div className='table__mobile--header-period'>Tarde</div>
                                <div className='table__mobile--header-period'>Noite</div>
                            </td>
                        </tr>
                        <tr className='table__mobile--header-day'>
                            <td colSpan='2'>Terça</td>
                        </tr>
                        <tr>
                            <td className='table__mobile--header-test'>TESTE SETOR</td>
                            <td>
                                <div className='table__mobile--header-period'>Manhã</div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        padding: '20px'
                                    }}>
                                    <div>14:00/14:30</div>
                                    <div style={{ fontWeight: '600' }}>ANESTESIOLOGIA</div>
                                </div>
                                <div className='table__mobile--header-period'>Tarde</div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        padding: '20px'
                                    }}>
                                    <div>14:00/14:30</div>
                                    <div>ANESTESIOLOGIA</div>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        padding: '20px'
                                    }}>
                                    <div>14:00/14:30</div>
                                    <div>ANESTESIOLOGIA</div>
                                </div>
                                <div className='table__mobile--header-period'>Noite</div>
                            </td>
                        </tr>
                        <tr className='table__mobile--header-day'>
                            <td colSpan='2'>Quarta</td>
                        </tr>
                        <tr>
                            <td className='table__mobile--header-test'>TESTE SETOR</td>
                            <td>
                                <div className='table__mobile--header-period'>Manhã</div>
                                <div className='table__mobile--header-period'>Tarde</div>
                                <div className='table__mobile--header-period'>Noite</div>
                            </td>
                        </tr>
                        <tr className='table__mobile--header-day'>
                            <td colSpan='2'>Quinta</td>
                        </tr>
                        <tr>
                            <td className='table__mobile--header-test'>TESTE SETOR</td>
                            <td>
                                <div className='table__mobile--header-period'>Manhã</div>
                                <div className='table__mobile--header-period'>Tarde</div>
                                <div className='table__mobile--header-period'>Noite</div>
                            </td>
                        </tr>
                        <tr className='table__mobile--header-day'>
                            <td colSpan='2'>Sexta</td>
                        </tr>
                        <tr>
                            <td className='table__mobile--header-test'>TESTE SETOR</td>
                            <td>
                                <div className='table__mobile--header-period'>Manhã</div>
                                <div className='table__mobile--header-period'>Tarde</div>
                                <div className='table__mobile--header-period'>Noite</div>
                            </td>
                        </tr>
                        <tr className='table__mobile--header-day'>
                            <td colSpan='2'>Sábado</td>
                        </tr>
                        <tr>
                            <td className='table__mobile--header-test'>TESTE SETOR</td>
                            <td>
                                <div className='table__mobile--header-period'>Manhã</div>
                                <div className='table__mobile--header-period'>Tarde</div>
                                <div className='table__mobile--header-period'>Noite</div>
                            </td>
                        </tr>
                        <tr className='table__mobile--header-day'>
                            <td colSpan='2'>Domingo</td>
                        </tr>
                        <tr>
                            <td className='table__mobile--header-test'>TESTE SETOR</td>
                            <td>
                                <div className='table__mobile--header-period'>Manhã</div>
                                <div className='table__mobile--header-period'>Tarde</div>
                                <div className='table__mobile--header-period'>Noite</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        );
    };
}

export default GestaoEscalaTabela;
