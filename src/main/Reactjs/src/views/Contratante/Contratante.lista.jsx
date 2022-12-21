import React from "react";
import Eye from 'react-icons/lib/fa/eye';
import Arquivar from 'react-icons/lib/fa/minus';
import Desarquivar from 'react-icons/lib/fa/plus';
import Edit from 'react-icons/lib/ti/edit';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from "react-toastify";
// reactstrap components
import { Button, Card, Col, Input, Row, Table } from "reactstrap";
import Container from "reactstrap/es/Container";
import swal from 'sweetalert';
import ContratanteService from "../../services/contratante.service";
import UsuarioFactory from "../Usuario/Usuario.factory";
import "./Contratante.lista.scss";


class ContratanteLista extends React.Component {

    constructor(props){
        super(props);
        this.excluir = this.excluir.bind(this);
        this.state = {
            listaContratante: [],
            nomeContratante: '',
            cidade: '',
            uf: '',
            permissao: false,
            loading: true,
            excluido: '',

            formData: {
                situacao: "CONTRATANTES_ATIVOS",
            }
        };
    }



    componentDidMount() {

        const usuarioLogado = UsuarioFactory.getUsuarioLogado();
        if (!usuarioLogado) {
            this.props.history.push('/auth/login');
        } else {
            if (!!usuarioLogado.listaUsuarioTipoPermissao) {
                for (let i = 0; i < usuarioLogado.listaUsuarioTipoPermissao.length; i++) {
                    if (usuarioLogado.listaUsuarioTipoPermissao[i].tipoPermissao.id === 2) {
                        this.setState({permissao: true});
                    }
                }
            }
        }

        ContratanteService.listar(this.state.formData).subscribe(
            data => {
                if (!!data) {
                    this.setState({listaContratante: data});
                    this.setState({loading: false});
                }
            },
            error => console.error(error)
        );
    }

    listar = () =>{
        ContratanteService.listar(this.state.formData).subscribe(
            data => {
                if (!!data) {
                    this.setState({listaContratante: data});
                    this.setState({loading: false});
                }
            },
            error => console.error(error)
        );
    };

    excluir = (item, e) => {
        e.preventDefault();
        swal({
            title: "Inativar Contratante",
            text: "Deseja inativar esse contratante?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.setState({loading: true});
                    ContratanteService.excluir(item).subscribe(
                        data => {
                            if (!!data) {
                                console.log(data);
                                if (data.erro) {
                                    toast.error(data.mensagem);
                                } else {
                                    const obj = data.objeto;

                                    let listaContratante = [...this.state.listaContratante];

                                    const index = listaContratante.findIndex(o => o.id === obj.id);

                                    listaContratante.splice(index, 1);

                                    this.setState({listaContratante});

                                    toast.success(data.mensagem);

                                    this.setState({loading: false});

                                    this.listar();
                                }
                            }
                        },
                        error => console.error(error)
                    );
                    swal("Inativado!", {
                        icon: "success",
                    });
                }
            });

        // ContratanteService.excluir(item).subscribe(
        //     data => {
        //         if (!!data) {
        //             console.log(data);
        //         }
        //     },
        //     error => console.error(error)
        // );
    };

    handleSituacaoChange = e => {
        let formData = {...this.state.formData};
        formData.situacao = e.target.value;
        this.setState({formData});
    };

    ativar = (item, e) => {
        e.preventDefault();
        swal({
            title: "Ativar Contratante",
            text: "Deseja ativar esse contratante?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.setState({loading: true});
                    ContratanteService.ativarContratante(item).subscribe(
                        data => {
                            if (!!data) {
                                console.log(data);
                                if (data.erro) {
                                    toast.error(data.mensagem);
                                } else {
                                    toast.success(data.mensagem);
                                    this.setState({loading: false});
                                    this.listar();
                                }
                            }
                        },
                        error => console.error(error)
                    );
                    swal("Ativado!", {
                        icon: "success",
                    });
                }
            });
    };

    changeColorRow = (item) => {
        if (item.excluido === true ) {
            return {background: '#cccccc', color: 'black'};
        } else {
            return {background: '#ffffff', color: 'black'};
        }

    };

    render() {
        return (
            <>
                <Container className="mt-5" fluid id="contratante-lista">
                    <Row>
                        <Col md="12" className="botton-to-right">
                            <Link hidden={this.state.permissao === false} className="custom-link" to="/admin/cadastro-contratante">Cadastrar Contratante</Link>
                        </Col>
                    </Row>
                    <Card className="b-r-1">
                        <Row className="p-b-20 p-t-20 m-l-0 m-r-1">
                            <Col md="6" >
                                <Input
                                    type="select" name="select"
                                    id="diaSelect"
                                    onChange={this.handleSituacaoChange}
                                    value={this.state.situacao}
                                >
                                    <option value="CONTRATANTES_ATIVOS">Contratantes Ativos</option>
                                    <option value="TODOS_CONTRATANTES">Todos os Contratantes</option>
                                    <option value="CONTRATANTES_INATIVOS">Contratantes Inativos</option>

                                </Input>
                            </Col>
                            <Col md="6">
                                <Button
                                    color="secondary"
                                    type="button"
                                    onClick={() => this.listar()}
                                >
                                    Filtrar
                                </Button>
                            </Col>
                        </Row>
                        <Card>
                            <Table>
                                <thead className="thead-light">
                                <tr>
                                    <th scope="col">Nome do Contratante</th>
                                    <th scope="col">Cidade</th>
                                    <th scope="col">Uf</th>
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
                                {this.state.listaContratante.map((item, i) => {
                                    return (
                                        <tr key={i} style={this.changeColorRow(item)}>
                                            <td>
                                                {item.nomeContratante}
                                            </td>
                                            <td>
                                                {item.cidade}
                                            </td>
                                            <td>
                                                {item.uf}
                                            </td>
                                            <td key={item.id}>
                                                <Row>
                                                    <Col md="2">
                                                        <Link to={`/admin/visualizar-contratante/${item.id}`}>
                                                            <Eye size={24} color="black"/>
                                                        </Link>
                                                    </Col>
                                                    <Col md="2">
                                                       <Link hidden={this.state.permissao === false} to={`/admin/cadastro-contratante/${item.id}`}>
                                                           <Edit size={24} color="black"/>
                                                       </Link>
                                                    </Col>

                                                    <Col md="2" hidden={this.state.permissao === false || item.excluido === true} className="pointer">
                                                        <Arquivar  onClick={(e) => this.excluir(item, e)}  size={24} color="black"/>
                                                    </Col>
                                                    <Col md="2" hidden={this.state.permissao === false || item.excluido === false} className="pointer">
                                                        <Desarquivar  onClick={(e) => this.ativar(item, e)}  size={24} color="black"/>
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


export default ContratanteLista;
