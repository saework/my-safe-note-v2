import React, { useState, useRef, useMemo, useContext, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";
import { loadNoteBodyFromServer, saveNoteToServer, loadNoteDocxFromServer } from "../api/note-api";
import moment from "moment";
import { Link, useNavigate } from 'react-router-dom';

//var y = `<p>qqq</p>`;

const Note = () => {
  //const {noteId, userId} = props;
  const editor = useRef(null);
  const [noteBody, setNoteBody] = useState("");
  const [noteName, setNoteName] = useState("");
  const [notebookName, setNotebookName] = useState("");

  const [needLoadNoteBody, setNeedLoadNoteBody] = useState(true);

  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);
  const notesState = useContext(StateContext);

  //const [userUnfold, setUserUnfold] = useState(true);
  //const [isModal, setModal] = useState(false);

  // const currentUser = notesState.currentUser;
  // const jwtToken = notesState.jwtToken;
  // const noteRows = notesState.noteRows;
  //const noteId = notesState.currentNoteId;

  const userId = notesState.userId; 
  const currentNoteId = notesState.currentNoteId;

  //const userId = 1; //!!!убрать!

  useEffect(() => {
    
    //const userId = notesState.userId;
    //const currentNoteId = notesState.currentNoteId;
    if (needLoadNoteBody)
    {
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
    //let data = await loadBDfromServer(currentUser, setLoading);
    //let noteBodyFromServer = await loadNoteBodyFromServer(userId, currentNoteId, setLoading);
    let noteDataFromServer = await loadNoteBodyFromServer(userId, currentNoteId);
    console.log("loadNoteBodyFromServer");
    console.log(noteDataFromServer);
    if (noteDataFromServer) {
      setNoteName(noteDataFromServer.noteName);
      setNoteBody(noteDataFromServer.noteBody);
      setNotebookName(noteDataFromServer.notebook);
    }
    // dispatch({ type: "LOAD_BD", payload: data });
  };

  //const handleSaveNoteBodyToServer = () => {
  const handleSaveNoteToServer = async function () {
    console.log(noteBody);
    let note;
    let notePassword = ""; //!!! добавить обработку!
    //const date = moment().format("DD.MM.YYYY HH.mm.ss");
    const date = new Date();
    console.log(`currentNoteId =${currentNoteId}`);
    if  (currentNoteId == 0){  //если новая заметка
    note = {
      noteId: currentNoteId,
      title: noteName,
      createDate: date,
      lastChangeDate: date,
      notebook: notebookName,
      noteBody,
      notePassword,
      userId,
    };
  } else {  //если редактирование заметки
    note = {
      noteId: currentNoteId,
      title: noteName,
      createDate: date, //!!!обработать!!
      lastChangeDate: date,
      notebook: notebookName,
      noteBody,
      notePassword,
      userId
    };
  }
    //let result = await saveNoteBodyToServer(userId, currentNoteId, content, setLoading);
    //let result = await saveNoteToServer(note, setLoading);
    let result = await saveNoteToServer(note);
    console.log(result);
  };

  const handleExitNote = () => {
      dispatch({ type: ACTIONS.CHECK_ID_ROW, payload: 0 });
      dispatch({ type: "NEED_LOAD_DATA", payload: true });  //!!!можно  оптимизировать - обновить state вместо загрузи из бд!
      const url = '/main';
      navigate(url);
  };

  const handleLoadNoteDocxFromServer = async function () {
    let result = await loadNoteDocxFromServer(currentNoteId, noteName);
    console.log(`loadNoteDocxFromServer result = ${result}`);
  };

  

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
    console.log(newNoteBody);
    setNoteBody(newNoteBody)
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
        <label>Блокнот</label>
        <input
          type="text"
          className="form-control"
          placeholder=""
          aria-describedby="findText"
          value={notebookName}
          onChange={notebookChangeHandler}
        />
      </div>
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
    </div>
  );
};
export default Note;
