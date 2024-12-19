import _ from 'lodash';
//import React from 'react';
import React, { useContext } from 'react';
import { getLoginData } from '../functions';
//import { ISendData } from '../interfaces';
//import { StateContext } from "../state/notes-context";
//import { ACTIONS, DispatchContext } from "../state/notes-context";



//export const loadNoteBodyFromServer = async function (userId, noteId, setLoading){
  export const loadNoteBodyFromServer = async function (userId, noteId){
  //const url = `api/note/notebody/${noteId}`;
  const url = `api/note/notebody`;
    const jwtToken = getLoginData('jwtToken');
    if (!_.isEmpty(jwtToken)) {
      console.log(`loadNoteBodyFromServer - jwtToken - ${JSON.stringify(jwtToken)}`);

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
      notebook: responseData.notebook,
      noteBody: responseData.noteBody,
      //notePassword: noteData.notePassword,
      //userId: noteData.userId, 
    }
    console.log(responseData);
    console.log(noteData);
    console.log('Получена тело и данные заметки с сервера');
    //console.log(data);
    return noteData;
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
        notebook: noteData.notebook,
        noteBody: noteData.noteBody,
        notePassword: noteData.notePassword,
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