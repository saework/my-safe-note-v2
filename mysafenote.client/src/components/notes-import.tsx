//import React from 'react';
import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';
import { exportNotesFromServer, importNotesToServer } from '../api/main-api';

interface IProps {
    handleImportNotesCloseModal: () => void;
    handlerLoadFromServer: () => void;
    importNotesModalShow: boolean;
    userId: number;
  }

function NotesImport(props: IProps) {
    //const {userId} = props;
    // const {userId, importNotesModalShow, handleImportNotesCloseModal, handlerLoadFromServer} = props;
    const {userId, importNotesModalShow, handleImportNotesCloseModal, handlerLoadFromServer} = props;
    const [file, setFile] = useState(null);

//   const handlerExportNotesFromServer = () => {
//     // Логика для выгрузки заметок
//     console.log("Выгрузка заметок...");
//   };

//   const handleFileChange = (event) => {
//     // Логика для обработки изменения файла
//     console.log(event.target.files[0]);
//   };

//   const handlerImportNotesToServer = () => {
//     // Логика для загрузки заметок
//     console.log("Загрузка заметок...");
//   };

 const handlerImportNotesToServer = async function (){
    console.log("handlerImportNotesToServer");
  
    if (!file) {
      //alert('Пожалуйста, выберите zip-файл для загрузки.');
      return;
    }
    //await importNotesToServer(userId, file);
    var result = await importNotesToServer(userId, file);
    //console.log(result);
    if (result === true)
    {
      handlerLoadFromServer();
      setFile(null);
      handleImportNotesCloseModal();
    }
  }
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <Modal show={importNotesModalShow} onHide={handleImportNotesCloseModal} backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Загрузка заметок</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
            <Form.Group controlId="formFile" className="mb-3">
              {/* <Form.Label>Выберите файл для загрузки</Form.Label> */}
              <Form.Control 
                type="file" 
                accept=".zip" 
                onChange={handleFileChange} 
              />
            </Form.Group>
            <Button 
              onClick={handlerImportNotesToServer} 
              variant="primary" 
              type="button"
              disabled={!file}
            >
              Загрузить заметки
            </Button>
          </Form>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button onClick={handleImportNotesCloseModal}>Закрыть</Button>
      </Modal.Footer> */}
    </Modal>


  );
}  

export default NotesImport;