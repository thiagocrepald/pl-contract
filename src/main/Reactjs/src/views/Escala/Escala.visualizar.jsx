import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
// reactstrap components
import { Card, CardBody, CardHeader, Col, Container, FormGroup, Row, Table, } from "reactstrap";
import EscalaService from "../../services/escala.service";
import * as Util from "../../util/Util";
import "./Escala.visualizar.scss";

class EscalaVisualizar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        id: "",
        nomeEscala: "",
        periodoInicio: moment(),
        periodoFim: moment(),
        previsaoPagamento: moment(),
        coordenador: {},
        contrato: {},
        listaPlantao: [],
      },
      listaPlantao: [],
      loading: true,
    };
  }

  componentDidMount = async () => {
    const {
      match: { params },
    } = this.props;

    if (!!params && !!params.id) {
      let escala = { id: params.id };

      await EscalaService.getById(escala).subscribe(
        (data) => {
          if (!!data) {
            if (data.erro) {
              toast.error(data.mensagem);
              this.props.history.push("/admin/escala/");
            } else {
              escala = data.objeto;
              this.setObjToState(escala);
            }
          }
        },
        (error) => console.error(error)
      );
      let escalaPlantao = (escala = { id: params.id });
      await EscalaService.listarEscalaPlantao(escalaPlantao).subscribe(
        (data) => {
          if (!!data) {
            if (data.erro) {
              toast.error(data.mensagem);
              this.props.history.push("/admin/escala/");
            } else {
              for (let i = 0; i < data.length; i++) {
                const duracaoPlantao = Util.calculaDiferencaDeHoras(
                  data[i].horaInicio,
                  data[i].horaFim
                );

                this.setState({ duracaoPlantao: duracaoPlantao });

                data[i].duracaoPlantao = this.state.duracaoPlantao;
              }
              this.setState({ listaPlantao: data });
              this.setState({ loading: false });
            }
          }
        },
        (error) => console.error(error)
      );
    }
  };

  setObjToState = (obj) => {
    let formData = { ...this.state.formData };
    formData.id = obj.id;
    formData.nomeEscala = obj.nomeEscala;
    formData.periodoInicio = moment(obj.periodoInicio);
    formData.periodoFim = moment(obj.periodoFim);
    formData.previsaoPagamento = moment(obj.previsaoPagamento);
    formData.coordenador = obj.coordenador;
    formData.contrato = obj.contrato;
    this.setState({ formData });
    console.log(this.formData);
  };

  render() {
    return (
      <>
        {/* Page content */}
        <div id="escala-visualizar">
          <Card className="pt-lg-1 b-r-1 w-95">
            <CardHeader className="bg-transparent pb-5">
              <div className="text-muted text-center mt-2 mb-4">
                <h1 className="card-title">
                  Escala: {this.state.formData.nomeEscala}
                </h1>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              {this.state.loading ? (
                <div className="text-center">
                  <ClipLoader
                    sizeUnit={"px"}
                    size={50}
                    margin={"2px"}
                    color={"#149d5b"}
                    loading={this.state.loading}
                  />
                </div>
              ) : null}
              {/* visualizar */}

              <Row className="w">
                <Col md="12">
                  <FormGroup>
                    Contrato: {this.state.formData.contrato.codigo}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    Coordenador: {this.state.formData.coordenador.nome}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    Previsão de Pagamento:{" "}
                    {moment(this.state.formData.previsaoPagamento).format(
                      "DD/MM/YYYY"
                    )}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    Data de início:{" "}
                    {moment(this.state.formData.periodoInicio).format(
                      "DD/MM/YYYY"
                    )}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    Data de fim:{" "}
                    {moment(this.state.formData.periodoFim).format(
                      "DD/MM/YYYY"
                    )}
                  </FormGroup>
                </Col>
              </Row>

              <div syle={{width:'100%'}}>
                <Container className=" mt-5" fluid id="escala-lista">
                  <div className="text-muted text-left mt-2 mb-4">
                    <span>
                      <b>Plantões:</b>
                    </span>
                  </div>
                  <Card>
                    <Table>
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">
                            Hora
                            <br />
                            Início
                          </th>
                          <th scope="col">
                            Hora
                            <br />
                            Fim
                          </th>
                          <th scope="col">Duração</th>
                          <th scope="col">Data</th>
                          <th scope="col">Dia</th>
                          <th scope="col">Turno</th>
                          <th scope="col">Valor</th>
                          <th scope="col">Setores</th>
                          <th scope="col">Especialidades</th>
                        </tr>
                      </thead>

                      <tbody>
                        {this.state.loading ? (
                          <tr>
                            <td colSpan="7" align="center">
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

                        {this.state.listaPlantao.map((item, i) => {
                          return (
                            <tr key={i}>
                              <td>
                                {new Intl.DateTimeFormat("default", {
                                  hour: "numeric",
                                  minute: "numeric",
                                }).format(moment(item.horaInicio))}
                              </td>
                              <td>
                                {new Intl.DateTimeFormat("default", {
                                  hour: "numeric",
                                  minute: "numeric",
                                }).format(moment(item.horaFim))}
                              </td>
                              <td>{item.duracaoPlantao}</td>
                              <td>
                                {new Intl.DateTimeFormat("default", {
                                  year: "numeric",
                                  month: "numeric",
                                  day: "numeric",
                                }).format(moment(item.data))}
                              </td>
                              <td>{item.dia}</td>
                              <td>{item.turno}</td>
                              <td>{item.valor}</td>
                              <td>
                                {item.listaSetorSelecionado.map((item, i) => {
                                  return <Col key={i}>{item.descricao}</Col>;
                                })}
                              </td>
                              <td>
                                {item.listaEspecialidadeSelecionado.map(
                                  (item, i) => {
                                    return <Col key={i}>{item.descricao}</Col>;
                                  }
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Card>
                </Container>
              </div>

              {/*Botões de ação*/}
              <Row style={{marginTop:'20px'}}>
                <Col style={{margin:'auto'}} md="3">
                  <Link className="btn-primary" to="/admin/escala">
                    Voltar
                  </Link>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }
}

export default EscalaVisualizar;
