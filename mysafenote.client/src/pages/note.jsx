import React, { useState, useRef, useMemo, useContext, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";
import { loadNoteBodyFromServer, saveNoteToServer } from "../api/note-api";
import moment from "moment";

//var y = `<p>qqq</p>`;

const Note = () => {
  //const {noteId, userId} = props;
  const editor = useRef(null);
  const [noteBody, setNoteBody] = useState("");
  const [noteName, setNoteName] = useState("");
  const [notebookName, setNotebookName] = useState("");

  //const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);
  const notesState = useContext(StateContext);
  //const [userUnfold, setUserUnfold] = useState(true);
  //const [isModal, setModal] = useState(false);

  // const currentUser = notesState.currentUser;
  // const jwtToken = notesState.jwtToken;
  // const noteRows = notesState.noteRows;
  const userId = notesState.userId;
  const noteId = notesState.currentNoteId;
  const currentNoteId = notesState.currentNoteId;

  useEffect(() => {
    if (noteId && userId != 0) {
      handlerLoadNoteBodyFromServer();
      //dispatch({ type: "NEED_LOAD_DATA", payload: false });
    }
    //}
  });

  const handlerLoadNoteBodyFromServer = async function () {
    //let data = await loadBDfromServer(currentUser, setLoading);
    let noteBodyFromServer = await loadNoteBodyFromServer(userId, noteId, setLoading);
    console.log("loadNoteBodyFromServer");
    console.log(noteBodyFromServer);
    if (noteBodyFromServer) {
      setNoteBody(noteBodyFromServer);
    }
    // dispatch({ type: "LOAD_BD", payload: data });
  };

  //const handleSaveNoteBodyToServer = () => {
  const handleSaveNoteToServer = async function () {
    console.log(noteBody);
    let note;
    let notePassword = ""; //!!! добавить обработку!
    const date = moment().format("DD.MM.YYYY HH.mm.ss");
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
      noteId,
      title: noteName,
      createDate,
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
        onBlur={(newNoteBody) => setNoteBody(newNoteBody)} // preferred to use only this option to update the content for performance reasons
        onChange={(newNoteBody) => {}}
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
    </div>
  );
};
export default Note;
