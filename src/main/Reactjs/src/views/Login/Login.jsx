import React from "react";

// reactstrap components
import { Button, Col, Form, FormGroup, Input, Row } from "reactstrap";

import "./Login.scss";
import LoginService from "../../services/login.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ClipLoader } from "react-spinners";
import { css } from "@emotion/core";
import logo from "../../assets/logo/logohorizontal.png";
import { Image } from "react-bootstrap";
import UtilService from "../../services/util.service";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class Login extends React.Component {
  constructor(props) {
    super(props);
    localStorage.clear();
    this.state = {
      loading: false,
      login: "",
      senha: "",
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    await LoginService.login(this.state).subscribe(
      (data) => {
        if (data.tipo === "success") {
          localStorage.setItem("_wt_token", data.objeto.token);
          localStorage.setItem(
            "_wt_usr",
            UtilService.base64encode(JSON.stringify(data.objeto))
          );
          this.setState({ loading: false });
          this.props.history.push("/admin/indicadores");
        } else {
          toast.error("Login ou Senha inválidos");
          this.setState({ loading: false });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  handleLoginChange = (e) => {
    this.setState({ login: e.target.value });
  };

  handleSenhaChange = (e) => {
    this.setState({ senha: e.target.value });
  };

  render() {
    return (
      <Col>
        <section className="justify-content-center" id="loginView">
          <Form className="login-form" onSubmit={this.handleSubmit}>
            {/* <div/> */}
            <Row className="w">
              <Col md="12" xs={{ size: "12" }}>
                <Image className="img-align" src={logo} />
                <div className="clip-loader-login">
                  {this.state.loading ? (
                    <ClipLoader
                      css={override}
                      sizeUnit={"px"}
                      size={50}
                      color={"#FFFFFF"}
                      loading={this.state.loading}
                    />
                  ) : null}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="12" xs={{ size: "12" }}>
                <FormGroup>
                  <Input
                    id="login"
                    placeholder="nome@exemplo.com"
                    type="email"
                    onChange={this.handleLoginChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Col style={{textAlign:'center'}} md="12" xs={{ size: "12" }}>
                <FormGroup>
                  <Input
                    id="password"
                    placeholder="password"
                    type="password"
                    onChange={this.handleSenhaChange}
                  />
                </FormGroup>
                <Button color="primary" type="submit">
                  Entrar
                </Button>
              </Col>
              <span style={{color: 'black', marginTop: '10px', cursor: 'pointer'}} onClick={() => this.props.history.push("/auth/redefinir-senha/")}>Esqueci a senha</span>
            </Row>
          </Form>
        </section>
      </Col>
    );
  }
}

export default Login;
