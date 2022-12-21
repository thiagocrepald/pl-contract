import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";
import RcIf from "rc-if";
import React from "react";
import ReactDatetime from "react-datetime";
import Asterisk from "react-icons/lib/fa/asterisk";
import { ClipLoader } from "react-spinners";
// reactstrap components
import {
    Button,
    Card,
    Col,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
    Table
} from "reactstrap";
import Container from "reactstrap/es/Container";
import EscalaService from "../../../services/escala.service";
import FechamentoService from "../../../services/fechamento.service";
import UsuarioAppService from "../../../services/usuario.app.service";
import UsuarioFactory from "../../Usuario/Usuario.factory";
import "./Fechamento.lista.scss";


class FechamentoLista extends React.Component {
  constructor(props) {
    super(props);
    this.emptyFechamentoVo = {
      medico: {},
      escala: {},
      dataInicio: "",
      dataFim: "",
      turno: "",
      setor: "",
    };

    this.state = {
      formFechamento: this.emptyFechamentoVo,
      fechamentoVo: {
        listaFechamentoPorMedico: [],
        listaFechamentoPorEscala: [],
        valorBrutoTotal: "",
        cargaHorariaTotal: "",
        layout: "",
        turno: "",
        setor: "",
      },
      permissao: false,
      loading: false,
      listaMedico: [],
      listaEscala: [],
      totalValorBruto: "",
      nomeDoMedico: "",
    };
  }

  componentDidMount() {
    this.carregarCombos();
    const usuarioLogado = UsuarioFactory.getUsuarioLogado();
    if (!usuarioLogado) {
      this.props.history.push("/auth/login");
    } else {
      if (!!usuarioLogado.listaUsuarioTipoPermissao) {
        for (
          let i = 0;
          i < usuarioLogado.listaUsuarioTipoPermissao.length;
          i++
        ) {
          if (
            usuarioLogado.listaUsuarioTipoPermissao[i].tipoPermissao.id === 7
          ) {
            this.setState({ permissao: true });
          }
        }
      }
    }
  }

  listar = async () => {
    console.log(this.state);
    this.setState({
      loading: true,
      fechamentoVo: this.emptyFechamentoVo,
    });

    let filtro = {};
    if (!!this.state.formFechamento) {
      if (
        !!this.state.formFechamento.escala &&
        !!this.state.formFechamento.escala.id &&
        this.state.formFechamento.escala.id !== "default"
      ) {
        filtro.escala = this.state.formFechamento.escala;
      }
      if (
        !!this.state.formFechamento.medico &&
        !!this.state.formFechamento.medico.id &&
        this.state.formFechamento.medico.id !== "default"
      ) {
        filtro.medico = this.state.formFechamento.medico;
        filtro.dataInicio = this.state.formFechamento.dataInicio;
        filtro.dataFim = this.state.formFechamento.dataFim;
      }
    }
    console.log(filtro);
    await FechamentoService.listar(filtro).subscribe(
      (data) => {
        if (!!data) {
          this.setState({ fechamentoVo: data });
          this.setState({ loading: false });
          if (
            !!data.listaFechamentoPorMedico &&
            data.listaFechamentoPorMedico.length > 0
          ) {
            let nomeDoMedico =
              data.listaFechamentoPorMedico[0].plantao.medico.nome;
            this.setState({ nomeDoMedico: nomeDoMedico });
          }
        }
      },
      (error) => console.error(error)
    );
  };

  carregarCombos = async () => {
    await UsuarioAppService.listarComboMedico().subscribe(
      (data) => {
        if (!!data) {
          this.setState({ listaMedico: data });
        }
      },
      (error) => console.error(error)
    );
    await EscalaService.listarComboEscala().subscribe(
      (data) => {
        if (data) {
          this.setState({ listaEscala: data });
        }
      },
      (error) => console.error(error)
    );
  };

  handleSituacaoChange = (e) => {
    let formData = { ...this.state.formData };
    formData.situacao = e.target.value;
    this.setState({ formData });
  };

  handleMedicoChange = (e) => {
    let formFechamento = { ...this.state.formFechamento };
    formFechamento.medico = { id: e.target.value };
    this.setState({ formFechamento });
  };

  handleEscalaChange = (e) => {
    if (e.target.value === "default") {
      let formFechamento = { ...this.state.formFechamento };
      formFechamento.escala.id = e.target.value;
      this.setState({ formFechamento });
    } else {
      const indexObjSelecionado = this.state.listaEscala.findIndex(
        (obj) => obj.id === e.target.value
      );
      if (indexObjSelecionado !== -1) {
        let listaEscala = { ...this.state.listaEscala };

        let formFechamento = { ...this.state.formFechamento };
        formFechamento.escala.id = listaEscala[indexObjSelecionado].id;
        formFechamento.escala.nomeEscala =
          listaEscala[indexObjSelecionado].nomeEscala;

        this.setState({ formFechamento });

        console.log(this.state.formFechamento);
      }
    }
  };

