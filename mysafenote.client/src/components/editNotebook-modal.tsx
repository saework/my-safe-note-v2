import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  saveNotebookToServer,
  deleteNotebookFromServer,
} from "../api/notebook-api";
import { ACTIONS, DispatchContext } from "../state/notes-context";
import DeleteModal from "./delete-modal";
import "../style.scss";

interface IProps {
  handleNotebookEditCloseModal: () => void;
  notebookEditModalShow: boolean;
  userId: number;
  currentNotebookId: number;
  currentNotebookName: string;
}

function EditNotebookModal(props: IProps) {
  const dispatch = useContext(DispatchContext);

  const {
    notebookEditModalShow,
    currentNotebookId,
    currentNotebookName,
    userId,
    handleNotebookEditCloseModal,
  } = props;

  const [notebookName, setNotebookName] = useState<string>("");
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  useEffect(() => {
    setNotebookName(currentNotebookName);
  }, [currentNotebookName]);

  const handleEditNotebookClick = async () => {
    let notebookData = {
      id: currentNotebookId,
      name: notebookName,
      userId,
    };
    let savedNotebookId = await saveNotebookToServer(notebookData);
    if (savedNotebookId > 0) {
      if (dispatch != null) {
        dispatch({ type: ACTIONS.NEED_LOAD_DATA, payload: true });
      }
    }
    handleNotebookEditCloseModal();
  };

  const handleDeleteNotebookClick = async () => {
    setDeleteModalShow(true);
  };

  const handleDeleteNotebook = async () => {
    let deleteResult = await deleteNotebookFromServer(currentNotebookId);
    console.log(`handleDeleteNotebook deleteNotebookFromServer result = ${deleteResult}`);
    if (deleteResult === true) {
      if (dispatch != null) {
        dispatch({ type: ACTIONS.NEED_LOAD_DATA, payload: true });
      }
    }
    setDeleteModalShow(false);
    handleNotebookEditCloseModal();
  };

  return (
    <>
      <Modal
        show={notebookEditModalShow}
        onHide={handleNotebookEditCloseModal}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Редактирование блокнота
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
        <Modal.Footer className="notebook-modal__container">
          <Button
            variant="success"
            className="notebook-modal__button"
            onClick={handleEditNotebookClick}
          >
            Сохранить
          </Button>
          <Button
            variant="danger"
            className="notebook-modal__button"
            onClick={handleDeleteNotebookClick}
          >
            Удалить
          </Button>
          <Button
            className="notebook-modal__button"
            onClick={handleNotebookEditCloseModal}
          >
            Отмена
          </Button>
        </Modal.Footer>
      </Modal>
      <DeleteModal
        modalShow={deleteModalShow}
        handleCloseModal={() => setDeleteModalShow(false)}
        handleDeleteRow={handleDeleteNotebook}
        deleteObjectName={"блокнот и все заметки в нем"}
      />
    </>
  );
}

export default EditNotebookModal;
