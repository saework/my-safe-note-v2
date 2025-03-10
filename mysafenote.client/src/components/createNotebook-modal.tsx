import React, { useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { saveNotebookToServer } from "../api/notebook-api";
import { ACTIONS, DispatchContext } from "../state/notes-context";
import "../style.scss";

interface IProps {
  handleNotebookCloseModal: () => void;
  handleCheckNotebook: (
    currentNotebookId: number,
    currentNotebookName: string
  ) => void;
  notebookModalShow: boolean;
  userId: number;
}

function CreateNotebookModal(props: IProps) {
  const dispatch = useContext(DispatchContext);

  const {
    notebookModalShow,
    userId,
    handleNotebookCloseModal,
    handleCheckNotebook,
  } = props;
  const [notebookName, setNotebookName] = useState<string>("");

  const handleCreateNotebookClick = async () => {
    let notebookId = 0;

    let notebookData = {
      id: notebookId,
      name: notebookName,
      userId,
    };
    try {
      let savedNotebookId = await saveNotebookToServer(notebookData);
      if (savedNotebookId > 0) {
        if (dispatch) {
          let resNotebookData = {
            id: savedNotebookId,
            name: notebookName,
            userId,
          };
          dispatch({ type: ACTIONS.ADD_NOTEBOOK, payload: resNotebookData });
          handleCheckNotebook(resNotebookData.id, resNotebookData.name);
        }
      }
    } catch (error) {
      console.error(
        "handleCreateNotebookClick - Ошибка при сохранении блокнота:",
        error
      );
    } finally {
      handleNotebookCloseModal();
    }
  };

  return (
    <Modal
      show={notebookModalShow}
      onHide={handleNotebookCloseModal}
      backdrop="static"
      keyboard={false}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Создание блокнота
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
        <Button
          variant="success"
          className="notebook-modal__button"
          onClick={handleCreateNotebookClick}
        >
          Создать
        </Button>
        <Button
          className="notebook-modal__button"
          onClick={handleNotebookCloseModal}
        >
          Отмена
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateNotebookModal;
