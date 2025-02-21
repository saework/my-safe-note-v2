import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import bcrypt from "bcryptjs";
import "../style.scss";

interface IProps {
  notePasswordHash: string;
  handleDecrypt: (password: string, notePasswordHash: string) => void;
  handleCloseModal: () => void;
  modalShow: boolean;
}

function DecryptModal(props: IProps) {
  const { modalShow, notePasswordHash, handleCloseModal, handleDecrypt } =
    props;
  const [password, setPassword] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");

  const handleDecryptClick = async () => {
    console.log(`notePasswordHash - ${notePasswordHash}`);
    if (!password) {
      setAlertMessage("Введите пароль!");
      return;
    }
    // Проверяем введенный пароль с хешем
    const isMatch = await bcrypt.compare(password, notePasswordHash);
    if (isMatch) {
      handleDecrypt(password, notePasswordHash); // Если пароли совпадают, вызываем handleDecrypt
      setPassword("");
      setAlertMessage("");
    } else {
      setAlertMessage("Неверный пароль!");
    }
  };
  const handleButtonClose = () => {
    setPassword("");
    setAlertMessage("");
    handleCloseModal();
  };

  return (
    <Modal
      show={modalShow}
      onHide={handleButtonClose}
      backdrop="static"
      keyboard={false}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Расшифровка заметки
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="decrypt-modal__body">
        <label>Пароль</label>
        <input
          type="password"
          className="form-control"
          placeholder=""
          aria-describedby="findText"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="decrypt-modal-alert">{alertMessage}</label>
      </Modal.Body>
      <Modal.Footer>
        <Button className="encrypt-modal__button" onClick={handleDecryptClick}>
          Да
        </Button>
        <Button className="encrypt-modal__button" onClick={handleButtonClose}>
          Отмена
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DecryptModal;
