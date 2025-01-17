
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Container, Alert } from 'react-bootstrap';
//import { connect } from 'react-redux';
import '../style.scss';
import { loadNotesDataFromServer, loadNotebooksDataFromServer, exportNotesFromServer, importNotesToServer } from '../api/main-api';
//import { history } from '../store/store';
//import MainForm from '../components/main-form';
import NotesInfo from '../components/notes-info';
//import * as config from '../configs/config';
import config from '../configs/config';
//import {TIME_ZONE, DEFAULT_PERIOD}  from '../configs/config';
//import { IRootReducer, IStore } from '../interfaces';
import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";
//import { DispatchContext } from "../state/notes-context";
//import Button from '@mui/material/Button';
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
//import '../style.scss';

function Main(props) {
  //const { rootReducer, currentUser, jwtToken } = props;
  const { TIME_ZONE, DEFAULT_PERIOD } = config;
  const [loading, setLoading] = useState('');
  const [buttonAddName, setButtonAddName] = useState('Добавить заметку');
  // const [bdPeriodVal, setBdPeriodVal] = useState(DEFAULT_PERIOD);
  const [startDate, setStartDate] = useState(new Date());
  const [titleVal, setTitleVal] = useState('');
  const [noteShortTextVal, setNoteShortTextVal] = useState('');
  const [lastChangeDateVal, setLastChangeDateVal] = useState(TIME_ZONE);
  const [formVisible, setFormVisible] = useState(false);

  const [file, setFile] = useState(null);

//!!!
const navigate = useNavigate();
const dispatch = useContext(DispatchContext);

//const [userUnfold, setUserUnfold] = useState(true);
const [isModal, setModal] = useState(false);
const notesState = useContext(StateContext);
const currentUser = notesState.currentUser;
const jwtToken = notesState.jwtToken;
const noteRows = notesState.noteRows;
const userId = notesState.userId;

//     const [forecasts, setForecasts] = useState();
//     const [notes, setNotes] = useState();

//     useEffect(() => {
//         populateWeatherData();
//     }, []);

//     useEffect(() => {
//         notesData();
//     }, []);

//     async function notesData() {
//         const response = await fetch('api/note');
//         console.log(response);
//         const data = await response.json();
//         setNotes(data);
//     }
//!!!

  const titleRef = useRef(null);

  useEffect(() => {
    //const historyState = history.location.state;
    //if (historyState) {
      //const { needLoadData } = historyState;
      const needLoadData = notesState.needLoadData; //!!!
      console.log(`useEffect - needLoadData - needLoadData: ${needLoadData}`);
      if (needLoadData) {
         handlerLoadFromServer();
        //historyState.needLoadData = false;
        dispatch({ type: ACTIONS.NEED_LOAD_DATA, payload: false });
      }
    //}
  });

  const handlerLoading = () => {
    if (loading === '') {
      return '';
    }
    if (loading === 'load') {
      return 'Загрузка данных..';
    }
    if (loading === 'save') {
      return 'Сохранение данных..';
    }
  };

  // // Сохранить список задач пользователя на сервер
  // const handlerSaveToServer = () => {
  //   const data = {
  //     //rootReducer,
  //     noteRows, //!!!
  //     currentUser,
  //     jwtToken,
  //   };
  //   sendBDtoServer(data, setLoading);
  // };

  // const handlerLoadFromServer = () => {
  //   loadNotesDataFromServer(currentUser, setLoading);
  // };
//!!!
const handlerLoadFromServer = async function (){
  //let data = await loadNotesDataFromServer(currentUser, setLoading);
  //const userId = 2; //!!!убрать!!
  //let notesData = await loadNotesDataFromServer(userId, setLoading);
  let notesData = await loadNotesDataFromServer(userId, setLoading);
  let notebooksData = await loadNotebooksDataFromServer(userId, setLoading);
  dispatch({ type: ACTIONS.LOAD_BD, payload: notesData });
  dispatch({ type: ACTIONS.LOAD_NOTEBOOKS, payload: notebooksData });
  console.log("handlerLoadFromServer");
  console.log(notesData);
  console.log(notebooksData);
}

const handleAddButtonClick = (e) => {
  //e.preventDefault();
  dispatch({ type: ACTIONS.CHECK_ID_ROW, payload: 0 });
  const url = '/note';
  navigate(url);
}

const handlerExportNotesFromServer = async function (){
  console.log("handlerExportNotesFromServer");
  //console.log(data);
  await exportNotesFromServer(userId);
}

const handlerImportNotesToServer = async function (){
  console.log("handlerImportNotesToServer");

  if (!file) {
    alert('Пожалуйста, выберите zip-файл для загрузки.');
    return;
  }
  //await importNotesToServer(userId, file);
  var result = await importNotesToServer(userId, file);
  console.log(result);
  if (result === true)
  {
    handlerLoadFromServer();
  }
}

const handleFileChange = (event) => {
  setFile(event.target.files[0]);
};

//let notebooks = ["Блокнот 1", "Блокнот 2", "Блокнот 3", "Блокнот 4", "Блокнот 5", "Блокнот 5", "Блокнот 7", "Блокнот 8"]

  // const async handlerLoadFromServer = () => {
  //   let data = await loadNotesDataFromServer(currentUser, setLoading);
  //   dispatch({ type: "LOAD_BD", payload: data });
  //   console.log("handlerLoadFromServer");
  //   console.log(data);
  // };
  //!!!

  return (
    // <div className="main-form__container">
    <div>
      <Container>
        <NotesInfo
          // setBdPeriodVal={setBdPeriodVal}
          setButtonAddName={setButtonAddName}
          setStartDate={setStartDate}
          setTitleVal={setTitleVal}
          setNoteShortTextVal={setNoteShortTextVal}
          setLastChangeDateVal={setLastChangeDateVal}
          titleRef={titleRef}
          //handlerSaveToServer={handlerSaveToServer}
          setFormVisible={setFormVisible}
        />
        <Button onClick={handleAddButtonClick} id="buttonAdd" type="button" variant="success" size="lg" block className="main-form__button-add">
          Добавить заметку
        </Button>

        <Button onClick={handlerExportNotesFromServer} id="buttonExportNotes" type="button" variant="success" size="lg" block className="main-form__button-add">
          Выгрузить заметки
        </Button>
        <div>
            <input type="file" accept=".zip" onChange={handleFileChange} />
            <button onClick={handlerImportNotesToServer}>Загрузить заметки</button>
        </div>

        <Alert className="message__alert_center" variant="light" id="mainLabel">
          {handlerLoading()}
        </Alert>
      </Container>
    </div>
  );
}

// const mapStateToProps = (store) => ({
//   rootReducer: store.rootReducer,
//   currentUser: store.rootReducer.currentUser,
//   jwtToken: store.rootReducer.jwtToken,
// });

// export default connect(mapStateToProps)(Home);
//export default Home;
export default Main;
