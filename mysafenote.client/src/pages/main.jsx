import React, { useState, useEffect, useContext } from "react";
import { Container } from "react-bootstrap";
import "../style.scss";
import {
  loadNotesDataFromServer,
  loadNotebooksDataFromServer,
} from "../api/main-api";
import NotesInfo from "../components/notes-info";
import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";
import { useNavigate } from "react-router-dom";

function Main() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);
  const notesState = useContext(StateContext);
  const userId = notesState.userId;
  const needLoadData = notesState.needLoadData;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const fetchData = async () => {
    if (userId && needLoadData) {
      setLoading(true);
      try {
        const notesData = await loadNotesDataFromServer(userId, setLoading);
        const notebooksData = await loadNotebooksDataFromServer(userId, setLoading);
        
        dispatch({ type: ACTIONS.LOAD_BD, payload: notesData });
        dispatch({ type: ACTIONS.LOAD_NOTEBOOKS, payload: notebooksData });

        const loginDataJSON = localStorage.getItem("loginData");
        if (loginDataJSON) {
          const loginData = JSON.parse(loginDataJSON);
          dispatch({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        dispatch({ type: ACTIONS.NEED_LOAD_DATA, payload: false });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, needLoadData, dispatch]);

  return (
    <div>
      <Container>
        {loading ? <div>Загрузка...</div> : <NotesInfo handlerLoadFromServer={fetchData} />}
      </Container>
    </div>
  );
}

export default Main;

//-----

// import React, { useState, useEffect, useContext, useRef } from "react";
// import { Container } from "react-bootstrap";
// import "../style.scss";
// import {
//   loadNotesDataFromServer,
//   loadNotebooksDataFromServer,
// } from "../api/main-api";
// import NotesInfo from "../components/notes-info";
// import { StateContext } from "../state/notes-context";
// import { ACTIONS, DispatchContext } from "../state/notes-context";
// import { useNavigate } from "react-router-dom";

// function Main() {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useContext(DispatchContext);
//   const notesState = useContext(StateContext);
//   const userId = notesState.userId;
//   const needLoadData = notesState.needLoadData;
//   const hasLoadedData = useRef(false); // Используем useRef для отслеживания загрузки данных

//   useEffect(() => {
//     if (!userId) {
//       navigate("/login");
//     }
//   }, [userId, navigate]);

//   const fetchData = async () => {
//     if (userId && needLoadData && !hasLoadedData.current) { // Проверяем, была ли уже выполнена загрузка
//       setLoading(true);
//       hasLoadedData.current = true; // Устанавливаем флаг, что данные загружены
//       try {
//         const notesData = await loadNotesDataFromServer(userId, setLoading);
//         const notebooksData = await loadNotebooksDataFromServer(userId, setLoading);
        
//         dispatch({ type: ACTIONS.LOAD_BD, payload: notesData });
//         dispatch({ type: ACTIONS.LOAD_NOTEBOOKS, payload: notebooksData });

//         const loginDataJSON = localStorage.getItem("loginData");
//         if (loginDataJSON) {
//           const loginData = JSON.parse(loginDataJSON);
//           dispatch({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
//         }
//       } catch (error) {
//         console.error("Ошибка при загрузке данных:", error);
//       } finally {
//         dispatch({ type: ACTIONS.NEED_LOAD_DATA, payload: false });
//         setLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [userId, needLoadData, dispatch]);

//   return (
//     <div>
//       <Container>
//         {loading ? <div>Загрузка...</div> : <NotesInfo handlerLoadFromServer={fetchData} />}
//       </Container>
//     </div>
//   );
// }

// export default Main;

//-----

// import React, { useState, useEffect, useRef, useContext } from "react";
// import { Container } from "react-bootstrap";
// import "../style.scss";
// import {
//   loadNotesDataFromServer,
//   loadNotebooksDataFromServer,
// } from "../api/main-api";
// import NotesInfo from "../components/notes-info";
// import { StateContext } from "../state/notes-context";
// import { ACTIONS, DispatchContext } from "../state/notes-context";
// import { useNavigate } from "react-router-dom";

// function Main() {
//   const [loading, setLoading] = useState("");
//   const navigate = useNavigate();
//   const dispatch = useContext(DispatchContext);

//   const notesState = useContext(StateContext);
//   const userId = notesState.userId;
//   const needLoadData = notesState.needLoadData;

//   useEffect(() => {
//     if (userId === 0 || !userId) navigate("/login");
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         handlerLoadFromServer();
//         dispatch({ type: ACTIONS.NEED_LOAD_DATA, payload: false });
//         console.log("fetchData");
//       } catch (error) {
//         console.error("fetchData - Ошибка при загрузке данных:", error);
//       }
//     };
//     fetchData();
//   }, [userId, dispatch, needLoadData === true]);

//   const handlerLoadFromServer = async () => {
//     let notesData = await loadNotesDataFromServer(userId, setLoading);
//     let notebooksData = await loadNotebooksDataFromServer(userId, setLoading);
//     dispatch({ type: ACTIONS.LOAD_BD, payload: notesData });
//     dispatch({ type: ACTIONS.LOAD_NOTEBOOKS, payload: notebooksData });
//     const loginDataJSON = localStorage.getItem("loginData");
//     if (loginDataJSON) {
//       const loginData = JSON.parse(loginDataJSON);
//       dispatch({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
//     }
//     console.log("handlerLoadFromServer");
//     console.log(notesData);
//   };

//   return (
//     <div>
//       <Container>
//         <NotesInfo
//           handlerLoadFromServer={handlerLoadFromServer}
//         />
//       </Container>
//     </div>
//   );
// }

// export default Main;
