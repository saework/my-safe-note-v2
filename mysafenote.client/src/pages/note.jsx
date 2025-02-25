import React, { useState, useRef, useMemo, useContext, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Button } from "react-bootstrap";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";
import {
  loadNoteBodyFromServer,
  saveNoteToServer,
  loadNoteDocxFromServer,
} from "../api/note-api";
import { useNavigate } from "react-router-dom";
import { encryptNote, decryptNote } from "../functions";
import EncryptModal from "../components/encrypt-modal.tsx";
import DecryptModal from "../components/decrypt-modal.tsx";
import moment from "moment-timezone";
import noteConfig from "../configs/config";

const Note = () => {
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);
  const notesState = useContext(StateContext);

  const userId = notesState.userId;
  const currentNoteId = notesState.currentNoteId;
  const currentNotebookId = notesState.currentNotebookId;
  const notebooks = notesState.notebooks;
  const editor = useRef(null);
  const [noteBody, setNoteBody] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [lastChangeDate, setLastChangeDate] = useState("");
  const [noteName, setNoteName] = useState("");
  const [notebookName, setNotebookName] = useState("");
  const [notebookId, setNotebookId] = useState(currentNotebookId);
  const [needLoadNoteBody, setNeedLoadNoteBody] = useState(true);
  const [encryptModalShow, setEncryptModalShow] = useState(false);
  const [decryptModalShow, setDecryptModalShow] = useState(false);
  const [notePasswordHash, setNotePasswordHash] = useState("");
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [notebooksForSelect, setNotebooksForSelect] = useState(notebooks);
  const withoutnotebookFilterName = noteConfig.WITHOUTNOTEBOOK_FILTER_NAME;

  useEffect(() => {
    if (userId === 0 || !userId) {
      const loginDataJSON = localStorage.getItem("loginData");
      if (loginDataJSON) {
        const loginData = JSON.parse(loginDataJSON);
        dispatch({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
        navigate("/main");
      }
    }
  }, [userId, currentNoteId]);

  useEffect(() => {
    if (needLoadNoteBody) {
      console.log(notesState);
      console.log(`UserId:${userId}`);
      console.log(`currentNoteId:${currentNoteId}`);
      if (currentNoteId && userId != 0) {
        handlerLoadNoteBodyFromServer();
        setNeedLoadNoteBody(false);
      }
    }
  });

  useEffect(() => {
    if (notebooks) {
      let notebooksForSelectNewVal = [
        { id: -2, name: withoutnotebookFilterName },
        ...notebooks,
      ];
      setNotebooksForSelect(notebooksForSelectNewVal);
    }
  }, [notebooks]);

  const handleCheckNotebook = (notebookIdCheckedVal) => {
    setNotebookId(notebookIdCheckedVal);
  };

  const handlerLoadNoteBodyFromServer = async () => {
    let noteDataFromServer = await loadNoteBodyFromServer(
      userId,
      currentNoteId
    );
    console.log("loadNoteBodyFromServer");
    if (noteDataFromServer) {
      setNoteName(noteDataFromServer.noteName);
      setCreateDate(noteDataFromServer.createDate);
      setLastChangeDate(noteDataFromServer.lastChangeDate);
      setNoteBody(noteDataFromServer.noteBody);
      setNotebookName(noteDataFromServer.notebookName);
      setNotebookId(noteDataFromServer.notebookId);
      setNotePasswordHash(noteDataFromServer.notePasswordHash);
    }
  };

  const handleSaveNoteToServer = async () => {
    console.log("handleSaveNoteToServer");
    let note;
    const date = new Date();
    let notebookIdVal = notebookId;
    if (notebookId === -1 || notebookId === -2) notebookIdVal = null;

    if (currentNoteId == 0) {
      //если новая заметка
      note = {
        noteId: currentNoteId,
        title: noteName,
        createDate: date,
        lastChangeDate: date,
        notebookId: notebookIdVal,
        noteBody: noteBody,
        notePasswordHash: notePasswordHash,
        userId,
      };
    } else {
      //если редактирование заметки
      note = {
        noteId: currentNoteId,
        title: noteName,
        createDate: createDate,
        lastChangeDate: date,
        notebookId: notebookIdVal,
        noteBody: noteBody,
        notePasswordHash: notePasswordHash,
        userId,
      };
    }
    await saveNoteToServer(note);
  };

  const handleExitNote = () => {
    dispatch({ type: ACTIONS.CHECK_ID_ROW, payload: 0 });
    dispatch({ type: "NEED_LOAD_DATA", payload: true }); //!!!можно  оптимизировать - обновить state вместо загрузи из бд!
    const url = "/main";
    navigate(url);
  };

  const handleLoadNoteDocxFromServer = async () => {
    await loadNoteDocxFromServer(currentNoteId, noteName);
  };

  // Функция для шифрования заметки
  const handleEncrypt = async (password, notePasswordHash) => {
    const encryptedBody = encryptNote(noteBody, password);
    setNoteBody(encryptedBody);
    setEncryptModalShow(false);
    const date = new Date();
    setNotePasswordHash(notePasswordHash);
    var note = {
      noteId: currentNoteId,
      title: noteName,
      createDate: createDate,
      lastChangeDate: date,
      notebookId: notebookId,
      noteBody: encryptedBody,
      notePasswordHash: notePasswordHash,
      userId,
    };
    await saveNoteToServer(note);
  };

  const handleDecrypt = async (password) => {
    try {
      const decryptedBody = decryptNote(noteBody, password);
      setNoteBody(decryptedBody);
      setNotePasswordHash("");
      setDecryptModalShow(false);

      const date = new Date();
      var note = {
        noteId: currentNoteId,
        title: noteName,
        createDate: createDate,
        lastChangeDate: date,
        notebookId: notebookId,
        noteBody: decryptedBody,
        notePasswordHash: "",
        userId,
      };

      await saveNoteToServer(note);
    } catch (error) {
      console.error("Ошибка при расшифровке:", error);
    }
  };

  const config = {
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "superscript",
      "subscript",
      "paragraph",
      "font",
      "fontsize",
      "brush",
      "eraser",

      "indent",
      "outdent",
      "align",

      "ul",
      "ol",

      "lineHeight",

      "hr",
      "image",
      "table",
      "link",
      "symbols",

      "spellcheck",

      "selectall",
      "cut",
      "copy",
      "paste",

      "undo",
      "redo",
      "find",

      "source",
      "fullsize",
      "preview",
      "print",
    ],
    uploader: { insertImageAsBase64URI: true },
    readonly: false,
    toolbarAdaptive: false,
    language: "ru",
    i18n: "ru",
  };

  const noteNameChangeHandler = (e) => {
    setNoteName(e.target.value);
  };
  const onBlurHandle = (newNoteBody) => {
    setNoteBody(newNoteBody);
  };

  const handleEncryptDecryptClick = () => {
    if (!notePasswordHash) {
      setEncryptModalShow(true);
    } else {
      setDecryptModalShow(true);
    }
  };

  return (
    <div className="container">
      <div className="note_main-container">
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
            disabled={notePasswordHash}
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
        <TextField
          label="Название"
          variant="outlined"
          value={noteName}
          onChange={noteNameChangeHandler}
          className="note-name__textfield"
        />

        <FormControl fullWidth>
          <InputLabel id="note-notebook-select-label">Блокнот</InputLabel>
          <Select
            labelId="note-notebook-select-label"
            value={notebookId}
            onChange={(e) => handleCheckNotebook(Number(e.target.value))}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 400, // Максимальная высота выпадающего меню
                  overflowY: "auto", // Прокрутка
                },
              },
            }}
          >
            {notebooksForSelect.length > 0 ? (
              notebooksForSelect.map((notebook) => (
                <MenuItem key={notebook.id} value={notebook.id}>
                  {notebook.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Нет доступных блокнотов</MenuItem>
            )}
          </Select>
        </FormControl>

        {lastChangeDate && createDate && (
          <div className="notebook-date-container">
            <div className="notebook-lastChangeDate__div">
              <label className="notebook-date-text__label">Изменено: </label>
              <label>
                {moment
                  .utc(lastChangeDate)
                  .tz(timeZone)
                  .format("DD.MM.YYYY HH:mm")}
              </label>
            </div>
            <div className="notebook-createDate__div">
              <label className="notebook-date-text__label">Создано: </label>
              <label>
                {moment.utc(createDate).tz(timeZone).format("DD.MM.YYYY HH:mm")}
              </label>
            </div>
          </div>
        )}
      </div>
      <EncryptModal
        modalShow={encryptModalShow}
        handleCloseModal={() => setEncryptModalShow(false)}
        handleEncrypt={handleEncrypt}
      />
      <DecryptModal
        modalShow={decryptModalShow}
        notePasswordHash={notePasswordHash}
        handleCloseModal={() => setDecryptModalShow(false)}
        handleDecrypt={handleDecrypt}
      />
      <div className="jodit-main-container">
        <JoditEditor
          ref={editor}
          value={noteBody}
          config={config}
          tabIndex={1} // tabIndex textarea
          onBlur={(newNoteBody) => onBlurHandle(newNoteBody)}
          className={
            notePasswordHash ? "jodit-note-editor-block" : "jodit-note-editor"
          }
        />

        {notePasswordHash && (
          <div class="jodit-block-container">
            <img src="images/lock.svg" alt="lock" />
          </div>
        )}
      </div>
    </div>
  );
};
export default Note;
