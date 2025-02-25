import React, { useState } from "react";
import { Link } from "react-router-dom";
import Copyright from "../components/copyright";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "../style.scss";

function NewPass() {
  const [reqMessage, setReqMessage] = useState<string>("");
  const [email, setEmailVal] = useState<string>("");

  const updatePasswordHandler = () => {
    //newPassApi(email, setReqMessage); //TODO реализовать в новой версии.
  };
  const emailInputHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const emailEl = e.currentTarget as HTMLInputElement;
    setEmailVal(emailEl.value);
  };

  return (
    <Container className="sign-in__main" component="main" maxWidth="xs">
      <CssBaseline />
      <Box className="sign-in__main-box">
        <Typography component="h1" variant="h6">
          Сброс пароля
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
          <Button
            type="button"
            className="sign-in__button"
            fullWidth
            variant="contained"
            onClick={updatePasswordHandler}
          >
            Сменить пароль
          </Button>
          <div className="sign-up__reqMessage-label">{reqMessage}</div>
          <Box>
            <Link to="/login">На главную</Link>
          </Box>
        </form>
      </Box>
      <Box mt={3}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default NewPass;
