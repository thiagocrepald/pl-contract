import React from "react";
import {Image} from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
// reactstrap components
import {Col, Form, Row} from "reactstrap";
import logo from '../../assets/logo/logohorizontal.png';
import UsuarioAppService from "../../services/usuario.app.service";
import "./ConfirmarEmail.scss";

class ConfirmarEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  componentDidMount() {
    const medico = this.props.match.params.medico;
    console.log(medico);
    this.enviarConfirmarcao(medico);
  }

  enviarConfirmarcao = medico => {
    const replacedJsonDoctor = medico.replaceAll('\'', '"');
    UsuarioAppService.confirmarEmail(JSON.parse(replacedJsonDoctor)).subscribe();
  };

  render() {
    return (
      <>
        <section id="confirmarEmailView">
          <Form className="email-form">
            <Row md="12" className="p-l-10">
              <Col md="12">
                <Image className="img-align" src={logo} />
              </Col>
            </Row>
            <Row className="p-l-10">
              <Col md="12">
                <h1 className="text">Pré-cadastro confirmado! Agora você pode realizar login no aplicativo para completar seu cadastro anexando seus documentos.</h1>
              </Col>
            </Row>
          </Form>
        </section>
      </>
    );
  }
}

export default ConfirmarEmail;
