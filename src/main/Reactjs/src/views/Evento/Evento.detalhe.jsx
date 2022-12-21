import React from "react";
import EventoService from "../../services/evento.service";
import { toast } from "react-toastify";
import { Card, Col, Row } from "reactstrap";
import Container from "reactstrap/es/Container";
import moment from "moment";
import { Link } from "react-router-dom";
import PermissionService from "../../services/permissao.service";
import "./Evento.detalhe.scss";

class EventoDetalhe extends React.Component {
  constructor(props) {
    super(props);

    this.emptyAddress = {
      street: "",
      number: "",
      zipcode: "",
      complement: "",
      city: {
        name: "",
        state: {
          name: "",
        },
      },
    };

    this.emptyAttachement = {
      url: null,
    };

    this.state = {
      formData: {
        id: null,
        attachment: this.emptyAttachement,
        title: null,
        description: null,
        city: null,
        state: null,
        address: this.emptyAddress,
        startDateTime: null,
        endDateTime: null,
        link: null,
        active: null,
      },
      hasPermissions: false,
    };

    this.dateTimeFormatter = new Intl.DateTimeFormat("pt-br", {
      year: "numeric",
      month: "numeric",
      day: "2-digit"
    });
  }

  componentDidMount = async () => {
    const {
      match: { params },
    } = this.props;

    if (!!params && !!params.id) {
      EventoService.get(params.id, null, null).subscribe(
        (data) => {
          if (!!data) {
            if (data.erro) {
              toast.error(data.mensagem);
            } else {
              this.setState({ formData: data.objeto[0] });
            }
          }
        },
        (error) => {
          console.log(error);
          toast.error("Erro ao buscar os eventos");
        }
      );
    }

    await this.checkUserPermission();
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

  render() {
    return (
      <>
        {/*marvelous once more*/}
        <br />
        <br />
        <Container className="evento-detalhe mt-5" fluid id="evento-detalhe">
          <Card className="b-r-1 p-t-50" style={{ paddingLeft: 20 }}>
            <Row style={{ marginBottom: 10 }}>
              <Col md="1" className="title-col-wrapper">
                Título:
              </Col>
              <Col>{this.state.formData.title}</Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col md="1" className="title-col-wrapper">
                Descrição:
              </Col>
              <Col>{this.state.formData.description}</Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col md="1" className="title-col-wrapper">
                Cidade:
              </Col>
              <Col>{this.state.formData.address.city.name}</Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col md="1" className="title-col-wrapper">
                Estado:
              </Col>
              <Col>{this.state.formData.address.city.state.name}</Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col md="1" className="title-col-wrapper">
                Início:
              </Col>
              {this.state.formData.startDate != null ? (
                <Col>
                  {
                    `${moment(this.state.formData.startDate + " " + this.state.formData.startTime, "YYYY-MM-DD HH:mm").format("DD-MM-YYYY [às] HH:mm[h]")}`  
                  }
                </Col>
              ) : null}
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col md="1" className="title-col-wrapper">
                Fim:
              </Col>
              {this.state.formData.endDate != null ? (
                <Col>
                  {
                    `${moment(this.state.formData.endDate + " " + this.state.formData.endTime, "YYYY-MM-DD HH:mm").format("DD-MM-YYYY [às] HH:mm[h]")}`
                  }
                </Col>
              ) : null}
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col md="1" className="title-col-wrapper">
                Link:
              </Col>

              {this.state.formData.link != null ? (
                <Col>
                  <a href={this.state.formData.link} target="_blank" rel="noopener noreferrer">
                    Acesse
                  </a>
                </Col>
              ) : null}
            </Row>
            <Row>
              <Col md="1" className="title-col-wrapper">
                Imagem:
              </Col>
              {this.state.formData.attachment != null &&
              this.state.formData.attachment.url != null ? (
                <Col>
                  <a href={this.state.formData.attachment.url} target="_blank" rel="noopener noreferrer">
                    <img
                      alt=''
                      style={{ objectFit: "contain", width: "200px" }}
                      className="image"
                      src={this.state.formData.attachment.url}
                    />
                  </a>
                </Col>
              ) : this.state.formData.attachment != null &&
                this.state.formData.attachment.file != null ? (
                <Col>
                  <img
                    alt=''
                    style={{ objectFit: "contain", width: "200px" }}
                    src={`data:image/png;base64,${this.state.formData.attachment.file}`}
                  />
                </Col>
              ) : null}
            </Row>
          </Card>
          <Row style={{ marginLeft: 30, marginTop: 20 }}>
            <Col md="12">
              <Link
                className="custom-link"
                to={`/admin/cadastro-evento/${this.state.formData.id}`}
                hidden={!this.state.hasPermissions}
              >
                Editar
              </Link>
              <Link to="/admin/evento" style={{ marginLeft: 20 }}>
                Voltar
              </Link>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default EventoDetalhe;
