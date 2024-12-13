//import React, { useState } from 'react';
import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
//import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
//import { Link } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import signInApi from '../api/signin-api';
import Copyright from '../components/copyright';
import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";
//import { DispatchContext } from "../state/notes-context";
import '../style.scss';
//import useStyles from '../configs/signstl-conf';

//function SignIn({ onLogin }) {
  function SignIn() {

  const dispatch = useContext(DispatchContext);
  //const classes = useStyles();
  // const [reqMessage, setReqMessage] = useState<string>('');
  // const [email, setEmailVal] = useState<string>('');
  // const [password, setPasswordVal] = useState<string>('');

  const [reqMessage, setReqMessage] = useState('');
  const [email, setEmailVal] = useState('');
  const [password, setPasswordVal] = useState('');

  

  const navigate = useNavigate();

     // Войти по логину и паролю
     const signInHandler = async function (){
      let loginData = await signInApi(email, password, setReqMessage);
      if (loginData){
        // const loginData = {
        //   currentUser: email,
        //   //jwtToken: jwt.jwtToken
        //   //jwtToken: data.access_token 
        //   userId: data.userId,
        //   jwtToken: data.accessToken 
        // }
       //store.dispatch(loginSaveStore(loginData));
        dispatch({ type: ACTIONS.LOGIN_SAVE_STORE, payload: loginData });
        dispatch({ type: ACTIONS.NEED_LOAD_DATA, payload: true });
        console.log("signInHandler");
        console.log(loginData);
        const url = '/main';
        navigate(url);

            // history.push({
            //   pathname: '/home',
            //   state: { needLoadData: true },
            // });
      }
    };
  
  //  // Войти по логину и паролю
  //  const signInHandler = () => {
  //   signInApi(email, password, setReqMessage);
  // };

  // // Войти по логину и паролю
  // const signInHandler = () => {
  //   //signInApi(email, password, setReqMessage);
  //       // Здесь должна быть ваша логика аутентификации.
  //       // После успешной аутентификации:
  //       //onLogin(); // Вызов метода входа
  //       //const url = 'http://localhost:3000/home'; // dev
  //       const url = '/main';
  //       navigate(url);
  // };

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
            <Box className="sign-up__box-links" >
                <Link to="/newpassword">Забыли пароль?</Link>
                <Link to="/signup">Нет аккаунта? Регистрация</Link>
            </Box>
        </form>
        <Box mt={3}>
          <Copyright />
        </Box>
    </Box>
    {/* <Box mt={3}>
        <Copyright />
    </Box> */}
</Container>
  );
}

export default SignIn;
//-------------------

    // <Container component="main" maxWidth="xs">
    //   <CssBaseline />
    //   <div className="sign-in__container">
    //     <Typography component="h1" variant="h5">
    //       Вход
    //     </Typography>
    //     <form className="sign-in__form" noValidate>
    //       <TextField
    //         variant="outlined"
    //         margin="normal"
    //         required
    //         fullWidth
    //         id="email"
    //         label="Email адрес"
    //         name="email"
    //         autoComplete="email"
    //         autoFocus
    //         onChange={emailInputHandler}
    //       />
    //       <TextField
    //         variant="outlined"
    //         margin="normal"
    //         required
    //         fullWidth
    //         name="password"
    //         label="Пароль"
    //         type="password"
    //         id="password"
    //         autoComplete="current-password"
    //         onChange={passInputHandler}
    //       />
    //       <Button type="button" className="sign-in__button" fullWidth variant="contained"  onClick={signInHandler}>
    //         Войти
    //       </Button>
    //       <div className="sign-up__reqMessage-label">{reqMessage}</div>
    //       <Grid container>
    //         <Grid item xs>
    //           <Link to="/newpassword">Забыли пароль?</Link>
    //         </Grid>
    //         <Grid item>
    //           <Link to="/signup">Нет аккаунта? Регистрация</Link>
    //         </Grid>
    //       </Grid>
    //     </form>
    //   </div>
    //   <Box mt={3}>
    //     <Copyright />
    //   </Box>
    // </Container>
//   );
// }

// export default SignIn;


// import React from 'react';

// const SignIn = ({ onLogin }) => {
//     const handleLogin = () => {
//         // Здесь должна быть ваша логика аутентификации.
//         // После успешной аутентификации:
//         onLogin(); // Вызов метода входа
//     };

//     return (
//         <div>
//             <h1>Sign In</h1>
//             <button onClick={handleLogin}>Login</button>
//         </div>
//     );
// };

// export default SignIn;



// import React, { useState } from 'react';
// //import './App.css';
// //import './style.css';

// function SignIn() {

//     return (
//     <div>SignIn</div>
//     );
//   }
// export default SignIn;