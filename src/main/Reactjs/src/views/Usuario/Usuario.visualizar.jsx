import React from "react";
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
// reactstrap components
import { Card, CardBody, CardHeader, Col, Form, FormGroup, Row } from "reactstrap";
import UsuarioService from "../../services/usuario.service";
import "./Usuario.visualizar.scss";


class UsuarioVisualizar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            nome: '',
            login: '',
            senha: '',
            telefone: '',
            listaTipoPermissao: [],
            listaTipoPermissaoDB: [],
            listaUsuarioTipoPermissao: [],
            loading: true
        };
    }

    componentDidMount = async () => {

        await UsuarioService.listarTipoPermissao().subscribe(
            data => {
                if (!!data) {
                    this.setState({listaTipoPermissaoDB: data});
                    console.log(this.state.listaTipoPermissaoDB);
                }
            },
            error => console.error(error)
        );

        const {match: {params}} = this.props;
        if (!!params && !!params.userId) {

            let usuarioVo = {id: params.userId};

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
                <div id="usuario-visualizar">
                    <Card className="pt-lg-1 b-r-1 w-95">
                        <CardHeader className="bg-transparent pb-5">
                            <div className="text-muted text-center mt-2 mb-4">
                                <h1 className="card-title">Usuário de: {this.state.nome}</h1>
                            </div>
                        </CardHeader>
                        <CardBody className="px-lg-5 py-lg-5">
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
                            <Form>
                                <Row className="w">
                                    <Col md="12">
                                        <FormGroup>
                                            Nome: {this.state.nome}
                                        </FormGroup>
                                    </Col>
                                    <Col md="12">
                                        <FormGroup>
                                            Telefone: {this.state.telefone}
                                        </FormGroup>
                                    </Col>
                                    <Col md="12">
                                        <FormGroup>
                                            Login: {this.state.login}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                {/*Botões de ação*/}
                                <Row>
                                    <Col md="6"></Col>
                                    <Col md="3">
                                        <Link className="btn-primary" to="/admin/usuario">Voltar</Link>
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


export default UsuarioVisualizar;
