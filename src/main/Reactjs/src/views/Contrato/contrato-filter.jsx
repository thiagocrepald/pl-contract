import { Button, Grow, makeStyles, Paper, Popper } from "@material-ui/core";
import React from "react";
import "./contrato-filter.scss";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

const ContratoFilter = () => {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Button ref={anchorRef} aria-controls={open ? "menu-list-grow" : undefined} aria-haspopup="true" onClick={handleToggle}>
        Filtrar por ...
        <div className="downarrow-icon" />
      </Button>
      <Popper className="paper-filter" open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}>
            <Paper>
              <div className="filter-body__container">
                <div className="filter-body__container-line">
                  <div className="filter-body__container-line-group">
                    <Checkbox checked={checked} onChange={handleChange} inputProps={{ "aria-label": "primary checkbox" }} />
                    <div>Código</div>
                  </div>
                  <div className="filter-body__container-line-group">
                    <Checkbox checked={checked} onChange={handleChange} inputProps={{ "aria-label": "primary checkbox" }} />
                    <div>Administrador de acesso</div>
                  </div>
                </div>
                <div className="filter-body__container-line">
                  <div className="filter-body__container-line-group">
                    <Checkbox checked={checked} onChange={handleChange} inputProps={{ "aria-label": "primary checkbox" }} />
                    <div>Contratante</div>
                  </div>
                  <div className="filter-body__container-line-group">
                    <Checkbox checked={checked} onChange={handleChange} inputProps={{ "aria-label": "primary checkbox" }} />
                    <div>Cidade/Estado</div>
                  </div>
                </div>
                <div className="filter-body__container-line">
                  <div style={{ maxWidth: "124px" }} className="filter-body__container-line-group">
                    <Checkbox checked={checked} onChange={handleChange} inputProps={{ "aria-label": "primary checkbox" }} />
                    <div>Tipo de serviço</div>
                  </div>
                </div>
                <hr style={{ margin: "10px 0 6px 0" }} />
                <div className="filter-body--title">Filtrar por status</div>
                <div className="filter-body__container-line--second">
                  <div className="group--inactive">
                    <Checkbox checked={checked} onChange={handleChange} inputProps={{ "aria-label": "primary checkbox" }} />
                    <div>Inativo</div>
                  </div>
                  <div className="group--active">
                    <Checkbox checked={checked} onChange={handleChange} inputProps={{ "aria-label": "primary checkbox" }} />
                    <div>Ativo</div>
                  </div>
                </div>
                <hr style={{ margin: "20px 0 16px 0" }} />
                <div className="filter-body__container-buttons">
                  <Link to={`#`}>Limpar filtros</Link>
                  <div style={{ display: "flex" }}>
                    <Link to={`#`}>CANCELAR</Link>
                    <Link style={{ marginLeft: "18px" }} to={`#`}>
                      APLICAR
                    </Link>
                  </div>
                </div>
              </div>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default ContratoFilter;
