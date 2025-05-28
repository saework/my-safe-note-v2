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
import Loader from '../components/loader';

function Main() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);
  const notesState = useContext(StateContext);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    // При монтировании компонента всегда устанавливаем флаг необходимости загрузки
    dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: true });
    setInitialLoad(false);
  }, [dispatch]);

  if (!notesState || notesState.userId === undefined) {
    return <Loader />;
  }

  const userId = notesState.userId;
  const needLoadData = notesState.needLoadData;

  //!!!comm
  // useEffect(() => {
  //   if (!userId) {
  //     navigate("/login");
  //   }
  // }, [userId, navigate]);
  //!!!comm

  const loadDataFromServer = async () => {
    //if (userId && needLoadData) { //!!!comm
      setLoading(true);
      try {
        const notesData = await loadNotesDataFromServer(userId);
        const notebooksData = await loadNotebooksDataFromServer(userId);
        
        dispatch?.({ type: ACTIONS.LOAD_BD, payload: notesData });
        dispatch?.({ type: ACTIONS.LOAD_NOTEBOOKS, payload: notebooksData });

        const loginDataJSON = localStorage.getItem("loginData");
        if (loginDataJSON) {
          const loginData = JSON.parse(loginDataJSON);
          dispatch?.({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        //!!!comm
        // localStorage.removeItem("loginData"); 
        // dispatch?.({ type: ACTIONS.RESET_STORE, payload: 0 });
        // navigate("/login");
        //!!!comm
      } finally {
        dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: false });
        setLoading(false);
      }
   // }  //!!!comm
  };
//!!! comm
  // useEffect(() => {
  //   loadDataFromServer();
  // }, [userId, needLoadData, dispatch]);
//!!!comm

//!!!
  useEffect(() => {
    console.log(userId);
    if (!userId) {
      const loginDataJSON = localStorage.getItem("loginData");
      console.log(loginDataJSON);
      if (navigator.onLine && loginDataJSON) {
        loadDataFromServer();
      } else {
        console.log("Нет интернет-соединения. Пожалуйста, проверьте подключение.");
        navigate("/login");
      }
    } else {
        if (navigator.onLine && needLoadData)
          loadDataFromServer();
    }
  }, [userId, needLoadData, dispatch]);
  //}, [userId, dispatch]);
//!!!

  return (
    <div>
      <Container>
        <NotesInfo handlerLoadFromServer={loadDataFromServer} />
        {loading && (
          <div className="loader-overlay">
            <Loader />
          </div>
        )}
      </Container>
    </div>
  );
}

export default Main;