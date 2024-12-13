
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Container, Alert } from 'react-bootstrap';
//import { connect } from 'react-redux';
import '../style.scss';
import { sendBDtoServer, loadBDfromServer } from '../api/home-api';
//import { history } from '../store/store';
//import MainForm from '../components/main-form';
import MainInfo from '../components/notes-info';
//import * as config from '../configs/config';
import config from '../configs/config';
//import {TIME_ZONE, DEFAULT_PERIOD}  from '../configs/config';
//import { IRootReducer, IStore } from '../interfaces';
import { StateContext } from "../state/notes-context";
//import { ACTIONS, DispatchContext } from "../state/notes-context";
import { DispatchContext } from "../state/notes-context";
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

//!!!
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
        dispatch({ type: "NEED_LOAD_DATA", payload: false });
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

  // Сохранить список задач пользователя на сервер
  const handlerSaveToServer = () => {
    const data = {
      //rootReducer,
      noteRows, //!!!
      currentUser,
      jwtToken,
    };
    sendBDtoServer(data, setLoading);
  };

  // const handlerLoadFromServer = () => {
  //   loadBDfromServer(currentUser, setLoading);
  // };
//!!!
const handlerLoadFromServer = async function (){
  //let data = await loadBDfromServer(currentUser, setLoading);
  //const userId = 2; //!!!убрать!!
  let data = await loadBDfromServer(userId, setLoading);
  dispatch({ type: "LOAD_BD", payload: data });
  console.log("handlerLoadFromServer");
  console.log(data);
}



  // const async handlerLoadFromServer = () => {
  //   let data = await loadBDfromServer(currentUser, setLoading);
  //   dispatch({ type: "LOAD_BD", payload: data });
  //   console.log("handlerLoadFromServer");
  //   console.log(data);
  // };
  //!!!

  return (
    <div>
      <Container>
        <MainInfo
          // setBdPeriodVal={setBdPeriodVal}
          setButtonAddName={setButtonAddName}
          setStartDate={setStartDate}
          setTitleVal={setTitleVal}
          setNoteShortTextVal={setNoteShortTextVal}
          setLastChangeDateVal={setLastChangeDateVal}
          titleRef={titleRef}
          handlerSaveToServer={handlerSaveToServer}
          setFormVisible={setFormVisible}
        />
        {/* <MainForm
          bdPeriodVal={bdPeriodVal}
          setBdPeriodVal={setBdPeriodVal}
          buttonAddName={buttonAddName}
          setButtonAddName={setButtonAddName}
          startDate={startDate}
          setStartDate={setStartDate}
          titleVal={titleVal}
          settitleVal={settitleVal}
          noteShortTextVal={noteShortTextVal}
          setnoteShortTextVal={setnoteShortTextVal}
          lastChangeDateVal={lastChangeDateVal}
          setlastChangeDateVal={setlastChangeDateVal}
          titleRef={titleRef}
          formVisible={formVisible}
          setFormVisible={setFormVisible}
        /> */}
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

//-----

// import React, { useState, useEffect, useRef } from 'react';
// import { Container, Alert } from 'react-bootstrap';
// import { connect } from 'react-redux';
// import '../style.scss';
// import { sendBDtoServer, loadBDfromServer } from '../api/home-api';
// import { history } from '../store/store';
// import MainForm from '../components/main-form';
// import MainInfo from '../components/main-info';
// import config from '../configs/config';
// import { IRootReducer, IStore } from '../interfaces';


// function Home(props) {
//   const { rootReducer, currentUser, jwtToken } = props;
//   const { TIME_ZONE, DEFAULT_PERIOD } = config;
//   const [loading, setLoading] = useState('');
//   const [buttonAddName, setButtonAddName] = useState('Добавить заметку');
//   const [bdPeriodVal, setBdPeriodVal] = useState(DEFAULT_PERIOD);
//   const [startDate, setStartDate] = useState(new Date());
//   const [titleVal, settitleVal] = useState('');
//   const [noteShortTextVal, setnoteShortTextVal] = useState('');
//   const [lastChangeDateVal, setlastChangeDateVal] = useState(TIME_ZONE);
//   const [formVisible, setFormVisible] = useState(false);

//   const titleRef = useRef(null);

//   useEffect(() => {
//     const historyState = history.location.state;
//     if (historyState) {
//       const { needLoadData } = historyState;
//       console.log(`useEffect - needLoadData - needLoadData: ${needLoadData}`);
//       if (needLoadData) {
//         handlerLoadFromServer();
//         historyState.needLoadData = false;
//       }
//     }
//   });

//   const handlerLoading = () => {
//     if (loading === '') {
//       return '';
//     }
//     if (loading === 'load') {
//       return 'Загрузка данных..';
//     }
//     if (loading === 'save') {
//       return 'Сохранение данных..';
//     }
//   };

//   // Сохранить список задач пользователя на сервер
//   const handlerSaveToServer = () => {
//     const data = {
//       rootReducer,
//       currentUser,
//       jwtToken,
//     };
//     sendBDtoServer(data, setLoading);
//   };

//   const handlerLoadFromServer = () => {
//     loadBDfromServer(currentUser, setLoading);
//   };

//   return (
//     <div>
//       <Container>
//         <MainInfo
//           setBdPeriodVal={setBdPeriodVal}
//           setButtonAddName={setButtonAddName}
//           setStartDate={setStartDate}
//           settitleVal={settitleVal}
//           setnoteShortTextVal={setnoteShortTextVal}
//           setlastChangeDateVal={setlastChangeDateVal}
//           titleRef={titleRef}
//           handlerSaveToServer={handlerSaveToServer}
//           setFormVisible={setFormVisible}
//         />
//         {/* <MainForm
//           bdPeriodVal={bdPeriodVal}
//           setBdPeriodVal={setBdPeriodVal}
//           buttonAddName={buttonAddName}
//           setButtonAddName={setButtonAddName}
//           startDate={startDate}
//           setStartDate={setStartDate}
//           titleVal={titleVal}
//           settitleVal={settitleVal}
//           noteShortTextVal={noteShortTextVal}
//           setnoteShortTextVal={setnoteShortTextVal}
//           lastChangeDateVal={lastChangeDateVal}
//           setlastChangeDateVal={setlastChangeDateVal}
//           titleRef={titleRef}
//           formVisible={formVisible}
//           setFormVisible={setFormVisible}
//         /> */}
//         <Alert className="message__alert_center" variant="light" id="mainLabel">
//           {handlerLoading()}
//         </Alert>
//       </Container>
//     </div>
//   );
// }

// const mapStateToProps = (store) => ({
//   rootReducer: store.rootReducer,
//   currentUser: store.rootReducer.currentUser,
//   jwtToken: store.rootReducer.jwtToken,
// });

// export default connect(mapStateToProps)(Home);


//---

// import React from 'react';

// const Main = ({ onLogout }) => {
//     return (
//         <div>
//             <h1>Main Page</h1>
//             <button onClick={onLogout}>Logout</button>
//         </div>
//     );
// };

// export default Main;

//---

// import React, { useState } from 'react';
// //import './App.css';
// //import './style.css';

// function Main() {

//     return (
//     <div>Main</div>
//     );
//   }
// export default Main;



// import { useEffect, useState } from 'react';
// import './App.css';
// //import NoteEditor from './NoteEditor.jsx';
// //import { NotesProvider } from "../state/notes-context";

// function Main() {
//     //const [forecasts, setForecasts] = useState();
//     const [notes, setNotes] = useState();

//     // useEffect(() => {
//     //     populateWeatherData();
//     // }, []);

//     useEffect(() => {
//         notesData();
//     }, []);

//     // const contents = forecasts === undefined
//     //     ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
//     //     : <table className="table table-striped" aria-labelledby="tableLabel">
//     //         <thead>
//     //             <tr>
//     //                 <th>Date</th>
//     //                 <th>Temp. (C)</th>
//     //                 <th>Temp. (F)</th>
//     //                 <th>Summary</th>
//     //             </tr>
//     //         </thead>
//     //         <tbody>
//     //             {forecasts.map(forecast =>
//     //                 <tr key={forecast.date}>
//     //                     <td>{forecast.date}</td>
//     //                     <td>{forecast.temperatureC}</td>
//     //                     <td>{forecast.temperatureF}</td>
//     //                     <td>{forecast.summary}</td>
//     //                 </tr>
//     //             )}
//     //         </tbody>
//     //     </table>;

//     const noteContents = notes === undefined
//         ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
//         : <table className="table table-striped" aria-labelledby="tableLabel">
//             <thead>
//                 <tr>
//                     <th>Number</th>
//                     <th>Title</th>
//                     {/*<th>Temp. (F)</th>*/}
//                     {/*<th>Summary</th>*/}
//                 </tr>
//             </thead>
//             <tbody>
//                 {notes.map(note =>
//                     <tr key={note.number}>
//                         <td>{note.number}</td>
//                         <td>{note.title}</td>
//                         {/*<td>{note.title}</td>*/}
//                         {/*<td>{note.title}</td>*/}
//                     </tr>
//                 )}
//             </tbody>
//         </table>;

//     return (
//         <div>
//             <h1 id="tableLabel">Weather forecast</h1>
//             <p>This component demonstrates fetching data from the server.</p>
//             {/* {contents} */}
//             {noteContents}
//             {/* <div><NoteEditor/></div> */}
//         </div>
        
//     );
    
//     // async function populateWeatherData() {
//     //     //const response = await fetch('weatherforecast');
//     //     const response = await fetch('api/weatherforecast');
//     //     console.log(response);
//     //     const data = await response.json();
//     //     setForecasts(data);
//     // }

//     async function notesData() {
//         const response = await fetch('api/note');
//         console.log(response);
//         const data = await response.json();
//         setNotes(data);
//     }
// }

// export default Main;