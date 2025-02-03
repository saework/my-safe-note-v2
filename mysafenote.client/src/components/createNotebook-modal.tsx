//import React from 'react';
import React, { useState, useContext } from "react";
import { Modal, Button } from 'react-bootstrap';
import { saveNotebookToServer } from "../api/notebook-api";
import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";
import '../style.scss';

interface IProps {
  handleNotebookCloseModal: () => void;
  handleCheckNotebook: (currentNotebookId: number, currentNotebookName: string) => void
  notebookModalShow: boolean;
  userId: number;
}

function CreateNotebookModal(props: IProps) {
  const dispatch = useContext(DispatchContext);
  //const notesState = useContext(StateContext);

  const { notebookModalShow,  userId, handleNotebookCloseModal, handleCheckNotebook } = props;
  const [notebookName, setNotebookName] = useState<string>('');

  const handleCreateNotebookClick = async () => {
    let notebookId = 0;
    
    let notebookData = {
      id: notebookId,
      name: notebookName,
      userId
    };
    console.log("saveNotebookResult");
    let savedNotebookId = await saveNotebookToServer(notebookData);
    if (savedNotebookId > 0)
    {
        if (dispatch) {
          let resNotebookData = {
            id: savedNotebookId,
            name: notebookName,
            userId
          };
          dispatch({ type: ACTIONS.ADD_NOTEBOOK, payload: resNotebookData });
          //dispatch({ type: ACTIONS.CHECK_NOTEBOOK_ID, payload: resNotebookData.id });
          //dispatch({ type: ACTIONS.CHECK_NOTEBOOK_NAME, payload: resNotebookData.name });
          handleCheckNotebook(resNotebookData.id, resNotebookData.name);
          console.log(resNotebookData.id);
        }
    }
    handleNotebookCloseModal();
  };

  return (
    <Modal show={notebookModalShow} onHide={handleNotebookCloseModal} backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Создание блокнота</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <p>Расшифровать заметку?</p> */}
        <label>Название</label>
        <input
          type="text"
          className="form-control"
          placeholder=""
          aria-describedby="findText"
          value={notebookName}
          onChange={(e) => setNotebookName(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCreateNotebookClick}>Создать</Button>
        <Button onClick={handleNotebookCloseModal}>Отмена</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateNotebookModal;