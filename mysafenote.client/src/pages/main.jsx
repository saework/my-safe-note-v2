import React, { useState, useEffect, useRef, useContext } from "react";
import { Container, Alert } from "react-bootstrap";
import "../style.scss";
import {
  loadNotesDataFromServer,
  loadNotebooksDataFromServer,
  exportNotesFromServer,
  importNotesToServer,
} from "../api/main-api";
import NotesInfo from "../components/notes-info";
import config from "../configs/config";
import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";
import { Row, Col, Form, Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Main(props) {
  const { TIME_ZONE, DEFAULT_PERIOD } = config;
  const [loading, setLoading] = useState("");
  const [buttonAddName, setButtonAddName] = useState("Добавить заметку");
  const [startDate, setStartDate] = useState(new Date());
  const [titleVal, setTitleVal] = useState("");
  const [noteShortTextVal, setNoteShortTextVal] = useState("");
  const [lastChangeDateVal, setLastChangeDateVal] = useState(TIME_ZONE);
  const [formVisible, setFormVisible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);

  const [isModal, setModal] = useState(false);
  const notesState = useContext(StateContext);
  const currentUser = notesState.currentUser;
  const jwtToken = notesState.jwtToken;
  const noteRows = notesState.noteRows;
  const userId = notesState.userId;
  const needLoadData = notesState.needLoadData;

  const titleRef = useRef(null);

  useEffect(() => {
    if (userId === 0 || !userId) navigate("/login");
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        handlerLoadFromServer();
        dispatch({ type: ACTIONS.NEED_LOAD_DATA, payload: false });
        console.log("fetchData");
      } catch (error) {
        console.error("fetchData - Ошибка при загрузке данных:", error);
      }
    };
    fetchData();
  }, [userId, dispatch, needLoadData === true]);

  const handlerLoading = () => {
    if (loading === "") {
      return "";
    }
    if (loading === "load") {
      return "Загрузка данных..";
    }
    if (loading === "save") {
      return "Сохранение данных..";
    }
  };

  const handlerLoadFromServer = async () => {
    let notesData = await loadNotesDataFromServer(userId, setLoading);
    let notebooksData = await loadNotebooksDataFromServer(userId, setLoading);
    dispatch({ type: ACTIONS.LOAD_BD, payload: notesData });
    dispatch({ type: ACTIONS.LOAD_NOTEBOOKS, payload: notebooksData });
    const loginDataJSON = localStorage.getItem("loginData");
    if (loginDataJSON) {
      const loginData = JSON.parse(loginDataJSON);
      dispatch({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
    }
    console.log("handlerLoadFromServer");
    console.log(notesData);
  };

  const handlerImportNotesToServer = async function () {
    console.log("handlerImportNotesToServer");

    if (!file) {
      return;
    }
    var result = await importNotesToServer(userId, file);
    if (result === true) {
      handlerLoadFromServer();
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  return (
    <div>
      <Container>
        <NotesInfo
          setButtonAddName={setButtonAddName}
          setStartDate={setStartDate}
          setTitleVal={setTitleVal}
          setNoteShortTextVal={setNoteShortTextVal}
          setLastChangeDateVal={setLastChangeDateVal}
          titleRef={titleRef}
          setFormVisible={setFormVisible}
          handlerLoadFromServer={handlerLoadFromServer}
        />
      </Container>
    </div>
  );
}

export default Main;
