import React from "react";
import axios from "axios";
//import { history, store } from '../store/store';
import { validateEmail } from "../functions";
//import { loginSaveStore } from '../actions/actions';

const tokenKey = "accessToken";

const signInApi = async function (
  email: string,
  password: string,
  setReqMessage: React.Dispatch<React.SetStateAction<string>>
) {
  if (email && password) {
    const validEmail = validateEmail(email);
    if (validEmail === true) {
      //console.log(password);
      //const url = `api/note/userid/${userId}`;
      const url = "api/User/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (response.ok === true) {
        // получаем данные
        const responseData = await response.json();

        // сохраняем в хранилище sessionStorage токен доступа
        //sessionStorage.setItem(tokenKey, loginData.access_token);
        //sessionStorage.setItem(tokenKey, loginData.accessToken);
        var loginData = {
          currentUser: email,
          userId: responseData.userId,
          jwtToken: responseData.accessToken 
        }
        localStorage.setItem('loginData', JSON.stringify(loginData));
        //localStorage.setItem('loginData', loginData);
        console.log(
          "Аутентификация прошла успешно, loginData записан в LocalStorage"
        );
        return loginData;
      } else if (response.status === 401) {
        setReqMessage("Не верный логин или пароль!");
      } else {
        //console.log("Status: ", response.status);
        console.log(`signInApi - Ошибка соединения:${response.statusText}`);
        setReqMessage("Ошибка сервера");
      }
    } else {
      setReqMessage("Email имеет не верный формат!");
    }
  } else {
    setReqMessage("Заполните обязательные поля!");
  }
};

// const signInApi = (email: string, password: string, setReqMessage: React.Dispatch<React.SetStateAction<string>>) => {
//   if (email && password) {
//     const validEmail = validateEmail(email);
//     if (validEmail === true) {
//       // const url = 'http://localhost:3000/login'; // dev
//       // const url = '/login'; // prod
//       const url = 'api/note/login';
//       axios
//         .post(url, {
//           //username: email,
//           email,
//           password,
//         })
//         .then((response) => {
//           let bd;
//           if (response.statusText === 'OK') {
//             const jwt = response.data;
//             console.log(`signInApi - Получен ответ от сервера - jwt: ${jwt}`);
//             const loginData = {
//               currentUser: email,
//               jwtToken: jwt.jwtToken,
//             };
//             //store.dispatch(loginSaveStore(loginData));
//             localStorage.setItem('loginData', JSON.stringify(loginData));
//             console.log('Аутентификация прошла успешно, loginData записан в LocalStorage');
//             bd = true;
//           } else {
//             setReqMessage('Ошибка сервера');
//           }
//           return bd;
//         })
//         .then((bd) => {
//           if (bd) {
//             console.log('signInApi - Переход на главную страницу после аутентификации');
//             // history.push({
//             //   pathname: '/home',
//             //   state: { needLoadData: true },
//             // });
//           }
//         })
//         .catch((error) => {
//           if (error.response) {
//             if (error.response.status === 401) {
//               setReqMessage('Не верный логин или пароль!');
//             } else {
//               console.log(`signInApi - Ошибка соединения:${error}`);
//               setReqMessage('Ошибка сервера');
//             }
//           } else {
//             console.log(`signInApi - Ошибка соединения:${error}`);
//             setReqMessage('Ошибка сервера');
//           }
//         });
//     } else {
//       setReqMessage('Email имеет не верный формат!');
//     }
//   } else {
//     setReqMessage('Заполните обязательные поля!');
//   }
// };

export default signInApi;
