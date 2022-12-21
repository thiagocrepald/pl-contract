import RcIf, { RcElse } from 'rc-if';
import { default as React } from 'react';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Row } from 'reactstrap';
import Label from 'reactstrap/es/Label';
import ContratanteService from '../../services/contratante.service';
import { MSG_CNPJ_INVALIDO } from '../../util/Constantes';
import { capitalizaString, validarCNPJ } from '../../util/Util';
import './Contratante.cadastro.scss';

const cidadeEstado = require('../../util/estados_cidades');

class ContratanteCadastro extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            nomeContratante: '',
            cidade: '',
            uf: '',
            cnpj: '',
            // Campos p/ validação
            formVazios: {
                nome: false,
                cidade: false,
                uf: false,
                cnpj: false
            },
            formErro: {
                cnpj: ''
            },
            cnpjValido: false,
            formValido: false,
            cnpjSaveValido: true,
            listaCidadeEstado: cidadeEstado,
            ufSelecionado: false,
            listaCidade: []
        };
    }

    componentDidMount = async () => {
        const {
            match: { params }
        } = this.props;

        if (!!params && !!params.userId) {
            let contratanteVo = { id: params.userId };

            await ContratanteService.getById(contratanteVo).subscribe(
                (data) => {
                    if (!!data && !data.erro) {
                        contratanteVo = data.objeto;
                        let cidadeCapt = 'default';
                        if (!!contratanteVo.cidade) {
                            cidadeCapt = capitalizaString(contratanteVo.cidade);
                        }
                        this.carregaComboCidade(contratanteVo.uf);
                        this.setState({
                            id: contratanteVo.id,
                            nomeContratante: contratanteVo.nomeContratante,
                            cidade: cidadeCapt,
                            uf: contratanteVo.uf,
                            cnpj: contratanteVo.cnpj,
                            ufSelecionado: true
                        });
                    }
                },
                (error) => console.error(error)
            );
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        this.setState({ formVazios: this.verificaPreenchimento(this.state) });

        let cnpjSaveValido = this.validaCampo('cnpj', this.state.cnpj);

        this.setState({ cnpjSaveValido: cnpjSaveValido });

        if (this.state != null) {
            if (this.state.nomeContratante.length !== 0 && this.state.cidade.length !== 0 && this.state.uf.length !== 0 && this.state.cnpj.length !== 0 && cnpjSaveValido) {
                this.salvaRegistro(this.state);
            } else {
                if (this.state.cnpj.length !== 0 && !cnpjSaveValido) {
                    toast.error('CNPJ inválido!');
                }
                if (this.state.nomeContratante.length === 0 || this.state.cidade.length === 0 || this.state.uf.length === 0 || this.state.cnpj.length === 0) {
                    toast.error('Preencha os Campos Obrigatórios!');
                }
            }
        } else {
            toast.error('Preencha os Campos do Formulário!');
        }
    };

    handleCidadeChange = (e) => {
        this.setState({ cidade: e.target.value });
    };

    handleNomeContratanteChange = (e) => {
        this.setState({ nomeContratante: e.target.value });
    };

    handleUfChange = (e) => {
        let ufSelecionado;
        this.carregaComboCidade(e.target.value);
        ufSelecionado = e.target.value !== 'default';
        this.setState({
            uf: e.target.value,
            ufSelecionado: ufSelecionado
        });
    };

    handleCnpjChange = (e) => {
        this.setState({ cnpj: e.target.value });
    };

    carregaComboCidade(siglaEstado) {
        const listaCidadeEstado = [...this.state.listaCidadeEstado];
        const index = listaCidadeEstado.findIndex((o) => o.sigla === siglaEstado);
        let listaCidadeUfSelecionado;
        listaCidadeUfSelecionado = siglaEstado !== 'default' ? [...this.state.listaCidadeEstado[index].cidades] : [];
        this.setState({ listaCidade: listaCidadeUfSelecionado });
    }

    salvaRegistro = (item) => {
        if (!!item && !!item.cnpj) {
            if (!validarCNPJ(item.cnpj)) {
                toast.warn(MSG_CNPJ_INVALIDO);
                return;
            }
        }
        item.nomeContratante = item.nomeContratante.toUpperCase();
        item.cidade = item.cidade.toUpperCase();
        item.uf = item.uf.toUpperCase();
        ContratanteService.salvar(item).subscribe(
            (data) => {
                if (!!data) {
                    if (data.erro) {
                        toast.error(data.mensagem);
                    } else {
                        toast.success(data.mensagem);
                        this.props.history.push('/admin/contratante');
                    }
                }
            },
            (error) => console.error(error)
        );
    };

    validaCampo(campo, valor) {
        let erroValidacao = this.state.formErro;
        let cnpjValido = this.state.cnpjValido;
        let valido;

        switch (campo) {
            case 'cnpj':
                /* eslint-disable no-useless-escape */
                cnpjValido = valor.match(/^([0-9]{2})\.([0-9]{3})\.([0-9]{3})\/([0-9]{4})\-([0-9]{2})$/);
                /* eslint-enable no-useless-escape */
                erroValidacao.cnpj = cnpjValido ? '' : ' incompleto';
                valido = !!cnpjValido;
                break;
            default:
                break;
        }
        this.setState(
            {
                formErro: erroValidacao,
                cnpjValido: cnpjValido
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
        if (state.nomeContratante.length === 0) {
            formVazio.nome = true;
        } else {
            formVazio.nome = false;
        }

        if (state.cidade.length === 0) {
            formVazio.cidade = true;
        } else {
            formVazio.cidade = false;
        }

        if (state.uf.length === 0) {
            formVazio.uf = true;
        } else {
            formVazio.uf = false;
        }

        if (state.cnpj.length === 0) {
            formVazio.cnpj = true;
        } else {
            formVazio.cnpj = false;
        }

        return formVazio;
    }

    render() {
        return (
            <>
                {/* Page content */}
                <div id='contratante-cadastro'>
                    <Card className='pt-lg-1 b-r-1 w-95'>
                        <CardHeader className='bg-transparent pb-5'>
                            <div className='text-muted text-center mt-2 mb-4'>
                                <h1 className='card-title'>{this.state.nomeContratante ? 'Contratante: ' + this.state.nomeContratante : 'Novo Contratante'}</h1>
                            </div>
                        </CardHeader>
                        <CardBody className='px-lg-5 py-lg-5'>
                            {/* Formulário de cadastro */}
                            <Form onSubmit={this.handleSubmit} autoComplete='off'>
                                <Row className='w'>
                                    {/*Nome Contratante*/}
                                    <Col md='12'>
                                        <Label>
                                            <h2 className='card-title text-center'>Nome do contratante</h2>
                                        </Label>
                                        {!this.state.formVazios.nome ? (
                                            <FormGroup>
                                                <Input id='nomeContratante' placeholder='Nome do contratante' value={this.state.nomeContratante} onChange={this.handleNomeContratanteChange} maxlenght='50' autocomplete='off' />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <Input id='nomeContratante' placeholder='Nome do Contratante' value={this.state.nomeContratante} onChange={this.handleNomeContratanteChange} />
                                            </FormGroup>
                                        )}
                                    </Col>
                                    {/*UF*/}
                                    <Col md='4'>
                                        <Label>
                                            <h2 className='card-title text-center'>Estado</h2>
                                        </Label>
                                        {/*{!this.state.formVazios.uf ?*/}
                                        <RcIf if={!this.state.formVazios.uf}>
                                            <FormGroup>
                                                <Input type='select' name='select' id='ufSelect' onChange={this.handleUfChange} value={this.state.uf}>
                                                    <option name='default' value='default'>
                                                        Selecionar UF
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
                                        </RcIf>
                                        {/*:*/}
                                        <RcIf if={this.state.formVazios.uf}>
                                            <FormGroup className='campo-invalido'>
                                                <Input type='select' name='select' id='ufSelect' onChange={this.handleUfChange} value={this.state.uf}>
                                                    <option name='default' value='default'>
                                                        Selecionar UF
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
                                        </RcIf>
                                        {/*}*/}
                                    </Col>
                                    {/*Cidade*/}
                                    <Col md='8'>
                                        <Label>
                                            <h2 className='card-title text-center'>Cidade</h2>
                                        </Label>
                                        <RcIf if={this.state.ufSelecionado}>
                                            {!this.state.formVazios.cidade ? (
                                                <FormGroup>
                                                    <Input type='select' name='select' id='cidadeSelect' onChange={this.handleCidadeChange} value={this.state.cidade}>
                                                        <option name='default' value='default'>
                                                            Selecionar cidade
                                                        </option>
                                                        {this.state.listaCidade.map((item, i) => {
                                                            return (
                                                                <option key={i} value={item}>
                                                                    {item}
                                                                </option>
                                                            );
                                                        })}
                                                    </Input>
                                                </FormGroup>
                                            ) : (
                                                <FormGroup className='campo-invalido'>
                                                    <Input type='select' name='select' id='cidadeSelect' onChange={this.handleCidadeChange} value={this.state.cidade}>
                                                        <option name='default' value='default'>
                                                            Selecionar cidade
                                                        </option>
                                                        {this.state.listaCidade.map((item, i) => {
                                                            return (
                                                                <option key={i} value={item}>
                                                                    {item}
                                                                </option>
                                                            );
                                                        })}
                                                    </Input>
                                                </FormGroup>
                                            )}
                                            <RcElse>
                                                <Input id='cidadeSelect' placeholder='Selecione a UF' disabled={true} />
                                            </RcElse>
                                        </RcIf>
                                    </Col>
                                    {/*CNPJ*/}
                                    <Col md='12'>
                                        <Label>
                                            <h2 className='card-title text-center'>CNPJ</h2>
                                        </Label>
                                        {!this.state.formVazios.cnpj ? (
                                            <FormGroup>
                                                <InputMask id='cnpj' className='cnpj form-control' mask='99.999.999/9999-99' placeholder='CNPJ' value={this.state.cnpj} onChange={this.handleCnpjChange} />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <InputMask id='cnpj' className='cnpj form-control' mask='99.999.999/9999-99' maskChar={null} placeholder='CNPJ' value={this.state.cnpj} onChange={this.handleCnpjChange} />
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>
                                {/*Botões de ação*/}
                                <Row>
                                    <Col md='6'></Col>
                                    <Col md='3'>
                                        <Link className='btn-primary' to='/admin/contratante'>
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

export default ContratanteCadastro;
