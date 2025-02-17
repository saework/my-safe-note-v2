import React, { useState, useRef, useMemo, useContext, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Row, Col, Form, Button } from "react-bootstrap";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";
//import { loadNoteBodyFromServer, saveNoteToServer, saveNotebookToServer, loadNoteDocxFromServer } from "../api/note-api";
import {
  loadNoteBodyFromServer,
  saveNoteToServer,
  loadNoteDocxFromServer,
} from "../api/note-api";
// import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { encryptNote, decryptNote } from "../functions";
import EncryptModal from "../components/encrypt-modal.tsx";
import DecryptModal from "../components/decrypt-modal.tsx";
import moment from "moment-timezone";
import noteConfig from "../configs/config";

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
  const [isEncryptMode, setIsEncryptMode] = useState(true);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [notebooksForSelect, setNotebooksForSelect] = useState(notebooks);

  const withoutnotebookFilterName = noteConfig.WITHOUTNOTEBOOK_FILTER_NAME;

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

  //!!!
  useEffect(() => {
    if (notebooks) {
      let notebooksForSelectNewVal = [
        //{ id: -1, name: allnoteFilterName },
        { id: -2, name: withoutnotebookFilterName },
        ...notebooks,
      ];
      setNotebooksForSelect(notebooksForSelectNewVal);
    }
  }, [notebooks]);
  //!!!

  const handleCheckNotebook = (
    notebookIdCheckedVal
    //notebookName: string
  ) => {
    // let notebookIdChecked = notebookIdCheckedVal;

    // console.log("handleCheckNotebook");
    // console.log(notebookIdChecked);
    // //console.log(notebookName);

    // if (notebookIdChecked === -2)
    //   notebookIdChecked = null;

    //setCurrentNotebookId(notebookIdChecked);
    setNotebookId(notebookIdCheckedVal);
    //setCurrentNotebookName(notebookName);
    //dispatch?.({ type: ACTIONS.CHECK_NOTEBOOK_ID, payload: notebookIdChecked });
    //dispatch?.({ type: ACTIONS.CHECK_NOTEBOOK_NAME, payload: notebookName });
  };

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
    let notebookIdVal = notebookId;
    if (notebookId === -1 || notebookId === -2) notebookIdVal = null;

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
        //notebookId: currentNotebookId,
        notebookId: notebookIdVal,
        noteBody: noteBody,
        notePasswordHash: notePasswordHash,
        userId,
      };
    }
    //let result = await saveNoteBodyToServer(userId, currentNoteId, content, setLoading);
    //let result = await saveNoteToServer(note, setLoading);
    console.log("note");
    console.log(note);
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
  const notebookChangeHandler = (e) => {
    setNotebookName(e.target.value);
  };
  const onBlurHandle = (newNoteBody) => {
    //console.log(newNoteBody);
    setNoteBody(newNoteBody);
  };

  const handleEncryptDecryptClick = () => {
    if (isEncryptMode) {
      setEncryptModalShow(true);
    } else {
      setDecryptModalShow(true);
    }
    setIsEncryptMode(!isEncryptMode);
  };

  return (
    <div className="container">
      <div className="note_main-container">
        <div className="note-headpanel_container">
          {/* <Button
              id="buttonNoteMenu"
              type="button"
              //variant="success"
              variant="info"
              // onClick={handleMenuButtonClick}
              className="menu__button"
            >
              Меню
            </Button> */}
          <Button
            onClick={handleSaveNoteToServer}
            id="buttonSaveNote"
            type="button"
            variant="success"
            className="note-headpanel__button"
          >
            {/* <label className="note-headpanel__label">Сохранить заметку</label> */}
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
          >
            {/* Скачать в формате docx */}
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
            {/* {isEncryptMode ? "Зашифровать заметку" : "Расшифровать заметку"} */}
            <label className="note-headpanel__label">{isEncryptMode ? "Зашифровать" : "Расшифровать"}</label>
            {isEncryptMode ? <img
              className="note-headpanel__img"
              src="images/lock.svg"
              alt="lock"
            />: 
            <img
              className="note-headpanel__img"
              src="images/key.svg"
              alt="key"
            />
            }
          </Button>

          <Button
            onClick={handleExitNote}
            id="buttonExitNote"
            type="button"
            variant="danger"
            className="note-headpanel__button"
          >
            {/* Выйти из заметки */}
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
          // InputProps={{
          //   className: 'note-name__textfield' // Применяем класс к внутреннему элементу Input
          // }}
          // className={'note-name__textfield'}
          className="note-name__textfield"
        />

        {/* <Form.Group controlId="formNoteName">
      <Row>
        <Col xs="auto">
          <Form.Label>Название</Form.Label>
        </Col>
        <Col>
          <Form.Control
            type="text"
            value={noteName}
            onChange={noteNameChangeHandler}
            className="note-name__textfield"
          />
        </Col>
      </Row>
    </Form.Group> */}

        {/* <label>Название</label>
        <input
          type="text"
          className="form-control"
          placeholder=""
          aria-describedby="findText"
          value={noteName}
          onChange={noteNameChangeHandler}
        /> */}

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

        {/* <FormControl fullWidth>
            <InputLabel id="notebook-select-label">Блокнот</InputLabel>
            <Select
              labelId="notebook-select-label"
              value={notebookId}
              onChange={(e) => setNotebookId(e.target.value)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400, // Максимальная высота выпадающего меню
                    overflowY: "auto", // Прокрутка
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
          </FormControl> */}

        <FormControl fullWidth>
          <InputLabel id="note-notebook-select-label">Блокнот</InputLabel>
          <Select
            labelId="note-notebook-select-label"
            value={notebookId}
            //onChange={(e) => setNotebookId(e.target.value)}
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
              {/* <label className="notebook-date-text__label">Последние изменения: </label> */}
              <label className="notebook-date-text__label">Изменено: </label>
              {/* <label>{lastChangeDate}</label> */}
              <label>
                {moment
                  .utc(lastChangeDate)
                  .tz(timeZone)
                  .format("DD.MM.YYYY HH:mm")}
              </label>
            </div>
            <div className="notebook-createDate__div">
              {/* <label className="notebook-date-text__label">Дата создания: </label> */}
              <label className="notebook-date-text__label">Создано: </label>
              {/* <label>{createDate}</label> */}
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
      <JoditEditor
        ref={editor}
        value={noteBody}
        config={config}
        tabIndex={1} // tabIndex of textarea
        //onBlur={(newNoteBody) => setNoteBody(newNoteBody)} // preferred to use only this option to update the content for performance reasons
        onBlur={(newNoteBody) => onBlurHandle(newNoteBody)}
      />
      {/* <button onClick={handleSave}>Save</button> */}

      {/* <div className="note-add-container"> 
      <Button
        onClick={handleSaveNoteToServer}
        id="buttonSaveNote"
        type="button"
        variant="success"
        className="note-add__button"
      >
        Сохранить заметку
      </Button>
      </div> */}

      {/* <div>
        <Button
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
      </div> */}
    </div>
  );
};
export default Note;
