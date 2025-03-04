import React from "react";
import { Button } from "react-bootstrap";

interface IProps {
  handleSaveNoteToServer: () => void;
  handleLoadNoteDocxFromServer: () => void;
  handleEncryptDecryptClick: () => void;
  handleExitNote: () => void;
  notePasswordHash: string;
}

function NoteButtonsPanel(props: IProps) {
  const {
    handleSaveNoteToServer,
    handleLoadNoteDocxFromServer,
    notePasswordHash,
    handleEncryptDecryptClick,
    handleExitNote
  } = props;

  return (
    <>
      <div className="note-headpanel_container">
        <Button
          onClick={handleSaveNoteToServer}
          id="buttonSaveNote"
          type="button"
          variant="success"
          className="note-headpanel__button"
        >
          <label className="note-headpanel__label">Сохранить</label>
          <img
            className="note-headpanel__img"
            src="images/save.svg"
            alt="save"
          />
        </Button>

        <Button
          onClick={handleLoadNoteDocxFromServer}
          id="buttonSaveDocxNote"
          type="button"
          variant="success"
          className="note-headpanel__button"
          // disabled={notePasswordHash}
          disabled={notePasswordHash !== ""}
        >
          <label className="note-headpanel__label">Скачать в docx</label>
          <img
            className="note-headpanel__img"
            src="images/download.svg"
            alt="download"
          />
        </Button>

        <Button
          onClick={handleEncryptDecryptClick}
          id="buttonEncryptNote"
          type="button"
          variant="success"
          className="note-headpanel__button"
        >
          <label className="note-headpanel__label">
            {notePasswordHash ? "Расшифровать" : "Зашифровать"}
          </label>
          {notePasswordHash ? (
            <img
              className="note-headpanel__img"
              src="images/key.svg"
              alt="key"
            />
          ) : (
            <img
              className="note-headpanel__img"
              src="images/lock.svg"
              alt="lock"
            />
          )}
        </Button>

        <Button
          onClick={handleExitNote}
          id="buttonExitNote"
          type="button"
          variant="danger"
          className="note-headpanel__button"
        >
          <label className="note-headpanel__label">Выйти</label>
          <img
            className="note-headpanel__img"
            src="images/exit.svg"
            alt="exit"
          />
        </Button>
      </div>
    </>
  );
}

export default NoteButtonsPanel;
