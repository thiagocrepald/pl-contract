/*eslint-disable*/
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
import React from "react";
import { Link, NavLink as NavLinkRRD } from "react-router-dom";
// reactstrap components
import {
  Col,
  Collapse,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Media,
  Nav,
  Navbar,
  NavItem,
  NavLink,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import "./Sidebar.scss";

class Sidebar extends React.Component {
  state = {
    collapseOpen: false,
    collapseDesktop: false,
  };

  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
  }

  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }

  // toggles collapse between opened and closed (true/false)
  toggleCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    });
  };
  // closes the collapse
  closeCollapse = () => {
    this.setState({
      collapseOpen: false,
    });
  };
  toggleCollapseDesktop = () => {
    this.setState({
      collapseDesktop: !this.state.collapseDesktop,
    });
  };
  // creates the links that appear in the left menu / Sidebar
  createLinks = (routes) => {
    return routes.map((route, key) => {
      if (route.showSidebar) {

        const visibleRoutesCount = route.subRoutes?.filter(subRoute => subRoute.showSidebar).length
        const subRoutes = route.subRoutes?.filter(subRoute => subRoute.showSidebar)

        if (subRoutes && visibleRoutesCount > 0) {
          return (
              <div key={key}>
                <input style={{ display: "none" }} type="checkbox" name={route.path} id={route.path} />
                <div className="sibdebar-collapse__container">
                  <label style={{ width: "100%", margin: '0', fontSize: '13px', padding: '8px 25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} for={route.path} >
                    {route.name}
                    <div className="arrow--img-second" />
                  </label>
                  <div className="sidebar-collapse">
                    {subRoutes
                        .map((subRoute, subKey) => (
                            <NavItem key={subKey}>
                              <NavLink to={subRoute.layout + subRoute.path} tag={NavLinkRRD} onClick={this.closeCollapse} activeClassName="active">
                                {/* <i className={subRoute.icon} /> */}
                                <div className="container__section">
                                  <div className="text-secondary text-secondary-mobile">{subRoute.name}</div>
                                  <div className="arrow--img" />
                                </div>
                              </NavLink>
                            </NavItem>
                        ))}
                  </div>
                </div>
              </div>
          );
        }
        return (
            <NavItem key={key}>
              <NavLink to={route.layout + route.path} tag={NavLinkRRD} onClick={this.closeCollapse} activeClassName="active">
                {/* <i className={route.icon} /> */}
                <div className="container__section">
                  <div className="logout--img" />
                  <div className="text-secondary text-secondary-mobile">{route.name}</div>
                  <div className="arrow--img" />
                </div>
              </NavLink>
            </NavItem>
        );
      }
    });
  };

  render() {
    const { bgColor, routes, logo } = this.props;
    let navbarBrandProps;
    if (logo && logo.innerLink) {
      navbarBrandProps = {
        to: "/admin/indicadores",
        tag: Link,
      };
    } else if (logo && logo.outterLink) {
      navbarBrandProps = {
        href: logo.outterLink,
        target: "_blank",
      };
    }

    return (
        <Navbar
            className="navbar-vertical fixed-left navbar-light bg-default-sidebar"
            expand="md"
            id="sidenav-main"
            data-desktop-collapse={this.state.collapseDesktop}
        >
          <Container fluid>
            {/* Toggler */}
            <button className="navbar-toggler" type="button" onClick={this.toggleCollapse}>
              <span className="navbar-toggler-icon" />
            </button>
            {/* Brand */}
            {logo ? (
                <div className="brand__container" {...navbarBrandProps}>
                  <div alt={logo.imgAlt} className="brand__container--logo" src={logo.imgSrc} />
                  <div className="brand__container--menu" onClick={() => this.toggleCollapseDesktop()} />
                </div>
            ) : null}
            {/* User */}
            <Nav className="align-items-center d-md-none">
              <UncontrolledDropdown nav>
                <DropdownToggle nav className="nav-link-icon">
                  <i className="ni ni-bell-55" />
                </DropdownToggle>
                {/* <DropdownMenu aria-labelledby="navbar-default_dropdown_1" className="dropdown-menu-arrow" right>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu> */}
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle nav>
                  <Media className="align-items-center">
                                    <span className="avatar avatar-sm rounded-circle">
                                        <img alt="..." src={require("../../assets/img/theme/team-1-800x800.jpg")} />
                                    </span>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span>My profile</span>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-settings-gear-65" />
                    <span>Settings</span>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-calendar-grid-58" />
                    <span>Activity</span>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-support-16" />
                    <span>Support</span>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
            {/* Collapse */}
            <Collapse navbar isOpen={this.state.collapseOpen}>
              {/* Collapse header */}
              <div className="navbar-collapse-header d-md-none">
                <Row>
                  {logo ? (
                      <Col className="collapse-brand" xs="6">
                        {logo.innerLink ? (
                            <Link to={logo.innerLink}>
                              <img alt={logo.imgAlt} src={logo.imgSrc} />
                            </Link>
                        ) : (
                            <a href={logo.outterLink}>
                              <img alt={logo.imgAlt} src={logo.imgSrc} />
                            </a>
                        )}
                      </Col>
                  ) : null}
                  <Col className="collapse-close" xs="6">
                    <button className="navbar-toggler" type="button" onClick={this.toggleCollapse}>
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>
              {/* Form */}
              <Form className="mt-4 mb-3 d-md-none">
                <InputGroup className="input-group-rounded input-group-merge">
                  <Input aria-label="Search" className="form-control-rounded form-control-prepended" placeholder="Search" type="search" />
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <span className="fa fa-search" />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Form>
              <Nav className="nav--logout" navbar>
                {this.createLinks(routes)}
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
    );
  }
}

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
