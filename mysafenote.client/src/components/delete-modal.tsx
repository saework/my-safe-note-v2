import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../style.scss';

interface IProps {
  handleDeleteRow: () => void;
  handleCloseModal: () => void;
  modalShow: boolean;
}

function DeleteModal(props: IProps) {
  const { modalShow, handleCloseModal, handleDeleteRow } = props;

  return (
    <Modal show={modalShow} onHide={handleCloseModal} backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Удаление</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Вы действительно хотите удалить уведомление?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleDeleteRow}>Да</Button>
        <Button onClick={handleCloseModal}>Нет</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
