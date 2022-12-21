import React from "react";
import { Modal } from "reactstrap";
import "./modal-doctors-who-are-waiting.scss";

class ModalDoctorsWhoAreWating extends React.Component {
  render() {
    const {
      modalTitle,
      messageBody,
      showModal,
      toggleModal,
      modalClassName,
      centralized,
      inputs,
      onClose
    } = this.props;

    return (
      <>
        <Modal
          className={`modal-dialog-centered custom-basic-modal ${modalClassName ? modalClassName : ""} ${centralized ? "centralized" : ""}`}
          isOpen={showModal}
          toggle={toggleModal}
        >
          <div className="icon-close" onClick={onClose}/>
          <div className="modal-header">
            <h5 className="modal-title">{modalTitle ? modalTitle : ""}</h5>
          </div>
          <div className="modal-body">
            <span>{messageBody ? messageBody : ""}</span>
            {inputs ? inputs : ""}
          </div>
        </Modal>
      </>
    );
  }
}

export default ModalDoctorsWhoAreWating;
