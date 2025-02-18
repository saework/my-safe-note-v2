//import React from 'react';
import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import bcrypt from 'bcryptjs';
import '../style.scss';

interface IProps {
  //handleDeleteRow: () => void;
  notePasswordHash: string; // Храненый хеш пароля
  //handleDecrypt: (password: string) => void
  handleDecrypt: (password: string, notePasswordHash: string) => void
  handleCloseModal: () => void;
  modalShow: boolean;
}

function DecryptModal(props: IProps) {
  //const { modalShow, handleCloseModal, handleDeleteRow } = props;
  const {modalShow, notePasswordHash, handleCloseModal, handleDecrypt } = props;
  const [password, setPassword] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  //const [passwordTrue, setPasswordTrue] = useState<string>('');

  const handleDecryptClick = async () => {
       console.log(`notePasswordHash - ${notePasswordHash}`);
       if (!password)
        {
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
          //alert("Неверный пароль!");
          setAlertMessage("Неверный пароль!")
        }
  };

    const handleButtonClose = () => {
      setPassword("");
      setAlertMessage("");
      handleCloseModal();
    }

  return (
    // <Modal show={modalShow} onHide={handleCloseModal} backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered>
    <Modal show={modalShow} onHide={handleButtonClose} backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Расшифровка заметки</Modal.Title>
      </Modal.Header>
      {/* <Modal.Body className="decrypt-modal__body form-control"> */}
      <Modal.Body className="decrypt-modal__body">
        {/* <p className="encrypt-modal__p">Расшифровать заметку?</p> */}
        <label>Пароль</label>
        <input
          // type="text"
          type="password"
          className="form-control"
          placeholder=""
          aria-describedby="findText"
          value={password}
          //onChange={setPassword}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="decrypt-modal-alert">{alertMessage}</label>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={handleEncrypt}>Да</Button> */}
        <Button className="encrypt-modal__button" onClick={handleDecryptClick}>Да</Button>
        {/* <Button className="encrypt-modal__button" onClick={handleCloseModal}>Отмена</Button> */}
        <Button className="encrypt-modal__button" onClick={handleButtonClose}>Отмена</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DecryptModal;