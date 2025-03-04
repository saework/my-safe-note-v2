import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { importNotesToServer } from "../api/main-api";

interface IProps {
  handleImportNotesCloseModal: () => void;
  handlerLoadFromServer: () => void;
  importNotesModalShow: boolean;
  userId: number;
}

function NotesImport(props: IProps) {
  const {
    userId,
    importNotesModalShow,
    handleImportNotesCloseModal,
    handlerLoadFromServer,
  } = props;
  const [file, setFile] = useState(null);

  const handlerImportNotesToServer = async () => {
    console.log("handlerImportNotesToServer");

    if (!file) {
      return;
    }
    var result = await importNotesToServer(userId, file);
    if (result === true) {
      handlerLoadFromServer();
      setFile(null);
      handleImportNotesCloseModal();
    }
  };
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  return (
    <Modal
      show={importNotesModalShow}
      onHide={handleImportNotesCloseModal}
      backdrop="static"
      keyboard={false}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Загрузка заметок
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
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
    </Modal>
  );
}

export default NotesImport;
