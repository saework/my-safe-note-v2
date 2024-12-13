// import React, { useState } from 'react';
// import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
// import Typography from '@material-ui/core/Typography';
// import Container from '@material-ui/core/Container';
// import { Link } from 'react-router-dom';
// import signUpApi from '../api/signup-api';
// import Copyright from '../components/copyright';
// import useStyles from '../configs/signstl-conf';

import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
//import { Link } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import signUpApi from '../api/signup-api';
import Copyright from '../components/copyright';
import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";

function SignUp() {
  //const classes = useStyles();
  const dispatch = useContext(DispatchContext);
  // const [reqMessage, setReqMessage] = useState<string>('');
  // const [email, setEmailVal] = useState<string>('');
  // const [password, setPasswordVal] = useState<string>('');
  // const [passwordRpt, setPasswordRptVal] = useState<string>('');

  //const notesState = useContext(StateContext);
  // const currentUser = notesState.currentUser;
  // const jwtToken = notesState.jwtToken;
  // const noteRows = notesState.noteRows;
  //const userId = notesState.userId;

  const [reqMessage, setReqMessage] = useState('');
  const [email, setEmailVal] = useState('');
  const [password, setPasswordVal] = useState('');
  const [passwordRpt, setPasswordRptVal] = useState('');

  // Регистрация пользователя
  // const signUpHandler = () => {
  //   signUpApi(email, password, passwordRpt, setReqMessage);
  // };

  // const signInHandler = async function (){
  //   let data = await signInApi(email, password, setReqMessage);
    
  const navigate = useNavigate();

  //const signUpHandler = () => {\
  const signUpHandler = async function (){
    let loginData = await signUpApi(email, password, passwordRpt, setReqMessage);
    if (loginData){
      // const loginData = {
      //   currentUser: email,
      //   userId: data.userId,
      //   jwtToken: data.accessToken 
      //   //!!!добавить userId!
      // }
     //store.dispatch(loginSaveStore(loginData));
      dispatch({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
      dispatch({ type: ACTIONS.NEED_LOAD_DATA, payload: true });
      console.log("signUpHandler");
      console.log(loginData);
      const url = '/main';
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

  // const emailInputHandler = (e: React.SyntheticEvent) => {
  //   e.preventDefault();
  //   const emailEl = e.currentTarget as HTMLInputElement;
  //   setEmailVal(emailEl.value);
  // };
  // const passInputHandler = (e: React.SyntheticEvent) => {
  //   e.preventDefault();
  //   const passwordEl = e.currentTarget as HTMLInputElement;
  //   setPasswordVal(passwordEl.value);
  // };
  // const passInputRptHandler = (e: React.SyntheticEvent) => {
  //   e.preventDefault();
  //   const passwordRptEl = e.currentTarget as HTMLInputElement;
  //   setPasswordRptVal(passwordRptEl.value);
  // };

  return (
    <Container className="sign-in__main" component="main" maxWidth="xs">
      <CssBaseline />
      <Box className="sign-in__main-box">
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        <form className="sign-in__form" noValidate>
          {/* <Box container spacing={2}>
            <Box item xs={12}> */}
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
            {/* </Box>
            <Box item xs={12}> */}
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
            {/* </Box>
            <Box item xs={12}> */}
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
            {/* </Box>
          </Box> */}
          {/* <Button type="button" fullWidth variant="contained" className="sign-in__button" onClick={signUpHandler}>
            <Link to="/signup">Регистрация</Link>
          </Button> */}
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
          {/* <Box container justify="flex-end"> */}
            <Box>
              <Link to="/login">Уже есть аккаунт? Войти</Link>
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

export default SignUp;


// import React, { useState } from 'react';
// //import './App.css';
// //import './style.css';

// function SignUp() {

//     return (
//     <div>SignUp</div>
//     );
//   }
// export default SignUp;