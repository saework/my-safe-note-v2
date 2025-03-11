import React, { useState, useRef, useMemo, useContext, useEffect } from "react";
import JoditEditor from "jodit-react";
// import { Button } from "react-bootstrap";
import {
  // FormControl,
  // InputLabel,
  // Select,
  // MenuItem,
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
import EncryptModal from "../components/encrypt-modal";
import DecryptModal from "../components/decrypt-modal";
// import moment from "moment-timezone";
import noteConfig from "../configs/config";

import NoteButtonsPanel from "../components/note-buttons-panel";
import NoteDatePanel from "../components/note-date-panel";
import NoteNotebookSelect from "../components/note-notebook-select";
import { INoteDto } from "../interfaces";


const Note = () => {
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);
  const notesState = useContext(StateContext);

  if (!notesState) {
    return <div className="notes-loading-data">Загрузка...</div>;
  }

  const userId = notesState.userId;
  const currentNoteId = notesState.currentNoteId;
  const currentNotebookId = notesState.currentNotebookId;
  const notebooks = notesState.notebooks;

  // const editor = useRef(null);
  // const [noteBody, setNoteBody] = useState("");
  // const [createDate, setCreateDate] = useState("");
  // const [lastChangeDate, setLastChangeDate] = useState("");
  // const [title, setTitle] = useState("");
  // const [notebookName, setNotebookName] = useState("");
  // const [notebookId, setNotebookId] = useState(currentNotebookId);
  // const [needLoadNoteBody, setNeedLoadNoteBody] = useState(true);
  // const [encryptModalShow, setEncryptModalShow] = useState(false);
  // const [decryptModalShow, setDecryptModalShow] = useState(false);
  // const [notePasswordHash, setNotePasswordHash] = useState("");
  // // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // const [notebooksForSelect, setNotebooksForSelect] = useState(notebooks);

  // const editor = useRef<any>(null);
  // const [noteBody, setNoteBody] = useState<string>("");
  // const [createDate, setCreateDate] = useState<string>("");
  // const [lastChangeDate, setLastChangeDate] = useState<string>("");
  // const [title, setTitle] = useState<string>("");
  // const [notebookName, setNotebookName] = useState<string>("");
  // const [notebookId, setNotebookId] = useState<number>(currentNotebookId);
  // const [needLoadNoteBody, setNeedLoadNoteBody] = useState<boolean>(true);
  // const [encryptModalShow, setEncryptModalShow] = useState<boolean>(false);
  // const [decryptModalShow, setDecryptModalShow] = useState<boolean>(false);
  // const [notePasswordHash, setNotePasswordHash] = useState<string>("");
  // const [notebooksForSelect, setNotebooksForSelect] = useState<any[]>(notebooks);


  const editor = useRef<any>(null);
  const [noteBody, setNoteBody] = useState<string>("");
  const [createDate, setCreateDate] = useState<Date | null>(null);
  const [lastChangeDate, setLastChangeDate] = useState<Date | null>(null);
  const [title, setTitle] = useState<string>("");
  const [notebookName, setNotebookName] = useState<string>("");
  const [notebookId, setNotebookId] = useState<number | null>(currentNotebookId);
  const [needLoadNoteBody, setNeedLoadNoteBody] = useState<boolean>(true);
  const [encryptModalShow, setEncryptModalShow] = useState<boolean>(false);
  const [decryptModalShow, setDecryptModalShow] = useState<boolean>(false);
  const [notePasswordHash, setNotePasswordHash] = useState<string>("");
  const [notebooksForSelect, setNotebooksForSelect] = useState<any[]>(notebooks);

  const withoutnotebookFilterName = noteConfig.WITHOUTNOTEBOOK_FILTER_NAME;

  useEffect(() => {
    if (userId === 0 || !userId) {
      const loginDataJSON = localStorage.getItem("loginData");
      if (loginDataJSON) {
        const loginData = JSON.parse(loginDataJSON);
        dispatch?.({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
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

  const handleCheckNotebook = (notebookIdCheckedVal: number) => {
    setNotebookId(notebookIdCheckedVal);
  };

  const handlerLoadNoteBodyFromServer = async () => {
    let noteDataFromServer = await loadNoteBodyFromServer(
      userId,
      currentNoteId
    );
    console.log("loadNoteBodyFromServer");
    if (noteDataFromServer) {
      setTitle(noteDataFromServer.title);
      setCreateDate(noteDataFromServer.createDate);
      setLastChangeDate(noteDataFromServer.lastChangeDate);
      setNoteBody(noteDataFromServer.noteBody || "");
      setNotebookName(noteDataFromServer.notebookName || "");
      setNotebookId(noteDataFromServer.notebookId || null);
      setNotePasswordHash(noteDataFromServer.notePasswordHash || "");
    }
  };

  const handleSaveNoteToServer = async () => {
    console.log("handleSaveNoteToServer");
    let note: INoteDto;
    const date = new Date();
    let notebookIdVal = notebookId;
    if (notebookId === -1 || notebookId === -2) notebookIdVal = null;

    if (currentNoteId == 0) {
      //если новая заметка
      note = {
        noteId: currentNoteId,
        title: title,
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
        title: title,
        createDate: createDate || date,
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
    dispatch?.({ type: ACTIONS.CHECK_ID_ROW, payload: 0 });
    dispatch?.({ type: "NEED_LOAD_DATA", payload: true }); //!!!можно  оптимизировать - обновить state вместо загрузи из бд!
    const url = "/main";
    navigate(url);
  };

  const handleLoadNoteDocxFromServer = async () => {
    await loadNoteDocxFromServer(currentNoteId, title);
  };

  // Функция для шифрования заметки
  const handleEncrypt = async (password: string, notePasswordHash: string) => {
    const encryptedBody = encryptNote(noteBody, password);
    setNoteBody(encryptedBody);
    setEncryptModalShow(false);
    const date = new Date();
    setNotePasswordHash(notePasswordHash);
    let note : INoteDto = {
      noteId: currentNoteId,
      title: title,
      createDate: createDate || date,
      lastChangeDate: date,
      notebookId: notebookId,
      noteBody: encryptedBody,
      notePasswordHash: notePasswordHash,
      userId,
    };
    await saveNoteToServer(note);
  };

  const handleDecrypt = async (password: string) => {
    try {
      const decryptedBody = decryptNote(noteBody, password);
      setNoteBody(decryptedBody);
      setNotePasswordHash("");
      setDecryptModalShow(false);

      const date = new Date();
      let note: INoteDto = {
        noteId: currentNoteId,
        title: title,
        createDate: createDate || date,
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

  const config : any = {
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

  const titleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const onBlurHandle = (newNoteBody: string) => {
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
        <NoteButtonsPanel
          handleSaveNoteToServer={handleSaveNoteToServer}
          handleLoadNoteDocxFromServer={handleLoadNoteDocxFromServer}
          notePasswordHash={notePasswordHash}
          handleEncryptDecryptClick={handleEncryptDecryptClick}
          handleExitNote={handleExitNote}
        />

        <TextField
          label="Название"
          variant="outlined"
          value={title}
          onChange={titleChangeHandler}
          className="note-name__textfield"
        />

        <NoteNotebookSelect 
          handleCheckNotebook={handleCheckNotebook}
          notebookId={notebookId}
          notebooksForSelect={notebooksForSelect}
        />

        <NoteDatePanel
          lastChangeDate={lastChangeDate}
          createDate={createDate}
        />
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
          // tabIndex={1} // tabIndex textarea
          onBlur={(newNoteBody) => onBlurHandle(newNoteBody)}
          className={
            notePasswordHash ? "jodit-note-editor-block" : "jodit-note-editor"
          }
        />

        {notePasswordHash && (
          <div className="jodit-block-container">
            <img src="images/lock.svg" alt="lock" />
          </div>
        )}
      </div>
      
    </div>
  );
};
export default Note;
