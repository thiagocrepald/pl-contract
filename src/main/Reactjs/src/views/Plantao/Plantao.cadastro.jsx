import moment from 'moment';
import React from 'react';
import CurrencyInput from 'react-currency-input';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import WorkplaceItemService from '../../services/workplace-item-service';
import { toast } from 'react-toastify';
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
    Modal,
    Row,
    Table
} from 'reactstrap';
import EscalaService from '../../services/escala.service';
import './Plantao.cadastro.scss';

class PlantaoCadastro extends React.Component {
    constructor(props) {
        super(props);

        this.handleHoraInicioChange = this.handleHoraInicioChange.bind(this);
        this.handleHoraFimChange = this.handleHoraFimChange.bind(this);

        this.state = {
            formData: {
                id: '',
                turno: '',
                dia: '',
                diaList: [],
                workplaceItem: {},
                horaInicio: '',
                horaFim: '',
                listaEspecialidadeSelecionado: [],
                listaSetorSelecionado: [],
                valor: '',
                numeroVaga: ''
            },
            formSetorModal: {
                descricao: ''
            },
            formEspecialidadeModal: {
                descricao: ''
            },
            formVazio: {
                horaInicio: false,
                horaFim: false,
                dia: false,
                turno: false,
                workplaceItem: false,
                valor: false,
                numeroVaga: false
            },
            setor: {},
            especialidade: {},
            listaEspecialidade: [],
            listaWorkplaceItems: [],
            listaSetor: [],
            setorModal: false,
            especialidadeModal: false
        };
    }

    componentDidMount = async () => {
        console.log(this.state.formData);
        this.carregarCombos();
    };

