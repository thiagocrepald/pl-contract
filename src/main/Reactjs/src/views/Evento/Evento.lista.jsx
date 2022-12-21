import React from "react";
import UsuarioFactory from "../Usuario/Usuario.factory";
import EventoService from "../../services/evento.service";
import Container from "reactstrap/es/Container";
import { Card, Col, FormGroup, Input, Row, Table } from "reactstrap";
import { ClipLoader } from "react-spinners";
import moment from "moment";
import { Link } from "react-router-dom";
import Eye from "react-icons/lib/fa/eye";
import Edit from "react-icons/lib/ti/edit";
import Trash from "react-icons/lib/fa/trash";
import swal from "sweetalert";
import { toast } from "react-toastify";
import PermissionService from "../../services/permissao.service";

class EventoLista extends React.Component {
  constructor(props) {
    super(props);

    this.defaultActiveStatus = {
      label: "Todos",
      value: null,
    };

    this.state = {
      loading: false,
      events: [],
      hasPermissions: false,
      currentActiveStatus: this.defaultActiveStatus,

      activeStatus: [
        this.defaultActiveStatus,
        {
          label: "Ativo",
          value: true,
        },
        {
          label: "Inativo",
          value: false,
        },
      ],
    };

    this.dateFormatter = new Intl.DateTimeFormat("pt-br", {
      year: "numeric",
      month: "numeric",
      day: "2-digit"
    });

    this.hourFormatter = new Intl.DateTimeFormat('pt-br', {
        hour: 'numeric',
        minute: 'numeric'
    });
  }

  componentDidMount = async () => {
    const usuarioLogado = UsuarioFactory.getUsuarioLogado();
    if (!usuarioLogado) {
      this.props.history.push("/auth/login");
    } else {
      await this.getAllEvents(null);
      await this.checkUserPermission();
    }
  };

  getAllEvents = async (activeStatus) => {
    EventoService.get(null, activeStatus, "startDate").subscribe(
      (data) => {
        if (!!data) {
          if (data.erro) {
            toast.error(data.mensagem);
          } else {
            this.setState({ events: data.objeto });
          }
        }
      },
      (error) => {
        console.log(error);
        toast.error("Erro ao buscar os eventos");
      }
    );
  };

  checkUserPermission = async () => {
    PermissionService.userContainPermission(
      "CriarAlterarExcluirEventos"
    ).subscribe(
      (data) => {
        if (!!data) {
          if (data.erro) {
            toast.error(data.mensagem);
          } else {
            this.setState({ hasPermissions: data.objeto });
          }
        }
      },
      (error) => {
        this.setState({ hasPermissions: false });
        console.log(error);
      }
    );
  };

  deleteEvent = (item, e) => {
    e.preventDefault();
    swal({
      title: "Confirmar Exclusão",
      text: "Deseja excluir o evento " + item.title + "?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        EventoService.delete(item.id).subscribe(
          (data) => {
            if (!!data) {
              if (data.erro) {
                toast.error(data.mensagem);
              } else {
                swal("Deletado!", {
                  icon: "success",
                });
                this.getAllEvents(null);
              }
            }
          },
          (error) => {
            console.log(error);
            toast.error(error);
          }
        );
      }
    });
  };

  handleActiveChange = async (e) => {
    let status;
    if (e.target.value === "Todos") {
      status = null;
    } else {
      status = e.target.value;
    }

    await this.getAllEvents(status);
  };

  render() {
    return (
      <>
        {/*marvelous*/}
        <br />
        <br />
        <Container className=" mt-5" fluid id="evento-lista">
          <Row>
            <Col
              md="12"
              className="botton-to-right"
              hidden={!this.state.hasPermissions}
            >
              <Link className="custom-link" to="/admin/cadastro-evento">
                Cadastrar Evento
              </Link>
            </Col>
          </Row>

          <Col md="3" style={{ marginLeft: 30 }}>
            <span>Status</span>
            <FormGroup>
              <Input
                type="select"
                name="select"
                id="activeSelect"
                onChange={this.handleActiveChange}
                value={this.state.currentActiveStatus.value}
              >
                {this.state.activeStatus.map((item, i) => {
                  return (
                    <option key={i} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
              </Input>
            </FormGroup>
          </Col>

          <Card className="b-r-1 p-t-50">
            <Card>
              <Table>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Título</th>
                    <th scope="col">Endereço</th>
                    <th scope="col">Data Iníco</th>
                    <th scope="col">Data Fim</th>
                    <th scope="col">Horário</th>
                    <th scope="col">Ativo</th>
                    <th scope="col" />
                  </tr>
                </thead>

                <tbody>
                  {this.state.loading ? (
                    <tr>
                      <td colSpan="6" align="center">
                        <ClipLoader
                          sizeUnit={"px"}
                          size={50}
                          margin={"2px"}
                          color={"#149d5b"}
                          loading={this.state.loading}
                        />
                      </td>
                    </tr>
                  ) : null}

                  {this.state.events.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{item.title}</td>
                        <td>{item.address.street}</td>
                        <td>
                          {this.dateFormatter
                            .format(moment(item.startDate))
                            .toUpperCase()}
                        </td>
                        <td>
                          {this.dateFormatter
                            .format(moment(item.endDate))
                            .toUpperCase()}
                        </td>
                        <td>
                          {`${this.hourFormatter
                            .format(moment(item.startTime, "HH:mm:ss"))
                            .toUpperCase()} até
                          ${this.hourFormatter
                            .format(moment(item.endTime, "HH:mm:ss"))
                            .toUpperCase()}`}
                        </td>
                        <td>{item.active ? "Sim" : "Não"}</td>

                        <td key={item.id}>
                          <Row>
                            <Col md="2">
                              <Link to={`/admin/detalhe-evento/${item.id}`}>
                                <Eye size={24} color="black" />
                              </Link>
                            </Col>
                            <Col md="2" hidden={!this.state.hasPermissions}>
                              <Link to={`/admin/cadastro-evento/${item.id}`}>
                                <Edit size={24} color="black" />
                              </Link>
                            </Col>

                            <Col
                              md="2"
                              hidden={!this.state.hasPermissions}
                              className="pointer"
                            >
                              <Trash
                                onClick={(e) => this.deleteEvent(item, e)}
                                size={24}
                                color="black"
                              />
                            </Col>
                          </Row>
                        </td>
                      </tr>
                    );
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

export default EventoLista;
