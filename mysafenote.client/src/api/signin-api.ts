import React from 'react';
import axios from 'axios';
//import { history, store } from '../store/store';
import { validateEmail } from '../functions';
//import { loginSaveStore } from '../actions/actions';

const signInApi = (email: string, password: string, setReqMessage: React.Dispatch<React.SetStateAction<string>>) => {
  if (email && password) {
    const validEmail = validateEmail(email);
    if (validEmail === true) {
      // const url = 'http://localhost:3000/login'; // dev
      const url = '/login'; // prod
      axios
        .post(url, {
          username: email,
          password,
        })
        .then((response) => {
          let bd;
          if (response.statusText === 'OK') {
            const jwt = response.data;
            console.log(`signInApi - Получен ответ от сервера - jwt: ${jwt}`);
            const loginData = {
              currentUser: email,
              jwtToken: jwt.jwtToken,
            };
            //store.dispatch(loginSaveStore(loginData));
            localStorage.setItem('loginData', JSON.stringify(loginData));
            console.log('Аутентификация прошла успешно, loginData записан в LocalStorage');
            bd = true;
          } else {
            setReqMessage('Ошибка сервера');
          }
          return bd;
        })
        .then((bd) => {
          if (bd) {
            console.log('signInApi - Переход на главную страницу после аутентификации');
            // history.push({
            //   pathname: '/home',
            //   state: { needLoadData: true },
            // });
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setReqMessage('Не верный логин или пароль!');
            } else {
              console.log(`signInApi - Ошибка соединения:${error}`);
              setReqMessage('Ошибка сервера');
            }
          } else {
            console.log(`signInApi - Ошибка соединения:${error}`);
            setReqMessage('Ошибка сервера');
          }
        });
    } else {
      setReqMessage('Email имеет не верный формат!');
    }
  } else {
    setReqMessage('Заполните обязательные поля!');
  }
};

export default signInApi;
