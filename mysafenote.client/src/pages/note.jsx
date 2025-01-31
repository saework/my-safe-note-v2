import React, { useState, useRef, useMemo, useContext, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";
//import { loadNoteBodyFromServer, saveNoteToServer, saveNotebookToServer, loadNoteDocxFromServer } from "../api/note-api";
import {
  loadNoteBodyFromServer,
  saveNoteToServer,
  loadNoteDocxFromServer,
} from "../api/note-api";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { encryptNote, decryptNote } from "../functions";
import EncryptModal from "../components/encrypt-modal.tsx";
import DecryptModal from "../components/decrypt-modal.tsx";

const Note = () => {
  //const {noteId, userId} = props;
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
  //const [password, setPassword] = useState('');

  const [notePasswordHash, setNotePasswordHash] = useState("");

  const [encryptedNote, setEncryptedNote] = useState("");
  const [decryptedNote, setDecryptedNote] = useState("");
  const [error, setError] = useState("");

  //const [userUnfold, setUserUnfold] = useState(true);
  //const [isModal, setModal] = useState(false);

  // const currentUser = notesState.currentUser;
  // const jwtToken = notesState.jwtToken;
  // const noteRows = notesState.noteRows;
  //const noteId = notesState.currentNoteId;

  //!!!comm
  // const userId = notesState.userId;
  // const currentNoteId = notesState.currentNoteId;
  // const currentNotebookId = notesState.currentNotebookId;
  // const notebooks = notesState.notebooks;
  //!!!comm

  //const userId = 1; //!!!убрать!

  useEffect(() => {
    // if (userId ===0 || !userId || currentNoteId===0){
    if (userId ===0 || !userId){
      const loginDataJSON = localStorage.getItem('loginData');
      if (loginDataJSON)
      {
        const loginData = JSON.parse(loginDataJSON);
        dispatch({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
        navigate('/main');
      }
    }
  }, [userId, currentNoteId]);

  useEffect(() => {
    //const userId = notesState.userId;
    //const currentNoteId = notesState.currentNoteId;
    if (needLoadNoteBody) {
      console.log(notesState);
      console.log(`UserId:${userId}`);
      console.log(`currentNoteId:${currentNoteId}`);
      if (currentNoteId && userId != 0) {
        handlerLoadNoteBodyFromServer();
        setNeedLoadNoteBody(false);
        //dispatch({ type: "NEED_LOAD_DATA", payload: false });
      }
    }
  });

  const handlerLoadNoteBodyFromServer = async function () {
    //let data = await loadNotesDataFromServer(currentUser, setLoading);
    //let noteBodyFromServer = await loadNoteBodyFromServer(userId, currentNoteId, setLoading);
    let noteDataFromServer = await loadNoteBodyFromServer(
      userId,
      currentNoteId
    );
    console.log("loadNoteBodyFromServer");
    //console.log(noteDataFromServer);
    if (noteDataFromServer) {
      setNoteName(noteDataFromServer.noteName);
      setCreateDate(noteDataFromServer.createDate);
      setLastChangeDate(noteDataFromServer.lastChangeDate);
      setNoteBody(noteDataFromServer.noteBody);
      setNotebookName(noteDataFromServer.notebookName);
      setNotebookId(noteDataFromServer.notebookId);
      setNotePasswordHash(noteDataFromServer.notePasswordHash);
    }
    // dispatch({ type: "LOAD_BD", payload: data });
  };

  //const handleSaveNoteBodyToServer = () => {
  const handleSaveNoteToServer = async function () {
    console.log("handleSaveNoteToServer");
    //console.log(noteBody);
    let note;

    //const date = moment().format("DD.MM.YYYY HH.mm.ss");
    const date = new Date();
    //const currDate = new Date();
    //const date = currDate.toISOString()
    //console.log(date);

    //console.log(`currentNoteId =${currentNoteId}`);
    //console.log(currentNotebookId);

    if (currentNoteId == 0) {
      //если новая заметка
      note = {
        noteId: currentNoteId,
        title: noteName,
        createDate: date,
        lastChangeDate: date,
        // createDate: date.toISOString(), // Используем ISO формат
        // lastChangeDate: date.toISOString(), // Используем ISO формат
        //notebookId: currentNotebookId,
        notebookId: notebookId,
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
        //notebookId: currentNotebookId,
        notebookId: notebookId,
        noteBody: noteBody,
        notePasswordHash: notePasswordHash,
        userId,
      };
    }
    //let result = await saveNoteBodyToServer(userId, currentNoteId, content, setLoading);
    //let result = await saveNoteToServer(note, setLoading);
    //console.log(note);
    let saveNoteResult = await saveNoteToServer(note);
    console.log(saveNoteResult);

    //!!!
    // notebookData = {
    //   notebookId: currentNotebookId,
    //   notebookName: notebookName,
    //   userId
    // };

    // let saveNotebookResult = await saveNotebookToServer(notebook);
    // console.log(saveNotebookResult);
    //!!!
  };

  const handleExitNote = () => {
    dispatch({ type: ACTIONS.CHECK_ID_ROW, payload: 0 });
    dispatch({ type: "NEED_LOAD_DATA", payload: true }); //!!!можно  оптимизировать - обновить state вместо загрузи из бд!
    const url = "/main";
    navigate(url);
  };

  const handleLoadNoteDocxFromServer = async function () {
    let result = await loadNoteDocxFromServer(currentNoteId, noteName);
    console.log(`loadNoteDocxFromServer result = ${result}`);
  };

  // const handleDelButtonClick = (NoteRowId : number) => {
  //   setDelRowId(NoteRowId);
  //   console.log(NoteRowId);
  //   setModalShow(true);
  // };

  // Функция для шифрования заметки
  //const handleEncrypt = async (password) => {
  //const encryptedBody = encryptNote(noteBody, password);
  const handleEncrypt = async (password, notePasswordHash) => {
    //const encryptedBody = encryptNote(noteBody, notePasswordHash);
    const encryptedBody = encryptNote(noteBody, password);
    //console.log(encryptedBody);
    setNoteBody(encryptedBody);
    //console.log(`handleEncrypt noteBody = ${noteBody}`);
    setEncryptModalShow(false);
    //handleSaveNoteToServer();
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

    let result = await saveNoteToServer(note);
    console.log(result);

    // setEncryptedNote(encryptedBody);
    // setDecryptedNote(''); // Сбросить расшифрованную заметку
    // setEncryptModalShow(false);

    // try {
    //     const encrypted = encryptNote(note, password);
    //     setEncryptedNote(encrypted);
    //     setDecryptedNote(''); // Сбросить расшифрованную заметку
    //     setError(''); // Сбросить ошибку
    // } catch (error) {
    //     setError(error.message);
    // }
  };

  //!!!
  const handleDecrypt = (password, notePasswordHash) => {
    //console.log("Зашифрованная заметка:", noteBody);
    //console.log("Введенный пароль:", password);
    //console.log("Хеш пароля:", notePasswordHash);

    try {
      //noteBody = "U2FsdGVkX18SUC6B4figL6jypnTd2uhJ4U3TY7NP6Bo="; //!!!убрать!!
      const decryptedBody = decryptNote(noteBody, password);
      //console.log("Расшифрованная заметка:", decryptedBody);
      setNoteBody(decryptedBody);
      setNotePasswordHash(notePasswordHash);
      setDecryptModalShow(false);
      handleSaveNoteToServer();
    } catch (error) {
      console.error("Ошибка при расшифровке:", error);
      alert("Ошибка при расшифровке: " + error.message);
    }
  };
  //!!!

  // // Функция для дешифрования заметки
  // const handleDecrypt = (password, notePasswordHash) => {
  // //  const handleDecrypt = (notePasswordHash) => {
  //   const decryptedBody = decryptNote(noteBody, password);
  //   //const decryptedBody = decryptNote(noteBody, notePasswordHash);
  //   console.log(decryptedBody);
  //   setNoteBody(decryptedBody);
  //   setNotePasswordHash(notePasswordHash);
  //   //setNotePasswordHash(notePasswordHash);
  //   setDecryptModalShow(false);
  //   handleSaveNoteToServer();

  //   // const decryptedBody = decryptNote(encryptedNote, password);
  //   // setDecryptedNote(decryptedBody);
  //   // setEncryptedNote(''); // Сбросить расшифрованную заметку
  //   // setDecryptModalShow(false);

  //     // try {
  //     //     const originalNote = decryptNote(encryptedNote, password);
  //     //     setDecryptedNote(originalNote);
  //     //     setError(''); // Сбросить ошибку
  //     // } catch (error) {
  //     //     setError(error.message);
  //     // }
  // };

  //     // Функция для дешифрования заметки
  // const handleDecrypt = (password) => {
  //   const decryptedBody = decryptNote(noteBody, password);
  //   //const decryptedBody = decryptNote(noteBody, notePasswordHash);
  //   console.log(decryptedBody);
  //   setNoteBody(decryptedBody);
  //   setNotePasswordHash(password);
  //   //setNotePasswordHash(notePasswordHash);
  //   setDecryptModalShow(false);
  //   handleSaveNoteToServer();
  // };

  // const config = useMemo(
  // 	{
  // 		readonly: false, // all options from https://xdsoft.net/jodit/docs/,
  // 		placeholder: placeholder || 'Start typings...'
  // 	},
  // 	[placeholder]
  // );

  // const config =
  // {
  // 	readonly: false,
  // 	placeholder:  'Start typings...',
  // 	i18n: 'ru'
  // }

  const config = {
    buttons: [
      "bold",
      "italic",
      "underline",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "image",
      "undo",
      "redo",
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
  const notebookChangeHandler = (e) => {
    setNotebookName(e.target.value);
  };
  const onBlurHandle = (newNoteBody) => {
    //console.log(newNoteBody);
    setNoteBody(newNoteBody);
  };

  return (
    <div>
      <div>
        <label>Название</label>
        <input
          type="text"
          className="form-control"
          placeholder=""
          aria-describedby="findText"
          value={noteName}
          onChange={noteNameChangeHandler}
        />
        {/* <label>Блокнот</label>
        <input
          type="text"
          className="form-control"
          placeholder=""
          aria-describedby="findText"
          value={notebookName}
          // onChange={notebookChangeHandler}  //!!!обработать!!
          readonly
        /> */}
        
        {/* <label>Блокнот</label>
        <select
          // className="note-notebook__select"
          className="form-control note-notebook__select"
          value={notebookId} // используйте notebookId для отслеживания выбранного блока
          onChange={(e) => setNotebookId(e.target.value)} // обновляем состояние при выборе
          // style={{ maxHeight: "100px", overflowY: "auto" }} // стиль для прокрутки
        >
          {notebooks.length > 0 ? (
            notebooks.map((notebook) => (
              <option key={notebook.id} value={notebook.id}>
                {notebook.name}
              </option>
            ))
          ) : (
            <option disabled>Нет доступных блокнотов</option>
          )}
        </select> */}

    <div>
      <FormControl fullWidth>
        <InputLabel id="notebook-select-label">Блокнот</InputLabel>
        <Select
          labelId="notebook-select-label"
          value={notebookId}
          onChange={(e) => setNotebookId(e.target.value)}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400, // Максимальная высота выпадающего меню
                overflowY: 'auto', // Прокрутка
              },
            },
          }}
        >
          {notebooks.length > 0 ? (
            notebooks.map((notebook) => (
              <MenuItem key={notebook.id} value={notebook.id}>
                {notebook.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Нет доступных блокнотов</MenuItem>
          )}
        </Select>
      </FormControl>
    </div>

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
      <JoditEditor
        ref={editor}
        value={noteBody}
        config={config}
        tabIndex={1} // tabIndex of textarea
        //onBlur={(newNoteBody) => setNoteBody(newNoteBody)} // preferred to use only this option to update the content for performance reasons
        onBlur={(newNoteBody) => onBlurHandle(newNoteBody)}

        //onChange={(newNoteBody) => {}}
        //onChange={(newNoteBody) => onBlurHandle(newNoteBody)}

        //  onChange={(newNoteBody) => setNoteBody(newNoteBody)}
      />
      {/* <button onClick={handleSave}>Save</button> */}
      <Button
        onClick={handleSaveNoteToServer}
        id="buttonSaveNote"
        type="button"
        variant="success"
        size="lg"
        block
        className="main-form__button-add"
      >
        Сохранить заметку
      </Button>
      <Button
        onClick={handleExitNote}
        id="buttonExitNote"
        type="button"
        variant="danger"
        size="lg"
        block
        className="main-form__button-add"
      >
        Выйти из заметки
      </Button>
      <Button
        onClick={handleLoadNoteDocxFromServer}
        id="buttonExitNote"
        type="button"
        variant="success"
        size="lg"
        block
        className="main-form__button-add"
      >
        Скачать в формате docx
      </Button>
      <div>
        <Button
          // onClick={handleEncrypt}
          //onClick={setEncrypteModalShow(true)}
          onClick={() => setEncryptModalShow(true)}
          id="buttonExitNote"
          type="button"
          variant="success"
          size="lg"
          block
          className="main-form__button-add"
        >
          Зашифровать заметку
        </Button>
        <Button
          onClick={() => setDecryptModalShow(true)}
          id="buttonExitNote"
          type="button"
          variant="success"
          size="lg"
          block
          className="main-form__button-add"
        >
          Расшифровать заметку
        </Button>
      </div>
    </div>
  );
};
export default Note;
