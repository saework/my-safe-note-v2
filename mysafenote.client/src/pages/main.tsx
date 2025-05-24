import React, { useState, useEffect, useContext } from "react";
import { Container, Alert } from "react-bootstrap";
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
import { getLoginData } from "../functions"; //!!!

function Main() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);
  const notesState = useContext(StateContext);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  //!!!
  //const [retryCount, setRetryCount] = useState<number>(0);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [needUpdateData, setNeedUpdateData] = useState<boolean>(false);
  //!!!

  //!!!comm
  // useEffect(() => {
  //   // При монтировании компонента всегда устанавливаем флаг необходимости загрузки
  //   dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: true });
  //   setInitialLoad(false);
  // }, [dispatch]);
  //!!!comm



  //!!!


  useEffect(() => {
    const handleOnline = () => {
      dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: true });
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [dispatch]);

  // useEffect(() => {
  //   // Проверяем, нужно ли загружать данные при монтировании компонента
  //   const needLoadData = localStorage.getItem("needLoadData") === "true";
  //   if (needLoadData) {
  //     dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: true });
  //     localStorage.removeItem("needLoadData"); // Сброс флага
  //   }
  // }, [dispatch]);

  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     localStorage.setItem("needLoadData", "true");
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);
  //!!!

  if (!notesState || notesState.userId === undefined) {
    return <Loader />;
  }

  //const userId = notesState.userId; //!!!comm
  //const needLoadData = notesState.needLoadData; //!!!comm
  let userId = notesState.userId;
  const needLoadData = notesState.needLoadData;

  //!!!
  useEffect(() => {
    // Проверяем наличие данных в localStorage и состояние notebooksData
    if (userId == 0)
    {
      const notesData = localStorage.getItem("notesData");
      const loginData = localStorage.getItem("loginData");

      if (notesState && notesState.noteRows.length === 0 && notesData && loginData) {
        //userId = Number(getLoginData("userId"));
        //dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: true });
        setNeedUpdateData(true);
      }
    }
  //}, [dispatch, notesState]);
  }, [dispatch]);

  //!!!

  //!!!comm
  // useEffect(() => {
  //   if (!userId) {
  //     navigate("/login");
  //   }
  // }, [userId, navigate]);
  //!!!comm

  //!!!
  // const saveDataToLocalStorageIfChanged = (serverData: any, storageKey: string) => {
  //   const storedDataJSON = localStorage.getItem(storageKey);
  //   const storedData = storedDataJSON ? JSON.parse(storedDataJSON) : null;
    
  //   // Сравниваем данные, игнорируя возможные различия в порядке элементов
  //   const dataChanged = !storedData || 
  //     JSON.stringify(serverData) !== JSON.stringify(storedData);
    
  //   if (dataChanged) {
  //     localStorage.setItem(storageKey, JSON.stringify(serverData));
  //   }
  // };
  //!!!

  // const loadDataFromServer = async () => {
  //   if (userId && needLoadData) {
  //     setLoading(true);
  //     try {
  //       const notesData = await loadNotesDataFromServer(userId);
  //       const notebooksData = await loadNotebooksDataFromServer(userId);
  //       //!!!
  //       // Сохраняем в localStorage только если данные изменились
  //       saveDataToLocalStorageIfChanged(notesData, 'notesData');
  //       saveDataToLocalStorageIfChanged(notebooksData, 'notebooksData');
  //       //!!!
  //       dispatch?.({ type: ACTIONS.LOAD_BD, payload: notesData });
  //       dispatch?.({ type: ACTIONS.LOAD_NOTEBOOKS, payload: notebooksData });

  //       const loginDataJSON = localStorage.getItem("loginData");
  //       if (loginDataJSON) {
  //         const loginData = JSON.parse(loginDataJSON);
  //         dispatch?.({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
  //       }
  //     } catch (error) {
  //       console.error("Ошибка при загрузке данных:", error);

  //       localStorage.removeItem("loginData");
  //       dispatch?.({ type: ACTIONS.RESET_STORE, payload: 0 });
  //       navigate("/login");

  //     } finally {
  //       dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: false });
  //       setLoading(false);
  //     }
  //   }
  // };


  //   const loadDataFromServer = async (attempt: number = 1): Promise<void> => {
  //   if (userId && needLoadData) {
  //     setLoading(true);
  //     try {
  //       const notesData = await loadNotesDataFromServer(userId);
  //       const notebooksData = await loadNotebooksDataFromServer(userId);
        
  //       saveDataToLocalStorageIfChanged(notesData, 'notesData');
  //       saveDataToLocalStorageIfChanged(notebooksData, 'notebooksData');
        
  //       dispatch?.({ type: ACTIONS.LOAD_BD, payload: notesData });
  //       dispatch?.({ type: ACTIONS.LOAD_NOTEBOOKS, payload: notebooksData });
  //       setRetryCount(0);
  //       setOfflineMode(false);

  //       const loginDataJSON = localStorage.getItem("loginData");
  //       if (loginDataJSON) {
  //         const loginData = JSON.parse(loginDataJSON);
  //         dispatch?.({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
  //       }
  //     } catch (error) {
  //       console.error(`Ошибка при загрузке данных (попытка ${attempt}):`, error);

  //       if (attempt < 3) {
  //         // Экспоненциальная задержка: 1s, 2s, 4s
  //         const delay = Math.pow(2, attempt - 1) * 1000;
  //         setTimeout(() => loadDataFromServer(attempt + 1), delay);
  //       } else {
  //         // После 3 неудачных попыток
  //         const storedNotes = localStorage.getItem('notesData');
  //         const storedNotebooks = localStorage.getItem('notebooksData');
  //         const loginDataJSON = localStorage.getItem("loginData");
          
  //         if (storedNotes && storedNotebooks && loginDataJSON) {
  //           // Есть данные в localStorage - работаем оффлайн
  //           setOfflineMode(true);

  //           dispatch?.({ 
  //             type: ACTIONS.LOAD_BD, 
  //             payload: JSON.parse(storedNotes) 
  //           });
  //           dispatch?.({ 
  //             type: ACTIONS.LOAD_NOTEBOOKS, 
  //             payload: JSON.parse(storedNotebooks) 
  //           });

  //           const loginData = JSON.parse(loginDataJSON);
  //           dispatch?.({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
            
  //         } else {
  //           // Нет данных в localStorage - переходим на логин
  //           localStorage.removeItem("loginData");
  //           localStorage.removeItem("notesData");
  //           localStorage.removeItem("notebooksData");
  //           dispatch?.({ type: ACTIONS.RESET_STORE, payload: 0 });
  //           navigate("/login");
  //         }
  //       }
  //     } finally {
  //       if (notesData > 0 || attempt >= 3 || !needLoadData) {
  //         dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: false });
  //         setLoading(false);
  //       }
  //     }
  //   }
  // };

