import React, { useState, useContext, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import signInApi from "../api/signin-api";
import Copyright from "../components/copyright";
import { ACTIONS, DispatchContext } from "../state/notes-context";
import "../style.scss";
import { db } from "../db-utils/db-config"; //!!!

function SignIn() {
  const dispatch = useContext(DispatchContext);
  const [reqMessage, setReqMessage] = useState<string>("");
  const [email, setEmailVal] = useState<string>("");
  const [password, setPasswordVal] = useState<string>("");
  const navigate = useNavigate();

  //!!!
  // useEffect(() => {
  //   const loginDataJSON = localStorage.getItem("loginData");
  //   //const notesData = localStorage.getItem("notesData");
  //   //console.log(notesData);
  //   console.log(loginDataJSON);
  //   // if (navigator.onLine && notesData && loginDataJSON) {
  //   if (navigator.onLine && loginDataJSON) {
  //     navigate("/main");
  //   }
  // }, [navigate]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Проверяем наличие данных в IndexedDB
        const loginData = await db.get('auth', 'loginData');
        console.log('loginData из IndexedDB:', loginData);
        
        if (navigator.onLine && loginData) {
          navigate("/main");
        }
      } catch (error) {
        console.error("checkAuthStatus - Ошибка:", error);
      }
    };

    checkAuthStatus();
  }, [navigate]);
  //!!!

  // Войти по логину и паролю
  const signInHandler = async () => {
    try {
      let loginData = await signInApi(email, password, setReqMessage);
      if (loginData) {
        dispatch?.({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
        dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: true });
        const url = "/main";
        navigate(url);
      }
    } catch (error) {
      setReqMessage("Ошибка аутентификации. Пожалуйста, попробуйте еще раз.");
    }
  };

  const emailInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailEl = e.currentTarget;
    setEmailVal(emailEl.value);
  };
  const passInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordEl = e.currentTarget;
    setPasswordVal(passwordEl.value);
  };

  return (
    <Container className="sign-in__main" component="main" maxWidth="xs">
      <CssBaseline />
      <Box className="sign-in__main-box">
        <Typography component="h1" variant="h5">
          Вход
        </Typography>
        <form className="sign-in__form" noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Логин"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={emailInputHandler}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={passInputHandler}
          />
          <Button
            type="button"
            className="sign-in__button"
            fullWidth
            variant="contained"
            onClick={signInHandler}
          >
            Войти
          </Button>
          <div className="sign-up__reqMessage-label">{reqMessage}</div>
          <Box className="sign-up__box-links">
            <Link to="/signup">Нет аккаунта? Регистрация</Link>
          </Box>
        </form>
        <Box mt={3}>
          <Copyright />
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;
