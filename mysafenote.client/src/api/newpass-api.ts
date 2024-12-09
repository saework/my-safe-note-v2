import React from 'react';
import axios from 'axios';
import { validateEmail } from '../functions';

const newPassApi = (email: string, setReqMessage: React.Dispatch<React.SetStateAction<string>>) => {
  if (email) {
    const validEmail = validateEmail(email);
    if (validEmail === true) {
      // const url = 'http://localhost:3000/newpassword'; // dev
      const url = '/newpassword'; // prod
      const data = { currentUser: email };
      axios
        .post(url, {
          data,
        })
        .then((response) => {
          if (response.statusText === 'OK') {
            if (response.data.result === 'OK') {
              setReqMessage(response.data.mes);
            } else {
              setReqMessage('Ошибка сервера');
            }
          }
        })
        .catch((error) => {
          console.log(`newPassApi - Ошибка соединения:${error}`);
        });
    } else {
      setReqMessage('Email имеет не верный формат!');
    }
  } else {
    setReqMessage('Заполните поле Email!');
  }
};

export default newPassApi;
