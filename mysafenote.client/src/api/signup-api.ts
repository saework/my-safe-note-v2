import React from "react";
import axios from "axios";
//import { history, store } from '../store/store';
import { validateEmail } from "../functions";
//import { loginSaveStore } from '../actions/actions';

const tokenKey = "accessToken";

//const signInApi = async function (email: string, password: string, setReqMessage: React.Dispatch<React.SetStateAction<string>>) {
const signUpApi = async function (
  email: string,
  password: string,
  passwordRpt: string,
  setReqMessage: React.Dispatch<React.SetStateAction<string>>
) {
  if (email && password && passwordRpt) {
    if (password === passwordRpt) {
      const validEmail = validateEmail(email);
      if (validEmail === true) {
        console.log(password);
        //const url = `api/note/userid/${userId}`;
        const url = "api/User/signup";
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
        // если запрос прошел нормально
        if (response.ok === true) {
          // получаем данные
          const responseData = await response.json();
          var loginData = {
            currentUser: email,
            userId: responseData.userId,
            jwtToken: responseData.accessToken 
          }
          // сохраняем в хранилище sessionStorage токен доступа
          //sessionStorage.setItem(tokenKey, loginData.access_token);
          //sessionStorage.setItem(tokenKey, loginData.accessToken);
          localStorage.setItem('loginData', JSON.stringify(loginData));
          console.log('Регистрация прошла успешно, loginData записан в LocalStorage');
          return loginData;
        } // если произошла ошибка, получаем код статуса
        //console.log("Status: ", response.status);
        else {
          console.log(`signUpApi - Ошибка соединения:${response.statusText}`);
          setReqMessage('Ошибка сервера');
        }
      } else {
        setReqMessage("Email имеет не верный формат!");
      }
    } else {
      setReqMessage("Пароли не совпадают!");
    }
  } else {
    setReqMessage("Заполните обязательные поля!");
  }
};

// const signUpApi = (email: string, password: string, passwordRpt: string, setReqMessage: React.Dispatch<React.SetStateAction<string>>) => {
//   if (email && password && passwordRpt) {
//     if (password === passwordRpt) {
//       const validEmail = validateEmail(email);
//       if (validEmail === true) {
//         // const url = 'http://localhost:3000/signup'; // dev
//         const url = '/signup'; // prod
//         axios
//           .post(url, {
//             username: email,
//             password,
//           })
//           .then((response) => {
//             let bd;
//             if (response.statusText === 'OK') {
//               const respRes = response.data.result;
//               if (respRes === 'jwt') {
//                 const { jwt } = response.data;
//                 if (jwt) {
//                   console.log(`signUpApi - Получен ответ от сервера - jwt: ${jwt}`);
//                   const loginData = {
//                     currentUser: email,
//                     jwtToken: jwt,
//                   };
//                   //store.dispatch(loginSaveStore(loginData));
//                   localStorage.setItem('loginData', JSON.stringify(loginData));
//                   console.log('Регистрация прошла успешно, loginData записан в LocalStorage');
//                   bd = true;
//                 } else {
//                   setReqMessage('Ошибка аутентификации');
//                 }
//               } else {
//                 setReqMessage(respRes);
//               }
//             } else {
//               setReqMessage('Ошибка сервера');
//             }
//             return bd;
//           })
//           .then((bd) => {
//             if (bd) {
//               console.log('signUpApi - Переход на главную страницу после регистрации');
//               // history.push({
//               //   pathname: '/home',
//               //   state: { needLoadData: false },
//               // });
//             }
//           })
//           .catch((error) => {
//             console.log(`Ошибка соединения:${error}`);
//             setReqMessage('Ошибка соединения');
//           });
//       } else {
//         setReqMessage('Email имеет не верный формат!');
//       }
//     } else {
//       setReqMessage('Пароли не совпадают!');
//     }
//   } else {
//     setReqMessage('Заполните обязательные поля!');
//   }
// };

export default signUpApi;
