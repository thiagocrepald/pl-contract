import React from "react";
import { Modal, Row } from "reactstrap";
import IconButton from "../icon-button/icon-button";
import "./basic-modal.scss";

class BasicModal extends React.Component {
  render() {
    const {
      modalTitle,
      messageBody,
      primaryButtonAction,
      primaryButtonTitle,
      secondaryButtonAction,
      secondaryButtonTitle,
      hasTwoButtons,
      showModal,
      toggleModal,
      modalClassName,
      centralized,
      resourcePrimary,
      resourceSecondary,
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
          
          <hr style={{ margin: "0", width: "100%" }} />
          <div className="modal-footer">
            <Row>
              {hasTwoButtons && (
                <div className="basic-modal--button-back">
                  <IconButton
                    color="white"
                    isAlignCenter
                    width={"150px"}
                    height={"44px"}
                    filled
                    clickButton={() => secondaryButtonAction(resourceSecondary)}
                  >
                    <div className="icon-arrow-filled" />
                    {secondaryButtonTitle ? secondaryButtonTitle : secondaryButtonTitle}
                  </IconButton>
                </div>
              )}
              <div className="basic-modal--button-forward">
                <IconButton
                  color="green"
                  isAlignCenter
                  width={"150px"}
                  height={"44px"}
                  filled
                  clickButton={() => primaryButtonAction(resourcePrimary)}
                >
                  {primaryButtonTitle ? primaryButtonTitle : primaryButtonTitle}
                </IconButton>
              </div>
            </Row>
          </div>
        </Modal>
      </>
    );
  }
}

export default BasicModal;
