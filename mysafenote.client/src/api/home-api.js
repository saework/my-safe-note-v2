import _ from 'lodash';
//import React from 'react';
import React, { useContext } from 'react';
import axios from 'axios';
//import { history, store } from '../store/store';
import { getLoginData } from '../functions';
//import { loadBD } from '../actions/actions';
//import { ISendData } from '../interfaces';
import { StateContext } from "../state/notes-context";
//import { ACTIONS, DispatchContext } from "../state/notes-context";
import { DispatchContext } from "../state/notes-context";

// Отправить список задач пользователя на сервер
//export const sendBDtoServer = (data: ISendData, setLoading: React.Dispatch<React.SetStateAction<string>>) => {
  export const sendBDtoServer = (data, setLoading) => {
  setLoading('save');
  // const url = 'http://localhost:3000/home'; // dev
  const url = '/home'; // prod
  const jwtAuthHeader = getLoginData('jwtAuthHeader');
  if (!_.isEmpty(jwtAuthHeader)) {
    console.log(`sendBDtoServer - jwtAuthHeader - ${JSON.stringify(jwtAuthHeader)}`);
    const config = {
      headers: jwtAuthHeader,
    };
    axios
      .post(url, { data }, config)
      .then((response) => {
        if (response.statusText === 'OK') {
          const res = response.data;
          console.log(`sendBDtoServer - response.data - ${res}`);
          setLoading('');
        }
      })
      .catch((error) => {
        setLoading('');
        console.log(`sendBDtoServer - Ошибка соединения:${error}`);
      });
  } else {
    console.log('sendBDtoServer - Не определен jwtAuthHeader!');
    // history.push({
    //   pathname: '/login',
    // });
  }
};

// const response = await fetch(url, {
//   method: "POST",
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     email: email,
//     password: password,
//   }),
// });

export const loadBDfromServer = async function (userId, setLoading){
  const url = `api/note/userid/${userId}`;

    //const jwtAuthHeader = getLoginData('jwtAuthHeader');
    const jwtToken = getLoginData('jwtToken');
    //let result;
    // if (!_.isEmpty(jwtAuthHeader)) {
    //   console.log(`loadBDfromServer - jwtAuthHeader - ${JSON.stringify(jwtAuthHeader)}`);
    if (!_.isEmpty(jwtToken)) {
      console.log(`loadBDfromServer - jwtToken - ${JSON.stringify(jwtToken)}`);
      // const config = {
      //   headers: jwtAuthHeader,
      // };
      //const data = { currentUser };

  //const response = await fetch(url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": "Bearer " + jwtToken  // передача токена в заголовке
  }
    // headers: { jwtAuthHeader,
    //   Accept: "application/json",
    //   "Content-Type": "application/json",
    // },
    // body: JSON.stringify({
    //   email: email,
    //   password: password,
    // }),
  });

  if (response.ok === true) {
    //console.log(response);
    const data = await response.json();
    console.log('Получены данные с сервера');
    //console.log(data);
    return data;
  }
  else
{
  console.log(`Ошибка при получении данных с сервера - ${response.statusText}`);
}
    }
    else {
      console.log('sendBDtoServer - Не определен jwtAuthHeader!');
    }
};

//export loadBDfromServer;

// export const await loadBDfromServer = (currentUser, setLoading) => {
//   const response = fetch('api/note');
//           console.log(response);
//           const data = response.json();
//           //setNotes(data);
//           console.log(data);
// };

// export const  loadBDfromServer = (currentUser, setLoading) => {
//   const response = await fetch('api/note');
//           console.log(response);
//           const data = await response.json();
//           //setNotes(data);
//           console.log(response);
// };

// Получить список задач пользователя с сервера
// //export const loadBDfromServer = (currentUser: string, setLoading: React.Dispatch<React.SetStateAction<string>>) => {
//   export const loadBDfromServer = (currentUser, setLoading) => {
//   //const dispatch = useContext(DispatchContext);
//   setLoading('load');
//   // const url = 'http://localhost:3000/load'; // dev
//   //const url = '/load'; // prod
//   const url = 'api/note';
//   //const jwtAuthHeader = getLoginData('jwtAuthHeader');
//   const jwtAuthHeader = "qqq"; //!!!убрать!!
//   let result;
//   if (!_.isEmpty(jwtAuthHeader)) {
//     console.log(`loadBDfromServer - jwtAuthHeader - ${JSON.stringify(jwtAuthHeader)}`);
//     const config = {
//       headers: jwtAuthHeader,
//     };
//     const data = { currentUser };
//     axios
//       //.post(url, data, config)
//       .get(url, data, config)
//       .then((response) => {
//         let bd;
//         if (response.statusText === 'OK') {
//           //console.log('Получены данные с сервера');
//           console.log(response);
//           console.log(response.data);
//           console.log(`sendBDtoServer - response.statusText - ${response.statusText}`);
//           //const json = response.data[0].notesData;
//           //const json = response.data[0];
//           console.log("!!!");
//           console.log(response.json());
//           console.log(response.data.json());
//           //response.json();
//           bd = response.json();
//           // if (json) {
//           //   bd = JSON.parse(json);
//           //   console.log(`sendBDtoServer - data[0].notesData - ${json}`);
//           // } else {
//           //   console.log('Список заданий пользователя пуст');
//           //   bd = null;
//           // }
//         }
//         return bd;
//       })
//       // .then((bd) => {
//       //   if (bd) {
//       //     //store.dispatch(loadBD(bd));
//       //     //console.log(`sendBDtoServer - Данные загружены в state`);
//       //     console.log(`sendBDtoServer - ${bd}`);
//       //     return bd;
//       //     //dispatch({ type: "LOAD_BD", payload: bd });
//       //   }
//       //   setLoading('');
//       // })
//       .catch((error) => {
//         console.log(`sendBDtoServer - Ошибка соединения:${error}`);
//         setLoading('');
//       });
//   } else {
//     console.log('sendBDtoServer - Не определен jwtAuthHeader!');
//     // history.push({
//     //   pathname: '/login',
//     // });
//   }
// };
