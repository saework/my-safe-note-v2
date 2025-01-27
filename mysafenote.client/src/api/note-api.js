import _ from "lodash";
//import React from 'react';
import React, { useContext } from "react";
import { getLoginData } from "../functions";
//import { ISendData } from '../interfaces';
//import { StateContext } from "../state/notes-context";
//import { ACTIONS, DispatchContext } from "../state/notes-context";

//export const loadNoteBodyFromServer = async function (userId, noteId, setLoading){
export const loadNoteBodyFromServer = async function (userId, noteId) {
  //const url = `api/note/notebody/${noteId}`;
  const url = `api/note/notebody`;
  const jwtToken = getLoginData("jwtToken");
  if (!_.isEmpty(jwtToken)) {
    console.log(
      `loadNoteBodyFromServer - jwtToken - ${JSON.stringify(jwtToken)}`
    );

    //console.log(userId);
    //console.log(noteId);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        // "Accept": "application/json",
        // "Authorization": "Bearer " + jwtToken  // передача токена в заголовке
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        noteId: noteId,
      }),
    });

    if (response.ok === true) {
      //console.log(response);
      const responseData = await response.json();

      var noteData = {
        //noteId: noteData.noteId,
        noteName: responseData.title,
        createDate: responseData.createDate,
        lastChangeDate: responseData.lastChangeDate,
        notebookName: responseData.notebookName,
        notebookId: responseData.notebookId,
        noteBody: responseData.noteBody,
        notePasswordHash: responseData.notePasswordHash,
        //userId: noteData.userId,
      };
      console.log(responseData);
      console.log(noteData);
      console.log("Получена тело и данные заметки с сервера");
      //console.log(data);
      return noteData;
    } else {
      console.log(
        `Ошибка при получении данных с сервера - ${response.statusText}`
      );
    }
  } else {
    console.log("loadNoteBodyFromServer - Не определен jwtAuthHeader!");
  }
};

//export const saveNoteToServer = async function (noteData, setLoading){
export const saveNoteToServer = async function (noteData) {
  //const url = `api/note/notebody/${noteId}`;
  //const url = `api/note/notebody`;
  const url = `api/note/savenote`;
  const jwtToken = getLoginData("jwtToken");
  if (!_.isEmpty(jwtToken)) {
    console.log(`saveNoteToServer - jwtToken - ${JSON.stringify(jwtToken)}`);
    console.log(noteData);
    //console.log(noteDto);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        // "Accept": "application/json",
        // //"Content-Type": "application/json",
        // "Authorization": "Bearer " + jwtToken  // передача токена в заголовке

        //   Accept: "application/json",
        //   "Content-Type": "application/json",
        // },
        // body: JSON.stringify(
        //   {noteData},
        // ),
        //body: {noteDto} ,

        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        noteId: noteData.noteId,
        title: noteData.title,
        createDate: noteData.createDate,
        lastChangeDate: noteData.lastChangeDate,
        notebookId: noteData.notebookId,
        noteBody: noteData.noteBody,
        notePasswordHash: noteData.notePasswordHash,
        userId: noteData.userId,
      }),

      // body: JSON.stringify({
      //   noteId: 0,
      //   title: "noteData.title",
      //   // createDate: date,
      //   // lastChangeDate: date,
      //   notebook: "noteData.notebook",
      //   noteBody: "noteData.noteBody",
      //   notePassword: "",
      //   userId: 1,
      // }),
    });
    console.log(response);
    if (response.ok === true) {
      //console.log(response);
      //const noteBody = await response.json();
      console.log("Заметка сохранена на сервера");
      //console.log(data);
      return true;
    } else {
      console.log(
        `Ошибка при сохранении заметки на сервер - ${response.statusText}`
      );
    }
  } else {
    console.log("saveNoteToServer - Не определен jwtAuthHeader!");
  }
};

export const deleteNoteFromServer = async function (noteId) {
  const url = `api/note/${noteId}`; // URL для удаления заметки по ID
  const jwtToken = getLoginData("jwtToken"); // Получаем токен аутентификации

  if (!_.isEmpty(jwtToken)) {
    console.log(
      `deleteNoteFromServer - jwtToken - ${JSON.stringify(jwtToken)}`
    );

    const response = await fetch(url, {
      method: "DELETE", // Указываем метод DELETE
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken, // Передаем токен в заголовке
      },
    });

    console.log(response);
    if (response.ok) {
      console.log("Заметка успешно удалена с сервера");
      return true; // Возвращаем true, если удаление прошло успешно
    } else {
      console.log(
        `Ошибка при удалении заметки с сервера - ${response.statusText}`
      );
      return false; // Возвращаем false в случае ошибки
    }
  } else {
    console.log("deleteNoteFromServer - Не определен jwtAuthHeader!");
    return false; // Возвращаем false, если токен не определен
  }
};

export const loadNoteDocxFromServer = async function (noteId, noteName) {
  const url = "api/note/notedocx";
  try {
    const jwtToken = getLoginData("jwtToken"); // Получаем токен аутентификации

    if (!_.isEmpty(jwtToken)) {
      console.log(
        `loadNoteDocxFromServer - jwtToken - ${JSON.stringify(jwtToken)}`
      );
      const response = await fetch(url, {
        method: "POST",
        // headers: {
        //   //   "Content-Type": "application/json",
        //   // },
        //   Accept: "application/json",
        //   "Content-Type": "application/json",
        // },
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`, // Добавляем токен в заголовок
        },
        body: noteId, // Отправляем noteId в теле запроса
      });

      if (!response.ok) {
        throw new Error(`${response.statusText}`);
      }
      const blob = await response.blob(); // Получаем ответ как Blob
      const docUrl = window.URL.createObjectURL(blob); // Создаем URL для скачивания
      const link = document.createElement("a");
      link.href = docUrl;
      const fileName = noteName + ".docx";
      link.setAttribute("download", fileName); // Имя файла для скачивания
      document.body.appendChild(link);
      link.click(); // Имитируем клик для скачивания
      link.remove(); // Удаляем ссылку из DOM
      return true;
    } else {
      console.log("loadNoteDocxFromServer - Не определен jwtAuthHeader!");
      return false; // Возвращаем false, если токен не определен
    }
  } catch (error) {
    console.error("Ошибка при скачивании файла:", error);
  }
};