  handleDataInicioChange = (data) => {
    let formFechamento = { ...this.state.formFechamento };
    formFechamento.dataInicio = data;
    this.setState({ formFechamento });
    console.log(formFechamento);
  };

  handleDataFimChange = (data) => {
    let formFechamento = { ...this.state.formFechamento };
    formFechamento.dataFim = data;
    this.setState({ formFechamento });
    console.log(formFechamento);
  };

  gerarExcel() {
    let filtro = {};
    if (!!this.state.formFechamento) {
      if (
        !!this.state.formFechamento.escala &&
        !!this.state.formFechamento.escala.id &&
        this.state.formFechamento.escala.id !== "default"
      ) {
        filtro.escala = this.state.formFechamento.escala;
      }
      if (
        !!this.state.formFechamento.medico &&
        !!this.state.formFechamento.medico.id &&
        this.state.formFechamento.medico.id !== "default"
      ) {
        filtro.nomeMedico = this.state.nomeDoMedico;
        filtro.medico = this.state.formFechamento.medico;
        filtro.dataInicio = this.state.formFechamento.dataInicio;
        filtro.dataFim = this.state.formFechamento.dataFim;
      }
    }
    FechamentoService.gerarExcel(filtro).subscribe(
      (data) => {
        if (!!data) {
          const sampleArr = this.base64ToArrayBuffer(data.arquivo);
          this.saveByteArray(data.nmAnexo, sampleArr);
        }
      },
      (error) => console.error(error)
    );
  }

