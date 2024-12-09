// import React, { useState } from 'react';
// import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
// import Typography from '@material-ui/core/Typography';
// import Container from '@material-ui/core/Container';
// import { Link } from 'react-router-dom';
// import newPassApi from '../api/newpass-api';
// import Copyright from '../components/copyright';
// import useStyles from '../configs/signstl-conf';

import React, { useState } from "react";
import { Link } from "react-router-dom";
// import newPassApi from '../api/newpass-api';
import Copyright from "../components/copyright";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
//import newPassApi from '../api/newpass-api';
import "../style.scss";

function NewPass() {
  //const classes = useStyles();
  const [reqMessage, setReqMessage] = useState<string>('');
  const [email, setEmailVal] = useState<string>('');

  const updatePasswordHandler = () => {
    //newPassApi(email, setReqMessage);
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
          {/* <Grid item xs={12}> */}
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
          {/* </Grid> */}
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
          {/* <Box container> */}
            {/* <Box item xs> */}
            <Box>
              <Link to="/login">На главную</Link>
            </Box>
          {/* </Box> */}
        </form>
      </Box>
      <Box mt={3}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default NewPass;

// import React, { useState } from 'react';
// //import './App.css';
// //import './style.css';

// function NewPass() {

//     return (
//     <div>NewPass</div>
//     );
//   }
// export default NewPass;