    componentWillReceiveProps(newProps) {
        if (newProps.workplace != null && this.props.workplace !== newProps.workplace) {
            this.handleGetWorkplaceItems(newProps.workplace.id);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.verificaRegistro();
    };

    toggleModal = (state) => {
        this.setState({
            [state]: !this.state[state]
        });
    };

    handleHoraInicioChange = (data) => {
        let formData = { ...this.state.formData };
        formData.horaInicio = data;
        this.setState({ formData }, () => {
            this.verificarTurnoPorHorario();
        });
    };

    handleGetWorkplaceItems = async (id?: number) => {
        if (id == null) {
            id = '';
        }
        const result = await WorkplaceItemService.getAllByWorkplaceId(id);
        this.setState({ listaWorkplaceItems: result });
    };

    handleHoraFimChange = (data) => {
        let formData = { ...this.state.formData };
        formData.horaFim = data;
        this.setState({ formData }, () => {
            this.verificarTurnoPorHorario();
        });
    };

    /**
     * Retorna uma data em Moment
     *
     * @param dateTime
     * @returns {moment.Moment}
     */
    getTime(dateTime) {
        return moment({ h: dateTime.hours(), m: dateTime.minutes() });
    }

    /**
     * Verifica se os horários de início e fim batem com os horários definidos para cada turno.
     * Caso positivo, altera o turno automaticamente.
     */
    verificarTurnoPorHorario = () => {
        // Apenas se o início e fim já tivem sido inputados
        if (!!this.state.formData.horaInicio && !!this.state.formData.horaFim) {
            // Pega o moment dos inputs
            const inicio = moment(this.state.formData.horaInicio);
            const fim = moment(this.state.formData.horaFim);

            const inicioManha = this.getTime(moment([2020, 1, 1, 7, 0, 0])); // 07:00
            const fimManha = this.getTime(moment([2020, 1, 1, 13, 0, 0])); // 13:00

            const inicioTarde = this.getTime(moment([2020, 1, 1, 13, 0, 0])); // 13:00
            const fimTarde = this.getTime(moment([2020, 1, 1, 19, 0, 0])); // 19:00

            const inicioNoite = this.getTime(moment([2020, 1, 1, 19, 0, 0])); // 19:00
            const fimNoite = this.getTime(moment([2020, 1, 1, 7, 0, 0])); // 07:00

            const inicioCinderela = this.getTime(moment([2020, 1, 1, 19, 0, 0])); // 19:00
            const fimCinderela = this.getTime(moment([2020, 1, 1, 1, 0, 0])); // 01:00

            let formData = { ...this.state.formData };
            // Manhã
            if (inicio.isSame(inicioManha, 'minutes') && fim.isSame(fimManha, 'minutes')) {
                formData.turno = 'manhã';
                this.setState({ formData, turno: 'manhã' });
                // Tarde
            } else if (inicio.isSame(inicioTarde, 'minutes') && fim.isSame(fimTarde, 'minutes')) {
                formData.turno = 'tarde';
                this.setState({ formData, turno: 'tarde' });
                // Noite
            } else if (inicio.isSame(inicioNoite, 'minutes') && fim.isSame(fimNoite, 'minutes')) {
                formData.turno = 'noite';
                this.setState({ formData, turno: 'noite' });
                // Cinderela
            } else if (inicio.isSame(inicioCinderela, 'minutes') && fim.isSame(fimCinderela, 'minutes')) {
                formData.turno = 'cinderela';
                this.setState({ formData, turno: 'cinderela' });
            } else {
                formData.turno = '';
                this.setState({ formData, turno: '' });
            }
        }
    };

    handleTurnoChange = (e) => {
        let formData = { ...this.state.formData };
        formData.turno = e.target.value;
        this.setState({ formData, turno: e.target.value });
    };

    handleDiaChange = (e) => {
        let list = this.state.formData.diaList.slice(0);
        let value = e.target.value;

        if (!value || value === '') return;

        if (list.includes(value)) {
            let index = list.indexOf(value);
            list.splice(index, 1);
        } else {
            list.push(value);
        }

        let formData = { ...this.state.formData };
        formData.dia = '';
        formData.diaList = list;
        this.setState({ formData });
    };

    handleValorChange = (e) => {
        let formData = { ...this.state.formData };
        formData.valor = e;
        this.setState({ formData });
    };

    handleNumeroVagaChange = (e) => {
        let formData = { ...this.state.formData };
        formData.numeroVaga = e.target.value;
        this.setState({ formData });
    };

    handleSetorChange = (e) => {
        const indexObjSelecionado = this.state.listaSetor.findIndex((obj) => obj.id === Number(e.target.value));
        if (indexObjSelecionado !== -1) {
            const obj = this.state.listaSetor[indexObjSelecionado];
            let setor = { ...this.state.setor };
            setor.id = obj.id;
            setor.descricao = obj.descricao;
            this.setState({ setor });
        }
    };

    handleEspecialidadeChange = (e) => {
        const indexObjSelecionado = this.state.listaEspecialidade.findIndex((obj) => obj.id === Number(e.target.value));
        const obj = this.state.listaEspecialidade[indexObjSelecionado];
        if (indexObjSelecionado !== -1) {
            let especialidade = { ...this.state.especialidade };
            especialidade.id = obj.id;
            especialidade.descricao = obj.descricao;
            this.setState({ especialidade });
        }
    };

    voltarParaEscala = () => {
        this.props.voltar();
    };

    verificaRegistro = () => {
        this.setState({ formVazio: this.verificaPreenchimento() });

        if (!!this.state.formData) {
            if (
                this.state.formData.diaList.length !== 0 &&
                this.state.formData.horaInicio.length !== 0 &&
                this.state.formData.horaFim.length !== 0 &&
                this.state.formData.valor.length !== 0 &&
                this.state.formData.turno.length !== 0 &&
                this.state.formData.numeroVaga.length !== 0
            ) {
                if (this.state.formData.listaEspecialidadeSelecionado.length === 0) {
                    toast.error('O Plantão dever ter pelo menos uma Especialidade.');
                    return;
                }
                if (this.state.formData.listaSetorSelecionado.length === 0) {
                    console.log(this.state);
                    toast.error('O Plantão dever ter pelo menos um Setor.');
                    return;
                }
                this.enviaRegistro();
            } else {
                toast.error('Preencha os Campos Obrigatórios!');
            }
        }
    };

    enviaRegistro = () => {
        let plantoes = [];
        this.state.formData.diaList.map((dia, _) => {
            const valor = this.state.formData.valor;

            //transforma string para double
            let match = valor.match(/[0-9,.]*/);
            if (match !== null) {
                let amount = parseFloat(match[0].replace(/,/g, ''));

                let formData = { ...this.state.formData };
                formData.valor = amount;
                formData.dia = dia;
                formData.diaList = null;
                plantoes.push(formData);
            }
            return dia;
        });

        this.setState({ plantoes }, () => this.props.action(plantoes));

        // const valor = this.state.formData.valor;
        //
        // //transforma string para double
        // let match = valor.match(/[0-9,.]*/);
        // if (match !== null) {
        //     let amount = parseFloat(match[0].replace(/,/g, ''));
        //
        //     let formData = {...this.state.formData};
        //     formData.valor = amount;
        //     this.setState({formData}, () => (this.props.action(this.state.formData)));
        // }
        // invoca a função do componente pai (EscalaCadastro)
    };

    adicionaSetor = (e) => {
        e.preventDefault();
        if (!this.state.setor.id) {
            toast.warn("Selecione um setor no campo Setor, ou click no botão '+' para cadastrar um novo.");
            return;
        }
        let formData = { ...this.state.formData };
        const indexObjSelecionado = this.state.formData.listaSetorSelecionado.findIndex((obj) => obj.id === this.state.setor.id);
        if (indexObjSelecionado === -1) {
            formData.listaSetorSelecionado = [...formData.listaSetorSelecionado, this.state.setor];
            this.setState({ formData });
        } else {
            toast.error('Setor já adicionado!');
        }
    };

    adicionaEspecialidade = (e) => {
        e.preventDefault();
        if (!this.state.especialidade.id) {
            toast.warn("Selecione uma especialidade no campo Especialidades, ou click no botão '+' para cadastrar uma nova.");
            return;
        }

        let formData = { ...this.state.formData };
        const indexObjSelecionado = this.state.formData.listaEspecialidadeSelecionado.findIndex((obj) => obj.id === this.state.especialidade.id);
        if (indexObjSelecionado === -1) {
            formData.listaEspecialidadeSelecionado = [...formData.listaEspecialidadeSelecionado, this.state.especialidade];
            this.setState({ formData });
        } else {
            toast.error('Especialidade já adicionada!');
        }
    };

    carregarCombos = async () => {
        // await this.handleGetWorkplaceItems(obj.contrato.id);
        if (this.props.workplace != null) {
            await this.handleGetWorkplaceItems(this.props.workplace.id);
        }
        await EscalaService.listarComboEspecialidade().subscribe(
            (data) => {
                if (!!data) {
                    this.setState({ listaEspecialidade: data });
                }
            },
            (error) => console.error(error)
        );
        await EscalaService.listarComboSetor().subscribe(
            (data) => {
                if (data) {
                    this.setState({ listaSetor: data });
                }
            },
            (error) => console.error(error)
        );
    };

    removerEspecialidade = (index) => {
        let formData = { ...this.state.formData };
        formData.listaEspecialidadeSelecionado.splice(index, 1);
        this.setState({ formData });
    };

    removerSetor = (index) => {
        let formData = { ...this.state.formData };
        formData.listaSetorSelecionado.splice(index, 1);
        this.setState({ formData });
    };

    handleSetorModalDescricaoChange = (e) => {
        let formSetorModal = { ...this.state.formSetorModal };
        formSetorModal.descricao = e.target.value;
        this.setState({ formSetorModal });
    };

    handleEspecialidadeModalDescricaoChange = (e) => {
        let formEspecialidadeModal = { ...this.state.formEspecialidadeModal };
        formEspecialidadeModal.descricao = e.target.value;
        this.setState({ formEspecialidadeModal });
    };

    handleSubmitModalSetor = async (e) => {
        e.preventDefault();
        let formSetorModal = { ...this.state.formSetorModal };
        if (!formSetorModal.descricao || !formSetorModal.descricao.length) {
            toast.info('Informe a descrição do Setor.');
            return;
        }

        // let formModal = {...this.state.formModal};
        let servico = formSetorModal.descricao.toUpperCase();
        formSetorModal.descricao = servico;
        this.setState({ formSetorModal });

        this.setState({ formSetorModal: { descricao: servico } });

        await EscalaService.salvarSetor(formSetorModal).subscribe(
            (data) => {
                if (!!data) {
                    if (data.error) {
                        toast.error(data.mensagem);
                    } else {
                        toast.success('Setor salvo com sucesso.');
                        this.setState({
                            listaSetor: [...this.state.listaSetor, data.objeto]
                        });
                        let formData = { ...this.state.formData };
                        formData.listaSetorSelecionado = [...formData.listaSetorSelecionado, data.objeto];
                        this.setState({ formData });
                        this.toggleModal('setorModal');
                    }
                }
            },
            (error) => {
                console.error(error);
                toast.error('Ocorreu um erro, tente novamente.');
            }
        );
    };

    handleWorkPlaceChange = (e) => {
        let formData = { ...this.state.formData };

        formData.workplaceItem.id = e.target.value;
        this.setState({ formData });
    };

    handleSubmitModalEspecialidade = async (e) => {
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
            (data) => {
                if (!!data) {
                    if (data.error) {
                        toast.error(data.mensagem);
                    } else {
                        toast.success('Especialidade salva com sucesso.');
                        this.setState({
                            listaEspecialidade: [...this.state.listaEspecialidade, data.objeto]
                        });
                        let formData = { ...this.state.formData };
                        formData.listaEspecialidadeSelecionado = [...formData.listaEspecialidadeSelecionado, data.objeto];
                        this.setState({ formData });

                        this.toggleModal('especialidadeModal');
                    }
                }
            },
            (error) => {
                console.error(error);
                toast.error('Ocorreu um erro, tente novamente.');
            }
        );
    };

