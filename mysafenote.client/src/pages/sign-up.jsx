import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import signUpApi from "../api/signup-api";
import Copyright from "../components/copyright";
import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";

function SignUp() {
  const dispatch = useContext(DispatchContext);
  const [reqMessage, setReqMessage] = useState("");
  const [email, setEmailVal] = useState("");
  const [password, setPasswordVal] = useState("");
  const [passwordRpt, setPasswordRptVal] = useState("");
  const navigate = useNavigate();

  // Регистрация пользователя
  const signUpHandler = async () => {
    let loginData = await signUpApi(
      email,
      password,
      passwordRpt,
      setReqMessage
    );
    if (loginData) {
      dispatch({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
      dispatch({ type: ACTIONS.NEED_LOAD_DATA, payload: true });
      const url = "/main";
      navigate(url);
    }
  };

  const emailInputHandler = (e) => {
    e.preventDefault();
    const emailEl = e.currentTarget;
    setEmailVal(emailEl.value);
  };
  const passInputHandler = (e) => {
    e.preventDefault();
    const passwordEl = e.currentTarget;
    setPasswordVal(passwordEl.value);
  };
  const passInputRptHandler = (e) => {
    e.preventDefault();
    const passwordRptEl = e.currentTarget;
    setPasswordRptVal(passwordRptEl.value);
  };

  return (
    <Container className="sign-in__main" component="main" maxWidth="xs">
      <CssBaseline />
      <Box className="sign-in__main-box">
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        <form className="sign-in__form" noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email адрес"
            name="email"
            autoComplete="email"
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="passwordRpt"
            label="Повтор пароля"
            type="password"
            id="passwordRpt"
            autoComplete="current-password"
            onChange={passInputRptHandler}
          />
          <Button
            type="button"
            className="sign-in__button"
            fullWidth
            variant="contained"
            onClick={signUpHandler}
          >
            <Link to="/signup"></Link>
            Регистрация
          </Button>
          <div className="sign-up__reqMessage-label">{reqMessage}</div>
          <Box>
            <Link to="/login">Уже есть аккаунт? Войти</Link>
          </Box>
        </form>
      </Box>
      <Box mt={3}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default SignUp;
