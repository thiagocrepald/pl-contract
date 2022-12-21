import React from "react";
import Eye from 'react-icons/lib/fa/eye';
import Trash from 'react-icons/lib/fa/trash';
import Edit from 'react-icons/lib/ti/edit';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from "react-toastify";
// reactstrap components
import { Card, Col, Row, Table } from "reactstrap";
import Container from "reactstrap/es/Container";
import swal from 'sweetalert';
import UsuarioService from "../../services/usuario.service";
import UsuarioFactory from "./Usuario.factory";
import "./Usuario.lista.scss";


class UsuarioLista extends React.Component {

    state = {
        listaUsuario: [],
        nome: '',
        login: '',
        permissao: false,
        loading: true
    };

    componentDidMount() {

        const usuarioLogado = UsuarioFactory.getUsuarioLogado();
        if (!usuarioLogado) {
            this.props.history.push('/auth/login');
        } else {
            if (!!usuarioLogado.listaUsuarioTipoPermissao) {
                for (let i = 0; i < usuarioLogado.listaUsuarioTipoPermissao.length; i++) {
                    if (usuarioLogado.listaUsuarioTipoPermissao[i].tipoPermissao.id === 10) {
                        this.setState({permissao: true});
                    }
                }
            }
        }

        UsuarioService.listar(this.state).subscribe(
            data => {
                if (!!data) {
                    this.setState({listaUsuario: data});
                    this.setState({loading: false});
                }
            },
            error => console.error(error)
        );
    }

    handleSubmit = async e => {
        e.preventDefault();
    };

    excluir = (item, e) => {
        e.preventDefault();
        swal({
            title: "Confirmar Exclusão",
            text: "Deseja excluir esse usuário?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.setState({loading: true});
                    UsuarioService.excluir(item).subscribe(
                        data => {
                            if (!!data) {
                                if (data.erro) {
                                    toast.error(data.mensagem);
                                } else {
                                    const obj = data.objeto;

                                    let listaUsuario = [...this.state.listaUsuario];

                                    const index = listaUsuario.findIndex(o => o.id === obj.id);

                                    listaUsuario.splice(index, 1);

                                    this.setState({listaUsuario});

                                    toast.success(data.mensagem);

                                    this.setState({loading: false});
                                }
                            }
                        },
                        error => console.error(error)
                    );
                    swal("Deletado!", {
                        icon: "success",
                    });
                }
            });
    };

    render() {
        return (
            <>
                {/*<Header/>*/}

                {/* Page content */}
                <Container className=" mt-5" fluid>
                    <Row>
                        <Col md="12" className="botton-to-right">
                            <Link hidden={this.state.permissao === false} className="custom-link" to="/admin/cadastro-usuario">Cadastrar Usuário</Link>
                        </Col>
                    </Row>
                    <Card className="b-r-1 p-t-50">
                        <Card>
                            <Table>
                                <thead className="thead-light">
                                <tr>
                                    <th scope="col">Nome</th>
                                    <th scope="col">E-mail</th>
                                    {/*<th scope="col">Tipo</th>*/}
                                    <th scope="col">Telefone</th>
                                    <th scope="col">Opções</th>
                                </tr>
                                </thead>

                                <tbody>
                                {this.state.loading ?
                                    <tr>
                                        <td colSpan="4" align='center'>
                                            <ClipLoader
                                                sizeUnit={"px"}
                                                size={50}
                                                margin={"2px"}
                                                color={'#149d5b'}
                                                loading={this.state.loading}/>

                                        </td>
                                    </tr>
                                    : null}

                                {this.state.listaUsuario.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                {item.nome}
                                            </td>
                                            <td>
                                                {item.email}
                                            </td>
                                            {/*<td>*/}

                                            {/*</td>*/}
                                            <td>
                                                {item.telefone}
                                            </td>
                                            <td key={item.id}>
                                                <Row>
                                                    <Col md="2">
                                                        <Link to={`/admin/visualizar-usuario/${item.id}`}>
                                                            <Eye size={24} color="black"/>
                                                        </Link>
                                                    </Col>
                                                    <Col md="2">
                                                        <Link hidden={this.state.permissao === false} to={`/admin/cadastro-usuario/${item.id}`} >
                                                            <Edit size={24} color="black"/>
                                                        </Link>
                                                    </Col>
                                                    <Col md="2" className="pointer">
                                                        <Trash hidden={this.state.permissao === false} onClick={(e) => this.excluir(item, e)} size={24} color="black"/>
                                                    </Col>
                                                </Row>
                                            </td>
                                        </tr>
                                    )


                                    })}
                                </tbody>
                            </Table>
                        </Card>
                    </Card>
                </Container>
            </>
        );
    }
}


export default UsuarioLista;