//!!!
    const loadDataFromServer = async () => {
    if ((userId && needLoadData) || needUpdateData==true) {
      setNeedUpdateData(false);
      setLoading(true);
      let attempts = 0;
      const maxAttempts = 3;
      const retryInterval = 2000; // 2 seconds

      while (attempts < maxAttempts) {
        try {
          const notesData = await loadNotesDataFromServer(userId);
          const notebooksData = await loadNotebooksDataFromServer(userId);

          // Check and update localStorage if data differs
          const existingNotesData = localStorage.getItem("notesData");
          const existingNotebooksData = localStorage.getItem("notebooksData");

          if (JSON.stringify(existingNotesData) !== JSON.stringify(notesData)) {
            localStorage.setItem("notesData", JSON.stringify(notesData));
          }

          if (JSON.stringify(existingNotebooksData) !== JSON.stringify(notebooksData)) {
            localStorage.setItem("notebooksData", JSON.stringify(notebooksData));
          }

          dispatch?.({ type: ACTIONS.LOAD_BD, payload: notesData });
          dispatch?.({ type: ACTIONS.LOAD_NOTEBOOKS, payload: notebooksData });

          const loginDataJSON = localStorage.getItem("loginData");
          if (loginDataJSON) {
            const loginData = JSON.parse(loginDataJSON);
            dispatch?.({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
          }
          setOfflineMode(false);
          break; // Exit the loop if data is loaded successfully
        } catch (error) {
          console.error("Ошибка при загрузке данных:", error);
          attempts += 1;

          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, retryInterval));
          } else {
            const localStorageNotesData = localStorage.getItem("notesData");
            const localStorageNotebooksData = localStorage.getItem("notebooksData");
            const loginDataJSON = localStorage.getItem("loginData");

            // if (existingNotesData || existingNotebooksData) {
            //   alert("Отсутствует интернет соединение. Работа в автономном режиме");
            // }
        if (localStorageNotesData && localStorageNotebooksData && loginDataJSON) {
            // Есть данные в localStorage - работаем оффлайн
            setOfflineMode(true);

            dispatch?.({ 
              type: ACTIONS.LOAD_BD, 
              payload: JSON.parse(localStorageNotesData) 
            });
            dispatch?.({ 
              type: ACTIONS.LOAD_NOTEBOOKS, 
              payload: JSON.parse(localStorageNotebooksData) 
            });

            const loginData = JSON.parse(loginDataJSON);
            dispatch?.({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
            
            setOfflineMode(true);
          } else {
            // Нет данных в localStorage - переходим на логин
            localStorage.removeItem("loginData");
            localStorage.removeItem("notesData");
            localStorage.removeItem("notebooksData");
            dispatch?.({ type: ACTIONS.RESET_STORE, payload: 0 });
            setOfflineMode(false);
            navigate("/login");

          }
            // localStorage.removeItem("loginData");
            // dispatch?.({ type: ACTIONS.RESET_STORE, payload: 0 });
            // navigate("/login");
          }
        } finally {
          dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: false });
          setLoading(false);
        }
      }
    }
  };
  //!!!


  useEffect(() => {
    loadDataFromServer();
  }, [userId, needLoadData, dispatch, needUpdateData]);

  return (
    // <div>
    //   <Container>
    //     <NotesInfo handlerLoadFromServer={loadDataFromServer} />
    //     {loading && (
    //       <div className="loader-overlay">
    //         <Loader />
    //       </div>
    //     )}
    //   </Container>
    // </div>
        <div>
      <Container>
        {offlineMode && (
          <Alert variant="warning" className="mt-3">
            Отсутствует интернет соединение. Работа в автономном режиме
          </Alert>
        )}
        <NotesInfo handlerLoadFromServer={() => loadDataFromServer()} />
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