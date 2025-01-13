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
  //const [passwordTrue, setPasswordTrue] = useState<string>('');

  const handleDecryptClick = async () => {
       console.log(`notePasswordHash - ${notePasswordHash}`);
       
        // Проверяем введенный пароль с хешем
        const isMatch = await bcrypt.compare(password, notePasswordHash);
        if (isMatch) {
          handleDecrypt(password, notePasswordHash); // Если пароли совпадают, вызываем handleDecrypt
        } else {
          alert("Неверный пароль!");
        }


    // let passwordTrue = "123";
    // console.log(password);
    // if (password === passwordTrue) {
    //   handleDecrypt(password);
    // } else {
    //   alert("Не верный пароль!");
    // }

  };

  return (
    <Modal show={modalShow} onHide={handleCloseModal} backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Расшифровка заметки</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Расшифровать заметку?</p>
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
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={handleEncrypt}>Да</Button> */}
        <Button onClick={handleDecryptClick}>Да</Button>
        <Button onClick={handleCloseModal}>Отмена</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DecryptModal;