    verificaPreenchimento = () => {
        let formVazio = { ...this.state.formVazios };
        formVazio.dia = this.state.formData.diaList.length === 0;
        formVazio.turno = this.state.formData.turno.length === 0;
        formVazio.horaInicio = this.state.formData.horaInicio.length === 0;
        formVazio.horaFim = this.state.formData.horaFim.length === 0;
        formVazio.valor = !this.state.formData.valor.length > 0;
        formVazio.numeroVaga = !this.state.formData.numeroVaga.length > 0;
        return formVazio;
    };

    renderTags = () => {
        return (
            <div
                style={{
                    flex: 1,
                    alignItems: 'stretch'
                }}>
                {this.state.formData.diaList.map((tag) => this.renderTag(tag))}
            </div>
        );
    };

    handleDeleteTag = (tag) => {
        let list = this.state.formData.diaList.slice(0);
        let index = list.indexOf(tag);
        list.splice(index, 1);

        let formData = { ...this.state.formData };
        formData.diaList = list;
        this.setState({ formData });
    };

    renderTag = (tag) => {
        return (
            <Row style={{ flex: 1 }}>
                <Col>
                    <span style={{ backgroundColor: '#fff', marginLeft: 5 }}>{tag}</span>
                </Col>
                <Col>
                    <span
                        className='fa fa-trash'
                        onClick={() => {
                            this.handleDeleteTag(tag);
                        }}
                    />
                </Col>
            </Row>
        );
    };

