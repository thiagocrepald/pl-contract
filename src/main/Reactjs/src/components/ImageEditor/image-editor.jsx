import "cropperjs/dist/cropper.css";
import React from "react";
import CropperJs from "react-cropper";
import { Button, Modal, Row } from "reactstrap";
import "./image-editor.scss";

class ImageEditorModal extends React.Component {
  cropper = React.createRef(null);
  constructor(props) {
    super(props);
    this.state = {
      rotation: 0,
      zoom: 0.55,
      aspect:
        this.props.width && this.props.height
          ? this.props.width / this.props.height
          : 4 / 3,
      crop: { x: 0, y: 0 },
      image: this.props.image ? this.props.image : null,
      croppedAreaPixels: null,
      height: this.props.height,
      width: this.props.width,
      cropping: false,
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.image != null && this.state.image == null) {
      this.setState({
        image: newProps.image,
      });
    }

    if (newProps.height != null) {
      this.setState({
        height: newProps.height,
      });
    }
    if (newProps.width != null) {
      this.setState({
        width: newProps.width,
      });
    }
  }

  startCropping = () => {
    this.cropper.setDragMode("crop");
    this.setState({
      cropping: true,
    });
  };

  endCroping = () => {
    this.cropper.setDragMode("move");
    this.setState({
      cropping: false,
      image: this.cropper.getCroppedCanvas().toDataURL(),
    });
  };

  onZoomChange = (zoom) => {
    this.cropper.zoom(this.props.zoomRate * zoom);
  };

  onRotationChange = (rotation) => {
    this.setState({ rotation }, () =>
      this.cropper.rotateTo(this.state.rotation)
    );
  };

  componentDidMount() {}

  handleButtonClick = () => {
    this.props.primaryButtonAction(this.cropper.getCroppedCanvas().toDataURL());
  };

  render() {
    const {
      cancelAction,
      showModal,
      toggleModal,
      rotationRate,
    } = this.props;

    const { height, width, cropping } = this.state;

    return (
      <>
        <Modal
          className={"modal-dialog-centered image-editor-modal centralized"}
          isOpen={showModal}
          toggle={toggleModal}
        >
          <div className="modal-header">
            <h5 className="modal-title">{"Alterar imagem"}</h5>
          </div>
          <div className="modal-body">
            <Row
              className="row-cropper-container"
              style={height && width ? { height, width } : {}}
            >
              <CropperJs
                ref={(ref) => (this.cropper = ref)}
                src={this.state.image ? this.state.image : ""}
                style={{ height: "100%", width: "100%" }}
                zoomable
                scalable
                rotatable
                responsive
                movable
                dragMode="move"
                checkCrossOrigin={true}
                autoCrop={false}
                viewMode={1}
              />
            </Row>
            <Row className="row-options-container">
              <i
                id="icon"
                onClick={() => this.onZoomChange(1)}
                class="fa fa-search-plus"
                style={{ color: "#DDDDDD" }}
              />
              <i
                id="icon"
                onClick={() => this.onZoomChange(-1)}
                className="fa fa-search-minus"
                style={{ color: "#DDDDDD" }}
              />
              {!cropping ? (
                <i
                  id="icon"
                  onClick={() => this.startCropping()}
                  className="fa fa-crop"
                  style={{ color: "#DDDDDD" }}
                />
              ) : (
                <i
                  id="icon"
                  onClick={() => this.endCroping()}
                  className="fa fa-check"
                  style={{ color: "#DDDDDD" }}
                />
              )}

              <i
                id="icon"
                onClick={() =>
                  this.onRotationChange(this.state.rotation - rotationRate)
                }
                class="fa fa-undo"
                style={{ color: "#DDDDDD" }}
              />
              <i
                id="icon"
                onClick={() =>
                  this.onRotationChange(this.state.rotation + rotationRate)
                }
                class="fa fa-redo"
                style={{ color: "#DDDDDD" }}
              />
            </Row>
          </div>
          <div className="modal-footer">
            <Row>
              <Button
                color="secondary"
                data-dismiss="modal"
                type="button"
                onClick={() => cancelAction()}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                data-dismiss="modal"
                type="button"
                onClick={() => this.handleButtonClick()}
              >
                Salvar alterações
              </Button>
            </Row>
          </div>
        </Modal>
      </>
    );
  }
}

export default ImageEditorModal;
