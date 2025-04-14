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

  if (!notesState || notesState.userId === undefined) {
    return <Loader />;
  }

  const userId = notesState.userId;
  const needLoadData = notesState.needLoadData;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const loadDataFromServer = async () => {
    if (userId && needLoadData) {
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
      } finally {
        dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: false });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadDataFromServer();
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