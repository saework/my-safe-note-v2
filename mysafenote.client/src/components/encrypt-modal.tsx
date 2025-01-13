//import React from 'react';
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import bcrypt from "bcryptjs";
import "../style.scss";

interface IProps {
  //handleDeleteRow: () => void;
  //handleEncrypt: (password: string) => void
  handleEncrypt: (password:string, hashedPassword: string) => void;
  handleCloseModal: () => void;
  modalShow: boolean;
}

function EncryptModal(props: IProps) {
  //const { modalShow, handleCloseModal, handleDeleteRow } = props;
  const { modalShow, handleCloseModal, handleEncrypt } = props;
  const [password, setPassword] = useState<string>("");
  const [passwordRpt, setPasswordRpt] = useState<string>("");

  const handleEncryptClick = async () => {
    if (password === passwordRpt) {

      // Хешируем пароль
      const salt = await bcrypt.genSalt(10);
      const notePasswordHash = await bcrypt.hash(password, salt);
      handleEncrypt(password, notePasswordHash);

      //handleEncrypt(password);
    } else {
      alert("Пароли не совпадают!");
    }
  };

  return (
    <Modal
      show={modalShow}
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Шифрование заметки
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Зашифровать заметку?</p>
        <label>Пароль</label>
        <input
          type="text"
          className="form-control"
          placeholder=""
          aria-describedby="findText"
          value={password}
          //onChange={setPassword}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Повтор пароля</label>
        <input
          type="text"
          className="form-control"
          placeholder=""
          aria-describedby="findText"
          value={passwordRpt}
          //onChange={setPassword}
          onChange={(e) => setPasswordRpt(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={handleEncrypt}>Да</Button> */}
        <Button onClick={handleEncryptClick}>Да</Button>
        <Button onClick={handleCloseModal}>Отмена</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EncryptModal;