    render() {
        return (
            <>
                {/* Page content */}
                <div id='plantao-cadastro'>
                    {/* Modal Setor */}
                    <Modal className='modal-dialog-centered' isOpen={this.state.setorModal} toggle={() => this.toggleModal('setorModal')}>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='setorModalLabel'>
                                Cadastrar Novo Setor
                            </h5>
                            <button aria-label='Close' className='close' data-dismiss='modal' type='button' onClick={() => this.toggleModal('setorModal')}>
                                <span aria-hidden={true}>×</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <Form>
                                <Row className='w'>
                                    {/*  */}
                                    <Col md='12'>
                                        <FormGroup>
                                            <Input id='descricao' placeholder='Descrição' value={this.state.formSetorModal.descricao} onChange={this.handleSetorModalDescricaoChange} autoComplete='off' />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className='modal-footer'>
                            <Button color='secondary' data-dismiss='modal' type='button' onClick={() => this.toggleModal('setorModal')}>
                                Cancelar
                            </Button>
                            <Button color='primary' type='button' onClick={this.handleSubmitModalSetor}>
                                Salvar
                            </Button>
                        </div>
                    </Modal>

                    {/* Modal Especialidade */}
                    <Modal className='modal-dialog-centered' isOpen={this.state.especialidadeModal} toggle={() => this.toggleModal('especialidadeModal')}>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='especialidadeModalModalLabel'>
                                Cadastrar Nova Especialidade
                            </h5>
                            <button aria-label='Close' className='close' data-dismiss='modal' type='button' onClick={() => this.toggleModal('especialidadeModal')}>
                                <span aria-hidden={true}>×</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <Form>
                                <Row className='w'>
                                    {/*  */}
                                    <Col md='12'>
                                        <FormGroup>
                                            <Input id='descricao' placeholder='Descrição' value={this.state.formEspecialidadeModal.descricao} onChange={this.handleEspecialidadeModalDescricaoChange} autoComplete='off' />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className='modal-footer'>
                            <Button color='secondary' data-dismiss='modal' type='button' onClick={() => this.toggleModal('especialidadeModal')}>
                                Cancelar
                            </Button>
                            <Button color='primary' type='button' onClick={this.handleSubmitModalEspecialidade}>
                                Salvar
                            </Button>
                        </div>
                    </Modal>

                    <Card className='pt-lg-1'>
                        <CardHeader className='bg-transparent pb-5'>
                            <div className='text-muted text-center mt-2 mb-4'>
                                <h1 className='card-title'>Novo Plantão</h1>
                            </div>
                        </CardHeader>
                        <CardBody className='px-lg-5 py-lg-5'>
                            {/* Formulário de cadastro */}
                            <Form onSubmit={this.handleSubmit} autoComplete='off'>
                                <Row className='w'>
                                    <Col md='2'>
                                        {!this.state.formVazio.horaInicio ? (
                                            <FormGroup>
                                                <h2 className='card-title text-center'>Hora Início</h2>
                                                <DatePicker
                                                    className='date-custom'
                                                    type='select'
                                                    name='select'
                                                    id='horaInicioSelect'
                                                    selected={this.state.formData.horaInicio}
                                                    onChange={this.handleHoraInicioChange}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={30}
                                                    dateFormat='HH:mm'
                                                    timeFormat='HH:mm'
                                                    timeCaption='Hora'
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup>
                                                <h2 className='card-title text-center'>Hora Início</h2>
                                                <DatePicker
                                                    className='date-custom campo-invalido'
                                                    type='select'
                                                    name='select'
                                                    id='horaInicioSelect'
                                                    selected={this.state.formData.horaInicio}
                                                    onChange={this.handleHoraInicioChange}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={30}
                                                    dateFormat='HH:mm'
                                                    timeFormat='HH:mm'
                                                    timeCaption='Hora'
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>
                                    <Col md='2'>
                                        {!this.state.formVazio.horaFim ? (
                                            <FormGroup>
                                                <h2 className='card-title text-center'>Hora Fim</h2>
                                                <DatePicker
                                                    className='date-custom'
                                                    type='select'
                                                    name='select'
                                                    id='horaFimSelect'
                                                    selected={this.state.formData.horaFim}
                                                    onChange={this.handleHoraFimChange}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={30}
                                                    dateFormat='HH:mm'
                                                    timeFormat='HH:mm'
                                                    timeCaption='Hora'
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup>
                                                <h2 className='card-title text-center'>Hora Fim</h2>
                                                <DatePicker
                                                    className='date-custom campo-invalido'
                                                    type='select'
                                                    name='select'
                                                    id='horaFimSelect'
                                                    selected={this.state.formData.horaFim}
                                                    onChange={this.handleHoraFimChange}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={30}
                                                    dateFormat='HH:mm'
                                                    timeFormat='HH:mm'
                                                    timeCaption='Hora'
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>
                                    <Col md='2'>
                                        {!this.state.formVazio.numeroVaga ? (
                                            <FormGroup>
                                                <h2 className='card-title text-center'>Nrº de Vagas</h2>
                                                <Input type='number' id='valor' placeholder='Vagas' value={this.state.formData.numeroVaga} onChange={this.handleNumeroVagaChange} />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup>
                                                <h2 className='card-title text-center'>Nrº de Vagas</h2>
                                                <Input type='number' id='valor' className='campo-invalido' placeholder='Vagas' value={this.state.formData.numeroVaga} onChange={this.handleNumeroVagaChange} />
                                            </FormGroup>
                                        )}
                                    </Col>
                                    <Col md='2'>
                                        {!this.state.formVazio.valor ? (
                                            <FormGroup>
                                                <h2 className='card-title text-center'>Valor</h2>

                                                <CurrencyInput className='input-custom' placeholder='Valor' value={this.state.formData.valor} onChange={this.handleValorChange} />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup>
                                                <h2 className='card-title text-center'>Valor</h2>
                                                <CurrencyInput placeholder='Valor' className='input-custom campo-invalido ' value={this.state.formData.valor} onChange={this.handleValorChange} />
                                            </FormGroup>
                                        )}
                                    </Col>
                                    <Col md='2'>
                                        {!this.state.formVazio.dia ? (
                                            <FormGroup>
                                                <h2 className='card-title text-center'>Dia</h2>
                                                <Input type='select' name='select' id='diaSelect' onChange={this.handleDiaChange} value={this.state.dia}>
                                                    <option value=''>Dia</option>
                                                    <option value='segunda'>Segunda</option>
                                                    <option value='terça'>Terça</option>
                                                    <option value='quarta'>Quarta</option>
                                                    <option value='quinta'>Quinta</option>
                                                    <option value='sexta'>Sexta</option>
                                                    <option value='sabado'>Sabado</option>
                                                    <option value='domingo'>Domingo</option>
                                                </Input>
                                            </FormGroup>
                                        ) : (
                                            <FormGroup>
                                                <h2 className='card-title text-center'>Dia</h2>
                                                <Input className='campo-invalido' type='select' name='select' id='diaSelect' onChange={this.handleDiaChange} value={this.state.dia}>
                                                    <option value=''>Dia</option>
                                                    <option value='segunda'>Segunda</option>
                                                    <option value='terça'>Terça</option>
                                                    <option value='quarta'>Quarta</option>
                                                    <option value='quinta'>Quinta</option>
                                                    <option value='sexta'>Sexta</option>
                                                    <option value='sabado'>Sábado</option>
                                                    <option value='domingo'>Domingo</option>
                                                </Input>
                                            </FormGroup>
                                        )}
                                        {this.renderTags()}
                                    </Col>
                                    <Col md='4'>
                                        {!this.state.formVazio.turno ? (
                                            <FormGroup>
                                                <h2 className='card-title text-center'>Turno</h2>
                                                <Input type='select' name='select' id='turnoSelect' onChange={this.handleTurnoChange} value={this.state.turno}>
                                                    <option value=''>Turno</option>
                                                    <option value='manhã'>Manhã</option>
                                                    <option value='tarde'>Tarde</option>
                                                    <option value='cinderela'>Cinderela</option>
                                                    <option value='noite'>Noite</option>
                                                </Input>
                                            </FormGroup>
                                        ) : (
                                            <FormGroup>
                                                <h2 className='card-title text-center'>Turno</h2>
                                                <Input className='campo-invalido' type='select' name='select' id='turnoSelect' onChange={this.handleTurnoChange} value={this.state.turno}>
                                                    <option value=''>Turno</option>
                                                    <option value='manhã'>Manhã</option>
                                                    <option value='tarde'>Tarde</option>
                                                    <option value='cinderela'>Cinderela</option>
                                                    <option value='noite'>Noite</option>
                                                </Input>
                                            </FormGroup>
                                        )}
                                    </Col>
                                    <Col md='4'>
                                        <h2 className='card-title text-center'>Item</h2>
                                        {!this.state.formVazio.workplaceItem ? (
                                            <FormGroup>
                                                <Input type='select' name='select' id='workplaceSelect' onChange={this.handleWorkPlaceChange} value={this.state.formData.workplaceItem?.id} required>
                                                    <option name='default' value='default'>
                                                        Selecionar Item
                                                        </option>
                                                    {this.state.listaWorkplaceItems.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.id}>
                                                                {item.item + " - " + item.object}
                                                            </option>
                                                        );
                                                    })}
                                                </Input>
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <Input type='select' name='select' id='workPlaceSelect' onChange={this.handleWorkPlaceChange} value={this.state.formData.workplaceItem?.id} required>
                                                    <option name='default' value='default'>
                                                        Selecionar Item
                                                        </option>
                                                    {this.state.listaWorkplaceItems.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.id}>
                                                                {item.item + " - " + item.object}
                                                            </option>
                                                        );
                                                    })}
                                                </Input>
                                            </FormGroup>
                                        )}
                                    </Col>

                                    {/*lista de especialidade*/}
                                    <Container className=' mt-5' fluid id='contrato-lista'>
                                        {/*lista de especialidades*/}
                                        <Card>
                                            <Row className='m-0'>
                                                <Col md='4' className='text-muted text-center mt-2 mb-4'>
                                                    <h1 className='card-title'>Especialidades</h1>
                                                </Col>
                                                {/*combo de especialidades*/}
                                                <Col md='4' className='m-t-10'>
                                                    <FormGroup>
                                                        <Input type='select' name='select' id='setorSelect' onChange={this.handleEspecialidadeChange} value={this.state.especialidade.id}>
                                                            <option name='default' value='default'>
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
                                                <Col md='2' className='m-t-17'>
                                                    <Button className='btn-primary btn-primary-mobile' onClick={this.adicionaEspecialidade}>
                                                        Adicionar
                                                    </Button>
                                                </Col>
                                                <Col md='2' className='m-t-12'>
                                                    <FormGroup>
                                                        <Button className='btn-primary-mobile' color='secondary' outline type='button' onClick={() => this.toggleModal('especialidadeModal')}>
                                                            <i className='fa fa-plus-circle fa-lg' />
                                                        </Button>
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            {/*tabela especialidade*/}
                                            <Table>
                                                <thead className='thead-light'>
                                                    <tr>
                                                        <th scope='col'>Descrição</th>
                                                        <th scope='col'>Opções</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {this.state.formData.listaEspecialidadeSelecionado.map((item, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>{item.descricao}</td>
                                                                <td key={item.id}>
                                                                    <Row>
                                                                        <Col md='2'>
                                                                            <span onClick={() => this.removerEspecialidade(i)} className='fa fa-trash' />
                                                                        </Col>
                                                                    </Row>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </Table>
                                        </Card>
                                    </Container>

                                    {/*lista de Setores*/}
                                    <Container className=' mt-5' fluid id='contrato-lista'>
                                        <Card>
                                            <Row className='m-0'>
                                                <Col md='4' className='text-muted text-center mt-2 mb-4'>
                                                    <h1 className='card-title'>Setor</h1>
                                                </Col>
                                                <Col md='4' className='m-t-10'>
                                                    <FormGroup>
                                                        <Input type='select' name='select' id='setorSelect' onChange={this.handleSetorChange} value={this.state.setor.id}>
                                                            <option name='default' value='default'>
                                                                Selecione Setor
                                                            </option>
                                                            {this.state.listaSetor.map((item, i) => {
                                                                return (
                                                                    <option key={i} value={item.id}>
                                                                        {item.descricao}
                                                                    </option>
                                                                );
                                                            })}
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='2' className='m-t-17'>
                                                    <Button className='btn-primary btn-primary-mobile' onClick={this.adicionaSetor}>
                                                        Adicionar
                                                    </Button>
                                                </Col>
                                                <Col md='2' className='m-t-12'>
                                                    <FormGroup>
                                                        <Button className='btn-primary-mobile' color='secondary' outline type='button' onClick={() => this.toggleModal('setorModal')}>
                                                            <i className='fa fa-plus-circle fa-lg' />
                                                        </Button>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Table>
                                                <thead className='thead-light'>
                                                    <tr>
                                                        <th scope='col'>Descrição</th>
                                                        <th scope='col'>Opções</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {this.state.formData.listaSetorSelecionado.map((item, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>{item.descricao}</td>
                                                                <td key={item.id}>
                                                                    <Row>
                                                                        <Col md='2'>
                                                                            <span onClick={() => this.removerSetor(i)} className='fa fa-trash' />
                                                                        </Col>
                                                                    </Row>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </Table>
                                        </Card>
                                    </Container>
                                </Row>
                                {/*Botões de ação*/}
                                <Row className='p-t-40'>
                                    <Col md={{ size: '2', offset: '8' }} xs={{ size: '6' }}>
                                        <Button className='btn-primary btn-primary-mobile' onClick={this.voltarParaEscala}>
                                            Cancelar
                                        </Button>
                                    </Col>
                                    <Col md='2' xs={{ size: '6' }}>
                                        <Button className='btn-primary btn-primary-mobile' type='submit'>
                                            Salvar
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </div>
            </>
        );
    }
}

export default PlantaoCadastro;
