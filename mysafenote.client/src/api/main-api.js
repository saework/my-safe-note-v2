import _ from "lodash";
//import React from 'react';
import React, { useContext } from "react";
import axios from "axios";
//import { history, store } from '../store/store';
import { getLoginData } from "../functions";
//import { loadBD } from '../actions/actions';
//import { ISendData } from '../interfaces';
import { StateContext } from "../state/notes-context";
//import { ACTIONS, DispatchContext } from "../state/notes-context";
import { DispatchContext } from "../state/notes-context";

export const loadNotesDataFromServer = async function (userId, setLoading) {
  
  const jwtToken = getLoginData("jwtToken");
   if (userId === 0 || !userId)  
     userId = getLoginData("userId");

  if (!_.isEmpty(jwtToken) && (userId > 0)) {
    console.log(`loadNotesDataFromServer - userId = ${userId} jwtToken = ${JSON.stringify(jwtToken)}`);
    
    const url = `api/note/userid/${userId}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + jwtToken, // передача токена в заголовке
      },
    });

    if (response.ok === true) {
      const data = await response.json();
      console.log("Получены данные с сервера");
      //console.log(data);
      return data;
    } else {
      console.log(
        `Ошибка при получении данных с сервера - ${response.statusText}`
      );
    }
  } else {
    console.log("loadNotesDataFromServer - Ошибка. Не определены значения loginData (userId или jwtToken)");
  }
};

export const loadNotebooksDataFromServer = async function (userId) {
  const jwtToken = getLoginData("jwtToken");
   if (userId === 0 || !userId)  
     userId = getLoginData("userId");

  if (!_.isEmpty(jwtToken) && (userId > 0)) {
    console.log(`loadNotebooksDataFromServer - userId = ${userId} jwtToken = ${JSON.stringify(jwtToken)}`);

    const url = `api/notebook/userid/${userId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + jwtToken,
      },
    });

    if (response.ok === true) {
      const data = await response.json();
      console.log("Получены данные с сервера");
      //console.log(data);
      return data;
    } else {
      console.log(
        `Ошибка при получении данных с сервера - ${response.statusText}`
      );
    }
  } else {
    console.log("loadNotebooksDataFromServer - Ошибка. Не определены значения loginData (userId или jwtToken)");
  }
};

// export const exportNotesFromServer = async function (userId, setLoading){
//   const url = `api/note/userid/${userId}`;

//     const jwtToken = getLoginData('jwtToken');
//     if (!_.isEmpty(jwtToken)) {
//       console.log(`loadNotesDataFromServer - jwtToken - ${JSON.stringify(jwtToken)}`);

//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       "Accept": "application/json",
//       "Authorization": "Bearer " + jwtToken  // передача токена в заголовке
//   }
//   });

//   if (response.ok === true) {
//     //console.log(response);
//     const data = await response.json();
//     console.log('Получены данные с сервера');
//     //console.log(data);
//     return data;
//   }
//   else
// {
//   console.log(`Ошибка при получении данных с сервера - ${response.statusText}`);
// }
//     }
//     else {
//       console.log('sendBDtoServer - Не определен jwtAuthHeader!');
//     }
// };

export const exportNotesFromServer = async function (userId) {
  try {
    const response = await fetch(`/api/Note/export/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Добавьте здесь заголовок авторизации, если необходимо
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при выгрузке заметок");
    }


    // Получаем имя файла из заголовка Content-Disposition
    // const contentDisposition = response.headers.get("Content-Disposition");
    // let fileName = "notes.zip"; // Значение по умолчанию

    // if (contentDisposition) {
    //   const matches = /filename[^*=]*=((['"]).*?\2|[^;\n]*)/.exec(
    //     contentDisposition
    //   );
    //   if (matches != null && matches[1]) {
    //     fileName = matches[1].replace(/['"]/g, ""); // Удаляем кавычки
    //   }
    // }
   
    //console.log(contentDisposition);
    //console.log(fileName);

    let fileName = "notes_backup.zip"; // Значение по умолчанию

    // Создаем blob из ответа
    const blob = await response.blob();

    // Создаем ссылку для скачивания
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // Имя файла для скачивания
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url); // Освобождаем память
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Не удалось выгрузить заметки. Пожалуйста, попробуйте еще раз.");
  }
};


export const importNotesToServer = async function (userId, file) {

  const formData = new FormData();
  formData.append('file', file);
  var result = false;
  try {
      const response = await fetch(`/api/Note/import/${userId}`, {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) {
          throw new Error('Ошибка при загрузке заметок');
      }

      alert('Заметки успешно загружены!');
      result = true; 
  } catch (error) {
      console.error('Ошибка:', error);
      alert('Не удалось загрузить заметки. Пожалуйста, попробуйте еще раз.');
  }
  return result;
};
