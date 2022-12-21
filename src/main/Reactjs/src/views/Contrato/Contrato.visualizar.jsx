import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardBody, CardHeader, Col, Form, FormGroup, Row } from 'reactstrap';
import ContratoService from '../../services/contrato.service';
import './Contrato.visualizar.scss';

// @ts-ignore
const cidadeEstado = require('../../util/estados_cidades');

require('moment/locale/pt-br');

class ContratoVisualizar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                id: '',
                codigo: '',
                contratante: {},
                cidade: '',
                estado: '',
                local: '',
                tipoServico: {},
                dataVigencia: moment(),
                anexoContrato: '',
                nomeAnexo: '',
                tamanhoAnexo: '',
                tipoAnexo: '',
                contratada: '',
                observacao: '',
                attachment: null
            },
            formModal: {
                descricao: ''
            },
            listaContratante: [],
            listaTipoServico: [],
            exampleModal: false,
            loading: true,
            listaCidadeEstado: cidadeEstado
        };
    }

    setObjToState = (obj) => {
        let formData = { ...this.state.formData };
        const listaCidadeEstado = [...this.state.listaCidadeEstado];
        const uf = listaCidadeEstado.find((o) => o.sigla === obj.estado);
        const estado = uf.nome.toUpperCase();
        formData.id = obj.id;
        formData.codigo = obj.codigo;
        formData.contratante = obj.contratante;
        formData.cidade = obj.cidade;
        formData.estado = estado;
        formData.local = obj.local;
        formData.tipoServico = obj.tipoServico;
        formData.dataVigencia = moment(obj.dataVigencia);
        formData.anexoContrato = obj.anexoContrato;
        formData.nomeAnexo = obj.nomeAnexo;
        formData.tamanhoAnexo = obj.tamanhoAnexo;
        formData.tipoAnexo = obj.tipoAnexo;
        formData.contratada = obj.contratada;
        formData.observacao = obj.observacao;
        formData.attachment = obj.attachment;
        this.setState({ formData });
        console.log(this.state);
    };

    componentDidMount = async () => {
        const {
            match: { params }
        } = this.props;

        if (!!params && !!params.id) {
            let contrato = { id: params.id };

            await ContratoService.getById(contrato).subscribe(
                (data) => {
                    if (!!data) {
                        if (data.erro) {
                            toast.error(data.mensagem);
                            this.props.history.push('/admin/contrato/');
                        } else {
                            contrato = data.objeto;
                            this.setObjToState(contrato);
                            this.setState({ loading: false });
                        }
                    }
                },
                (error) => console.error(error)
            );
        }
    };

    render() {
        return (
            <>
                {/* Page content */}
                <div id='contrato-visualizar'>
                    <Card className='pt-lg-1 b-r-1 w-95'>
                        <CardHeader className='bg-transparent pb-5'>
                            <div className='text-muted text-center mt-2 mb-4'>
                                <h1 className='card-title'>Contrato: {this.state.formData.codigo}</h1>
                            </div>
                        </CardHeader>
                        <CardBody className='px-lg-5 py-lg-5'>
                            {this.state.loading ? (
                                <div className='text-center'>
                                    <ClipLoader sizeUnit={'px'} size={50} margin={'2px'} color={'#149d5b'} loading={this.state.loading} />
                                </div>
                            ) : null}
                            {/* Formulário de cadastro */}
                            <Form>
                                <Row className='w'>
                                    {/* Código */}
                                    <Col md='12'>
                                        <FormGroup>Código: {this.state.formData.codigo}</FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    {/* Contratante */}
                                    <Col md='12'>
                                        <FormGroup>Nome: {this.state.formData.contratante.nomeContratante}</FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    {/* Cidade */}
                                    <Col md='12'>
                                        <FormGroup>Cidade: {this.state.formData.cidade}</FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    {/* Estado */}
                                    <Col md='12'>
                                        <FormGroup>Estado: {this.state.formData.estado}</FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    {/* Local */}
                                    <Col md='12'>
                                        <FormGroup>Local: {this.state.formData.local}</FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    {/* Tipo Serviço */}
                                    <Col md='12'>
                                        <FormGroup>Tipo de Serviço: {this.state.formData.tipoServico.descricao}</FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    {/* Data de vigência*/}
                                    <Col md='12'>
                                        <FormGroup>Data de Vigência: {moment(this.state.formData.dataVigencia).format('DD/MM/YYYY')}</FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    {/* Contratada */}
                                    <Col md='12'>
                                        <FormGroup>Contratada: {this.state.formData.contratada}</FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    {/* Observações */}
                                    <Col md='12'>
                                        <FormGroup>Observações: {this.state.formData.observacao}</FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    {/*Anexo do contrato */}
                                    <Col md='12'>
                                        {!!this.state.formData.nomeAnexo && this.state.formData.nomeAnexo.length && this.state.formData.anexoContrato ? (
                                            <FormGroup>
                                                Anexo:
                                                <a
                                                    download={this.state.formData.nomeAnexo}
                                                    href={'data:' + this.state.formData.tipoAnexo + ';base64,' + this.state.formData.anexoContrato}>
                                                    {' '}
                                                    {this.state.formData.nomeAnexo}
                                                </a>
                                            </FormGroup>
                                        ) : null}
                                        {this.state.formData.attachment != null && this.state.formData.attachment.url != null ? (
                                            <FormGroup>
                                                Anexo:
                                                <a download={this.state.formData.attachment.fileName} href={this.state.formData.attachment.url}>
                                                    {' '}
                                                    {this.state.formData.nomeAnexo}
                                                </a>
                                            </FormGroup>
                                        ) : null}
                                    </Col>
                                </Row>

                                {/*Botões de ação*/}
                                <Row>
                                    <Col md='6'></Col>
                                    <Col md='3'>
                                        <Link className='btn-primary' to='/admin/contrato'>
                                            Voltar
                                        </Link>
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

export default ContratoVisualizar;
