import React from "react";
import { Button, Modal, Row } from "reactstrap";
import ContratoAnexoService from "../../services/contrato-anexo-service";
import UtilService from "../../services/util.service";
import "./contrato-anexo-modal.scss";

class ContratoAnexoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formAnexo: {
        listaMedicosVisualizaram: [],
      },
    };
  }

  carregarMedicos = async (id) => {
    await ContratoAnexoService.getById(id).subscribe(
      (data) => {
        if (!!data) {
          this.setState({
            formAnexo: {
              listaMedicosVisualizaram: data.objeto.listaMedicosVisualizaram
                ? data.objeto.listaMedicosVisualizaram
                : [],
            },
          });
        }
      },
      (error) => console.error(error)
    );
  };

  componentWillReceiveProps(newProps) {
    if (newProps.anexo != null) {
      if (newProps.anexo.id != null) {
        this.carregarMedicos(newProps.anexo.id);
      }
    }
  }

  componentDidMount = async () => {
    if (this.props.anexo != null && this.props.anexo.id != null) {
      this.carregarMedicos(this.props.anexo.id);
    }
  };

  baixarAnexo = (e) => {
    const { anexo } = this.props;
    if (anexo.attachment != null) {
      if (anexo.attachment.file != null) {
        UtilService.downloadPdfOrImage(
          anexo.attachment.file,
          anexo.nomeAnexo,
          anexo.tipoAnexo
        );
      } else if (anexo.attachment.processed) {
        UtilService.openPdfOrImageUrl(anexo.attachment.url);
      }
    } else if (anexo && anexo.base64Anexo && anexo.base64Anexo.length > 0) {
      UtilService.downloadPdfOrImage(
        anexo.base64Anexo,
        anexo.nomeAnexo,
        anexo.tipoAnexo
      );
    }
  };

  render() {
    return (
      <>
        <Modal
          className="modal-dialog-centered custom-attachment-modal"
          isOpen={this.props.showModal}
          toggle={this.props.toggleModal}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="modalVisualizarAnexo">
              {this.props.anexo ? this.props.anexo.nomeAnexo : ""}
            </h5>
          </div>
          <div className="modal-body">
            <span>Médicos que visualizaram este informativo:</span>
            <div className="medicos-list">
              {this.state.formAnexo.listaMedicosVisualizaram.length > 0 ? (
                this.state.formAnexo.listaMedicosVisualizaram.map(
                  (item, index) => (
                    <span className="medico-item-name">{item.nome}</span>
                  )
                )
              ) : (
                <span className="medico-item-name">
                  Nenhum médico visualizou este informativo
                </span>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <Row>
              <Button
                color="secondary"
                data-dismiss="modal"
                type="button"
                onClick={this.props.toggleModal}
              >
                Fechar
              </Button>
              <Button
                color="primary"
                data-dismiss="modal"
                type="button"
                onClick={() => this.baixarAnexo()}
              >
                Visualizar
              </Button>
            </Row>
          </div>
        </Modal>
      </>
    );
  }
}

export default ContratoAnexoModal;
