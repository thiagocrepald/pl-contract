import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
// reactstrap components
import { Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Row } from 'reactstrap';
import Label from 'reactstrap/es/Label';
import TipoConfiguracaoService from '../../services/tipo.configuracao.service';
import UsuarioService from '../../services/usuario.service';
import './Usuario.cadastro.scss';

class UsuarioCadastro extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            nome: '',
            login: '',
            senha: '',
            senhaEditarEscala: '',
            telefone: '',
            listaTipoPermissao: [],
            listaTipoPermissaoDB: [], //permissoes de acesso
            listaUsuarioTipoPermissao: [],
            listaConfiguracao: [],
            listaTipoConfiguracao: [],
            listaTipoConfiguracaoBD: [], //permissao de notificacao

            // Campos p/ validação
            formErro: {
                login: ''
            },
            formVazios: {
                login: false,
                senha: false,
                nome: false,
                telefone: false
            },
            loginValido: false,
            formValido: false,
            emailValido: true,
            editando: false,
            senhaEditarEscalaHabilitado: false
        };
    }

    componentDidMount = async () => {
        this.carregarCombos();

        await UsuarioService.listarTipoPermissao().subscribe(
            data => {
                if (!!data) {
                    this.setState({ listaTipoPermissaoDB: data });
                    console.log(this.state.listaTipoPermissaoDB);
                }
            },
            error => console.error(error)
        );

        const {
            match: { params }
        } = this.props;
        if (!!params && !!params.userId) {
            let usuarioVo = { id: params.userId };
            this.setState({ editando: true });
            await UsuarioService.getById(usuarioVo).subscribe(
                data => {
                    if (!!data && !data.erro) {
                        usuarioVo = data.objeto;
                        this.setState({
                            id: usuarioVo.id,
                            nome: usuarioVo.nome,
                            login: usuarioVo.login,
                            telefone: usuarioVo.telefone,
                            listaUsuarioTipoPermissao: usuarioVo.listaUsuarioTipoPermissao ? usuarioVo.listaUsuarioTipoPermissao : [],
                            listaConfiguracao: usuarioVo.listaConfiguracao ? usuarioVo.listaConfiguracao : []
                        });

                        this.handleCheckBoxValue();
                        this.handleCheckBoxValueConfig();

                        this.setState({
                            senhaEditarEscalaHabilitado: this.checkPermissaoExcluirEscala()
                        });
                    }
                },
                error => console.error(error)
            );
        }
    };

    carregarCombos = async () =>
        await TipoConfiguracaoService.listarComboTipoConfiguracao().subscribe(
            data => {
                if (!!data) {
                    this.setState({ listaTipoConfiguracaoBD: data });
                }
            },
            error => console.error(error)
        );

    handleSubmit = async e => {
        e.preventDefault();

        this.setState({ formVazios: this.verificaPreenchimento(this.state) });

        let emailValido = this.validaCampo('login', this.state.login);

        this.setState({ emailValido: emailValido });

        if (this.state != null) {
            if (
                this.state.nome.length !== 0 &&
                this.state.telefone.length !== 0 &&
                this.state.login.length !== 0 &&
                (this.state.senha.length !== 0 || this.state.editando) &&
                emailValido
            ) {
                this.salvaRegistro(this.state);
            } else {
                if (this.state.login.length !== 0 && !emailValido) {
                    toast.error('Email inválido!');
                }
                if (
                    this.state.nome.length === 0 ||
                    this.state.telefone.length === 0 ||
                    (this.state.senha.length === 0 && !this.state.editando) ||
                    this.state.login.length === 0
                ) {
                    toast.error('Preencha os Campos Obrigatórios!');
                }
            }
        } else {
            toast.error('Preencha os Campos do Formuláio!');
        }
    };

    handleLoginChange = e => {
        this.setState({ login: e.target.value });
    };

    handleNomeChange = e => {
        this.setState({ nome: e.target.value });
    };

    handleTelefoneChange = e => {
        this.setState({ telefone: this.setMascara(e.target.value) });
    };

    handleSenhaChange = e => {
        this.setState({ senha: e.target.value });
    };

    handleSenhaEscalaChange = e => {
        this.setState({ senhaEditarEscala: e.target.value });
    };

    handleClickPermissoes = (item, e) => {
        if (!!this.state.listaUsuarioTipoPermissao && this.state.listaUsuarioTipoPermissao.length) {
            let index = this.state.listaUsuarioTipoPermissao.findIndex(x => x.id === item.id);
            if (index !== -1) {
                this.state.listaUsuarioTipoPermissao.splice(index, 1);
            } else {
                this.state.listaUsuarioTipoPermissao.push(item);
            }
        } else {
            this.state.listaUsuarioTipoPermissao.push(item);
        }
        this.handleCheckBoxValue();
    };

    handleCheckBoxValue = () => {
        if (!!this.state.listaUsuarioTipoPermissao && this.state.listaUsuarioTipoPermissao.length) {
            let listaTipoPermissaoDB = [...this.state.listaTipoPermissaoDB];
            let listaUsuarioTipoPermissao = [...this.state.listaUsuarioTipoPermissao];
            for (let i = 0; i < listaTipoPermissaoDB.length; i++) {
                let permissao = listaTipoPermissaoDB[i];
                let index = listaUsuarioTipoPermissao.findIndex(o => o.tipoPermissao.id === permissao.id);
                listaTipoPermissaoDB[i].checked = index !== -1;
            }
            this.setState({ listaTipoPermissaoDB });
            this.setState({ listaUsuarioTipoPermissao });
        }
        console.log(this.state);
    };

    checkPermissaoExcluirEscala = () => {
        if (!!this.state.listaTipoPermissaoDB) {
            let found = this.state.listaTipoPermissaoDB.filter(it => it.id === 2);

            return found.length === 1 && found[0].checked;
        }
        return false;
    };

    salvaRegistro = item => {
        /* eslint-disable react/no-direct-mutation-state */
        this.state.listaTipoPermissao = this.state.listaTipoPermissaoDB;
        this.state.listaTipoConfiguracao = this.state.listaTipoConfiguracaoBD;
        /* eslint-enable react/no-direct-mutation-state */

        item.nome = item.nome.toUpperCase();

        UsuarioService.salvar(item).subscribe(
            data => {
                if (!!data) {
                    if (data.erro) {
                        toast.error(data.mensagem);
                    } else {
                        if (this.state.senhaEditarEscala !== '') {
                            UsuarioService.salvarSenhaExclusaoEscala(data.objeto, this.state.senhaEditarEscala).subscribe(
                                dataSenha => {
                                    toast.success(data.mensagem);
                                    this.props.history.push('/admin/usuario');
                                },
                                error => console.error(error)
                            );
                        } else {
                            toast.success(data.mensagem);
                            this.props.history.push('/admin/usuario');
                        }
                    }
                }
            },
            error => console.error(error)
        );
    };

    onClickCheck = (e, i) => {
        let listaTipoPermissaoDB = [...this.state.listaTipoPermissaoDB];
        listaTipoPermissaoDB[i].checked = !listaTipoPermissaoDB[i].checked;
        this.setState(listaTipoPermissaoDB);

        this.setState({
            senhaEditarEscalaHabilitado: this.checkPermissaoExcluirEscala()
        });
    };

    validaCampo(campo, valor) {
        let erroValidacao = this.state.formErro;
        let loginValido = this.state.loginValido;
        let valido;

        switch (campo) {
            case 'login':
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

    verificaPreenchimento(state) {
        let formVazio = { ...this.state.formVazios };
        if (state.nome.length === 0) {
            formVazio.nome = true;
        } else {
            formVazio.nome = false;
        }

        if (state.login.length === 0) {
            formVazio.login = true;
        } else {
            formVazio.login = false;
        }

        if (state.senha.length === 0) {
            formVazio.senha = true;
        } else {
            formVazio.senha = false;
        }

        if (state.telefone.length === 0) {
            formVazio.telefone = true;
        } else {
            formVazio.telefone = false;
        }
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

    onClickCheckConfig = (y, k) => {
        let listaTipoConfiguracaoBD = [...this.state.listaTipoConfiguracaoBD];
        listaTipoConfiguracaoBD[k].checked = !listaTipoConfiguracaoBD[k].checked;
        this.setState(listaTipoConfiguracaoBD);
    };

    handleCheckBoxValueConfig = () => {
        if (!!this.state.listaConfiguracao && this.state.listaConfiguracao.length) {
            let listaTipoConfiguracaoBD = [...this.state.listaTipoConfiguracaoBD];
            let listaConfiguracao = [...this.state.listaConfiguracao];
            for (let i = 0; i < listaTipoConfiguracaoBD.length; i++) {
                let configuracao = listaTipoConfiguracaoBD[i];
                let index = listaConfiguracao.findIndex(o => o.tipoConfiguracao.id === configuracao.id);
                listaTipoConfiguracaoBD[i].checked = index !== -1;
            }
            this.setState({ listaTipoConfiguracaoBD });
            this.setState({ listaConfiguracao });
        }
        console.log(this.state);
    };

    render() {
        return (
            <>
                {/* Page content */}
                <div id="usuario-cadastro">
                    <Card className="pt-lg-1 b-r-1 w-95">
                        <CardHeader className="bg-transparent pb-5">
                            <div className="text-muted text-center mt-2 mb-4">
                                <h1 className="card-title">{!!this.state.nome ? this.state.nome : 'Novo Usuário'}</h1>
                            </div>
                        </CardHeader>
                        <CardBody className="px-lg-5 py-lg-5">
                            {/* Formulário de cadastro */}
                            <Form onSubmit={this.handleSubmit}>
                                <Row>
                                    {/*Nome*/}
                                    <Col md='6'>
                                        <Label>
                                            <h2 className='card-title text-center'>Nome</h2>
                                        </Label>
                                        {!this.state.formVazios.nome ? (
                                            <FormGroup>
                                                <Input id='nome' placeholder='Nome' value={this.state.nome} onChange={this.handleNomeChange} maxlength='50' autocomplete='off' />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <Input id='nome' placeholder='Nome' value={this.state.nome} onChange={this.handleNomeChange} autocomplete='off' />
                                            </FormGroup>
                                        )}
                                    </Col>

                                    {/*Telefone*/}
                                    <Col md='6'>
                                        <Label>
                                            <h2 className='card-title text-center'>Telefone</h2>
                                        </Label>
                                        {!this.state.formVazios.telefone ? (
                                            <FormGroup>
                                                <Input id='telefone' placeholder='Telefone' value={this.state.telefone} onChange={this.handleTelefoneChange} maxlength='15' autocomplete='off' />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <Input id='telefone' placeholder='Telefone' value={this.state.telefone} onChange={this.handleTelefoneChange} maxlength='15' autocomplete='off' />
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>

                                <Row>
                                    {/*Email*/}
                                    <Col md='6'>
                                        <Label>
                                            <h2 className='card-title text-center'>E-mail</h2>
                                        </Label>
                                        {!this.state.formVazios.login && this.state.emailValido ? (
                                            <FormGroup>
                                                <Input id='login' placeholder='E-mail' value={this.state.login} onChange={this.handleLoginChange} maxlenght='15' autocomplete='off' />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <Input id='login' placeholder='E-mail' value={this.state.login} onChange={this.handleLoginChange} maxlenght='15' autocomplete='off' />
                                            </FormGroup>
                                        )}
                                    </Col>

                                    {/*Senha*/}
                                    <Col md='6'>
                                        <Label>
                                            <h2 className='card-title text-center'>Senha</h2>
                                        </Label>
                                        {!this.state.formVazios.senha || this.state.editando ? (
                                            <FormGroup>
                                                <Input id='senha' placeholder='Senha' value={this.state.senha} onChange={this.handleSenhaChange} maxlenght='15' autocomplete='off' />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <Input id='senha' placeholder='Senha' value={this.state.senha} onChange={this.handleSenhaChange} autocomplete='off' />
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md='6'>
                                        <Label>
                                            <h2 className='card-title text-center'>Senha deletar escalas</h2>
                                        </Label>
                                        {!this.state.formVazios.senha || this.state.editando ? (
                                            <FormGroup>
                                                <Input
                                                    id='senha_editar_escala'
                                                    placeholder='Senha deletar escalas'
                                                    value={this.state.senhaEditarEscala}
                                                    onChange={this.handleSenhaEscalaChange}
                                                    type='password'
                                                    maxlenght='15'
                                                    autocomplete='off'
                                                    disabled={!this.state.senhaEditarEscalaHabilitado}
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <Input id='senha_editar_escala' placeholder='Senha deletar escalas' value={this.state.senhaEditarEscala} type='password' onChange={this.handleSenhaEscalaChange} autocomplete='off' />
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>

                                <Row>
                                    {/* Permissões */}
                                    <Col md='6'>
                                        <Label>
                                            <h2 className='card-title text-center'>Permissões</h2>
                                        </Label>
                                        {this.state.listaTipoPermissaoDB
                                            //.filter((item) => item?.id !== 2)
                                            .map((item, i) => {
                                                // this.handleCheckBoxValue();
                                                return (
                                                    <div className='custom-control custom-checkbox col-md-6 ml-3 mb-3'>
                                                        <input className='custom-control-input' id={i} type='checkbox' checked={!!item.checked} onClick={(e) => this.onClickCheck(e, i)} />
                                                        <label className='custom-control-label' htmlFor={i}>
                                                            {item.descricao}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                    </Col>
                                    {/* Permissões notificacao */}
                                    <Col id='permissao-notificacao' md='6'>
                                        <Label>
                                            <h2 className='card-title text-center'>Configurações</h2>
                                        </Label>
                                        {this.state.listaTipoConfiguracaoBD.map((permissao, k) => {
                                            return (
                                                <div className='custom-control custom-checkbox col-md-6 ml-3 mb-3'>
                                                    <input className='custom-control-input' id={k + 20} type='checkbox' checked={!!permissao.checked} onClick={(y) => this.onClickCheckConfig(y, k)} />
                                                    <label className='custom-control-label' htmlFor={k + 20}>
                                                        {permissao.descricao}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </Col>
                                </Row>

                                {/*<Row id="permissao-acesso">*/}
                                {/* */}
                                {/*</Row>*/}

                                {/*Botões de ação*/}
                                <Row>
                                    <Col md='6'></Col>
                                    <Col md='3'>
                                        <Link className='btn-primary' to='/admin/usuario'>
                                            Cancelar
                                        </Link>
                                    </Col>
                                    <Col md='3'>
                                        <Button className='btn-primary' type='submit'>
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

export default UsuarioCadastro;
