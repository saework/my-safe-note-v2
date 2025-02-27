import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import signInApi from "../api/signin-api";
import Copyright from "../components/copyright";
// import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";
import "../style.scss";

function SignIn() {
  const dispatch = useContext(DispatchContext);
  const [reqMessage, setReqMessage] = useState("");
  const [email, setEmailVal] = useState("");
  const [password, setPasswordVal] = useState("");
  const navigate = useNavigate();

  // Войти по логину и паролю
  const signInHandler = async () => {
    let loginData = await signInApi(email, password, setReqMessage);
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
            label="Email адрес"
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
            <Link to="/newpassword">Забыли пароль?</Link>
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
