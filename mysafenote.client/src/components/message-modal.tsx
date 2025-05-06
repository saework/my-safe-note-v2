import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../style.scss";

interface IProps {
  handleExitNote: () => void;
  handleCloseMessageModal: () => void;
  modalShow: boolean;
}

function MessageModal(props: IProps) {
const { modalShow, handleCloseMessageModal, handleExitNote } = props;
//const { modalShow, handleExitNote } = props;

//   const handleCloseModal = () => {
//     handleCloseMessageModal();
//   };

  return (
    <Modal
      show={modalShow}
      onHide={handleCloseMessageModal}
      backdrop="static"
      keyboard={false}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title 
        id="contained-modal-title-vcenter"
        className="message-modal__title"
        // >Выйти без сохранения заметки?</Modal.Title>
        >Выйти без сохранения?</Modal.Title>
      </Modal.Header>
      {/* <Modal.Body>
        <p>Выйти без сохранения заметки?</p>
      </Modal.Body> */}
      <Modal.Footer>
        <Button
          className="delete-modal__button"
          variant="danger"
          onClick={handleExitNote}
        >
          Да
        </Button>
        <Button className="delete-modal__button" onClick={handleCloseMessageModal}>
          Нет
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MessageModal;
