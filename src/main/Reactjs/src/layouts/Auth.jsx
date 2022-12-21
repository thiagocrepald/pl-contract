import React from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// reactstrap components
import { Container, Row } from "reactstrap";
// core components
// import AuthNavbar from "../components/Navbars/AuthNavbar.jsx";
// import AuthFooter from "../components/Footers/AuthFooter.jsx";
import routes from "../routes.js";


class Auth extends React.Component {
  componentDidMount() {
    document.body.classList.add("bg-default");
  }
  componentWillUnmount() {
    document.body.classList.remove("bg-default");
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  render() {
    return (
      <>
        <div className="main-content">
          {/* <AuthNavbar /> */}
          {/* Page content */}
          <Container>
              <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnVisibilityChange
                  draggable
                  pauseOnHover
              />
            <Row className="justify-content-center">
              <Switch>{this.getRoutes(routes)}</Switch>
            </Row>
          </Container>
        </div>
        {/* <AuthFooter /> */}
      </>
    );
  }
}

export default Auth;
