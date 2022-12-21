import React from "react";
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
// reactstrap components
import { Card, CardBody, CardHeader, Col, Form, FormGroup, Row } from "reactstrap";
import ContratanteService from "../../services/contratante.service";
import "./Contratante.visualizar.scss";


const cidadeEstado = require('../../util/estados_cidades');

class ContratanteVisualizar extends React.Component {

    state = {
        id: '',
        nomeContratante: '',
        cidade: '',
        uf: '',
        cnpj: '',
        loading: true,
        listaCidadeEstado: cidadeEstado
    };

    componentDidMount = async () => {
        const {match: {params}} = this.props;

        if (!!params && !!params.userId) {

            let contratanteVo = {id: params.userId};

            const listaCidadeEstado = [...this.state.listaCidadeEstado];


            await ContratanteService.getById(contratanteVo).subscribe(
                data => {
                    if (!!data && !data.erro) {
                        contratanteVo = data.objeto;
                        const uf = listaCidadeEstado.find(o => o.sigla === contratanteVo.uf);
                        const estado = uf.nome.toUpperCase();
                        this.setState({
                            id: contratanteVo.id,
                            nomeContratante: contratanteVo.nomeContratante,
                            cidade: contratanteVo.cidade,
                            uf: estado,
                            cnpj: contratanteVo.cnpj,
                            loading: false
                        });
                    }
                },
                error => console.error(error)
            );
        }
    };


    render() {
        return (
            <>
                {/* Page content */}
                <div id="contratante-visualizar">
                    <Card className="pt-lg-1 b-r-1 w-95">
                        <CardHeader className="bg-transparent pb-5">
                            <div className="text-muted text-center mt-2 mb-4">
                                <h1 className="card-title">Contratante: {this.state.nomeContratante}</h1>
                            </div>
                        </CardHeader>
                        <CardBody>

                            {this.state.loading ?
                                <div className="text-center">
                                    <ClipLoader
                                        sizeUnit={"px"}
                                        size={50}
                                        margin={"2px"}
                                        color={'#149d5b'}
                                        loading={this.state.loading}
                                    />
                                </div>

                                : null}

                            {/* Formulário de cadastro */}
                            <Form onSubmit={this.handleSubmit}>
                                <Row className="w">
                                    <Col md="12">
                                        <FormGroup>
                                            Nome: {this.state.nomeContratante}
                                        </FormGroup>
                                    </Col>
                                    <Col md="12">
                                        <FormGroup>
                                            Cidade: {this.state.cidade}
                                        </FormGroup>
                                    </Col>
                                    <Col md="12">
                                        <FormGroup>
                                            Estado: {this.state.uf}
                                        </FormGroup>
                                    </Col>
                                    <Col md="12">
                                        <FormGroup>
                                            CNPJ: {this.state.cnpj}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                {/*Botões de ação*/}
                                <Row>
                                    <Col md="6"></Col>
                                    <Col md="3">
                                        <Link className="btn-primary" to="/admin/contratante">Voltar</Link>
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


export default ContratanteVisualizar;
