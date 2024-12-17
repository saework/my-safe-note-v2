import _ from 'lodash';
//import React from 'react';
import React, { useContext } from 'react';
import { getLoginData } from '../functions';
//import { ISendData } from '../interfaces';
//import { StateContext } from "../state/notes-context";
//import { ACTIONS, DispatchContext } from "../state/notes-context";



export const loadNoteBodyFromServer = async function (userId, noteId, setLoading){
  //const url = `api/note/notebody/${noteId}`;
  const url = `api/note/notebody`;
    const jwtToken = getLoginData('jwtToken');
    if (!_.isEmpty(jwtToken)) {
      console.log(`loadNoteBodyFromServer - jwtToken - ${JSON.stringify(jwtToken)}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": "Bearer " + jwtToken  // передача токена в заголовке
    },
    body: JSON.stringify({
      userId: userId,
      noteId: noteId,
    }),
  });

  if (response.ok === true) {
    //console.log(response);
    const noteBody = await response.json();
    console.log('Получена тело заметки с сервера');
    //console.log(data);
    return noteBody;
  }
  else
{
  console.log(`Ошибка при получении данных с сервера - ${response.statusText}`);
}
    }
    else {
      console.log('loadNoteBodyFromServer - Не определен jwtAuthHeader!');
    }
};

//export const saveNoteToServer = async function (noteData, setLoading){
  export const saveNoteToServer = async function (noteData){
  //const url = `api/note/notebody/${noteId}`;
  //const url = `api/note/notebody`;
  const url = `api/note/savenote`;
    const jwtToken = getLoginData('jwtToken');
    if (!_.isEmpty(jwtToken)) {
      console.log(`loadNoteBodyFromServer - jwtToken - ${JSON.stringify(jwtToken)}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": "Bearer " + jwtToken  // передача токена в заголовке
    },
    body: JSON.stringify({
      noteData,
    }),
  });

  if (response.ok === true) {
    //console.log(response);
    //const noteBody = await response.json();
    console.log('Заметка сохранена на сервера');
    //console.log(data);
    return true;
  }
  else
{
  console.log(`Ошибка при сохранении заметки на сервер - ${response.statusText}`);
}
    }
    else {
      console.log('saveNoteToServer - Не определен jwtAuthHeader!');
    }
};