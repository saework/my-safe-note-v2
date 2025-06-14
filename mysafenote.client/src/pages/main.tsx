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
import { db } from "../db-utils/db-config";

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

  const loadDataFromServer = async () => {
      setLoading(true);
      try {
        
        const notesData = await loadNotesDataFromServer(userId);
        const notebooksData = await loadNotebooksDataFromServer(userId);

        console.log(notesData);
        if (notesData)  
        {
          dispatch?.({ type: ACTIONS.LOAD_BD, payload: notesData });
          dispatch?.({ type: ACTIONS.LOAD_NOTEBOOKS, payload: notebooksData });

          const loginData = await db.get('auth', 'loginData');
          if (loginData) {
            dispatch?.({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
          }
        } else {
          await db.delete('auth', 'loginData');
          dispatch?.({ type: ACTIONS.RESET_STORE, payload: 0 });
          navigate("/login");
        }
      } catch (error) {
        
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: false });
        setLoading(false);
      }
  };
    useEffect(() => {
    const checkAuthAndLoad = async () => {
      console.log(userId);
      if (!userId) {
        // Проверяем авторизацию в IndexedDB
        const loginData = await db.get('auth', 'loginData');
        console.log('loginData из IndexedDB:', loginData);
        
        if (navigator.onLine && loginData) {
          loadDataFromServer();
        } else {
          console.log("Нет интернет-соединения или сохранённой сессии");
          navigate("/login");
        }
      } else if (navigator.onLine && needLoadData) {
        loadDataFromServer();
      }
    };

    checkAuthAndLoad();
    }, [userId, needLoadData, dispatch]);

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