  saveByteArray(reportName, byte) {
    const blob = new Blob([byte], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    const fileName = reportName;
    link.download = fileName;
    link.click();
  }

  base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  render() {
    return (
      <>
        <Container className="mt-5" fluid id="fechamento-lista">
          <Row>
            <Col
              md="12"
              className="botton-to-right"
              hidden={!this.state.permissao}
            >
              <Button className="custom-link" onClick={() => this.gerarExcel()}>
                Exportar
              </Button>
            </Col>
          </Row>

          <Row className="p-b-20 p-t-20 m-l-0 m-r-1">
            {/*Escala*/}
            <Col md="3">
              <span>Escala</span>
              <FormGroup>
                <Input
                  type="select"
                  name="select"
                  id="escalaSelect"
                  onChange={this.handleEscalaChange}
                  value={this.state.formFechamento.escala.id}
                  disabled={this.state.loading}
                >
                  <option name="default" value="default">
                    Escala
                  </option>
                  {this.state.listaEscala.map((item, i) => {
                    return (
                      <option key={i} value={item.id}>
                        {item.nomeEscala}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>
            </Col>
            {/*medico*/}
            <Col md="3">
              <FormGroup>
                <span>Médico</span>
                <Input
                  type="select"
                  name="select"
                  id="medicoSelect"
                  onChange={this.handleMedicoChange}
                  value={
                    !!this.state.formFechamento.medico
                      ? this.state.formFechamento.medico.id
                      : null
                  }
                  disabled={this.state.loading}
                >
                  <option name="default" value="default">
                    Selecionar Médico
                  </option>
                  {this.state.listaMedico.map((item, i) => {
                    return (
                      <option key={i} value={item.id}>
                        {item.nome}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>
            </Col>

            <Col md="3">
              <span>Data Início</span>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    onChange={this.handleDataInicioChange}
                    value={this.state.formFechamento.dataInicio}
                    inputProps={{
                      placeholder: "Data Fim",
                      disabled:
                        this.state.loading ||
                        (!!this.state.formFechamento.escala.id &&
                          this.state.formFechamento.escala.id !== "default"),
                    }}
                    timeFormat={false}
                    dateFormat="DD/MM/YYYY"
                    locale="pt-br"
                    closeOnSelect={true}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md="3">
              <span>Data Fim</span>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    onChange={this.handleDataFimChange}
                    value={this.state.formFechamento.dataFim}
                    inputProps={{
                      placeholder: "Data Fim",
                      disabled:
                        this.state.loading ||
                        (!!this.state.formFechamento.escala.id &&
                          this.state.formFechamento.escala.id !== "default"),
                    }}
                    timeFormat={false}
                    dateFormat="DD/MM/YYYY"
                    locale="pt-br"
                    closeOnSelect={true}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md="6">
              <Button
                color="secondary"
                type="button"
                onClick={() => this.listar()}
                disabled={this.state.loading}
              >
                Filtrar
              </Button>
            </Col>
          </Row>
          <Card>
            {/*por medico*/}
            <Row className="text-fechamento">
              <span className="p-l-10">Fechamento de Horas</span>
            </Row>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 5,
              }}
            >
              {this.state.loading ? (
                <ClipLoader
                  sizeUnit={"px"}
                  size={30}
                  margin={"2px"}
                  color={"#149d5b"}
                  loading={this.state.loading}
                />
              ) : null}
            </div>

            <RcIf if={this.state.fechamentoVo.layout === 2}>
              <Row className="text-medico">
                Médico:{this.state.nomeDoMedico ? this.state.nomeDoMedico : ""}{" "}
              </Row>

              <Table>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nome da Escala</th>
                    <th scope="col">Data</th>
                    <th scope="col">Horário</th>
                    <th scope="col">Duração</th>
                    <th scope="col">Turno</th>
                    <th scope="col">Setor</th>

                    <th scope="col">
                      Valor Bruto
                      <Tooltip
                        title="*Este valor é bruto e não contempla retenções vinculadas à modalidade recebimento optada pelo médico."
                        aria-label="*Este valor é bruto e não contempla retenções vinculadas à modalidade recebimento optada pelo médico."
                      >
                        <span>
                          <Asterisk color="red" className="m-b-3" />
                        </span>
                      </Tooltip>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.fechamentoVo.listaFechamentoPorMedico
                    ? this.state.fechamentoVo.listaFechamentoPorMedico.map(
                        (item, i) => {
                          return (
                            <tr key={i}>
                              <td>{item.nomeEscala}</td>
                              <td>
                                {new Intl.DateTimeFormat("default", {
                                  year: "numeric",
                                  month: "numeric",
                                  day: "2-digit",
                                }).format(moment(item.data))}
                              </td>
                              <td>
                                {item.horaInicio} - {item.horaFim}
                              </td>
                              <td>{item.duracaoPlantao}h</td>
                              <td>{item.turno}</td>
                              <td>{item.setor}</td>
                              <td>R${item.valorBruto}</td>
                            </tr>
                          );
                        }
                      )
                    : null}
                  {this.state.fechamentoVo.listaFechamentoPorMedico &&
                    this.state.fechamentoVo.listaFechamentoPorMedico.length >
                      0 && (
                      <tr>
                        <th scope="row">TOTAL</th>
                        <td />
                        <td />
                        <td>{this.state.fechamentoVo.cargaHorariaTotal}h</td>
                        <td />
                        <td />
                        <td>R$ {this.state.fechamentoVo.valorBrutoTotal}</td>
                      </tr>
                    )}
                </tbody>
              </Table>
              <span>
                *O valor total é bruto e não contempla retenções vinculadas à
                modalidade recebimento optada pelo médico.
              </span>
            </RcIf>

            <RcIf if={this.state.fechamentoVo.layout === 1}>
              <Table>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Médico</th>
                    <th scope="col">Carga Horária</th>
                    <th scope="col">Data</th>
                    <th scope="col">Horário</th>
                    <th scope="col">Turno</th>
                    <th scope="col">Setor</th>
                    <th scope="col">Valor Bruto</th>
                  </tr>
                </thead>

                <tbody>
                  {!!this.state.fechamentoVo.listaFechamentoPorEscala
                    ? this.state.fechamentoVo.listaFechamentoPorEscala.map(
                        (item, i) => {
                          return (
                            <tr key={i}>
                              <td>{item.medico.nome}</td>
                              <td>{item.cargaHoraria}h</td>
                              <td>
                                {new Intl.DateTimeFormat("default", {
                                  year: "numeric",
                                  month: "numeric",
                                  day: "2-digit",
                                }).format(moment(item.data))}
                              </td>
                              <td>
                                {item.horaInicio} - {item.horaFim}
                              </td>
                              <td>{item.turno}</td>
                              <td>{item.setor}</td>
                              <td>R$ {item.valorBruto}</td>
                            </tr>
                          );
                        }
                      )
                    : null}

                  <tr>
                    <th scope="row">TOTAL</th>
                    <td>{this.state.fechamentoVo.cargaHorariaTotal}h</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>R$ {this.state.fechamentoVo.valorBrutoTotal}</td>
                  </tr>
                </tbody>
              </Table>
            </RcIf>
          </Card>
        </Container>
      </>
    );
  }
}

export default FechamentoLista;
