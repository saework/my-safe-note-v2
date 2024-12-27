//import React from 'react';
import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import '../style.scss';

interface IProps {
  //handleDeleteRow: () => void;
  handleDecrypt: (password: string) => void
  handleCloseModal: () => void;
  modalShow: boolean;
}

function DecryptModal(props: IProps) {
  //const { modalShow, handleCloseModal, handleDeleteRow } = props;
  const {modalShow, handleCloseModal, handleDecrypt } = props;
  const [password, setPassword] = useState<string>('');
  //const [passwordTrue, setPasswordTrue] = useState<string>('');

  const handleDecryptClick = () => {

    //setPasswordTrue("123"); //!!! сделать обработку!!
    let passwordTrue = "123";
    console.log(password);
    if (password === passwordTrue) {
      handleDecrypt(password);
    } else {
      alert("Не верный пароль!");
    }
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