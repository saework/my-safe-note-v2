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
  const [alertMessage, setAlertMessage] = useState<string>('');

  const handleEncryptClick = async () => {
    if (!password || !passwordRpt)
    {
      setAlertMessage("Заполните обязательные поля!");
      return;
    }
    if (password === passwordRpt) {

      // Хешируем пароль
      const salt = await bcrypt.genSalt(10);
      const notePasswordHash = await bcrypt.hash(password, salt);
      handleEncrypt(password, notePasswordHash);
      setPassword("");
      setPasswordRpt("");
      setAlertMessage("");
      //handleEncrypt(password);
    } else {
      //alert("Пароли не совпадают!");
      setAlertMessage("Пароли не совпадают!")  
    }
  };

  const handleButtonClose = () => {
    setPassword("");
    setPasswordRpt("");
    setAlertMessage("");
    handleCloseModal();
  }

  return (
    <Modal
      show={modalShow}
      // onHide={handleCloseModal}
      onHide={handleButtonClose}
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
      <Modal.Body className="decrypt-modal__body">
        <p className="encrypt-modal__p">Зашифровать заметку?</p>
        <label>Пароль</label>
        <input
          // type="text"
          required
          type="password"
          className="form-control"
          placeholder=""
          aria-describedby="findText"
          value={password}
          //onChange={setPassword}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Повтор пароля</label>
        <input
          required
          // type="text"
          type="password"
          className="form-control"
          placeholder=""
          aria-describedby="findText"
          value={passwordRpt}
          //onChange={setPassword}
          onChange={(e) => setPasswordRpt(e.target.value)}
        />
        <label className="decrypt-modal-alert">{alertMessage}</label>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={handleEncrypt}>Да</Button> */}
        <Button className="encrypt-modal__button" onClick={handleEncryptClick}>Да</Button>
        {/* <Button className="encrypt-modal__button" onClick={handleCloseModal}>Отмена</Button> */}
        <Button className="encrypt-modal__button" onClick={handleButtonClose}>Отмена</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EncryptModal;
